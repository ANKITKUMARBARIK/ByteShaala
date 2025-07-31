import { Schema, Types, model } from "mongoose";

const courseSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        thumbnail: {
            type: String,
            required: [true, "thumbnail is required"],
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        originalPrice: {
            // MRP or discount price
            type: Number,
            default: 0,
            min: 0,
        },
        currency: {
            type: String,
            default: "USD",
            enum: ["USD", "INR", "EUR"],
        },
        language: {
            type: String,
            default: "English",
            enum: ["Hindi", "English"],
        },
        level: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced"],
            default: "Beginner",
        },
        tags: {
            type: [String], // ["JS", "React", "Node"]
            default: [],
        },
        status: {
            type: String,
            enum: ["Draft", "Published", "Archived"],
            default: "Draft",
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
        totalEnrollments: {
            type: Number,
            default: 0,
        },
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        instructor: {
            type: Types.ObjectId,
            required: true,
            ref: "Auth",
        },
    },
    { timestamps: true }
);

const Course = model("Course", courseSchema);

export default Course;
