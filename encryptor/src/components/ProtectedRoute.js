import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user");
  const location = useLocation();

  return user ? children : <Navigate to="/login" state={{ from: location }} replace />;
}

export default ProtectedRoute;
