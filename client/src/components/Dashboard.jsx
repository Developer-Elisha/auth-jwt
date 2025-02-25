import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
      <button
        onClick={handleLogout}
        className="mt-6 px-6 py-2 bg-white text-black font-semibold rounded-lg"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
