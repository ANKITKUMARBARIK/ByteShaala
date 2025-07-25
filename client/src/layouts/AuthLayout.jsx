import { useCallback, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

import { AuthContext } from "@/context/AuthContext";
import { deleteAllCookies, getCookie } from "@/lib/utils";
import { logout } from "@/store/slices/authSlice";

export default function AuthLayout() {
  const { authenticated, removeAuth, addAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Simple logout handler
  const handleLogout = useCallback(() => {
    dispatch(logout());
    removeAuth();
    deleteAllCookies();
    navigate("/login");
  }, [dispatch, removeAuth, navigate]);

  // Check authentication status on component mount and route changes
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        // Get tokens from cookies
        const accessToken = getCookie("token");
        const refreshToken = getCookie("refToken");

        // If no tokens exist, user is not authenticated
        if (!accessToken && !refreshToken) {
          // Only logout if we're not already on auth pages
          if (
            location.pathname !== "/login" &&
            location.pathname !== "/register" &&
            location.pathname !== "/verify-otp"
          ) {
            handleLogout();
            return;
          }
          return;
        }

        // If we have tokens but AuthContext is not synced, sync it
        if ((accessToken || refreshToken) && !authenticated) {
          addAuth({
            token: accessToken,
            refToken: refreshToken,
          });
        }
      } catch (error) {
        console.error("Auth check error:", error);
        // On any error, clear everything and redirect to login
        handleLogout();
      }
    };

    checkAuthStatus();
  }, [addAuth, authenticated, handleLogout, location.pathname]);

  return (
    <>
      <header className="text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="gradient-text">LMS Platform</h1>
          <nav className="space-x-4">
            {authenticated && (
              <Link to="/" className="hover:text-primary-200">
                Courses
              </Link>
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
