import asyncHandler from "../utils/asyncHandler.util.js";
import ApiError from "../utils/ApiError.util.js";
import ApiResponse from "../utils/ApiResponse.util.js";
import slugify from "slugify";
import { uploadOnCloudinary } from "../services/cloudinary.service.js";
import Course from "../models/course.model.js";

export const createCourse = asyncHandler(async (req, res) => {
  // Parse the JSON payload from form-data
  const payloadObj = JSON.parse(req.body.payloadObj || "{}");

  const {
    title,
    description,
    category,
    price,
    originalPrice,
    currency,
    language,
    level,
    tags,
    duration,
    averageRating,
    requirements,
    learningPoints,
    courseContent,
  } = payloadObj;

  const slug = slugify(title.trim(), { lower: true, strict: true });

  const existedCourse = await Course.findOne({ slug });
  if (existedCourse)
    throw new ApiError(409, "course with this slug already exists");

  // Handle thumbnail file upload
  let thumbnailLocalPath = req.file?.buffer;
  if (!thumbnailLocalPath) throw new ApiError(400, "thumbnail file is missing");

  const thumbnailImage = await uploadOnCloudinary(thumbnailLocalPath);
  if (!thumbnailImage?.url)
    throw new ApiError(500, "error while uploading thumbnail");

  const course = new Course({
    title: title?.trim(),
    description: description?.trim(),
    category: category?.trim(),
    slug,
    price,
    originalPrice,
    currency,
    language,
    level,
    duration,
    averageRating: averageRating || 0,
    requirements: requirements || [],
    learningPoints: learningPoints || [],
    courseContent: courseContent || [],
    tags: tags || [],
    thumbnail: thumbnailImage.url,
    instructor: req.user?._id,
  });

  const createdCourse = await course.save();
  if (!createdCourse)
    throw new ApiError(500, "course creation failed, please try again");

  return res
    .status(201)
    .json(new ApiResponse(201, createdCourse, "course created successfully"));
});

export const updateCourse = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  // Parse the JSON payload from form-data (same as createCourse)
  const payloadObj = JSON.parse(req.body.payloadObj || "{}");

  const {
    title,
    description,
    category,
    price,
    originalPrice,
    currency,
    language,
    level,
    tags,
    duration,
    averageRating,
    requirements,
    learningPoints,
    courseContent,
  } = payloadObj;

  const existedCourse = await Course.findOne({ slug });
  if (!existedCourse) {
    throw new ApiError(404, "course not found");
  }

  const updateFields = {};

  // Title change => slug change
  if (title && title.trim() !== existedCourse.title) {
    const newSlug = slugify(title.trim(), { lower: true, strict: true });
    const slugExists = await Course.findOne({
      slug: newSlug,
      _id: { $ne: existedCourse._id },
    });
    if (slugExists) {
      throw new ApiError(409, "course with this slug already exists");
    }
    updateFields.title = title.trim();
    updateFields.slug = newSlug;
  }

  // Update other fields if provided
  if (description) updateFields.description = description.trim();
  if (category) updateFields.category = category.trim();
  if (price !== undefined) updateFields.price = price;
  if (originalPrice !== undefined) updateFields.originalPrice = originalPrice;
  if (currency) updateFields.currency = currency.trim();
  if (language) updateFields.language = language.trim();
  if (level) updateFields.level = level;
  if (tags) updateFields.tags = tags;
  if (duration) updateFields.duration = duration;
  if (averageRating !== undefined) updateFields.averageRating = averageRating;
  if (requirements) updateFields.requirements = requirements;
  if (learningPoints) updateFields.learningPoints = learningPoints;
  if (courseContent) updateFields.courseContent = courseContent;

  // Handle thumbnail file upload (same as createCourse)
  if (req.file?.buffer) {
    const thumbnailImage = await uploadOnCloudinary(req.file.buffer);
    if (!thumbnailImage?.url)
      throw new ApiError(500, "error while uploading thumbnail");
    updateFields.thumbnail = thumbnailImage.url;
  }

  const updatedCourse = await Course.findOneAndUpdate(
    { slug },
    { $set: updateFields },
    { new: true, runValidators: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedCourse, "course updated successfully"));
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const deletedCourse = await Course.findByIdAndDelete(courseId);
  if (!deletedCourse) {
    throw new ApiError(404, "course not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "course deleted successfully"));
});

export const getAllCourses = asyncHandler(async (req, res) => {
  const { search } = req.query;

  // Build search filter
  let searchFilter = {};
  if (search && search.trim()) {
    searchFilter.title = {
      $regex: search.trim(),
      $options: "i", // Case-insensitive search
    };
  }

  const existedCourse = await Course.find(searchFilter).sort("-createdAt");
  if (!existedCourse) {
    throw new ApiError(404, "course not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, existedCourse, "courses fetched successfully"));
});

export const getCourseById = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const existedCourse = await Course.findOne({ slug });
  if (!existedCourse) {
    throw new ApiError(404, "course not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, existedCourse, "course fetched successfully"));
});

export const getCourseByObjectId = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const existedCourse = await Course.findById(courseId);
  if (!existedCourse) {
    throw new ApiError(404, "course not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, existedCourse, "course fetched successfully"));
});

export const addReviews = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { rating, comment } = req.body;

  const existedCourse = await Course.findById(courseId);
  if (!existedCourse) {
    throw new ApiError(404, "course not found");
  }

  // check if user already reviewed
  const alreadyReviewed = existedCourse.reviews.some(
    (item) => item.user.toString() === req.user?._id.toString()
  );
  if (alreadyReviewed) {
    throw new ApiError(400, "you already reviewed this course");
  }

  const review = {
    user: req.user?._id,
    rating: Number(rating),
    comment,
  };

  // push review
  existedCourse.reviews.push(review);

  // calculate average rating
  existedCourse.averageRating = Number(
    (
      existedCourse.reviews.reduce((acc, item) => item.rating + acc, 0) /
      existedCourse.reviews.length
    ).toFixed(1)
  );

  await existedCourse.save();

  return res
    .status(200)
    .json(new ApiResponse(200, existedCourse, "review added successfully"));
});

export const getAllReviews = asyncHandler(async (req, res) => {
  const existedCourse = await Course.find().select("reviews");

  const allReviews = existedCourse.flatMap((course) =>
    course.reviews.map((review) => ({
      course: course._id,
      user: review.user,
      rating: review.rating,
      comment: review.comment,
    }))
  );

  return res
    .status(200)
    .json(new ApiResponse(200, allReviews, "reviews fetched successfully"));
});
