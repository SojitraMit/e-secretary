import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { DataProvider, useData } from "./DataContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import MemberDashboard from "./pages/MemberDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const AppContent = () => {
  const { currentUser } = useData();

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            currentUser ? (
              <Navigate
                to={
                  currentUser.role === "admin"
                    ? "/admin/dashboard"
                    : "/member/home"
                }
                replace
              />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/signup"
          element={currentUser ? <Navigate to="/login" replace /> : <Signup />}
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/member/*"
          element={
            <ProtectedRoute requiredRole="member">
              <MemberDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <Navigate
              to={
                currentUser
                  ? currentUser.role === "admin"
                    ? "/admin/dashboard"
                    : "/member/home"
                  : "/login"
              }
              replace
            />
          }
        />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <DataProvider>
      <div className="min-h-screen text-gray-200 bg-gray-900 font-inter">
        <AppContent />
      </div>
    </DataProvider>
  );
}

export default App;
