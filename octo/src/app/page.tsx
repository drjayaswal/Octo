"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import Loading from "@/components/loading";
import { toast } from "sonner";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  const [loggingOut, setLoggingOut] = useState(false);

  if (isPending) {
    return <Loading />;
  }
  if (!session) {
    redirect("/signin");
  }
  return (
    <div className="min-h-screen flex items-center justify-center font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-20 h-20 flex bg-white rounded-full items-center justify-center border-7 border-emerald-500">
          <img
            src="/logo.png"
            alt="Octo Logo"
            className="w-14 h-14 object-contain invert"
            onClick={() => {
              redirect("/about");
            }}
          />
        </div>
        <div className="flex flex-col items-center gap-3">
          <span className="font-medium text-lg text-gray-300 dark:text-gray-200">
            Logged in as{" "}
            <span className="font-semibold text-emerald-400">
              {session.user.name}
            </span>
          </span>
          <Button
            className={`px-5 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-400 flex items-center justify-center gap-2 ${
              loggingOut ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loggingOut}
            onClick={async () => {
              setLoggingOut(true);
              try {
                await authClient.signOut();
                toast("Logging Out");
                setTimeout(() => {
                  redirect("/signin");
                }, 1000);
              } catch (e) {
                setLoggingOut(false);
              }
            }}
          >
            {loggingOut && (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            {loggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </div>
  );
}
