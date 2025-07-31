
import React from "react";

const Dashboard = () => {

  return (
    <div className="min-h-screen flex items-center justify-center font-[family-name:var(--font-geist-sans)]">
      <div className="bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center max-w-2xl w-full">
        <img
          src="/logo.png"
          alt="Octo Logo"
          className="w-20 h-20 object-contain invert mb-6"
        />
        <h1 className="text-3xl font-bold text-emerald-600 mb-2">
          Welcome to your Dashboard
        </h1>
      </div>
    </div>
  );
};

export default Dashboard;
