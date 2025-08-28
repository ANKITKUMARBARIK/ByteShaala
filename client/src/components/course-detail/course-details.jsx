import {
  Star,
  Users,
  Clock,
  Globe,
  Award,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import { toast } from "sonner";

import AdditionalInfo from "./components/additional-info";
import CourseContent from "./components/course-content";
import CoursePreview from "./components/course-preview";
import WriteReview from "./components/write-review";

import { useAddToCartMutation } from "@/actions/cartActions";
import { useGetCourseByIdQuery } from "@/actions/courseActions";
import { useGetUserProfileQuery } from "@/actions/profileActions";
import { AuthContext } from "@/context/AuthContext";

const CourseDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  // Fetch course by ID from API
  const { data: courseDetails, isLoading, error } = useGetCourseByIdQuery(id);
  const { data: profileData } = useGetUserProfileQuery();

  const course = courseDetails?.data;
  const currentUser = profileData?.data || profileData || user;

  const handleAddToCart = async () => {
    try {
      await addToCart(course._id).unwrap();
      toast.success("Course added to cart!");
    } catch (error) {
      if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Failed to add course to cart");
      }
    }
  };

  // Determine if user owns the course
  const enrolledCourses =
    profileData?.data?.enrolledCourses || profileData?.enrolledCourses || [];
  const isOwnedByProfile = enrolledCourses.some(
    (c) => c?._id === course?._id || c?.slug === course?.slug
  );
  const isOwnedByState = Boolean(location.state?.fromEnrolled);
  const isOwned = isOwnedByProfile || isOwnedByState;
  const isAuthenticated = Boolean(currentUser);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading course...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-2">Course not found</div>
          <p className="text-gray-500">
            {error?.data?.message ||
              "The course you're looking for doesn't exist."}
          </p>
        </div>
      </div>
    );
  }

  // If no course data
  if (!course) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-2">Course not found</div>
          <p className="text-gray-500">
            The course you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      {/* Hero Section */}
      <div className="bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <span className="text-blue-400 text-sm font-medium">
                  {course?.category}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                {course?.title}
              </h1>

              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                {course?.description}
              </p>

              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(course?.averageRating) ? "text-yellow-400 fill-current" : "text-gray-400"}`}
                      />
                    ))}
                  </div>
                  <span className="text-yellow-400 font-semibold">
                    {course?.averageRating}
                  </span>
                  <span className="text-gray-400">
                    ({course?.reviews?.length} reviews)
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{course?.totalEnrollments} students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{course?.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>{course?.language}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4" />
                  <span>{course?.level}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Updated {new Date(course?.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <span className="text-gray-400">Created by </span>
                <span className="text-blue-400 font-semibold">
                  {course?.instructor}
                </span>
              </div>
            </div>

            {/* Right Sidebar - Course Preview */}
            <div className="lg:col-span-1">
              <CoursePreview
                course={course}
                handleAddToCart={handleAddToCart}
                isAddingToCart={isAddingToCart}
                isOwned={isOwned}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-6">
                What you&apos;ll learn
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {course.learningPoints.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Content with ShadCN Accordion */}
            <CourseContent course={course} />

            {/* Requirements */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-6">Requirements</h3>
              <ul className="space-y-3">
                {course.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reviews Section */}
            <WriteReview
              isAuthenticated={isAuthenticated}
              isOwned={isOwned}
              course={course}
            />
          </div>

          {/* Right Sidebar - Additional Info */}
          <div className="lg:col-span-1">
            <AdditionalInfo course={course} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
