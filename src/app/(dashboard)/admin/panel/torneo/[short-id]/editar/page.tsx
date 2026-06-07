import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTournamentFullDataByShortId } from "@/services/tournaments";
import { TournamentForm } from "../../crear/components/TournamentForm";

interface Props {
  params: Promise<{
    "short-id": string;
  }>;
}

export default async function EditTournamentPage({ params }: Props) {
  const { "short-id": shortId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }

  const tournament = await getTournamentFullDataByShortId(shortId);
  if (!tournament) {
    notFound();
  }

  // Ensure only the owner organizer can edit the tournament
  if (tournament.organizer_id !== user.id) {
    redirect("/admin/panel");
  }

  // Get organizer verification status
  const { data: org } = await supabase
    .from("organizers")
    .select("is_verified")
    .eq("id", user.id)
    .single();

  const isOrganizerVerified = org?.is_verified ?? false;

  return (
    <div className="max-w-2xl mx-auto pb-12">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href={`/admin/panel`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a Gestión del Torneo
        </Link>
      </div>

      <TournamentForm
        mode="edit"
        initialTournament={tournament}
        isOrganizerVerified={isOrganizerVerified}
      />
    </div>
  );
}
