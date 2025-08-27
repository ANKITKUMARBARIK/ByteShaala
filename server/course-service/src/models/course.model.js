import { Schema, Types, model } from "mongoose";
import slugify from "slugify";

// review schema
const reviewSchema = new Schema(
    {
        user: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

// course schema
const courseSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        duration: {
            type: String,
            required: false,
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
            default: "INR",
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
            type: String,
            required: true,
        },
        learningPoints: {
            type: [String],
            default: [],
        },
        requirements: {
            type: [String],
            default: [],
        },
        courseContent: {
            type: [
                {
                    title: { type: String },
                    lecturesCount: { type: Number },
                    duration: { type: String }, // Example: "8h 15m"
                    overview: { type: String },
                },
            ],
            default: [],
        },
        reviews: [reviewSchema],
    },
    { timestamps: true }
);

// Pre-save hook for auto slug
courseSchema.pre("save", function (next) {
    if (this.isModified("title")) {
        this.slug = slugify(this.title.trim(), { lower: true, strict: true });
    }
    next();
});

const Course = model("Course", courseSchema);

export default Course;
