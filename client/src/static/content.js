/**
 * Static content for the LMS application
 * This file contains placeholder data and default values
 */

// Default avatar images
export const defaultAvatars = {
  user: "/assets/images/default-user.png",
  instructor: "/assets/images/default-instructor.png",
  admin: "/assets/images/default-admin.png",
};

// Course categories
export const courseCategories = [
  { id: "web-dev", name: "Web Development" },
  { id: "mobile-dev", name: "Mobile Development" },
  { id: "data-science", name: "Data Science" },
  { id: "design", name: "Design" },
  { id: "marketing", name: "Digital Marketing" },
  { id: "business", name: "Business" },
  { id: "photography", name: "Photography" },
  { id: "music", name: "Music" },
  { id: "other", name: "Other" },
];

// Course difficulty levels
export const difficultyLevels = [
  { id: "beginner", name: "Beginner" },
  { id: "intermediate", name: "Intermediate" },
  { id: "advanced", name: "Advanced" },
  { id: "all-levels", name: "All Levels" },
];

// Placeholder course data
export const placeholderCourses = [
  {
    id: "1",
    title: "Complete Web Development Bootcamp",
    description:
      "Learn web development from scratch. This course covers HTML, CSS, JavaScript, React, Node.js, and more.",
    price: 99.99,
    discountPrice: 49.99,
    instructor: {
      id: "101",
      name: "John Smith",
      avatar: "/assets/images/instructors/john-smith.jpg",
      bio: "Senior Web Developer with 10+ years of experience",
    },
    thumbnail: "/assets/images/courses/web-dev.jpg",
    category: "web-dev",
    difficulty: "all-levels",
    duration: "40 hours",
    lessons: 120,
    students: 15000,
    rating: 4.8,
    reviews: 350,
    status: "active",
    createdAt: "2023-01-15T10:00:00Z",
    updatedAt: "2023-06-20T14:30:00Z",
  },
  {
    id: "2",
    title: "Data Science and Machine Learning",
    description:
      "Master data science, machine learning, and deep learning concepts with Python, TensorFlow, and PyTorch.",
    price: 129.99,
    discountPrice: null,
    instructor: {
      id: "102",
      name: "Sarah Johnson",
      avatar: "/assets/images/instructors/sarah-johnson.jpg",
      bio: "Data Scientist at Tech Giant Inc.",
    },
    thumbnail: "/assets/images/courses/data-science.jpg",
    category: "data-science",
    difficulty: "intermediate",
    duration: "35 hours",
    lessons: 95,
    students: 8500,
    rating: 4.7,
    reviews: 220,
    status: "active",
    createdAt: "2023-02-10T09:15:00Z",
    updatedAt: "2023-05-18T11:45:00Z",
  },
  {
    id: "3",
    title: "Mobile App Development with React Native",
    description:
      "Build cross-platform mobile apps for iOS and Android using React Native and JavaScript.",
    price: 89.99,
    discountPrice: 69.99,
    instructor: {
      id: "103",
      name: "Michael Chen",
      avatar: "/assets/images/instructors/michael-chen.jpg",
      bio: "Mobile Developer and React Native Expert",
    },
    thumbnail: "/assets/images/courses/mobile-dev.jpg",
    category: "mobile-dev",
    difficulty: "intermediate",
    duration: "28 hours",
    lessons: 85,
    students: 6200,
    rating: 4.6,
    reviews: 180,
    status: "active",
    createdAt: "2023-03-05T13:20:00Z",
    updatedAt: "2023-07-12T16:10:00Z",
  },
];

// Placeholder user data
export const placeholderUser = {
  id: "1001",
  name: "Alex Johnson",
  email: "alex@example.com",
  role: "student",
  avatar: null,
  bio: "Passionate about learning new technologies",
  enrolledCourses: ["1", "3"],
  completedCourses: [],
  wishlist: ["2"],
  createdAt: "2023-01-01T08:00:00Z",
};

// Placeholder admin data
export const placeholderAdmin = {
  id: "2001",
  name: "Admin User",
  email: "admin@example.com",
  role: "admin",
  avatar: "/assets/images/admin-avatar.jpg",
  createdAt: "2022-12-01T10:00:00Z",
};

// App settings
export const appSettings = {
  appName: "LearnHub",
  logo: "/assets/images/logo.svg",
  favicon: "/assets/images/favicon.ico",
  contactEmail: "support@learnhub.com",
  socialLinks: {
    facebook: "https://facebook.com/learnhub",
    twitter: "https://twitter.com/learnhub",
    instagram: "https://instagram.com/learnhub",
    youtube: "https://youtube.com/learnhub",
  },
  footerLinks: [
    { title: "About Us", url: "/about" },
    { title: "Contact", url: "/contact" },
    { title: "Terms of Service", url: "/terms" },
    { title: "Privacy Policy", url: "/privacy" },
    { title: "FAQ", url: "/faq" },
  ],
};
