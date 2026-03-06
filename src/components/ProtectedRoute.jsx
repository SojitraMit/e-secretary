import React from "react";
import { Navigate } from "react-router-dom";
import { useData } from "../DataContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser } = useData();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return (
      <Navigate
        to={currentUser.role === "admin" ? "/admin" : "/member"}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
