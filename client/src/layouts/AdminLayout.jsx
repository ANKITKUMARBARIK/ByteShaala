import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      {/* Admin Header */}
      <header className="text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <nav className="space-x-4">
            <a href="/admin" className="hover:text-primary-200">
              Dashboard
            </a>
            <a href="/admin/courses" className="hover:text-primary-200">
              Courses
            </a>
          </nav>
        </div>
      </header>

      {/* Admin Sidebar and Content */}
      <div className="flex min-h-[calc(100vh-128px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-100 p-4 shadow-md">
          <nav className="space-y-2">
            <a href="/admin" className="block p-2 hover:bg-gray-200 rounded">
              Dashboard
            </a>
            <a
              href="/admin/courses"
              className="block p-2 hover:bg-gray-200 rounded"
            >
              Manage Courses
            </a>
            <a
              href="/admin/users"
              className="block p-2 hover:bg-gray-200 rounded"
            >
              Manage Users
            </a>
            <a href="/" className="block p-2 hover:bg-gray-200 rounded">
              Back to Site
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {/* Admin Footer */}
      <footer className="text-white p-2 text-center">
        <p>© {new Date().getFullYear()} LMS Admin Panel</p>
      </footer>
    </div>
  );
};

export default AdminLayout;
