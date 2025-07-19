import { Schema, Types, model } from "mongoose";

const userSchema = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            ref: "Auth",
            required: true,
            unique: true,
            index: true,
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
        courses: [
            {
                type: Types.ObjectId,
                ref: "Course",
            },
        ],
    },
    { timestamps: true }
);

const User = model("User", userSchema);

export default User;
