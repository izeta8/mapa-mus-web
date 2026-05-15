import { createClient } from "@/lib/supabase/server";
import { Tournament } from "@/types/database";

export async function getTournamentByShortId(shortId: string): Promise<Tournament | null> {
  
    const supabase = await createClient();

    const { data: tournament, error } = await supabase
        .from('tournaments_develop')
        .select("*")
        .eq('short_id', shortId)
        .maybeSingle()

    if (error) {
        console.error(error);
        return null;
    }

    return tournament;
}