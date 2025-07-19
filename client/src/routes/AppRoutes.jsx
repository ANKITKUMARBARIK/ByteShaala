import AdminLayout from "@/layouts/AdminLayout";
import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import LoginPage from "@/pages/login";
import CoursesPage from "@/pages/courses";
import CourseDetailPage from "@/pages/courseDetail";
import ProfilePage from "@/pages/profile";
import AdminPage from "@/pages/admin";
import { useSelector } from "react-redux";
import { useRoutes } from "react-router-dom";
import RegisterPage from "@/pages/register";

export default function AppRoutes() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isAdmin = isAuthenticated && user?.role === "admin";

  const element = useRoutes([
    // Public routes with AuthLayout
    {
      element: <AuthLayout />,
      children: [
        { path: "/login", element: <LoginPage /> },
        { path: "/register", element: <RegisterPage /> },
      ],
    },

    // Main routes with MainLayout
    {
      element: <MainLayout />,
      children: [
        { path: "/", element: <CoursesPage /> },
        { path: "/courses", element: <CoursesPage /> },
        { path: "/course/:id", element: <CourseDetailPage /> },

        // Protected routes - only accessible when authenticated
        ...(isAuthenticated
          ? [{ path: "/profile", element: <ProfilePage /> }]
          : []),
      ],
    },

    // Admin routes with AdminLayout
    ...(isAdmin
      ? [
          {
            element: <AdminLayout />,
            children: [
              { path: "/admin", element: <AdminPage /> },
              { path: "/admin/courses", element: <AdminPage /> },
            ],
          },
        ]
      : []),
  ]);

  return element;
}
