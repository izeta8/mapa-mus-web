import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { TournamentFull } from "@/types/database";

/**
 * Subscribes to live changes of a tournament (matches, couples and the tournament
 * row itself) and keeps an up-to-date `TournamentFull` in state.
 *
 * Shared by the public TV view and the player-facing "find your table" panel, so it
 * lives in the shared `hooks/` folder instead of being colocated with a single route.
 */
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
      .channel(`tournament-realtime-${initialTournament.id}`)
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
