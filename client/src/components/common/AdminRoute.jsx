import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { authenticated, isAdmin } = useContext(AuthContext);

  // If not authenticated, redirect to login
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but not admin, redirect to dashboard
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // If admin, render the protected component
  return children;
};

export default AdminRoute;
