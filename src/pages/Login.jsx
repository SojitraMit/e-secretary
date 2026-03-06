import React, { useState } from "react";
import { useData } from "../DataContext";
import { Link } from "react-router-dom";

const Login = () => {
  const { login } = useData();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    login(loginEmail, loginPass, isAdmin);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <i className="fas fa-building-user text-4xl text-blue-500"></i>
          <h1 className="text-3xl font-bold mt-4 text-white">e-Secretary</h1>
          <p className="text-gray-400">Your Society's Digital Hub</p>
        </div>

        <div className="section-card">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Member / Admin Login
          </h2>
          <form onSubmit={handleLoginSubmit}>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email Address"
                className="form-input"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="form-input"
                required
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm text-gray-400">
                  <input
                    type="checkbox"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    className="rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Login as Admin</span>
                </label>
              </div>
            </div>
            <button type="submit" className="w-full btn btn-primary mt-6">
              Login
            </button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
