import React, { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import CourseCard from "./course-card";

// Dummy course data based on the screenshots
const dummyCourses = [
  {
    id: 1,
    title: "100x devs cohort",
    instructor: "Harkirat Singh",
    category: "0-100",
    progress: 6,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
    discord: true,
  },
  {
    id: 2,
    title: "Ad hoc classes",
    instructor: "Harkirat Singh",
    category: "Advanced",
    progress: 0,
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
    discord: true,
  },
  {
    id: 3,
    title: "Harnoor's Android cohort",
    instructor: "Harnoor Singh",
    category: "Android",
    progress: 0,
    image:
      "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=400&h=300&fit=crop",
    discord: true,
  },
  {
    id: 4,
    title: "Machine Learning + MLOps course",
    instructor: "Harkirat Singh",
    category: "ML/AI",
    progress: 0,
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop",
    discord: true,
  },
  {
    id: 5,
    title: "DSA Classes",
    instructor: "Harkirat Singh",
    category: "Programming",
    progress: 0,
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=300&fit=crop",
    discord: true,
  },
];

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  // Get current time for greeting
  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Get user's first name or fallback
  const getUserName = () => {
    if (user?.name) {
      return user.name.split(" ")[0];
    }
    return "User";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-white">
          {getCurrentGreeting()} {getUserName()}
        </h2>
        <p className="text-gray-400 text-md">
          Welcome back to your learning journey
        </p>
      </div>

      {/* Courses Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-6">Your Courses</h2>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* Additional Section - Don't See Your Courses */}
      {/* <div className="bg-gray-800 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold text-white mb-2">
          Don&apos;t See Your Courses?
        </h3>
        <p className="text-gray-400 mb-4">
          Try refreshing the database. If you are still facing issues,{" "}
          <a href="#" className="text-blue-400 hover:text-blue-300 underline">
            Contact us
          </a>
        </p>
        <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-colors duration-200">
          Refresh Database
        </button>
      </div> */}
    </div>
  );
};

export default Dashboard;
