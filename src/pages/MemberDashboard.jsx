import React from "react";
import { Routes, Route } from "react-router-dom";
import MemberSidebar from "../components/member/MemberSidebar";
import MemberHomeTab from "../components/member/MemberHomeTab";
import MemberFundsTab from "../components/member/MemberFundsTab";
import MemberEventsTab from "../components/member/MemberEventsTab";
import MemberPayTab from "../components/member/MemberPayTab";
import MemberComplaintTab from "../components/member/MemberComplaintTab";

const MemberDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      <MemberSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <Routes>
          <Route path="home" element={<MemberHomeTab />} />
          <Route path="funds" element={<MemberFundsTab />} />
          <Route path="events" element={<MemberEventsTab />} />
          <Route path="pay" element={<MemberPayTab />} />
          <Route path="complaint" element={<MemberComplaintTab />} />
          <Route path="/" element={<MemberHomeTab />} />
        </Routes>
      </main>
    </div>
  );
};

export default MemberDashboard;
