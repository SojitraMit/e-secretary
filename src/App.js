import React from "react";
import { DataProvider, useData } from "./DataContext";
import Auth from "./components/Auth";
import AdminPanel from "./components/AdminPanel";
import MemberPanel from "./components/MemberPanel";

const AppContent = () => {
  const { currentUser } = useData();

  if (!currentUser) {
    return <Auth />;
  }

  if (currentUser.role === "admin") {
    return <AdminPanel />;
  }

  return <MemberPanel />;
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
