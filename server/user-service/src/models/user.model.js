import { Schema, Types, model } from "mongoose";

const userSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
      unique: true,
      index: true,
      ref: "Auth",
    },
    firstName: {
      type: String,
      required: [true, "firstname is required"],
      trim: true,
      index: true,
    },
    lastName: {
      type: String,
      required: [true, "lastname is required"],
      trim: true,
      index: true,
    },
    avatar: {
      type: String,
    },
    enrolledCourses: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
