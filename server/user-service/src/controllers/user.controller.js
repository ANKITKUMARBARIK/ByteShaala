import asyncHandler from "../utils/asyncHandler.util.js";
import ApiError from "../utils/ApiError.util.js";
import ApiResponse from "../utils/ApiResponse.util.js";
import { uploadOnCloudinary } from "../services/cloudinary.service.js";
import publishMessage from "../rabbitmq/publish.js";
import User from "../models/user.model.js";

export const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    await publishMessage("user_exchange", "user.password.changed", {
        userId: req.user._id,
        oldPassword,
        newPassword,
        confirmPassword,
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password change will proceed only if the old password is correct"
            )
        );
});

export const updateAccountDetails = asyncHandler(async (req, res) => {
    const { firstName, lastName } = req.body;

    let avatarLocalPath = req.file?.buffer;
    // if (!avatarLocalPath) throw new ApiError(400, "avatar file is missing");

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    // if (!avatar?.url)
    //     throw new ApiError(401, "error while uploading on avatar");

    const existedUser = await User.findOneAndUpdate(
        { userId: req.user?._id },
        { $set: { firstName, lastName, avatar: avatar?.url || "" } },
        { new: true }
    );

    if (!existedUser)
        throw new ApiError(401, "something wrong while updating account");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                existedUser,
                "account details updated successfully"
            )
        );
});

export const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(200, req.user, "current user fetched successfully")
        );
});

export const deleteUser = asyncHandler(async (req, res) => {
    const existedUser = await User.findOneAndDelete({ userId: req.user?._id });
    if (!existedUser) throw new ApiError(404, "user not found");

    await publishMessage("user_exchange", "user.deleted", {
        userId: existedUser.userId,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "current user deleted successfully"));
});
