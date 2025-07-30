"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

const Dashboard = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = new URL(window.location.href);
    const via = url.searchParams.get("via");
    if (via === "signup") {
      toast.success("Account Created");
    } else if (via === "signin") {
      toast.success("Logged in successfully");
    }
    if (via) {
      url.searchParams.delete("via");
      window.history.replaceState({}, "", url.pathname + url.search);
    }
  }, [searchParams]);

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
        <p className="text-gray-700 text-lg mb-6 text-center">
          Here you can manage your account, view your activity, and explore all
          the features Octo has to offer.
        </p>
        <div className="w-full flex flex-col gap-4">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3">
            <svg
              className="w-6 h-6 text-emerald-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="text-emerald-700 font-medium">
              Get started by exploring your profile and settings.
            </span>
          </div>
          <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 flex items-center gap-3">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-gray-700">
              Check back soon for more features and updates!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
