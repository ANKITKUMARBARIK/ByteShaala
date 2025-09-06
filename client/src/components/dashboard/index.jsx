import { User, Mail, Phone, BookOpen } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import CourseCard from "./course-card";
import InquiryForm from "./inquiry-form";
import RecentActivity from "./recent-activity";
import Testimonials from "./testimonials";

import { useGetAllReviewsQuery } from "@/actions/courseActions";
import { useGetUserProfileQuery } from "@/actions/profileActions";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { data: userData } = useGetUserProfileQuery();
  const { data: reviewsData } = useGetAllReviewsQuery();

  const navigate = useNavigate();

  const currentUser = userData?.data || userData || user;
  const enrolledCourses = currentUser?.enrolledCourses || [];

  // Get current time for greeting
  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Get user's first name or fallback
  const getUserName = () => {
    if (currentUser?.firstName) {
      return currentUser.firstName;
    }
    if (currentUser?.name) {
      return currentUser.name.split(" ")[0];
    }
    return "User";
  };

  // Navigation handlers
  const handleExplore = () => navigate("/courses");
  const handleViewCourse = (course) => {
    navigate(`/courses/${course.slug}`, { state: { fromEnrolled: true } });
  };

  // Normalize course for CourseCard if some fields are missing
  const normalizeCourse = (c) => ({
    ...c,
    title: c?.title || "Untitled Course",
    thumbnail:
      c?.thumbnail ||
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=300&fit=crop",
    category: c?.category || "Course",
    instructor: c?.instructorName || c?.instructor || "",
    progress: c?.progress, // optional; CourseCard hides if undefined
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-white">
          {getCurrentGreeting()} {getUserName()}
        </h3>
        <p className="text-gray-400 text-md">
          Welcome back to your learning journey
        </p>
      </div>

      {/* User Details Card */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {currentUser?.firstName && currentUser?.lastName ? (
              `${currentUser.firstName[0]}${currentUser.lastName[0]}`
            ) : (
              <User className="w-8 h-8" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-lg font-semibold text-white">
              {currentUser?.firstName && currentUser?.lastName
                ? `${currentUser.firstName} ${currentUser.lastName}`
                : currentUser?.name || "User Name"}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0">
              <div className="flex items-center text-gray-400">
                <Mail className="w-4 h-4 mr-2" />
                <span>{currentUser?.email || "user@example.com"}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Phone className="w-4 h-4 mr-2" />
                <span>{currentUser?.phoneNumber || "Not provided"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div>
        <h3 className="text-white mb-6">Your Courses</h3>

        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <CourseCard
                key={course._id || course.id}
                course={normalizeCourse(course)}
                onButtonClick={handleViewCourse}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-white mb-2">
              You don&apos;t have any courses yet
            </h3>
            <p className="text-gray-400 mb-6">
              Start your learning journey by exploring our amazing courses
            </p>
            <Button
              onClick={handleExplore}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Explore Courses
            </Button>
          </div>
        )}
      </div>

      {/* Testimonials Section */}
      <Testimonials reviews={reviewsData?.data || []} />

      {/* Recent Activity Section */}
      <RecentActivity />

      {/* Inquiry Form Section */}
      <InquiryForm courses={enrolledCourses} />
    </div>
  );
};

export default Dashboard;
