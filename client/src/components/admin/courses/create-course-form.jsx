import { yupResolver } from "@hookform/resolvers/yup";
import { Upload, X, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import * as yup from "yup";

import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
} from "@/actions/adminActions";
import { useGetCourseByIdQuery } from "@/actions/courseActions";
import CommonInput from "@/components/common/common-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Validation schema
const courseSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  category: yup.string().required("Category is required"),
  price: yup
    .number()
    .required("Price is required")
    .min(0, "Price must be positive"),
  originalPrice: yup
    .number()
    .required("Original price is required")
    .min(0, "Original price must be positive"),
  currency: yup.string().required("Currency is required"),
  language: yup.string().required("Language is required"),
  level: yup.string().required("Level is required"),
  duration: yup.string().required("Duration is required"),
  averageRating: yup
    .number()
    .min(0, "Rating must be between 0 and 5")
    .max(5, "Rating must be between 0 and 5"),
  learningPoints: yup
    .array()
    .of(yup.string().required("Learning point is required"))
    .min(1, "At least one learning point is required"),
  requirements: yup
    .array()
    .of(yup.string().required("Requirement is required"))
    .min(1, "At least one requirement is required"),
  courseContent: yup
    .array()
    .of(
      yup.object({
        title: yup.string().required("Section title is required"),
        lecturesCount: yup
          .number()
          .required("Lectures count is required")
          .min(1, "Must have at least 1 lecture"),
        duration: yup.string().required("Section duration is required"),
        overview: yup.string().required("Section overview is required"),
      })
    )
    .min(1, "At least one course section is required"),
});

const CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "AI/ML",
  "Cloud",
  "DevOps",
  "Cybersecurity",
  "UI/UX",
  "Programming",
];
const LANGUAGES = [
  "English",
  "Hindi",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const CURRENCIES = ["INR", "USD", "EUR", "GBP"];

export function CreateCourseForm({ className, ...props }) {
  const navigate = useNavigate();
  const { id: courseId } = useParams();
  const isEditMode = Boolean(courseId);

  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const { data: courseData, isLoading: isFetching } = useGetCourseByIdQuery(
    courseId,
    {
      skip: !isEditMode,
    }
  );

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const methods = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      price: 0,
      originalPrice: 0,
      currency: "INR",
      language: "English",
      level: "Beginner",
      duration: "",
      averageRating: 0,
      tags: [],
      learningPoints: [""],
      requirements: [""],
      courseContent: [
        {
          title: "",
          lecturesCount: 1,
          duration: "",
          overview: "",
        },
      ],
    },
    resolver: yupResolver(courseSchema),
    mode: "onBlur",
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    register,
    reset,
  } = methods;

  const {
    fields: learningPointsFields,
    append: appendLearningPoint,
    remove: removeLearningPoint,
  } = useFieldArray({
    control: methods.control,
    name: "learningPoints",
  });

  const {
    fields: requirementsFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray({
    control: methods.control,
    name: "requirements",
  });

  const {
    fields: courseContentFields,
    append: appendCourseContent,
    remove: removeCourseContent,
  } = useFieldArray({
    control: methods.control,
    name: "courseContent",
  });

  // Pre-fill form data for edit mode
  useEffect(() => {
    if (isEditMode && courseData?.data) {
      const course = courseData.data;
      reset({
        title: course.title || "",
        description: course.description || "",
        category: course.category || "",
        price: course.price || 0,
        originalPrice: course.originalPrice || 0,
        currency: course.currency || "INR",
        language: course.language || "English",
        level: course.level || "Beginner",
        duration: course.duration || "",
        averageRating: course.averageRating || 0,
        tags: course.tags || [],
        learningPoints: course.learningPoints?.length
          ? course.learningPoints
          : [""],
        requirements: course.requirements?.length ? course.requirements : [""],
        courseContent: course.courseContent?.length
          ? course.courseContent
          : [
              {
                title: "",
                lecturesCount: 1,
                duration: "",
                overview: "",
              },
            ],
      });
      setThumbnailPreview(course.thumbnail || "");
    }
  }, [courseData, isEditMode, reset]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview("");
  };

  const onSubmit = async (data) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Create payload object matching backend structure
      const payloadObj = {
        title: data.title.trim(),
        description: data.description.trim(),
        category: data.category.trim(),
        price: Number(data.price),
        originalPrice: Number(data.originalPrice),
        currency: data.currency,
        language: data.language,
        level: data.level,
        duration: data.duration.trim(),
        averageRating: Number(data.averageRating),
        tags: data.tags || [],
        learningPoints: data.learningPoints.filter((point) => point.trim()),
        requirements: data.requirements.filter((req) => req.trim()),
        courseContent: data.courseContent.map((section) => ({
          title: section.title.trim(),
          lecturesCount: Number(section.lecturesCount),
          duration: section.duration.trim(),
          overview: section.overview.trim(),
        })),
      };

      // Add payload as JSON string
      formData.append("payloadObj", JSON.stringify(payloadObj));

      // Add thumbnail file if present
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      } else if (!isEditMode) {
        toast.error("Please select a thumbnail image");
        return;
      }

      let result;
      if (isEditMode) {
        const course = courseData.data;
        result = await updateCourse({
          slug: course.slug,
          courseData: formData,
        }).unwrap();
        toast.success("Course updated successfully!");
      } else {
        result = await createCourse(formData).unwrap();
        console.log("resssssss", result);
        toast.success("Course created successfully!");
      }

      navigate("/admin/courses");
    } catch (error) {
      console.error("Course operation error:", error);
      toast.error(
        error?.data?.message ||
          `${isEditMode ? "Update" : "Creation"} failed. Please try again.`
      );
    }
  };

  if (isEditMode && isFetching) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-white text-lg">Loading course data...</div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-8">
            <div className="mb-8">
              <h2>{isEditMode ? "Edit Course" : "Create New Course"}</h2>
              <p className="text-gray-400">
                {isEditMode
                  ? "Update the course details below"
                  : "Fill in the details to create a new course"}
              </p>
            </div>

            <FormProvider {...methods}>
              <form
                className={cn("space-y-8", className)}
                onSubmit={handleSubmit(onSubmit)}
                {...props}
              >
                {/* Basic Information */}
                <div className="space-y-6">
                  <h4 className="text-white border-b border-gray-700 pb-2">
                    Basic Information
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CommonInput
                      name="title"
                      label="Course Title"
                      type="text"
                      placeholder="Enter course title"
                      required
                      {...register("title")}
                    />

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Category
                      </label>
                      <select
                        {...register("category")}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Category</option>
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="text-red-400 text-sm">
                          {errors.category.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <CommonInput
                    name="description"
                    label="Description"
                    type="textarea"
                    placeholder="Enter course description"
                    required
                    rows={4}
                    {...register("description")}
                  />

                  {/* Thumbnail Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Course Thumbnail
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailChange}
                          className="hidden"
                          id="thumbnail-upload"
                        />
                        <label
                          htmlFor="thumbnail-upload"
                          className="flex items-center justify-center w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 cursor-pointer hover:bg-gray-600 transition-colors"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Thumbnail
                        </label>
                      </div>
                      {thumbnailPreview && (
                        <div className="relative">
                          <img
                            src={thumbnailPreview}
                            alt="Thumbnail preview"
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={removeThumbnail}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pricing & Details */}
                <div className="space-y-6">
                  <h4 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
                    Pricing & Details
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <CommonInput
                      name="price"
                      label="Price"
                      type="number"
                      placeholder="0"
                      required
                      {...register("price")}
                    />

                    <CommonInput
                      name="originalPrice"
                      label="Original Price"
                      type="number"
                      placeholder="0"
                      required
                      {...register("originalPrice")}
                    />

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Currency
                      </label>
                      <select
                        {...register("currency")}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {CURRENCIES.map((curr) => (
                          <option key={curr} value={curr}>
                            {curr}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Language
                      </label>
                      <select
                        {...register("language")}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {LANGUAGES.map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Level
                      </label>
                      <select
                        {...register("level")}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {LEVELS.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>

                    <CommonInput
                      name="duration"
                      label="Duration"
                      type="text"
                      placeholder="e.g., 36 hours"
                      required
                      {...register("duration")}
                    />
                  </div>

                  <CommonInput
                    name="averageRating"
                    label="Average Rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    placeholder="4.5"
                    {...register("averageRating")}
                  />
                </div>

                {/* Learning Points */}
                <div className="space-y-6">
                  <h4 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
                    What Students Will Learn
                  </h4>

                  <div className="space-y-4">
                    {learningPointsFields.map((field, index) => (
                      <div key={field.id} className="flex items-end space-x-3">
                        <div className="flex-1">
                          <CommonInput
                            name={`learningPoints.${index}`}
                            label={`Learning Point ${index + 1}`}
                            type="text"
                            placeholder="Enter what students will learn"
                            required
                            {...register(`learningPoints.${index}`)}
                          />
                        </div>
                        {learningPointsFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeLearningPoint(index)}
                            className="p-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => appendLearningPoint("")}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Learning Point</span>
                  </button>
                </div>

                {/* Requirements */}
                <div className="space-y-6">
                  <h4 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
                    Requirements
                  </h4>

                  <div className="space-y-4">
                    {requirementsFields.map((field, index) => (
                      <div key={field.id} className="flex items-end space-x-3">
                        <div className="flex-1">
                          <CommonInput
                            name={`requirements.${index}`}
                            label={`Requirement ${index + 1}`}
                            type="text"
                            placeholder="Enter course requirement"
                            required
                            {...register(`requirements.${index}`)}
                          />
                        </div>
                        {requirementsFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRequirement(index)}
                            className="p-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => appendRequirement("")}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Requirement</span>
                  </button>
                </div>

                {/* Course Content */}
                <div className="space-y-6">
                  <h4 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
                    Course Content
                  </h4>

                  {courseContentFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="bg-gray-700 rounded-lg p-6 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="text-white">Section {index + 1}</h5>
                        {courseContentFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCourseContent(index)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <CommonInput
                          name={`courseContent.${index}.title`}
                          label="Section Title"
                          type="text"
                          placeholder="Enter section title"
                          required
                          {...register(`courseContent.${index}.title`)}
                        />

                        <CommonInput
                          name={`courseContent.${index}.lecturesCount`}
                          label="Lectures Count"
                          type="number"
                          min="1"
                          placeholder="5"
                          required
                          {...register(`courseContent.${index}.lecturesCount`)}
                        />

                        <CommonInput
                          name={`courseContent.${index}.duration`}
                          label="Duration"
                          type="text"
                          placeholder="2h 30m"
                          required
                          {...register(`courseContent.${index}.duration`)}
                        />
                      </div>

                      <CommonInput
                        name={`courseContent.${index}.overview`}
                        label="Section Overview"
                        type="textarea"
                        placeholder="Enter section overview"
                        required
                        rows={3}
                        {...register(`courseContent.${index}.overview`)}
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      appendCourseContent({
                        title: "",
                        lecturesCount: 1,
                        duration: "",
                        overview: "",
                      })
                    }
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Section</span>
                  </button>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center space-x-4 pt-6">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3"
                    disabled={isSubmitting || isCreating || isUpdating}
                  >
                    {isSubmitting || isCreating || isUpdating
                      ? `${isEditMode ? "Updating" : "Creating"} Course...`
                      : `${isEditMode ? "Update" : "Create"} Course`}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/admin/courses")}
                    className="px-8 py-3"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
