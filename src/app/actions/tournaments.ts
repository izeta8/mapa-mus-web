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
