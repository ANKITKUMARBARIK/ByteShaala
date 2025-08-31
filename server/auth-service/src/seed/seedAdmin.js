import Auth from "../models/auth.model.js";
import ROLES from "../config/role.js";

const seedAdmin = async () => {
  try {
    const existedAdmin = await Auth.findOne({ role: ROLES.ADMIN });
    if (!existedAdmin) {
      const user = new Auth({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: ROLES.ADMIN,
        isVerified: true,
        authProvider: "local",
      });
      await user.save();
      //   const response = await publishMessage(
      //     "auth_exchange",
      //     "auth.account.create",
      //     {
      //       userId: user._id,
      //       firstName: "admin",
      //       lastName: "dev",
      //     }
      //   );
      //   console.log(response);
      //   console.info("default admin created successfully");
    } else {
      console.info("admin already exists");
    }
  } catch (error) {
    console.error("error while creating default admin:", error);
  }
};

export default seedAdmin;
