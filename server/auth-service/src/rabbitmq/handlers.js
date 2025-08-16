import Auth from "../models/auth.model.js";
import publishMessage from "./publish.js";

export const handleUserPasswordChangedEvent = async (data) => {
  try {
    const { userId, oldPassword, newPassword, confirmPassword } = data;

    // Validation 1: Check if user exists
    const existedUser = await Auth.findById(userId);
    if (!existedUser) {
      await publishMessage("auth_exchange", "auth.password.changed.failed", {
        userId,
        reason: "User not found",
      });
      return;
    }

    // Validation 2: Verify old password is correct
    const isPasswordValid = await existedUser.comparePassword(oldPassword);
    if (!isPasswordValid) {
      await publishMessage("auth_exchange", "auth.password.changed.failed", {
        userId,
        reason: "Current password is incorrect",
      });
      return;
    }

    // Validation 3: Check if new password is different from old password
    if (oldPassword === newPassword) {
      await publishMessage("auth_exchange", "auth.password.changed.failed", {
        userId,
        reason: "New password cannot be the same as current password",
      });
      return;
    }

    // Validation 4: Check if new password matches confirm password
    if (newPassword !== confirmPassword) {
      await publishMessage("auth_exchange", "auth.password.changed.failed", {
        userId,
        reason: "New password and confirm password do not match",
      });
      return;
    }

    // Validation 5: Additional check - ensure new password is not same as current hashed password
    const isSameAsCurrentPassword = await existedUser.comparePassword(
      newPassword
    );
    if (isSameAsCurrentPassword) {
      await publishMessage("auth_exchange", "auth.password.changed.failed", {
        userId,
        reason: "New password cannot be the same as current password",
      });
      return;
    }

    // All validations passed - update the password
    existedUser.password = newPassword;
    await existedUser.save();

    await publishMessage("auth_exchange", "auth.password.changed.success", {
      userId,
      reason: "Password changed successfully",
    });
  } catch (err) {
    console.error("Error in handleUserPasswordChangedEvent:", err.message);
    await publishMessage("auth_exchange", "auth.password.changed.failed", {
      userId: data?.userId || null,
      reason: "Internal server error",
    });
  }
};

export const handleUserDeletedEvent = async (data) => {
  try {
    const { userId } = data;

    const existedUser = await Auth.findByIdAndDelete(userId);
    if (!existedUser) {
      console.warn(`No auth record found for userId: ${userId}`);
      return;
    }
  } catch (err) {
    console.error("Error in handleUserDeletedEvent:", err.message);
  }
};
