import { createClient } from "@/lib/supabase/server";
import { Tournament, TournamentFull } from "@/types/database";

export async function getTournamentFullDataByShortId(shortId: string): Promise<TournamentFull | null> {
  
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('tournaments_develop')
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
            id,
            player1_name,
            player2_name,
            couple_number
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
        .from('tournaments_develop')
        .select("*")
        .eq('organizer_id', organizerId)

     if (error || !tournaments) {
        console.error(error);
        return null;
    }

    return tournaments
}