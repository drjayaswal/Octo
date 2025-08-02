"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Only protect specific routes to avoid infinite redirect loop
const PROTECTED_PATHS = ["/dashboard", "/dashboard/", "/dashboard/calendar", "/dashboard/agents"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only run auth check for protected paths
  if (PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(path + "/"))) {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // If not authenticated and not already on /signin, redirect to /signin
    if (!session && pathname !== "/signin") {
      const signinUrl = new URL("/signin", request.url);
      // Optionally, add a redirect param to return after login
    //   signinUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signinUrl);
    }
  }

  return NextResponse.next();
}
