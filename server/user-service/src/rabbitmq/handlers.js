import User from "../models/user.model.js";

export const handleAuthAccountCreate = async (data) => {
    try {
        const { userId, firstName, lastName } = data;

        const user = new User({
            userId,
            firstName,
            lastName,
            avatar: `${req.protocol}://${req.get("host")}/images/default.png`,
        });

        await user.save();

        console.log("User profile created successfully in User Service");
    } catch (error) {
        console.error(
            "Error creating user profile in User Service:",
            error?.message
        );
    }
};

export const handlePasswordChangeResponse = async (data, key) => {
    try {
        const { userId, reason } = data;

        if (key === "auth.password.changed.success") {
            console.log(`[${userId}] Password changed: ${reason}`);
        } else if (key === "auth.password.changed.failed") {
            console.warn(`[${userId}] Password change failed: ${reason}`);
        } else {
            console.log("Unknown routing key received");
        }
    } catch (error) {
        console.error("Error handling password change event:", error?.message);
    }
};
