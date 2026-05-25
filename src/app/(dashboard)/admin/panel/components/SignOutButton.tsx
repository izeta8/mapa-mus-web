'use client'

import { signOut } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = async () => {
    startTransition(async () => {
      await signOut();
      router.push("/admin/login");
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isPending}
      className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all duration-200 disabled:opacity-50"
    >
      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      {isPending ? "Cerrando..." : "Cerrar Sesión"}
    </button>
  );
}
