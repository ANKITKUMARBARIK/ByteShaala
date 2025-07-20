import React from "react";
import { Link, Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="main-layout">
      {/* Header can go here */}
      <header className="text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="gradient-text">LMS Platform</h1>
          <nav className="space-x-4">
            <Link to="/login" className="hover:text-primary-200">
              Login
            </Link>
            <Link to="/register" className="hover:text-primary-200">
              Register
            </Link>
            {/* Only enable when user is logged in */}
            {/* <a href="/profile" className="hover:text-primary-200">
              Profile
            </a> */}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto p-4 min-h-[calc(100vh-160px)]">
        <Outlet />
      </main>

      {/* Footer can go here */}
      <footer className="text-white p-4">
        <div className="container mx-auto text-center">
          <p>
            © {new Date().getFullYear()} LMS Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
