import asyncHandler from "../utils/asyncHandler.util.js";
import ApiError from "../utils/ApiError.util.js";
import ApiResponse from "../utils/ApiResponse.util.js";
import axios from "axios";
import Cart from "../models/cart.model.js";

export const addToCart = asyncHandler(async (req, res) => {
    const { courseId } = req.body;

    // verify course exists via Course Service
    let course;
    try {
        const response = await axios.get(
            `${process.env.GATEWAY_URL}/api/v1/course/get-course/${courseId}`
        );
        course = response.data?.data;
    } catch (error) {
        throw new ApiError(500, "Failed to fetch course from Course Service");
    }

    let existedCart = await Cart.findOne({ userId: req.user?._id });
    if (existedCart) {
        const alreadyExists = existedCart.courses.some(
            (item) => item.courseId.toString() === courseId
        );
        if (alreadyExists) {
            throw new ApiError(400, "course already in cart");
        }
        existedCart.courses.push({ courseId });
        await existedCart.save();
    } else {
        // new cart
        existedCart = new Cart({
            userId: req.user?._id,
            courses: [{ courseId }],
        });
        await existedCart.save();
    }

    return res
        .status(200)
        .json(new ApiResponse(200, existedCart, "course added to cart"));
});

export const getCart = asyncHandler(async (req, res) => {
    const existedCart = await Cart.findOne({ userId: req.user?._id });

    if (!existedCart || existedCart.courses.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "cart is empty"));
    }

    const coursesWithDetails = [];

    for (const item of existedCart.courses) {
        try {
            const response = await axios.get(
                `${process.env.GATEWAY_URL}/api/v1/course/get-course/${item.courseId}`
            );

            const courseData = response.data?.data;
            if (courseData) {
                coursesWithDetails.push({
                    courseId: item.courseId,
                    courseDetails: courseData,
                });
            }
        } catch (error) {
            console.error(
                `error fetching course ${item.courseId}:`,
                error.message
            );
            // optional: push basic info even if course fetch fails
        }
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                coursesWithDetails,
                "cart fetched successfully"
            )
        );
});

export const removeFromCart = asyncHandler(async (req, res) => {
    const { courseId } = req.body;

    let existedCart = await Cart.findOne({ userId: req.user?._id });

    if (!existedCart) {
        throw new ApiError(404, "cart not found");
    }

    // check if course exists in the cart
    const index = existedCart.courses.findIndex(
        (item) => item.courseId.toString() === courseId
    );

    if (index === -1) {
        throw new ApiError(404, "course not found in cart");
    }

    // remove the course from cart
    existedCart.courses.splice(index, 1);
    await existedCart.save();

    return res
        .status(200)
        .json(new ApiResponse(200, existedCart, "course removed from cart"));
});

export const clearCart = asyncHandler(async (req, res) => {
    const existedCart = await Cart.findOne({ userId: req.user?._id });

    if (!existedCart) {
        throw new ApiError(404, "cart not found");
    }

    existedCart.courses = [];
    await existedCart.save();

    return res
        .status(200)
        .json(new ApiResponse(200, existedCart, "cart cleared successfully"));
});
