"use client";

import { Menu } from "lucide-react";

export interface MobileHeaderProps {
  onOpenMenu: () => void;
}

export function MobileHeader({ onOpenMenu }: MobileHeaderProps) {
  return (
    <header className="min-[700px]:hidden h-14 bg-white border-b border-neutral-200 px-4 flex items-center justify-between shrink-0 z-20">
      <button
        onClick={onOpenMenu}
        className="p-2 text-neutral-700 hover:bg-[#F3F4F6] rounded-lg focus:outline-none cursor-pointer"
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
  );
}
