import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const Dashboard = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center font-[family-name:var(--font-geist-sans)]">
      <div className="bg-gray-300 rounded-3xl shadow-xl p-10 flex flex-col items-center max-w-2xl w-full">
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
