import {
  Star,
  Users,
  Clock,
  Globe,
  Award,
  Calendar,
  Play,
  CheckCircle,
  ShoppingCart,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { allCourses } from "../courses/data";

import { useAddToCartMutation } from "@/actions/cartActions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const CourseDetails = () => {
  const { id } = useParams();
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  // Find course by ID (with enhanced data structure)
  const course = allCourses.find((c) => c.id === parseInt(id)) || {
    id: parseInt(id),
    title: "100x devs cohort",
    instructor: "Harkirat Singh",
    category: "Full Stack",
    progress: 6,
    originalPrice: 15000,
    discountPrice: 8999,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
    description:
      "Master full-stack development with modern technologies. Learn React, Node.js, databases, and deployment strategies used by top tech companies.",
    rating: 4.8,
    studentsCount: 15420,
    duration: "52 hours",
    language: "English",
    level: "Beginner to Advanced",
    lastUpdated: "December 2024",
    requirements: [
      "Basic understanding of HTML, CSS, and JavaScript",
      "A computer with internet connection",
      "Willingness to learn and practice coding daily",
    ],
    whatYouWillLearn: [
      "Build full-stack web applications from scratch",
      "Master React.js for frontend development",
      "Learn Node.js and Express for backend development",
      "Work with databases (MongoDB, PostgreSQL)",
      "Deploy applications to production",
      "Understand modern development workflows",
    ],
    courseContent: [
      {
        title: "Introduction to Full Stack Development",
        lectures: 8,
        duration: "2h 30m",
      },
      {
        title: "Frontend Development with React",
        lectures: 15,
        duration: "8h 45m",
      },
      {
        title: "Backend Development with Node.js",
        lectures: 12,
        duration: "6h 20m",
      },
      {
        title: "Database Design and Management",
        lectures: 10,
        duration: "5h 15m",
      },
      { title: "Deployment and DevOps", lectures: 8, duration: "4h 30m" },
    ],
  };

  const discountPercentage = Math.round(
    ((course.originalPrice - course.discountPrice) / course.originalPrice) * 100
  );

  const handleAddToCart = async () => {
    try {
      await addToCart(course.id).unwrap();
      toast.success("Course added to cart!");
    } catch (error) {
      if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Failed to add course to cart");
      }
    }
  };

  return (
    <div className="min-h-screen text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <span className="text-blue-400 text-sm font-medium">
                  {course.category}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                {course.title}
              </h1>

              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                {course.description}
              </p>

              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(course.rating) ? "text-yellow-400 fill-current" : "text-gray-400"}`}
                      />
                    ))}
                  </div>
                  <span className="text-yellow-400 font-semibold">
                    {course.rating}
                  </span>
                  <span className="text-gray-400">
                    ({course.studentsCount.toLocaleString()} students)
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{course.studentsCount.toLocaleString()} students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>{course.language}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4" />
                  <span>{course.level}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Updated {course.lastUpdated}</span>
                </div>
              </div>

              <div className="mt-6">
                <span className="text-gray-400">Created by </span>
                <span className="text-blue-400 font-semibold">
                  {course.instructor}
                </span>
              </div>
            </div>

            {/* Right Sidebar - Course Preview */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl sticky top-4">
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <button className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 rounded-full p-4">
                      <Play className="w-8 h-8 text-white fill-current" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold text-white">
                        ₹{course.discountPrice.toLocaleString()}
                      </span>
                      <span className="text-lg text-gray-400 line-through">
                        ₹{course.originalPrice.toLocaleString()}
                      </span>
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                        {discountPercentage}% off
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 mb-3 flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>{isAddingToCart ? "Adding..." : "Add to Cart"}</span>
                  </button>

                  <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200">
                    Buy Now
                  </button>

                  <div className="mt-4 text-center text-sm text-gray-400">
                    30-Day Money-Back Guarantee
                  </div>
                </div>
              </div>
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
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">
                What you&apos;ll learn
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {course.whatYouWillLearn.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Content with ShadCN Accordion */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Course content</h2>
              <div className="mb-6 text-gray-300">
                {course.courseContent.length} sections •{" "}
                {course.courseContent.reduce(
                  (acc, section) => acc + section.lectures,
                  0
                )}{" "}
                lectures • {course.duration} total length
              </div>

              <Accordion type="multiple" className="w-full">
                {course.courseContent.map((section, index) => (
                  <AccordionItem
                    key={index}
                    value={`section-${index}`}
                    className="border-gray-700"
                  >
                    <AccordionTrigger className="text-left hover:no-underline hover:bg-gray-700/50 px-4 py-4 rounded-lg transition-colors">
                      <div className="flex flex-col items-start">
                        <h3 className="font-semibold text-white text-base mb-1">
                          {section.title}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {section.lectures} lectures • {section.duration}
                        </p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-2">
                      <div className="bg-gray-700/30 rounded-lg p-4 mt-2">
                        <div className="text-gray-300 text-sm space-y-2">
                          <p className="font-medium text-gray-200">
                            Section Overview:
                          </p>
                          <p>
                            This section covers comprehensive topics in{" "}
                            {section.title.toLowerCase()}. You&apos;ll learn
                            through practical examples and hands-on exercises.
                          </p>
                          <div className="mt-3 pt-3 border-t border-gray-600">
                            <p className="text-xs text-gray-400">
                              {section.lectures} video lectures •{" "}
                              {section.duration} total duration
                            </p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Requirements */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Requirements</h2>
              <ul className="space-y-3">
                {course.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Sidebar - Additional Info */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Course includes:</h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span>{course.duration} on-demand video</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-blue-400" />
                  <span>Certificate of completion</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <span>Access on mobile and TV</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                  <span>Full lifetime access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
