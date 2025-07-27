import { useCallback, useContext } from "react";
import { useDispatch } from "react-redux";
import { Link, Outlet } from "react-router-dom";

import { AuthContext } from "@/context/AuthContext";
import { deleteAllCookies } from "@/lib/utils";
import { logout } from "@/store/slices/authSlice";

export default function AuthLayout() {
  const { authenticated, removeAuth } = useContext(AuthContext);
  const dispatch = useDispatch();

  // Simple logout handler with direct redirect
  const handleLogout = useCallback(() => {
    // Clear all auth state
    dispatch(logout());
    removeAuth();
    deleteAllCookies();

    // Use window.location to bypass React Router and force immediate redirect
    window.location.href = "/login";
  }, [dispatch, removeAuth]);

  return (
    <>
      <header className="text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="gradient-text">LMS Platform</h1>
          <nav className="space-x-4">
            {authenticated && (
              <>
                <Link to="/courses" className="hover:text-primary-200">
                  Courses
                </Link>
                <Link to="/profile" className="hover:text-primary-200">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:text-primary-200 bg-transparent border-none cursor-pointer"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </header>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md p-6 rounded-lg shadow-lg">
          {/* Auth pages (login/register) will be rendered here */}
          <Outlet />

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>{new Date().getFullYear()} LMS Platform. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  );
}
