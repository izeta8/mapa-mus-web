import { CoupleInfo, MatchWithCouples, TournamentFull } from "@/types/database";

/**
 * Live state of a single couple within an ongoing tournament. Pure domain model with
 * no UI concerns, derived solely from the tournament data so it can be unit tested.
 */
export type CoupleLiveStatus =
  | { kind: "not_started"; coupleNumber: number }
  | { kind: "playing"; tableNumber: MatchWithCouples["table_number"]; opponent: CoupleInfo | null }
  | { kind: "bye" }
  | { kind: "won_round" }
  | { kind: "champion" }
  | { kind: "eliminated" }
  | { kind: "waiting" };

/**
 * Derives the live status of a couple from the current tournament snapshot.
 *
 * Round numbering counts down to the final (1 = Final, 2 = Semifinal, ...), matching
 * `tournament.current_round` and the TV view.
 */
export function deriveCoupleLiveStatus(
  tournament: TournamentFull,
  coupleId: string
): CoupleLiveStatus {
  const matches = tournament.matches ?? [];
  const couple = tournament.couples.find((c) => c.id === coupleId);

  if (matches.length === 0) {
    return { kind: "not_started", coupleNumber: couple?.couple_number ?? 0 };
  }

  const activeRound =
    tournament.current_round ?? Math.max(...matches.map((m) => m.round), 1);

  const currentMatch = matches.find(
    (m) =>
      m.round === activeRound &&
      (m.couple1_id === coupleId || m.couple2_id === coupleId)
  );

  if (currentMatch) {
    if (currentMatch.is_bye) {
      return { kind: "bye" };
    }

    const isCouple1 = currentMatch.couple1_id === coupleId;
    const opponent = isCouple1 ? currentMatch.couple2 : currentMatch.couple1;

    if (!currentMatch.winner_id) {
      return { kind: "playing", tableNumber: currentMatch.table_number, opponent };
    }

    if (currentMatch.winner_id === coupleId) {
      return activeRound === 1 ? { kind: "champion" } : { kind: "won_round" };
    }

    return { kind: "eliminated" };
  }

  // The couple is not in the active round: either it lost in a previous round, it has
  // already won the final, or it advanced and is waiting for the next pairing.
  const lostPastMatch = matches.find(
    (m) =>
      m.winner_id != null &&
      m.winner_id !== coupleId &&
      (m.couple1_id === coupleId || m.couple2_id === coupleId)
  );
  if (lostPastMatch) {
    return { kind: "eliminated" };
  }

  const wonFinal = matches.find((m) => m.round === 1 && m.winner_id === coupleId);
  if (wonFinal) {
    return { kind: "champion" };
  }

  return { kind: "waiting" };
}

/**
 * Human-readable couple label in the agreed format: "15. Julen Izeta - Gorka Goikoetxea".
 */
export function formatCoupleLabel(couple: {
  couple_number: number;
  player1_name: string | null;
  player2_name: string | null;
}): string {
  const player1 = couple.player1_name?.trim() || "Jugador 1";
  const player2 = couple.player2_name?.trim() || "Jugador 2";
  return `${couple.couple_number}. ${player1} - ${player2}`;
}
