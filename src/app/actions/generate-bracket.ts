
'use server'

import { createClient } from "@/lib/supabase/server";
import { buildMatchesTree, coupleAsignation, nearestPowerOfTwo, shuffleAlgorithm } from "@/lib/utils";
import { Couple, MatchInsert } from "@/types/database";
import { revalidatePath } from "next/cache";
import { updateTournamentStatus } from "./tournaments";

export async function fetchTournamentCouples(tournamentId: string): Promise<Couple[]> {

    const supabase = await createClient();

    // Fetch couples inscribed on the tournament.
    const { data: couples, error } = await supabase
        .from('couples')
        .select("*")
        .eq('tournament_id', tournamentId)

    if (error) {
        throw new Error('No se pudieron cargar las parejas del torneo');
    }

    return couples
}

export async function storeGeneratedBracket(tournamentId: string, bracket: MatchInsert[]) {

    /**
     * TODO: SECURITY CHECK (Pending Auth Implementation)
     * 1. Obtener sesión: const { data: { user } } = await supabase.auth.getUser();
     * 2. Validar propiedad: Verificar que user.id === tournament.organizer_id
     * 3. Abortar si no es el dueño para evitar ataques de enumeración de IDs.
     */

    const supabase = await createClient();

    // Clear a possible previous bracket before inserting the new one
    const { error: deleteError } = await supabase
        .from('matches')
        .delete()
        .eq('tournament_id', tournamentId);

    if (deleteError) {
        console.error("Error al limpiar matches previos:", deleteError.message);
        throw new Error('No se pudo resetear el torneo antes de guardar');
    }

    // Bulk insert 
    const { error: insertError } = await supabase
        .from('matches')
        .insert(bracket);

    if (insertError) {
        console.error("Error en bulk insert:", insertError.message);
        throw new Error('No se ha podido insertar el cuadro');
    }
}

export async function generateBracket(tournamentId: string) {

    try {

        // Fetch couples and calculate the dimension of the bracket.
        const couples = await fetchTournamentCouples(tournamentId);
        const currentRoundSlots = nearestPowerOfTwo(couples.length) // 16, 32, 64, 128...
        const tournamentRounds = Math.log2(currentRoundSlots)

        // Create each match of the bracket (just the placeholder without pairing)
        const matchesToInsert: MatchInsert[] = []
        buildMatchesTree(null, 1, 1, tournamentRounds, matchesToInsert, tournamentId);
        matchesToInsert.sort((a, b) => (a.round ?? 0) - (b.round ?? 0));

        // Shuffle couples array and asign to the matches.
        const couplesToPair = shuffleAlgorithm([...couples]);
        const finishedBracket = coupleAsignation(matchesToInsert, tournamentRounds, couplesToPair, currentRoundSlots)

        // Erase a possible previous bracket and insert the new one
        await storeGeneratedBracket(tournamentId, finishedBracket);
        
        // Update tournament status to 'ongoing'
        await updateTournamentStatus(tournamentId, 'ongoing');

        revalidatePath(`/admin/panel/[short-id]`, 'page');
        revalidatePath(`/tv/${tournamentId}`);

        return { success: true, message: "¡Torneo iniciado con éxito!" };

    } catch (error) {
        const message = error instanceof Error ? error.message : "Error inesperado";
        console.error("Fallo en generación de bracket:", message);
        
        return { success: false, error: message };
    }

}


