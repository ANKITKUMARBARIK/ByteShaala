import jwt from "jsonwebtoken";
import Auth from "../models/auth.model.js";
import ApiError from "../utils/ApiError.util.js";

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
            role: user.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await Auth.findById(userId);
        if (!user) throw new ApiError(404, "user not found");

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("error generating tokens ", error);
        throw new ApiError(
            500,
            "something went wrong while generating refresh and access token"
        );
    }
};

export default generateAccessAndRefreshToken;
