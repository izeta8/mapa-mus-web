import { Suspense } from "react";
import { TournamentList } from "./components/TournamentList";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminPanelPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8 pb-4 border-b">
        <h1 className="text-3xl font-black text-[#1F1F1F]">Mis Torneos</h1>
        <Link
          href="/admin/panel/torneo/crear"
          className="inline-flex items-center justify-center px-4 py-2.5 bg-[#33AD6A] hover:bg-[#288A56] active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm gap-2 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Crear Torneo
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center gap-3 py-8">
            <div className="w-8 h-8 border-4 border-zinc-200 border-t-[#33AD6A] rounded-full animate-spin flex"></div>
            <span className="text-sm font-medium text-neutral-500">Cargando los torneos...</span>
          </div>
        }
      >
        <TournamentList organizerId={user.id} />
      </Suspense>
    </div>
  );
}
