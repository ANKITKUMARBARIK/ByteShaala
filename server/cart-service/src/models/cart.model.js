import { Schema, Types, model } from "mongoose";

const cartSchema = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            required: true,
            unique: true,
            ref: "Auth",
        },
        courses: [
            {
                courseId: {
                    type: Types.ObjectId,
                    required: true,
                    ref: "Course",
                },
            },
        ],
    },
    { timestamps: true }
);

const Cart = model("Cart", cartSchema);

export default Cart;
