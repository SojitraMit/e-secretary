import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminDashboardTab from "../components/admin/AdminDashboardTab";
import AdminUpdatesTab from "../components/admin/AdminUpdatesTab";
import AdminEventsTab from "../components/admin/AdminEventsTab";
import AdminBillingTab from "../components/admin/AdminBillingTab";
import AdminMaintenanceTab from "../components/admin/AdminMaintenanceTab";
import AdminMembersTab from "../components/admin/AdminMembersTab";
import AdminComplaintsTab from "../components/admin/AdminComplaintsTab";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <Routes>
          <Route path="dashboard" element={<AdminDashboardTab />} />
          <Route path="updates" element={<AdminUpdatesTab />} />
          <Route path="events" element={<AdminEventsTab />} />
          <Route path="billing" element={<AdminBillingTab />} />
          <Route path="maintenance" element={<AdminMaintenanceTab />} />
          <Route path="members" element={<AdminMembersTab />} />
          <Route path="complaints" element={<AdminComplaintsTab />} />
          <Route path="/" element={<AdminDashboardTab />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
