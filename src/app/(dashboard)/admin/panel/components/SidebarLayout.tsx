"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { MobileHeader } from "./MobileHeader";
import { Backdrop } from "./Backdrop";

export function SidebarLayout({
  orgName,
  children,
}: {
  orgName: string | null;
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex bg-[#F9F9FB] overflow-hidden relative">
      <Backdrop isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <Sidebar
        orgName={orgName}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <MobileHeader onOpenMenu={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-4 min-[700px]:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
