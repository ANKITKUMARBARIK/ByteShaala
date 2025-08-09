import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useGetCoursesQuery } from "@/actions/courseActions";
import { useAddToCartMutation } from "@/actions/cartActions";
import Pagination from "@/components/common/pagination";
import CourseCard from "@/components/dashboard/course-card";

const CourseList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [addingCourseId, setAddingCourseId] = useState(null);
  const itemsPerPage = 9;

  // Fetch courses from API
  const {
    data: coursesData,
    isLoading,
    error,
  } = useGetCoursesQuery({
    search: searchTerm,
  });

  const courses = coursesData?.data || coursesData || [];

  // Filter courses based on search term (client-side filtering as backup)
  // const filteredCourses = useMemo(() => {
  //   if (!courses) return [];
  //   return courses.filter(
  //     (course) =>
  //       course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       course.instructor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       course.category?.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  // }, [courses, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(courses.length / itemsPerPage);
  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const paginatedCourses = courses.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleCourseClick = (course) => {
    navigate(`/courses/${course.slug}`);
  };

  const handleAddToCart = async (course) => {
    try {
      setAddingCourseId(course.id);
      await addToCart(course.id).unwrap();
      toast.success("Course added to cart!");
    } catch (error) {
      if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Failed to add course to cart");
      }
    } finally {
      setAddingCourseId(null);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="text-white text-lg">Loading courses...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-red-400 text-lg mb-2">
            Failed to load courses
          </div>
          <p className="text-gray-500">
            {error?.data?.message || "Please try again later."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="font-bold text-white">All Courses</h2>

        {/* Search Input */}
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search courses, instructors, or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Results Info */}
      {/* {searchTerm && (
        <div className="mb-6">
          <p className="text-gray-400">
            Found {filteredCourses.length} course
            {filteredCourses.length !== 1 ? "s" : ""}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>
      )} */}

      {/* Course Grid */}
      {courses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                buttonText="View Details"
                onButtonClick={handleCourseClick}
                showProgress={false} // Don't show progress on courses page
                showPricing={true} // Show pricing on courses page
                onAddToCart={handleAddToCart} // Enable add to cart
                isAddingToCart={addingCourseId === course.id} // Show loading state for specific course
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={courses.length}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No courses found</div>
          <p className="text-gray-500">
            Try adjusting your search terms or browse all available courses.
          </p>
        </div>
      )}
    </div>
  );
};

export default CourseList;
