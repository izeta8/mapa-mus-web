"use client";

export interface BackdropProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Backdrop({ isOpen, onClose }: BackdropProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-30 min-[700px]:hidden transition-opacity duration-200 animate-in fade-in"
      onClick={onClose}
    />
  );
}
