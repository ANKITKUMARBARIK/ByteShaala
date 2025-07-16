import React from "react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="auth-layout min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="auth-container w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-primary-600">LMS Platform</h1>
          <p className="text-gray-600">Access your learning journey</p>
        </div>

        {/* Auth pages (login/register) will be rendered here */}
        <Outlet />

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} LMS Platform. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
