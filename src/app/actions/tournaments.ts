'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addCouple(formData: { 
  tournamentId: string, 
  player1: string, 
  player2: string, 
  coupleNumber: number 
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('couples')
    .insert({
      tournament_id: formData.tournamentId,
      player1_name: formData.player1,
      player2_name: formData.player2,
      couple_number: formData.coupleNumber
    });

  if (error) {
    console.error("Error adding couple:", error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/panel/[short-id]`, 'page');
  return { success: true };
}

export async function deleteCouple(coupleId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('couples')
    .delete()
    .eq('id', coupleId);

  if (error) {
    console.error("Error deleting couple:", error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/panel/[short-id]`, 'page');
  return { success: true };
}

export async function updateMatchTable(matchId: string, tableNumber: string | null) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('matches')
    .update({ table_number: tableNumber })
    .eq('id', matchId);

  if (error) {
    console.error("Error updating table number:", error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/panel/[short-id]`, 'page');
  return { success: true };
}

export async function setMatchWinner(matchId: string, winnerId: string) {
  const supabase = await createClient();

  // Utilizamos el RPC 'advance_winner' que ya existe en la DB
  const { error } = await supabase.rpc('advance_winner', {
    p_match_id: matchId,
    p_winner_id: winnerId
  });

  if (error) {
    console.error("Error setting winner:", error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/panel/[short-id]`, 'page');
  return { success: true };
}

export async function rollbackMatchWinner(matchId: string) {
  const supabase = await createClient();

  const { error } = await supabase.rpc('rollback_winner', {
    p_match_id: matchId
  });

  if (error) {
    console.error("Error rolling back winner:", error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin/panel/[short-id]`, 'page');
  return { success: true };
}

export async function updateTournamentStatus(tournamentId: string, status: 'ongoing') {
    
    const supabase = await createClient();
    
    const { error } = await supabase
        .from('tournaments_develop')
        .update({ status })
        .eq('id', tournamentId);

    if (error) {
        console.error("Error al actualizar el estado del torneo:", error.message);
        throw new Error('No se pudo cambiar el estado del torneo');
    }
    
}