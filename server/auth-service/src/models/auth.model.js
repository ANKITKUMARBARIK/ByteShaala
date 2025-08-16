import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const authSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    authProvider: {
      type: String,
      enum: [
        "local",
        "google",
        "github",
        "linkedin",
        "facebook",
        "twitter",
        "apple",
        "microsoft",
      ],
      default: "local",
    },
    role: {
      type: String,
      enum: ["STUDENT", "INSTRUCTOR", "ADMIN"],
      default: "STUDENT",
    },
    refreshToken: {
      type: String,
    },
    otpSignup: {
      type: String,
    },
    otpSignupExpiry: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    forgetPasswordToken: {
      type: String,
    },
    forgetPasswordExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

authSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

authSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Auth = model("Auth", authSchema);

export default Auth;
