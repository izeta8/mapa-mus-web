"use client";

import { useMemo } from "react";
import { TournamentFull } from "@/types/database";
import { useTournamentRealtime } from "@/hooks/use-tournament-realtime";
import { useSelectedCouple } from "./use-selected-couple";
import { deriveCoupleLiveStatus } from "./live-status";
import { CoupleSelector } from "./CoupleSelector";
import { LiveTableStatus } from "./LiveTableStatus";

interface LiveTablePanelProps {
  initialTournament: TournamentFull;
}

/**
 * Player-facing "find your table" panel for an ongoing tournament.
 *
 * Composition root that wires together the live tournament data (realtime), the
 * persisted couple selection and the pure status derivation. Each concern lives in its
 * own unit; this component only orchestrates them.
 */
export function LiveTablePanel({ initialTournament }: LiveTablePanelProps) {
  const { tournament } = useTournamentRealtime(initialTournament);
  const { coupleId, select, clear } = useSelectedCouple(initialTournament.short_id);

  const sortedCouples = useMemo(
    () => [...tournament.couples].sort((a, b) => a.couple_number - b.couple_number),
    [tournament.couples]
  );

  const selectedCouple = coupleId
    ? sortedCouples.find((c) => c.id === coupleId) ?? null
    : null;

  return (
    <div className="mb-8">
      {selectedCouple ? (
        <LiveTableStatus
          couple={selectedCouple}
          status={deriveCoupleLiveStatus(tournament, selectedCouple.id)}
          onChange={clear}
        />
      ) : (
        <CoupleSelector couples={sortedCouples} onSelect={select} />
      )}
    </div>
  );
}
