import { useContext, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

import { AuthContext } from "@/context/AuthContext";
import { deleteAllCookies, getCookie } from "@/lib/utils";
import { logout } from "@/store/slices/authSlice";

const MainLayout = () => {
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

        // If no tokens exist, user is not authenticated - redirect to login
        if (!accessToken && !refreshToken) {
          handleLogout();
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
    <div className="main-layout">
      {/* Header */}
      <header className="text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="gradient-text">LMS Platform</h1>
          <nav className="space-x-4 flex items-center">
            {authenticated ? (
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
            ) : (
              <>
                <Link to="/login" className="hover:text-primary-200">
                  Login
                </Link>
                <Link to="/register" className="hover:text-primary-200">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto p-4 min-h-[calc(100vh-160px)]">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="text-white p-4">
        <div className="container mx-auto text-center">
          <p>
            &copy; {new Date().getFullYear()} LMS Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
