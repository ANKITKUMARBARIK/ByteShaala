import { useContext } from "react";
import { Outlet } from "react-router-dom";

import AdminNavbar from "../components/common/AdminNavbar";
import { AuthContext } from "../context/AuthContext";

const AdminLayout = () => {
  const { removeAuth } = useContext(AuthContext);

  const handleLogout = () => {
    removeAuth();
    // Force immediate redirect to bypass React Router interception
    window.location.href = "/login";
  };

  return (
    <div>
      <AdminNavbar onLogout={handleLogout} />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
