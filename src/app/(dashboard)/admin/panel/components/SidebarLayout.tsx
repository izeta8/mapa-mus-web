"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building, Trophy, Menu, X } from "lucide-react";
import { SignOutButton } from "./SignOutButton";

export function SidebarLayout({
  orgName,
  children,
}: {
  orgName: string | null;
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/admin/panel", label: "Mis Torneos", icon: Trophy },
    { href: "/admin/panel/organizador/editar", label: "Editar Organizador", icon: Building },
  ];

  return (
    <div className="h-screen flex bg-[#F9F9FB] overflow-hidden relative">
      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 min-[700px]:hidden transition-opacity duration-200 animate-in fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r bg-white p-5 flex flex-col justify-between shadow-sm shrink-0 transition-transform duration-200 ease-in-out
          min-[700px]:static min-[700px]:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div>
          <div className="mb-8 border-b pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#1F1F1F] tracking-tight">
                Mapa<span className="text-[#33AD6A]">Mus</span> <span className="text-xs font-semibold px-2 py-0.5 bg-[#33AD6A]/10 text-[#288A56] rounded-full border border-[#33AD6A]/20">Organizador</span>
              </h2>
              {orgName && (
                <p className="text-xs text-neutral-500 font-medium mt-1 truncate max-w-[180px]">
                  {orgName}
                </p>
              )}
            </div>
            {/* Close button for mobile */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 text-neutral-500 hover:bg-[#F3F4F6] rounded-lg min-[700px]:hidden focus:outline-none"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                    ${isActive
                      ? "bg-[#33AD6A]/10 text-[#288A56]"
                      : "text-neutral-700 hover:bg-[#F3F4F6]"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t pt-4">
          <SignOutButton />
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header for mobile */}
        <header className="min-[700px]:hidden h-14 bg-white border-b border-neutral-200 px-4 flex items-center justify-between shrink-0 z-20">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-neutral-700 hover:bg-[#F3F4F6] rounded-lg focus:outline-none"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base text-[#1F1F1F]">
              Mapa<span className="text-[#33AD6A]">Mus</span>
            </span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-[#33AD6A]/10 text-[#288A56] rounded-full border border-[#33AD6A]/20">
              Panel
            </span>
          </div>
          <div className="w-10 h-10" /> {/* Spacer to center the logo title */}
        </header>

        <main className="flex-1 p-4 min-[700px]:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
