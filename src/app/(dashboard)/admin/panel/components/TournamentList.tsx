import { getOrganizerTournaments } from "@/services/tournaments";
import Link from "next/link";
import { TournamentGroupedList } from "./TournamentGroupedList";
import { createClient } from "@/lib/supabase/server";

export async function TournamentList({ organizerId }: { organizerId: string }) {
  const tournaments = await getOrganizerTournaments(organizerId);

  if (!tournaments || tournaments.length === 0) {
    return (
      <div className="border border-dashed border-zinc-300 rounded-xl p-8 text-center bg-zinc-50">
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">No hay torneos</h3>
        <p className="text-zinc-500 mb-4">Aún no has creado ningún torneo. ¡Anímate a organizar el primero!</p>
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
    );
  }

  const supabase = await createClient();
  const { data: org } = await supabase
    .from("organizers")
    .select("is_verified")
    .eq("id", organizerId)
    .single();
  const isOrganizerVerified = org?.is_verified ?? false;

  return <TournamentGroupedList initialTournaments={tournaments} isOrganizerVerified={isOrganizerVerified} />;
}