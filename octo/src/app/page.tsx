"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();

  // State for toggling between login and signup
  const [mode, setMode] = useState<"login" | "signup">("login");

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Feedback state
  const [loading, setLoading] = useState(false);

  function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    authClient.signUp.email(
      {
        email,
        password,
        name,
        callbackURL: "/dashboard",
      },
      {
        onSuccess: () => {
          setLoading(false);
          alert("Sign Up successful!");
        },
        onError: (ctx) => {
          setLoading(false);
        },
      }
    );
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    authClient.signIn.email(
      {
        email,
        password,
        callbackURL: "/dashboard",
      },
      {
        onSuccess: () => {
          setLoading(false);
          alert("Logged In successfully!");
        },
        onError: (ctx) => {
          setLoading(false);
        },
      }
    );
  }

  function hangleLogout() {
    authClient.signOut();
  }

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center font-[family-name:var(--font-geist-sans)]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* Circular spinner */}
            <svg
              className="absolute inset-0 w-full h-full animate-spin"
              viewBox="0 0 64 64"
              fill="none"
            >
              <path
                d="M60 32a28 28 0 0 1-28 28"
                stroke="#2563eb"
                strokeWidth="4"
                strokeLinecap="round"
                className="opacity-80"
              />
            </svg>
            {/* O logo */}
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600 shadow">
              <span>O</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600 shadow">
              {session.user?.name
                ? session.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                : "👤"}
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Welcome, {session.user?.name || "User"}!
            </h2>
            <p className="text-gray-500 text-sm">{session.user?.email}</p>
            <Button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-2xl shadow hover:bg-red-600 transition"
              onClick={() => hangleLogout()}
              size="lg"
            >
              Log out
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 font-[family-name:var(--font-geist-sans)]">
      <main className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center gap-6">
        {/* Logo and App Name */}
        <div className="flex flex-col items-center gap-2 mb-2">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
            <span>O</span>
          </div>
          <span className="text-xl font-bold text-blue-700 tracking-wide">
            Octo
          </span>
        </div>

        {/* Toggle between Login and Signup */}
        <div className="flex w-full mb-2">
          <button
            className={`flex-1 py-2 rounded-l-md border border-gray-200 text-sm font-medium transition ${
              mode === "login"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setMode("login")}
            type="button"
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 rounded-r-md border-t border-b border-r border-gray-200 text-sm font-medium transition ${
              mode === "signup"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setMode("signup")}
            type="button"
          >
            Sign Up
          </button>
        </div>

        {/* Login Form */}
        {mode === "login" && (
          <form
            onSubmit={handleLogin}
            className="w-full flex flex-col gap-4"
            autoComplete="on"
          >
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="login-email"
              >
                Email
              </label>
              <input
                id="login-email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="login-password"
              >
                Password
              </label>
              <input
                id="login-password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="mt-2 w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        )}

        {/* Signup Form */}
        {mode === "signup" && (
          <form
            onSubmit={handleSignup}
            className="w-full flex flex-col gap-4"
            autoComplete="on"
          >
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="signup-name"
              >
                Name
              </label>
              <input
                id="signup-name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                required
                autoComplete="name"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="signup-email"
              >
                Email
              </label>
              <input
                id="signup-email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="signup-password"
              >
                Password
              </label>
              <input
                id="signup-password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" className="mt-2 w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        )}
      </main>
    </div>
  );
}
