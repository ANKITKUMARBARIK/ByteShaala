import React, { useState, useMemo } from "react";

import Pagination from "@/components/common/pagination";
import CourseCard from "@/components/dashboard/course-card";

// Extended dummy course data (30 courses) with pricing
const allCourses = [
  {
    id: 1,
    title: "100x devs cohort",
    instructor: "Harkirat Singh",
    category: "Full Stack",
    progress: 6,
    originalPrice: 15000,
    discountPrice: 8999,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Ad hoc classes",
    instructor: "Harkirat Singh",
    category: "Advanced",
    progress: 0,
    originalPrice: 12000,
    discountPrice: 7499,
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    title: "Harnoor's Android cohort",
    instructor: "Harnoor Singh",
    category: "Android",
    progress: 0,
    originalPrice: 18000,
    discountPrice: 11999,
    image:
      "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    title: "Machine Learning + MLOps course",
    instructor: "Harkirat Singh",
    category: "ML/AI",
    progress: 0,
    originalPrice: 25000,
    discountPrice: 16999,
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    title: "DSA Classes",
    instructor: "Harkirat Singh",
    category: "Programming",
    progress: 0,
    originalPrice: 10000,
    discountPrice: 5999,
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    title: "React Advanced Patterns",
    instructor: "John Doe",
    category: "Frontend",
    progress: 25,
    originalPrice: 14000,
    discountPrice: 8999,
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
  },
  {
    id: 7,
    title: "Node.js Backend Mastery",
    instructor: "Jane Smith",
    category: "Backend",
    progress: 40,
    originalPrice: 16000,
    discountPrice: 9999,
    image:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop",
  },
  {
    id: 8,
    title: "Python for Data Science",
    instructor: "Dr. Alex Johnson",
    category: "Data Science",
    progress: 60,
    originalPrice: 20000,
    discountPrice: 12999,
    image:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=300&fit=crop",
  },
  {
    id: 9,
    title: "DevOps with Docker & Kubernetes",
    instructor: "Mike Wilson",
    category: "DevOps",
    progress: 30,
    originalPrice: 22000,
    discountPrice: 14999,
    image:
      "https://images.unsplash.com/photo-1605745341112-85968b19335a?w=400&h=300&fit=crop",
  },
  {
    id: 10,
    title: "Vue.js Complete Guide",
    instructor: "Sarah Connor",
    category: "Frontend",
    progress: 15,
    originalPrice: 13000,
    discountPrice: 7999,
    image:
      "https://images.unsplash.com/photo-1619410283995-43d9134e7656?w=400&h=300&fit=crop",
  },
  {
    id: 11,
    title: "MongoDB Database Design",
    instructor: "Robert Brown",
    category: "Database",
    progress: 50,
    originalPrice: 15000,
    discountPrice: 9499,
    image:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=300&fit=crop",
  },
  {
    id: 12,
    title: "GraphQL API Development",
    instructor: "Emily Davis",
    category: "Backend",
    progress: 20,
    originalPrice: 17000,
    discountPrice: 10999,
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",
  },
  {
    id: 13,
    title: "AWS Cloud Practitioner",
    instructor: "David Lee",
    category: "Cloud",
    progress: 35,
    originalPrice: 24000,
    discountPrice: 15999,
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop",
  },
  {
    id: 14,
    title: "Cybersecurity Fundamentals",
    instructor: "Lisa Wang",
    category: "Security",
    progress: 10,
    originalPrice: 19000,
    discountPrice: 11999,
    image:
      "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=400&h=300&fit=crop",
  },
  {
    id: 15,
    title: "Flutter Mobile Development",
    instructor: "Chris Taylor",
    category: "Mobile",
    progress: 45,
    originalPrice: 18000,
    discountPrice: 11499,
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
  },
  {
    id: 16,
    title: "TypeScript Mastery",
    instructor: "Anna Martinez",
    category: "Programming",
    progress: 70,
    originalPrice: 12000,
    discountPrice: 6999,
    image:
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=300&fit=crop",
  },
  {
    id: 17,
    title: "Blockchain Development",
    instructor: "Kevin Zhang",
    category: "Blockchain",
    progress: 5,
    originalPrice: 30000,
    discountPrice: 19999,
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop",
  },
  {
    id: 18,
    title: "UI/UX Design Principles",
    instructor: "Rachel Green",
    category: "Design",
    progress: 80,
    originalPrice: 16000,
    discountPrice: 9999,
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
  },
  {
    id: 19,
    title: "PostgreSQL Advanced",
    instructor: "Tom Anderson",
    category: "Database",
    progress: 25,
    originalPrice: 14000,
    discountPrice: 8499,
    image:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=300&fit=crop",
  },
  {
    id: 20,
    title: "Redis Caching Strategies",
    instructor: "Maria Garcia",
    category: "Backend",
    progress: 40,
    originalPrice: 11000,
    discountPrice: 6499,
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",
  },
  {
    id: 21,
    title: "Next.js Full Stack",
    instructor: "James Wilson",
    category: "Full Stack",
    progress: 55,
    originalPrice: 17000,
    discountPrice: 10999,
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
  },
  {
    id: 22,
    title: "Rust Programming Language",
    instructor: "Sophie Chen",
    category: "Programming",
    progress: 15,
    originalPrice: 15000,
    discountPrice: 8999,
    image:
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=300&fit=crop",
  },
  {
    id: 23,
    title: "Go Backend Development",
    instructor: "Mark Johnson",
    category: "Backend",
    progress: 30,
    originalPrice: 16000,
    discountPrice: 9499,
    image:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop",
  },
  {
    id: 24,
    title: "TensorFlow Deep Learning",
    instructor: "Dr. Lisa Park",
    category: "ML/AI",
    progress: 65,
    originalPrice: 28000,
    discountPrice: 18999,
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop",
  },
  {
    id: 25,
    title: "Svelte Framework",
    instructor: "Alex Thompson",
    category: "Frontend",
    progress: 20,
    originalPrice: 12000,
    discountPrice: 7499,
    image:
      "https://images.unsplash.com/photo-1619410283995-43d9134e7656?w=400&h=300&fit=crop",
  },
  {
    id: 26,
    title: "Microservices Architecture",
    instructor: "Daniel Kim",
    category: "Architecture",
    progress: 35,
    originalPrice: 25000,
    discountPrice: 16499,
    image:
      "https://images.unsplash.com/photo-1605745341112-85968b19335a?w=400&h=300&fit=crop",
  },
  {
    id: 27,
    title: "Swift iOS Development",
    instructor: "Jennifer Lee",
    category: "Mobile",
    progress: 50,
    originalPrice: 20000,
    discountPrice: 12999,
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
  },
  {
    id: 28,
    title: "Elasticsearch & Kibana",
    instructor: "Ryan Murphy",
    category: "Search",
    progress: 10,
    originalPrice: 18000,
    discountPrice: 11499,
    image:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=300&fit=crop",
  },
  {
    id: 29,
    title: "Apache Kafka Streaming",
    instructor: "Helen Zhou",
    category: "Data Engineering",
    progress: 45,
    originalPrice: 22000,
    discountPrice: 14999,
    image:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=300&fit=crop",
  },
  {
    id: 30,
    title: "Ethical Hacking Course",
    instructor: "Carlos Rodriguez",
    category: "Security",
    progress: 25,
    originalPrice: 21000,
    discountPrice: 13999,
    image:
      "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=400&h=300&fit=crop",
  },
];

const CourseList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Filter courses based on search term
  const filteredCourses = useMemo(() => {
    return allCourses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = filteredCourses.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleCourseClick = (course) => {
    console.log("Course clicked:", course);
    // Handle course navigation here
  };

  const handleAddToCart = (course) => {
    console.log("Added to cart:", course);
    // Handle add to cart functionality here
    // You can integrate with your cart state management
  };

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
      {searchTerm && (
        <div className="mb-6">
          <p className="text-gray-400">
            Found {filteredCourses.length} course
            {filteredCourses.length !== 1 ? "s" : ""}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>
      )}

      {/* Course Grid */}
      {paginatedCourses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                buttonText="View Details"
                onButtonClick={handleCourseClick}
                showProgress={false} // Don't show progress on courses page
                showPricing={true} // Show pricing on courses page
                onAddToCart={handleAddToCart} // Enable add to cart
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredCourses.length}
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
