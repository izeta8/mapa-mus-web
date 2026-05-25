'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { TournamentSchema } from "@/lib/validations/tournament";

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
    return { success: false, error: "No se pudo registrar la pareja. Inténtalo de nuevo." };
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
    return { success: false, error: "No se pudo eliminar la pareja. Inténtalo de nuevo." };
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
    return { success: false, error: "No se pudo asignar la mesa. Inténtalo de nuevo." };
  }

  revalidatePath(`/admin/panel/[short-id]`, 'page');
  return { success: true };
}

export async function setMatchWinner(matchId: string, winnerId: string) {
  const supabase = await createClient();

  const { error } = await supabase.rpc('advance_winner', {
    p_match_id: matchId,
    p_winner_id: winnerId
  });

  if (error) {
    console.error("Error setting winner:", error);
    return { success: false, error: "No se pudo registrar el resultado. Inténtalo de nuevo." };
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
    return { success: false, error: "No se pudo revertir el resultado. Inténtalo de nuevo." };
  }

  revalidatePath(`/admin/panel/[short-id]`, 'page');
  return { success: true };
}

export async function updateTournamentStatus(tournamentId: string, status: 'ongoing') {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('tournaments')
    .update({ status })
    .eq('id', tournamentId);
      
  if (error) {
    console.error("Error updating tournament status:", error.message);
    throw new Error('No se pudo cambiar el estado del torneo');
  }
}

export async function advanceTournamentRound(tournamentId: string, round: number) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('tournaments')
    .update({ current_round: round })
    .eq('id', tournamentId);

  if (error) {
    console.error("Error advancing round:", error);
    return { success: false, error: "No se pudo avanzar de ronda. Inténtalo de nuevo." };
  }

  revalidatePath(`/admin/panel/[short-id]`, 'page');
  return { success: true };
}

export async function createTournament(formData: unknown) {
  const result = TournamentSchema.safeParse(formData);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const data = result.data;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Usuario no autenticado." };
  }

  // 1. Get organization verification status and default contacts
  const { data: org, error: orgError } = await supabase
    .from("organizers")
    .select("is_verified, contacts")
    .eq("id", user.id)
    .single();

  if (orgError || !org) {
    return { success: false, error: "No se encontró el perfil de organizador para tu usuario." };
  }

  // 2. Set tournament status based on verification
  const status = org.is_verified ? "planned" : "revision_pending";

  // 3. Insert the tournament
  const { data: insertedData, error } = await supabase
    .from("tournaments")
    .insert({
      name: data.name,
      organizer_id: user.id,
      tournament_date: data.tournamentDate,
      location: data.location,
      price_per_couple: data.pricePerCouple,
      max_spots: data.maxSpots,
      kings_modality: data.kingsModality,
      points_modality: data.pointsModality || null,
      status: status,
      contacts: data.contacts ?? [],
      prizes: data.prizes ?? [],
      rules: data.rules ?? [],
      poster_url: data.posterUrl,
      latitude: data.latitude,
      longitude: data.longitude,
      registration_info: data.registrationDetails
        ? { in_person_details: data.registrationDetails, in_app_enabled: false }
        : {},
    })
    .select("short_id")
    .single();

  if (error) {
    console.error("Error creating tournament:", error);
    return { success: false, error: "No se pudo guardar el torneo. Inténtalo de nuevo." };
  }

  revalidatePath("/admin/panel");
  return { success: true, shortId: insertedData.short_id };
}

export async function updateTournament(id: string, formData: unknown) {
  const result = TournamentSchema.safeParse(formData);
  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const data = result.data;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Usuario no autenticado." };
  }

  // Verify ownership
  const { data: existing, error: fetchError } = await supabase
    .from("tournaments")
    .select("organizer_id, short_id")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return { success: false, error: "No se pudo encontrar el torneo a editar." };
  }

  if (existing.organizer_id !== user.id) {
    return { success: false, error: "No tienes permisos para editar este torneo." };
  }

  // Update the tournament
  const { error } = await supabase
    .from("tournaments")
    .update({
      name: data.name,
      tournament_date: data.tournamentDate,
      location: data.location,
      price_per_couple: data.pricePerCouple,
      max_spots: data.maxSpots,
      kings_modality: data.kingsModality,
      points_modality: data.pointsModality || null,
      contacts: data.contacts ?? [],
      prizes: data.prizes ?? [],
      rules: data.rules ?? [],
      poster_url: data.posterUrl,
      latitude: data.latitude,
      longitude: data.longitude,
      registration_info: data.registrationDetails
        ? { in_person_details: data.registrationDetails, in_app_enabled: false }
        : {},
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating tournament:", error);
    return { success: false, error: "No se pudo actualizar el torneo. Inténtalo de nuevo." };
  }

  revalidatePath("/admin/panel");
  revalidatePath(`/admin/panel/torneo/${existing.short_id}`);
  revalidatePath(`/torneo/${existing.short_id}`);
  return { success: true, shortId: existing.short_id };
}