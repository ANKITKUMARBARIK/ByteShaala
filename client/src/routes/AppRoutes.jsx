import React, { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useRoutes,
  useLocation,
  Navigate,
  matchRoutes,
} from "react-router-dom";

import AdminRoute from "@/components/common/AdminRoute";
import { AuthContext } from "@/context/AuthContext";
import AdminLayout from "@/layouts/AdminLayout";
import AuthLayout from "@/layouts/AuthLayout";
import NonAuthLayout from "@/layouts/NonAuthLayout";
import { getCookie } from "@/lib/utils";
import AdminPage from "@/pages/admin";
import UserListPage from "@/pages/admin/user-list";
import CartPage from "@/pages/cart";
import CourseDetailPage from "@/pages/course-detail";
import CoursesPage from "@/pages/courses";
import DashboardPage from "@/pages/dashboard";
import ForgotPasswordPage from "@/pages/forgot-password";
import LoginPage from "@/pages/login";
import OtpPage from "@/pages/otp";
import ProfilePage from "@/pages/profile";
import RegisterPage from "@/pages/register";
import ResetPasswordPage from "@/pages/reset-password";

// Define auth routes (protected routes)
const authRoutes = [
  {
    path: "/dashboard",
    element: DashboardPage,
  },
  {
    path: "/cart",
    element: CartPage,
  },
  {
    path: "/profile",
    element: ProfilePage,
  },
];

// Define admin routes (admin-only protected routes)
const adminRoutes = [
  {
    path: "/user-list",
    element: UserListPage,
  },
  {
    path: "/admin/analytics",
    element: AdminPage,
  },
  {
    path: "/admin/courses",
    element: AdminPage,
  },
];

// Define non-auth routes (public routes) - now includes courses and course details
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
  {
    path: "/courses",
    element: CoursesPage,
  },
  {
    path: "/courses/:id",
    element: CourseDetailPage,
  },
];

function LayoutWrapper({ nonAuthRoutes, adminRoutes }) {
  const { authenticated, isAdmin, user } = useContext(AuthContext);
  const location = useLocation();

  // Check authentication from multiple sources for reliability
  const accessToken = getCookie("token");
  const refreshToken = getCookie("refToken");
  const cookieUser = getCookie("user") ? JSON.parse(getCookie("user")) : null;
  const isAuthenticated = authenticated || accessToken || refreshToken;

  // Enhanced admin detection
  const userIsAdmin =
    isAdmin || user?.role === "ADMIN" || cookieUser?.role === "ADMIN";

  // Check if current route is an admin route
  const adminRoute = matchRoutes(adminRoutes, location.pathname);

  // Check if current route is an authenticated route (excluding admin routes)
  const authenticatedRoute =
    !matchRoutes(nonAuthRoutes, location.pathname) && !adminRoute;

  // Use useEffect to handle authentication changes with a small delay
  useEffect(() => {
    // Small delay to allow state propagation during logout
    const timer = setTimeout(() => {
      // This will trigger a re-render after state has settled
    }, 10);

    return () => clearTimeout(timer);
  }, [authenticated, accessToken, refreshToken]);

  if (
    isAuthenticated &&
    userIsAdmin &&
    !adminRoute &&
    location.pathname !== "/user-list"
  ) {
    return <Navigate to="/user-list" replace />;
  }

  // Handle admin routes
  if (adminRoute) {
    return <AdminLayout />;
  }

  // Redirect logic
  if (!isAuthenticated && authenticatedRoute) {
    // Unauthenticated user trying to access protected route
    return <Navigate to="/login" state={{ from: location }} replace />;
  } else if (isAuthenticated && !authenticatedRoute) {
    // Authenticated user trying to access public route
    // Special handling for login route during logout
    if (location.pathname === "/login" && !accessToken && !refreshToken) {
      // If cookies are cleared but AuthContext hasn't updated yet, allow login
      return <NonAuthLayout />;
    }
    // For course detail pages, courses page, allow both authenticated and non-authenticated users
    if (location.pathname.startsWith("/courses")) {
      // Authenticated users accessing course details should use AuthLayout
      return <AuthLayout />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // Return appropriate layout based on authentication status
  return isAuthenticated ? <AuthLayout /> : <NonAuthLayout />;
}

export default function AppRoutes() {
  const { authenticated, isAdmin, user } = useContext(AuthContext);
  const { isAuthenticated, user: reduxUser } = useSelector(
    (state) => state.auth
  );

  // Check authentication from multiple sources
  const accessToken = getCookie("token");
  const refreshToken = getCookie("refToken");
  const cookieUser = getCookie("user") ? JSON.parse(getCookie("user")) : null;

  const userIsAuthenticated =
    authenticated || isAuthenticated || accessToken || refreshToken;

  // Enhanced admin detection from multiple sources
  const userIsAdmin =
    isAdmin ||
    user?.role === "ADMIN" ||
    reduxUser?.role === "ADMIN" ||
    cookieUser?.role === "ADMIN";

  const routes = React.useMemo(() => {
    // Conditional default route
    const conditionalDefaultRoute = (
      <Navigate
        to={
          userIsAuthenticated
            ? userIsAdmin
              ? "/user-list"
              : authRoutes[0].path
            : nonAuthRoutes[0].path
        }
        replace
      />
    );

    // Combine regular routes
    const childrenRoutes = [...authRoutes, ...nonAuthRoutes].map((route) => ({
      ...route,
      element: <route.element />,
    }));

    // Add admin routes with AdminRoute protection
    const protectedAdminRoutes = adminRoutes.map((route) => ({
      ...route,
      element: (
        <AdminRoute>
          <route.element />
        </AdminRoute>
      ),
    }));

    return [
      {
        path: "/",
        element: (
          <LayoutWrapper
            nonAuthRoutes={nonAuthRoutes}
            adminRoutes={adminRoutes}
          />
        ),
        children: [
          ...childrenRoutes,
          ...protectedAdminRoutes,
          {
            index: true,
            element: conditionalDefaultRoute,
          },
        ],
      },
      {
        path: "*",
        element: conditionalDefaultRoute,
      },
    ];
  }, [userIsAuthenticated, userIsAdmin]);

  const routing = useRoutes(routes);
  return routing;
}
