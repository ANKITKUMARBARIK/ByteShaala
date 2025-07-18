import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="main-layout">
      {/* Header can go here */}
      <header className="bg-primary-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">LMS Platform</h1>
          <nav className="space-x-4">
            <a href="/" className="hover:text-primary-200">
              Courses
            </a>
            <a href="/profile" className="hover:text-primary-200">
              Profile
            </a>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto p-4 min-h-[calc(100vh-160px)]">
        <Outlet />
      </main>

      {/* Footer can go here */}
      <footer className="bg-gray-800 text-white p-4">
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
