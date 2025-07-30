"use client";

import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-to-br from-emerald-950 via-emerald-950/30 to-emerald-950">
      {children}
      <Toaster />
    </div>
  );
}
