import asyncHandler from "../utils/asyncHandler.util.js";
import ApiError from "../utils/ApiError.util.js";
import ApiResponse from "../utils/ApiResponse.util.js";
import { uploadOnCloudinary } from "../services/cloudinary.service.js";
import publishMessage from "../rabbitmq/publish.js";
import User from "../models/user.model.js";

export const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  // Validation 1: Check if all required fields are provided
  if (!oldPassword || !newPassword || !confirmPassword) {
    throw new ApiError(
      400,
      "All fields (oldPassword, newPassword, confirmPassword) are required"
    );
  }

  // Validation 2: Check if newPassword and confirmPassword match
  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "New password and confirm password do not match");
  }

  // Validation 3: Check if newPassword is different from oldPassword
  if (oldPassword === newPassword) {
    throw new ApiError(
      400,
      "New password cannot be the same as the old password"
    );
  }

  // Validation 4: Basic password strength (optional - add your requirements)
  if (newPassword.length < 8) {
    throw new ApiError(400, "New password must be at least 8 characters long");
  }

  try {
    // Create a promise that will resolve when we get response from auth-service
    const passwordChangePromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Password change operation timed out"));
      }, 30000); // 30 second timeout

      // Store the promise resolvers globally or in a Map with userId as key
      // This is a simple approach - in production, consider using Redis or similar
      global.passwordChangePromises =
        global.passwordChangePromises || new Map();
      global.passwordChangePromises.set(req.user._id.toString(), {
        resolve,
        reject,
        timeout,
      });
    });

    // Publish message to auth-service
    await publishMessage("user_exchange", "user.password.changed", {
      userId: req.user._id,
      oldPassword,
      newPassword,
      confirmPassword,
    });

    // Wait for response from auth-service
    const result = await passwordChangePromise;

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password changed successfully"));
  } catch (error) {
    // Clean up the promise if it exists
    if (global.passwordChangePromises?.has(req.user._id.toString())) {
      const promiseData = global.passwordChangePromises.get(
        req.user._id.toString()
      );
      clearTimeout(promiseData.timeout);
      global.passwordChangePromises.delete(req.user._id.toString());
    }

    if (error.message === "Password change operation timed out") {
      throw new ApiError(
        408,
        "Password change operation timed out. Please try again."
      );
    }

    // If it's already an ApiError, throw it as is
    if (error instanceof ApiError) {
      throw error;
    }

    // For other errors from auth-service
    throw new ApiError(400, error.message || "Failed to change password");
  }
});

export const updateAccountDetails = asyncHandler(async (req, res) => {
  // Parse JSON payload from form-data
  const payloadObj = JSON.parse(req.body.payloadObj || "{}");
  const { firstName, lastName } = payloadObj;

  let avatarLocalPath = req.file?.buffer;
  // if (!avatarLocalPath) throw new ApiError(400, "avatar file is missing");

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const updateFields = {};
  if (firstName) updateFields.firstName = firstName;
  if (lastName) updateFields.lastName = lastName;
  if (avatar?.url) updateFields.avatar = avatar.url;

  const existedUser = await User.findOneAndUpdate(
    { userId: req.user?._id },
    { $set: updateFields },
    { new: true }
  );

  if (!existedUser)
    throw new ApiError(401, "something wrong while updating account");

  return res
    .status(200)
    .json(
      new ApiResponse(200, existedUser, "account details updated successfully")
    );
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const getUser = await User.findOne({ userId: req.user?._id });
  if (!getUser) throw new ApiError(404, "user not found");
  const user = {
    firstName: getUser.firstName,
    lastName: getUser.lastName,
    avatar: getUser.avatar,
    ...req.user,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, user, "current user fetched successfully"));
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
