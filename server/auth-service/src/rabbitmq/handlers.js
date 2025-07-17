import Auth from "../models/auth.model.js";
import publishMessage from "./publish.js";

export const handleUserPasswordChangedEvent = async (data) => {
    try {
        const { userId, oldPassword, newPassword, confirmPassword } = data;

        const existedUser = await Auth.findById(userId);
        if (!existedUser) {
            await publishMessage(
                "auth_exchange",
                "auth.password.changed.failed",
                {
                    userId,
                    reason: "user not found",
                }
            );
            return;
        }

        const isPasswordValid = await existedUser.comparePassword(oldPassword);
        if (!isPasswordValid) {
            await publishMessage(
                "auth_exchange",
                "auth.password.changed.failed",
                {
                    userId,
                    reason: "invalid old password",
                }
            );
            return;
        }

        existedUser.password = newPassword;
        await existedUser.save();

        await publishMessage("auth_exchange", "auth.password.changed.success", {
            userId,
            reason: "password changed successfully",
        });
    } catch (err) {
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

        console.log(`Auth record deleted for userId: ${userId}`);
    } catch (err) {
        console.error("Error in handleUserDeletedEvent:", err.message);
    }
};
