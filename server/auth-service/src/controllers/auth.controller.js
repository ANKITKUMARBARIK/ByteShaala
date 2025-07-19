import asyncHandler from "../utils/asyncHandler.util.js";
import ApiError from "../utils/ApiError.util.js";
import ApiResponse from "../utils/ApiResponse.util.js";
import generateSignupOtp from "../utils/generateSignupOtp.util.js";
import {
    sanitizeUser,
    setAuthCookies,
    clearAuthCookies,
} from "../utils/auth.util.js";
import publishMessage from "../rabbitmq/publish.js";
import generateAccessAndRefreshToken from "../services/token.service.js";
import generateForgetPasswordToken from "../utils/generateForgetPasswordToken.util.js";
import jwt from "jsonwebtoken";
import ROLES from "../config/role.js";
import Auth from "../models/auth.model.js";

export const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const existedUser = await Auth.findOne({ email });
    if (existedUser)
        throw new ApiError(409, "username or email already exists");

    const otpSignup = generateSignupOtp();
    const otpSignupExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const user = new Auth({
        email,
        password,
        otpSignup,
        otpSignupExpiry,
    });

    await user.save();

    const createdUser = await sanitizeUser(user._id);
    if (!createdUser)
        throw new ApiError(
            500,
            "something went wrong while registering the user"
        );

    await publishMessage("auth_exchange", "auth.account.create", {
        userId: createdUser._id,
        firstName,
        lastName,
    });

    await publishMessage("auth_exchange", "verify.signup.mail", {
        firstName,
        lastName,
        email: createdUser.email,
        otpSignup: createdUser.otpSignup,
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                createdUser,
                "user registered successfully....Please verify OTP !"
            )
        );
});

export const verifyOtpSignup = asyncHandler(async (req, res) => {
    const { otpSignup } = req.body;

    const existedUser = await Auth.findOneAndUpdate(
        { otpSignup, otpSignupExpiry: { $gt: new Date() } },
        {
            $unset: { otpSignup: 1, otpSignupExpiry: 1 },
            $set: { isVerified: true },
        },
        { new: true }
    );
    if (!existedUser) throw new ApiError(400, "invalid or expired otp");

    await publishMessage("auth_exchange", "welcome.signup.mail", {
        firstName: "Welcome",
        lastName: "Sir",
        email: existedUser.email,
    });

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        existedUser._id
    );

    const user = await sanitizeUser(existedUser._id);
    if (!user) throw new ApiError(404, "user not found");

    setAuthCookies(res, accessToken, refreshToken);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { user, accessToken, refreshToken },
                "OTP verified & user logged in"
            )
        );
});

export const resendOtpSignup = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const existedUser = await Auth.findOne({ email });
    if (!existedUser) throw new ApiError(404, "email doesn't exists");

    if (existedUser.isVerified)
        throw new ApiError(400, "user is already verified");

    const isOtpExpired =
        !existedUser.otpSignupExpiry ||
        existedUser.otpSignupExpiry < new Date();
    if (isOtpExpired) {
        const otpSignup = generateSignupOtp();
        const otpSignupExpiry = new Date(Date.now() + 5 * 60 * 1000);

        const updatedUser = await Auth.findByIdAndUpdate(
            existedUser._id,
            { $set: { otpSignup, otpSignupExpiry } },
            { new: true }
        );

        await publishMessage("auth_exchange", "verify.signup.mail", {
            firstName: "Welcome",
            lastName: "Sir",
            email: updatedUser.email,
            otpSignup: updatedUser.otpSignup,
        });
    } else {
        await publishMessage("auth_exchange", "verify.signup.mail", {
            firstName: "Welcome",
            lastName: "Sir",
            email: existedUser.email,
            otpSignup: existedUser.otpSignup,
        });
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "OTP resent successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const existedUser = await Auth.findOne({ email });
    if (!existedUser) throw new ApiError(404, "user does not exists");

    const isPasswordValid = await existedUser.comparePassword(password);
    if (!isPasswordValid) throw new ApiError(401, "invalid user credentials");

    if (!existedUser.isVerified) {
        const isOtpExpired =
            !existedUser.otpSignupExpiry ||
            existedUser.otpSignupExpiry < new Date();
        if (isOtpExpired) {
            const otpSignup = generateSignupOtp();
            const otpSignupExpiry = new Date(Date.now() + 5 * 60 * 1000);

            const updatedUser = await Auth.findByIdAndUpdate(
                existedUser._id,
                { $set: { otpSignup, otpSignupExpiry } },
                { new: true }
            );

            await publishMessage("auth_exchange", "verify.signup.mail", {
                firstName: "Welcome",
                lastName: "Sir",
                email: updatedUser.email,
                otpSignup: updatedUser.otpSignup,
            });
        } else {
            await publishMessage("auth_exchange", "verify.signup.mail", {
                firstName: "Welcome",
                lastName: "Sir",
                email: existedUser.email,
                otpSignup: existedUser.otpSignup,
            });
        }
        throw new ApiError(
            401,
            "your email is not verified. Please check your mail for OTP."
        );
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        existedUser._id
    );

    const user = await sanitizeUser(existedUser._id);
    if (!user) throw new ApiError(404, "user not found");

    setAuthCookies(res, accessToken, refreshToken);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { user, accessToken, refreshToken },
                "user logged in successfully"
            )
        );
});

export const forgetUserPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const token = generateForgetPasswordToken();
    const expiry = Date.now() + 3600000;

    const existedUser = await Auth.findOneAndUpdate(
        { email },
        { $set: { forgetPasswordToken: token, forgetPasswordExpiry: expiry } },
        { new: true }
    );
    if (!existedUser) throw new ApiError(404, "email does not exists");

    await publishMessage("auth_exchange", "verify.token.mail", {
        firstName: "Welcome",
        lastName: "Sir",
        email: existedUser.email,
        token: existedUser.forgetPasswordToken,
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { email: existedUser.email },
                "token generated - check your email to reset your password"
            )
        );
});

export const resetUserPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (!token?.trim()) throw new ApiError(400, "token is required");

    const existedUser = await Auth.findOne({
        forgetPasswordToken: token,
        forgetPasswordExpiry: { $gt: new Date() },
    });
    if (!existedUser) throw new ApiError(404, "invalid or expired token");

    existedUser.forgetPasswordToken = undefined;
    existedUser.forgetPasswordExpiry = undefined;
    existedUser.password = confirmPassword;
    await existedUser.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { email: existedUser.email },
                "password reset successfully. You can now log in with your new password."
            )
        );
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token) throw new ApiError(401, "unauthorized request");

    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    if (!decodedToken) throw new ApiError(401, "unauthorized request");

    const existedUser = await Auth.findById(decodedToken?._id);
    if (!existedUser) throw new ApiError(401, "invalid refresh token");

    if (token !== existedUser?.refreshToken)
        throw new ApiError(401, "refresh token is expired or used");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        existedUser._id
    );

    const user = await sanitizeUser(existedUser._id);
    if (!user) throw new ApiError(404, "user not found");

    setAuthCookies(res, accessToken, refreshToken);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { user, accessToken, refreshToken },
                "access token refreshed successfully"
            )
        );
});

export const logoutUser = asyncHandler(async (req, res) => {
    const existedUser = await Auth.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: 1 } },
        { new: true }
    );
    if (!existedUser) throw new ApiError(404, "user not found");

    clearAuthCookies(res);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "user logged out successfully"));
});

// for browser to clear cookies
export const safeLogoutUser = asyncHandler(async (req, res) => {
    clearAuthCookies(res);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "user logged out successfully"));
});

export const updateUserRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!id || !role?.trim())
        throw new ApiError(400, "id or role are required");

    if (!Object.values(ROLES).includes(role))
        throw new ApiError(400, "invalid role");

    if (req.user?._id === id)
        throw new ApiError(403, "you cannot update your own role");

    const existedUser = await Auth.findByIdAndUpdate(
        id,
        { $set: { role } },
        { new: true }
    ).select("-password -refreshToken");
    if (!existedUser) throw new ApiError(404, "user not found");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                existedUser,
                `user role updated to ${existedUser.role}`
            )
        );
});
