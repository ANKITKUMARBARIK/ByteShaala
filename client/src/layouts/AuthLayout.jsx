import { useCallback, useContext } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";

import Navbar from "@/components/common/navbar";
import { AuthContext } from "@/context/AuthContext";
import { logout } from "@/store/slices/authSlice";

export default function AuthLayout() {
  const { authenticated, removeAuth } = useContext(AuthContext);
  const dispatch = useDispatch();
  const location = useLocation();

  // Simple logout handler with direct redirect
  const handleLogout = useCallback(() => {
    // Clear all auth state
    dispatch(logout());
    removeAuth();
    // Use window.location to bypass React Router and force immediate redirect
    window.location.href = "/login";
  }, [dispatch, removeAuth]);

  // Check if current route is an auth form that needs centering
  const isAuthForm =
    ["/login", "/register", "/verify-otp", "/forgot-password"].includes(
      location.pathname
    ) || location.pathname.startsWith("/reset-password");

  return (
    <>
      <Navbar isAuthenticated={authenticated} onLogout={handleLogout} />

      <main
        className={
          isAuthForm ? "flex items-center justify-center h-screen" : ""
        }
      >
        {isAuthForm ? (
          // Centered layout for auth forms (login, signup, etc.)
          <div className="w-full max-w-md p-6 rounded-lg shadow-lg">
            <Outlet />
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                {new Date().getFullYear()} LMS Platform. All rights reserved.
              </p>
            </div>
          </div>
        ) : (
          // Full width layout for dashboard and other pages
          <Outlet />
        )}
      </main>
    </>
  );
}
