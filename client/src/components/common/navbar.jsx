import {
  Menu,
  X,
  User,
  BookOpen,
  LogOut,
  LogIn,
  UserPlus,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useGetCartQuery } from "../../actions/cartActions";

const Navbar = ({ isAuthenticated, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Get cart data for authenticated users
  // const { data: cartData } = useGetCartQuery(undefined, {
  //   skip: !isAuthenticated, // Only fetch cart data if user is authenticated
  // });

  // const cartItemsCount = cartData?.items?.length || 0;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
  };

  // Helper function to check if a path is active
  const isActivePath = (path) => {
    return location.pathname === path;
  };

  // Helper function to get link classes based on active state
  const getLinkClasses = (
    path,
    baseClasses = "flex items-center space-x-2 transition-colors duration-200"
  ) => {
    const isActive = isActivePath(path);
    return `${baseClasses} ${
      isActive ? "text-white" : "text-gray-300 hover:text-white"
    }`;
  };

  // Helper function for mobile link classes
  const getMobileLinkClasses = (path) => {
    const isActive = isActivePath(path);
    return `flex items-center space-x-3 transition-all duration-200 px-4 py-3 rounded-lg ${
      isActive
        ? "text-white bg-gray-800"
        : "text-gray-300 hover:text-white hover:bg-gray-800"
    }`;
  };

  return (
    <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              ByteShaala
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              // Authenticated user navigation
              <>
                <Link to="/profile" className={getLinkClasses("/profile")}>
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
                <Link to="/courses" className={getLinkClasses("/courses")}>
                  <BookOpen className="w-4 h-4" />
                  <span>Courses</span>
                </Link>
                <Link
                  to="/cart"
                  className={`${getLinkClasses("/cart")} relative`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Cart</span>
                  {/* {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )} */}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              // Non-authenticated user navigation
              <>
                <Link to="/courses" className={getLinkClasses("/courses")}>
                  <BookOpen className="w-4 h-4" />
                  <span>Courses</span>
                </Link>
                <Link to="/login" className={getLinkClasses("/login")}>
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-gray-300 hover:text-white transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-96 opacity-100 visible"
              : "max-h-0 opacity-0 invisible"
          } overflow-hidden`}
        >
          <nav className="py-4 space-y-2">
            {isAuthenticated ? (
              // Authenticated user mobile navigation
              <>
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className={getMobileLinkClasses("/profile")}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
                <Link
                  to="/courses"
                  onClick={closeMobileMenu}
                  className={getMobileLinkClasses("/courses")}
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Courses</span>
                </Link>
                <Link
                  to="/cart"
                  onClick={closeMobileMenu}
                  className={`${getMobileLinkClasses("/cart")} relative`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Cart</span>
                  {/* {cartItemsCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-auto">
                      {cartItemsCount}
                    </span>
                  )} */}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="w-full flex items-center space-x-3 text-gray-300 hover:text-red-400 hover:bg-gray-800 px-4 py-3 rounded-lg transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              // Non-authenticated user mobile navigation
              <>
                <Link
                  to="/courses"
                  onClick={closeMobileMenu}
                  className={getMobileLinkClasses("/courses")}
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Courses</span>
                </Link>
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className={getMobileLinkClasses("/login")}
                >
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-lg transition-all duration-200 mx-2 mt-2"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
