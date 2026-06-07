import { createClient } from "@/lib/supabase/server";
import { Tournament, TournamentFull } from "@/types/database";

export async function getTournamentFullDataByShortId(shortId: string): Promise<TournamentFull | null> {
  
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('tournaments')
        .select(`
        *,
        matches (
            *,
            couple1:couples!couple1_id (
                id,
                player1_name,
                player2_name,
                couple_number
            ),
            couple2:couples!couple2_id (
                id,
                player1_name,
                player2_name,
                couple_number
            )
        ),
        couples (
            *
        )
        `)
        .eq('short_id', shortId)
        .maybeSingle();

    if (error || !data) {
        console.error(error);
        return null;
    }

    return data;
}


export async function getOrganizerTournaments(organizerId: string): Promise<Tournament[] | null> {

    const supabase = await createClient()

    const { data: tournaments, error } = await supabase
        .from('tournaments')
        .select("*")
        .eq('organizer_id', organizerId)

     if (error || !tournaments) {
        console.error(error);
        return null;
    }

    return tournaments
}

export async function getPublicActiveTournaments(): Promise<Tournament[] | null> {
  const supabase = await createClient();

  // Filter out tournaments older than 12 hours ago to allow active/ongoing tournaments
  // of today to remain visible on the map while they are running.
  const thresholdDate = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();

  const { data: tournaments, error } = await supabase
    .from("tournaments")
    .select("*")
    .in("status", ["planned", "ongoing"])
    .eq("is_test", false)
    .gte("tournament_date", thresholdDate)
    .order("tournament_date", { ascending: true });

  if (error || !tournaments) {
    console.error("Error fetching public active tournaments:", error);
    return null;
  }

  return tournaments;
}