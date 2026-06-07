'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { TournamentSchema } from "@/lib/validations/tournament";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";
import { sendTelegramNotification } from "@/lib/telegram";

export async function verifyTournamentOwnership(supabase: SupabaseClient<Database>, tournamentId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: tournament, error } = await supabase
    .from("tournaments")
    .select("organizer_id")
    .eq("id", tournamentId)
    .maybeSingle();

  if (error || !tournament) {
    return false;
  }
  return tournament.organizer_id === user.id;
}

export async function getTournamentIdByCoupleId(supabase: SupabaseClient<Database>, coupleId: string): Promise<string | null> {
  const { data: couple, error } = await supabase
    .from("couples")
    .select("tournament_id")
    .eq("id", coupleId)
    .maybeSingle();

  if (error || !couple) return null;
  return couple.tournament_id;
}

export async function getTournamentIdByMatchId(supabase: SupabaseClient<Database>, matchId: string): Promise<string | null> {
  const { data: match, error } = await supabase
    .from("matches")
    .select("tournament_id")
    .eq("id", matchId)
    .maybeSingle();

  if (error || !match) return null;
  return match.tournament_id;
}

export async function addCouple(formData: {
  tournamentId: string,
  player1: string,
  player2: string,
  coupleNumber: number
}) {
  const supabase = await createClient();

  const isOwner = await verifyTournamentOwnership(supabase, formData.tournamentId);
  if (!isOwner) {
    return { success: false, error: "No autorizado para modificar este torneo." };
  }

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

  const tournamentId = await getTournamentIdByCoupleId(supabase, coupleId);
  if (!tournamentId) {
    return { success: false, error: "Pareja no encontrada." };
  }

  const isOwner = await verifyTournamentOwnership(supabase, tournamentId);
  if (!isOwner) {
    return { success: false, error: "No autorizado para modificar este torneo." };
  }

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

  const tournamentId = await getTournamentIdByMatchId(supabase, matchId);
  if (!tournamentId) {
    return { success: false, error: "Partido no encontrado." };
  }

  const isOwner = await verifyTournamentOwnership(supabase, tournamentId);
  if (!isOwner) {
    return { success: false, error: "No autorizado para modificar este torneo." };
  }

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

  const tournamentId = await getTournamentIdByMatchId(supabase, matchId);
  if (!tournamentId) {
    return { success: false, error: "Partido no encontrado." };
  }

  const isOwner = await verifyTournamentOwnership(supabase, tournamentId);
  if (!isOwner) {
    return { success: false, error: "No autorizado para modificar este torneo." };
  }

  // Verificar que el partido pertenece a la ronda activa
  const { data: match, error: matchError } = await supabase
    .from('matches')
    .select('round, tournament_id')
    .eq('id', matchId)
    .single();

  if (matchError || !match) {
    return { success: false, error: "Partido no encontrado." };
  }

  const { data: tournament, error: tournamentError } = await supabase
    .from('tournaments')
    .select('current_round')
    .eq('id', match.tournament_id)
    .single();

  if (tournamentError || !tournament) {
    return { success: false, error: "Torneo no encontrado." };
  }

  let activeRound = tournament.current_round;
  if (activeRound === null) {
    const { data: maxRoundData } = await supabase
      .from('matches')
      .select('round')
      .eq('tournament_id', match.tournament_id)
      .order('round', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    activeRound = maxRoundData?.round ?? 1;
  }

  if (match.round !== activeRound) {
    return { success: false, error: "Solo se pueden registrar resultados de la ronda activa." };
  }

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

  const tournamentId = await getTournamentIdByMatchId(supabase, matchId);
  if (!tournamentId) {
    return { success: false, error: "Partido no encontrado." };
  }

  const isOwner = await verifyTournamentOwnership(supabase, tournamentId);
  if (!isOwner) {
    return { success: false, error: "No autorizado para modificar este torneo." };
  }

  // Verificar que el partido pertenece a la ronda activa
  const { data: match, error: matchError } = await supabase
    .from('matches')
    .select('round, tournament_id')
    .eq('id', matchId)
    .single();

  if (matchError || !match) {
    return { success: false, error: "Partido no encontrado." };
  }

  const { data: tournament, error: tournamentError } = await supabase
    .from('tournaments')
    .select('current_round')
    .eq('id', match.tournament_id)
    .single();

  if (tournamentError || !tournament) {
    return { success: false, error: "Torneo no encontrado." };
  }

  let activeRound = tournament.current_round;
  if (activeRound === null) {
    const { data: maxRoundData } = await supabase
      .from('matches')
      .select('round')
      .eq('tournament_id', match.tournament_id)
      .order('round', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    activeRound = maxRoundData?.round ?? 1;
  }

  if (match.round !== activeRound) {
    return { success: false, error: "Solo se pueden deshacer resultados de la ronda activa." };
  }

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

export async function updateTournamentStatus(tournamentId: string, status: 'ongoing', currentRound?: number) {
  const supabase = await createClient();

  const payload: { status: 'ongoing'; current_round?: number } = { status };
  if (currentRound !== undefined) {
    payload.current_round = currentRound;
  }

  const { error } = await supabase
    .from('tournaments')
    .update(payload)
    .eq('id', tournamentId);

  if (error) {
    console.error("Error updating tournament status:", error.message);
    throw new Error('No se pudo cambiar el estado del torneo');
  }
}

export async function advanceTournamentRound(tournamentId: string, round: number) {
  const supabase = await createClient();

  const isOwner = await verifyTournamentOwnership(supabase, tournamentId);
  if (!isOwner) {
    return { success: false, error: "No autorizado para modificar este torneo." };
  }

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

export async function revertTournamentRound(tournamentId: string, round: number) {
  const supabase = await createClient();

  const isOwner = await verifyTournamentOwnership(supabase, tournamentId);
  if (!isOwner) {
    return { success: false, error: "No autorizado para modificar este torneo." };
  }

  // Cambiar el puntero de ronda activa del torneo sin borrar datos en cascada,
  // ya que la base de datos (con las funciones advance_winner y rollback_winner)
  // ya propaga y limpia los cambios de parejas de forma selectiva cuando se modifica
  // el resultado de un partido específico en la ronda previa, conservando intactos
  // los cruces y resultados de las ramas que no se vieron afectadas.
  const { error } = await supabase
    .from('tournaments')
    .update({ current_round: round })
    .eq('id', tournamentId);

  if (error) {
    console.error("Error reverting round:", error);
    return { success: false, error: "No se pudo volver a la ronda anterior. Inténtalo de nuevo." };
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
    .select("name, is_verified, contacts")
    .eq("id", user.id)
    .single();

  if (orgError || !org) {
    return { success: false, error: "No se encontró el perfil de organizador para tu usuario." };
  }

  // 2. Set tournament status based on verification or explicit draft status
  const status = data.status === "revision_pending"
    ? "revision_pending"
    : (org.is_verified ? "planned" : "revision_pending");

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
    .select("id, short_id")
    .single();

  if (error) {
    console.error("Error creating tournament:", error);
    return { success: false, error: "No se pudo guardar el torneo. Inténtalo de nuevo." };
  }

  // Send Telegram notification
  const tournamentLink = status === "planned"
    ? `https://mapamus.com/torneos/${insertedData.short_id}`
    : `https://mapa-mus-mitm.vercel.app/?id=${insertedData.id}`;

  const statusLabel = status === "revision_pending"
    ? (data.status === "revision_pending" ? "🟡 Borrador / En Revisión" : "🟡 Pendiente de revisión")
    : "🟢 Activo (Verificado)";

  const telegramText = `🏆 *Nuevo Torneo Creado*\n\n` +
    `*Torneo:* ${data.name}\n` +
    `*Organizador:* ${org.name || "Desconocido"}\n` +
    `*Fecha:* ${data.tournamentDate}\n` +
    `*Ubicación:* ${data.location}\n` +
    `*Estado:* ${statusLabel}\n` +
    `*Enlace:* [Ver/Gestionar](${tournamentLink})`;
  const telegramResult = await sendTelegramNotification(telegramText);
  if (!telegramResult.success) {
    console.error("Warning: Failed to send Telegram notification for new tournament:", telegramResult.error);
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

  // Verify ownership and get current status
  const { data: existing, error: fetchError } = await supabase
    .from("tournaments")
    .select("organizer_id, short_id, status")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return { success: false, error: "No se pudo encontrar el torneo a editar." };
  }

  if (existing.organizer_id !== user.id) {
    return { success: false, error: "No tienes permisos para editar este torneo." };
  }

  // 1. Get organization verification status
  const { data: org } = await supabase
    .from("organizers")
    .select("is_verified")
    .eq("id", user.id)
    .single();

  let targetStatus = existing.status;
  if (data.status === "revision_pending") {
    targetStatus = "revision_pending";
  } else if (existing.status === "revision_pending") {
    // If it was in revision/draft, and we do a normal save, promote to planned if verified
    if (org?.is_verified) {
      targetStatus = "planned";
    }
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
      status: targetStatus,
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

export async function deleteTournament(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Usuario no autenticado." };
  }

  // Verify ownership
  const { data: existing, error: fetchError } = await supabase
    .from("tournaments")
    .select("organizer_id")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return { success: false, error: "No se pudo encontrar el torneo a eliminar." };
  }

  if (existing.organizer_id !== user.id) {
    return { success: false, error: "No tienes permisos para eliminar este torneo." };
  }

  // Delete related matches first due to RESTRICT constraint
  const { error: matchesError } = await supabase
    .from("matches")
    .delete()
    .eq("tournament_id", id);

  if (matchesError) {
    console.error("Error deleting matches:", matchesError);
    return { success: false, error: "No se pudieron eliminar los enfrentamientos del torneo." };
  }

  // Delete related couples due to RESTRICT constraint
  const { error: couplesError } = await supabase
    .from("couples")
    .delete()
    .eq("tournament_id", id);

  if (couplesError) {
    console.error("Error deleting couples:", couplesError);
    return { success: false, error: "No se pudieron eliminar las parejas del torneo." };
  }

  // Delete the tournament
  const { error: tournamentError } = await supabase
    .from("tournaments")
    .delete()
    .eq("id", id);

  if (tournamentError) {
    console.error("Error deleting tournament:", tournamentError);
    return { success: false, error: "No se pudo eliminar el torneo. Inténtalo de nuevo." };
  }

  revalidatePath("/admin/panel");
  return { success: true };
}

export async function processTournamentPoster(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Usuario no autenticado." };
    }

    const file = formData.get("file");
    const caption = formData.get("caption");

    if (!file || !(file instanceof File)) {
      return { success: false, error: "No se ha proporcionado ningún archivo válido." };
    }

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("N8N_WEBHOOK_URL is not defined in environment variables.");
      return { success: false, error: "El servicio de procesamiento de carteles está mal configurado. Contacte con un administrador, por favor." };
    }

    const sendFormData = new FormData();
    sendFormData.append("file", file);
    if (caption) {
      sendFormData.append("caption", caption as string);
    }
    sendFormData.append("organizer_id", user.id);

    const response = await fetch(webhookUrl, {
      method: "POST",
      body: sendFormData,
    });

    if (!response.ok) {
      try {
        const errJson = await response.json();
        return { success: false, error: errJson.error || errJson.message || "Error al procesar el cartel con el asistente de IA." };
      } catch {
        const errorText = await response.text();
        console.error("n8n webhook error response:", errorText);
        return { success: false, error: "Error al procesar el cartel con el asistente de IA." };
      }
    }

    const json = await response.json();

    if (json && json.success === false) {
      return { success: false, error: json.error || "Ocurrió un error al procesar el cartel." };
    }

    const shortId = json?.shortId || json?.short_id || json?.data?.short_id || json?.data?.shortId;

    if (!shortId) {
      console.error("N8N webhook did not return a shortId:", json);
      return { success: false, error: "El asistente de IA no devolvió un identificador de torneo válido." };
    }

    revalidatePath("/admin/panel");
    return { success: true, shortId };
  } catch (error) {
    console.error("Error in processTournamentPoster:", error);
    const errorMessage = error instanceof Error ? error.message : "Ocurrió un error inesperado al procesar el cartel.";
    return { success: false, error: errorMessage };
  }
}

export async function changeTournamentStatusToDraft(tournamentId: string) {
  const supabase = await createClient();

  const isOwner = await verifyTournamentOwnership(supabase, tournamentId);
  if (!isOwner) {
    return { success: false, error: "No tienes permisos para modificar este torneo." };
  }

  const { error } = await supabase
    .from("tournaments")
    .update({ status: "revision_pending" })
    .eq("id", tournamentId);

  if (error) {
    console.error("Error setting tournament status to draft:", error);
    return { success: false, error: "No se pudo cambiar el estado a borrador. Inténtalo de nuevo." };
  }

  revalidatePath("/admin/panel");
  return { success: true };
}

export async function publishTournament(tournamentId: string) {
  const supabase = await createClient();

  const isOwner = await verifyTournamentOwnership(supabase, tournamentId);
  if (!isOwner) {
    return { success: false, error: "No tienes permisos para modificar este torneo." };
  }

  // Double check organizer verification status on the server
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Usuario no autenticado." };
  }

  const { data: org } = await supabase
    .from("organizers")
    .select("is_verified")
    .eq("id", user.id)
    .single();

  if (!org?.is_verified) {
    return { success: false, error: "Tu cuenta de organizador no está verificada para publicar torneos directamente." };
  }

  const { error } = await supabase
    .from("tournaments")
    .update({ status: "planned" })
    .eq("id", tournamentId);

  if (error) {
    console.error("Error publishing tournament:", error);
    return { success: false, error: "No se pudo publicar el torneo. Inténtalo de nuevo." };
  }

  revalidatePath("/admin/panel");
  return { success: true };
}
