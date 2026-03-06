import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useData } from "../../DataContext";

const MemberSidebar = () => {
  const { currentUser, logout } = useData();
  const location = useLocation();

  const navItems = [
    { id: "home", icon: "home", label: "Home", path: "home" },
    { id: "funds", icon: "wallet", label: "Society Funds", path: "funds" },
    { id: "events", icon: "calendar-check", label: "Events", path: "events" },
    {
      id: "pay",
      icon: "money-bill-wave",
      label: "Pay Maintenance",
      path: "pay",
    },
    {
      id: "complaint",
      icon: "comment-dots",
      label: "Complaint Box",
      path: "complaint",
    },
  ];

  const isActive = (path) => location.pathname === `/member/${path}`;

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-800 p-4 flex flex-col justify-between overflow-y-auto">
      <div>
        <div className="text-center mb-8">
          <i className="fas fa-user text-3xl text-blue-500"></i>
          <h2 className="text-2xl font-bold mt-2 text-white">Member Area</h2>
          <p className="text-sm text-gray-400">Welcome, {currentUser.name}!</p>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={`/member/${item.path}`}
              className={`nav-link w-full text-left ${
                isActive(item.path) ? "active" : ""
              }`}>
              <i className={`fas fa-${item.icon} w-6`}></i> {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <button
        onClick={logout}
        className="w-full btn bg-red-600 text-white hover:bg-red-700 mt-4">
        <i className="fas fa-sign-out-alt mr-2"></i> Logout
      </button>
    </aside>
  );
};

export default MemberSidebar;
