import React, { useContext } from "react";
import { useSelector } from "react-redux";
import {
  useRoutes,
  useLocation,
  Navigate,
  matchRoutes,
} from "react-router-dom";

import { AuthContext } from "@/context/AuthContext";
import AdminLayout from "@/layouts/AdminLayout";
import AuthLayout from "@/layouts/AuthLayout";
import NonAuthLayout from "@/layouts/NonAuthLayout";
import { getCookie } from "@/lib/utils";
import AdminPage from "@/pages/admin";
import CourseDetailPage from "@/pages/courseDetail";
import CoursesPage from "@/pages/courses";
import ForgotPasswordPage from "@/pages/forgot-password";
import LoginPage from "@/pages/login";
import OtpPage from "@/pages/otp";
import ProfilePage from "@/pages/profile";
import RegisterPage from "@/pages/register";
import ResetPasswordPage from "@/pages/reset-password";

// Define auth routes (protected routes)
const authRoutes = [
  {
    path: "/courses",
    element: CoursesPage,
  },
  {
    path: "/course/:id",
    element: CourseDetailPage,
  },
  {
    path: "/profile",
    element: ProfilePage,
  },
];

// Define non-auth routes (public routes)
const nonAuthRoutes = [
  {
    path: "/login",
    element: LoginPage,
  },
  {
    path: "/register",
    element: RegisterPage,
  },
  {
    path: "/verify-otp",
    element: OtpPage,
  },
  {
    path: "/forgot-password",
    element: ForgotPasswordPage,
  },
  {
    path: "/reset-password/:token",
    element: ResetPasswordPage,
  },
];

function LayoutWrapper({ nonAuthRoutes }) {
  const { authenticated } = useContext(AuthContext);
  const location = useLocation();

  // Check authentication from multiple sources for reliability
  const accessToken = getCookie("token");
  const refreshToken = getCookie("refToken");
  const isAuthenticated = authenticated || accessToken || refreshToken;

  // Check if current route is an authenticated route
  const authenticatedRoute = !matchRoutes(nonAuthRoutes, location.pathname);

  // Redirect logic
  if (!isAuthenticated && authenticatedRoute) {
    // Unauthenticated user trying to access protected route
    return <Navigate to="/login" state={{ from: location }} replace />;
  } else if (isAuthenticated && !authenticatedRoute) {
    // Authenticated user trying to access public route
    return <Navigate to="/courses" state={{ from: location }} replace />;
  }

  // Return appropriate layout based on route type
  return authenticatedRoute ? <AuthLayout /> : <NonAuthLayout />;
}

export default function AppRoutes() {
  const { authenticated } = useContext(AuthContext);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Check authentication from multiple sources
  const accessToken = getCookie("token");
  const refreshToken = getCookie("refToken");
  const userIsAuthenticated =
    authenticated || isAuthenticated || accessToken || refreshToken;

  const isAdmin = userIsAuthenticated && user?.role === "admin";

  const routes = React.useMemo(() => {
    // Conditional default route
    const conditionalDefaultRoute = (
      <Navigate
        to={userIsAuthenticated ? authRoutes[0].path : nonAuthRoutes[0].path}
        replace
      />
    );

    // Combine all routes
    const childrenRoutes = [...authRoutes, ...nonAuthRoutes].map((route) => ({
      ...route,
      element: <route.element />,
    }));

    return [
      {
        path: "/",
        element: <LayoutWrapper nonAuthRoutes={nonAuthRoutes} />,
        children: [
          ...childrenRoutes,
          {
            index: true,
            element: conditionalDefaultRoute,
          },
        ],
      },
      // Admin routes (separate from main flow)
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
      {
        path: "*",
        element: conditionalDefaultRoute,
      },
    ];
  }, [userIsAuthenticated, isAdmin]);

  const routing = useRoutes(routes);
  return routing;
}
