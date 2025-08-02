import { redirect } from "next/navigation";
import React from "react";

const Loading = () => {
  // Prevent scrolling on loading screen
  React.useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-20 h-20 flex bg-white rounded-full items-center justify-center">
          {/* Elegant spinner ring */}
          <svg
            className="absolute inset-0 w-full h-full animate-spin"
            viewBox="0 0 64 64"
            fill="none"
          >
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="#10b981"
              strokeWidth="4"
              strokeDasharray="44 100"
              strokeLinecap="round"
              className="opacity-70"
            />
          </svg>
          <img
            src="/logo.png"
            alt="Octo Logo"
            className="w-14 h-14 object-contain invert"
            onClick={() => {
              redirect("/about");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Loading;
