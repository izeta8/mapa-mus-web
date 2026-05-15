import { createClient } from "@/lib/supabase/server";
import { TournamentFull } from "@/types/database";

export async function getTournamentByShortId(shortId: string): Promise<TournamentFull | null> {
  
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('tournaments_develop')
        .select(`
        *,
        matches (
            *,
            couple1:couples!couple1_id (
            player1_name,
            player2_name,
            couple_number
            ),
            couple2:couples!couple2_id (
            player1_name,
            player2_name,
            couple_number
            )
        ),
        stats:couples(count)
        `)
        .eq('short_id', shortId)
        .maybeSingle();

    if (error || !data) {
        console.error(error);
        return null;
    }

    return {
        ...data,
        total_couples: data.stats?.[0]?.count ?? 0,
    };
}

