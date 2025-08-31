import {
  Menu,
  X,
  Users,
  BarChart3,
  BookOpen,
  LogOut,
  Shield,
} from "lucide-react";
import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";

const AdminNavbar = ({ onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    closeMobileMenu();
    onLogout();
  };

  const getLinkClasses = (path) => {
    const isActive = location.pathname === path;
    return `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
        : "text-gray-300 hover:text-white hover:bg-gray-800"
    }`;
  };

  const getMobileLinkClasses = (path) => {
    const isActive = location.pathname === path;
    return `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
        : "text-gray-300 hover:text-white hover:bg-gray-800"
    }`;
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/user-list" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                ByteShaala Admin
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/user-list" className={getLinkClasses("/user-list")}>
              <Users className="w-4 h-4" />
              <span>Users</span>
            </Link>
            <Link
              to="/admin/courses"
              className={getLinkClasses("/admin/courses")}
            >
              <BookOpen className="w-4 h-4" />
              <span>Courses</span>
            </Link>
          </div>

          {/* User Info and Logout */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-300">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">Admin</span>
                <span className="text-xs text-gray-400">{user?.email}</span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-800"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white transition-colors duration-200 p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700 py-4">
            <div className="flex flex-col space-y-2">
              <Link
                to="/user-list"
                onClick={closeMobileMenu}
                className={getMobileLinkClasses("/user-list")}
              >
                <Users className="w-5 h-5" />
                <span>Users</span>
              </Link>
              <Link
                to="/admin/analytics"
                onClick={closeMobileMenu}
                className={getMobileLinkClasses("/admin/analytics")}
              >
                <BarChart3 className="w-5 h-5" />
                <span>Analytics</span>
              </Link>
              <Link
                to="/admin/courses"
                onClick={closeMobileMenu}
                className={getMobileLinkClasses("/admin/courses")}
              >
                <BookOpen className="w-5 h-5" />
                <span>Courses</span>
              </Link>

              {/* Mobile User Info */}
              <div className="border-t border-gray-700 pt-4 mt-4">
                <div className="flex items-center space-x-3 px-4 py-2 text-gray-300">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {user?.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">
                      Admin
                    </span>
                    <span className="text-xs text-gray-400">{user?.email}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 text-gray-300 hover:text-red-400 hover:bg-gray-700 px-4 py-3 rounded-lg transition-all duration-200 text-left w-full mt-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
