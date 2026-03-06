import React, { useState } from "react";
import { useData } from "../DataContext";
import { Link } from "react-router-dom";

const Signup = () => {
  const { signup } = useData();
  const [sName, setSName] = useState("");
  const [sEmail, setSEmail] = useState("");
  const [sFlat, setSFlat] = useState("");
  const [sPass, setSPass] = useState("");

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const success = signup({
      name: sName,
      email: sEmail.toLowerCase(),
      flatNo: sFlat,
      password: sPass,
    });
    if (!success) alert("Email already exists.");
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
            Create Account
          </h2>
          <form onSubmit={handleSignupSubmit}>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="form-input"
                required
                value={sName}
                onChange={(e) => setSName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email Address"
                className="form-input"
                required
                value={sEmail}
                onChange={(e) => setSEmail(e.target.value)}
              />
              <input
                type="text"
                placeholder="Flat / House Number"
                className="form-input"
                required
                value={sFlat}
                onChange={(e) => setSFlat(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="form-input"
                required
                value={sPass}
                onChange={(e) => setSPass(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full btn btn-primary mt-6">
              Create Account
            </button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-500 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
