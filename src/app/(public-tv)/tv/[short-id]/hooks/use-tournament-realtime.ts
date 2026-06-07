import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { TournamentFull } from "@/types/database";

export function useTournamentRealtime(initialTournament: TournamentFull) {
  const [tournament, setTournament] = useState<TournamentFull>(initialTournament);

  useEffect(() => {
    const supabase = createClient();

    const refreshTournamentData = async () => {
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
        .eq('id', initialTournament.id)
        .maybeSingle();

      if (!error && data) {
        setTournament(data as unknown as TournamentFull);
      }
    };

    const channel = supabase
      .channel(`tv-tournament-${initialTournament.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches',
          filter: `tournament_id=eq.${initialTournament.id}`
        },
        () => {
          refreshTournamentData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tournaments',
          filter: `id=eq.${initialTournament.id}`
        },
        () => {
          refreshTournamentData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'couples',
          filter: `tournament_id=eq.${initialTournament.id}`
        },
        () => {
          refreshTournamentData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialTournament.id]);

  return { tournament };
}
