import User from "../models/user.model.js";

export const handleAuthAccountCreate = async (data) => {
  try {
    const { userId, firstName, lastName } = data;

    const user = new User({
      userId,
      firstName,
      lastName,
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

    // Get the stored promise for this user
    const promiseData = global.passwordChangePromises?.get(userId);

    if (!promiseData) {
      console.warn(
        `No pending password change promise found for userId: ${userId}`
      );
      return;
    }

    // Clear the timeout
    clearTimeout(promiseData.timeout);

    // Remove the promise from the map
    global.passwordChangePromises.delete(userId);

    if (key === "auth.password.changed.success") {
      console.log(`[${userId}] Password changed: ${reason}`);
      // Resolve the promise - password change was successful
      promiseData.resolve({ success: true, message: reason });
    } else if (key === "auth.password.changed.failed") {
      console.warn(`[${userId}] Password change failed: ${reason}`);
      // Reject the promise with the failure reason
      promiseData.reject(new Error(reason));
    } else {
      console.log("Unknown routing key received");
      promiseData.reject(new Error("Unknown response from auth service"));
    }
  } catch (error) {
    console.error("Error handling password change event:", error?.message);

    // If there's an error, try to reject the promise if it exists
    const { userId } = data || {};
    const promiseData = global.passwordChangePromises?.get(userId);
    if (promiseData) {
      clearTimeout(promiseData.timeout);
      global.passwordChangePromises.delete(userId);
      promiseData.reject(
        new Error("Internal server error while processing password change")
      );
    }
  }
};
