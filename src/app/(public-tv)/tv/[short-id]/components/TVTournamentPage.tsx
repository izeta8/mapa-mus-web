"use client"

import { ViewMode, TournamentFull } from "@/types/database";
import TVBracketView from "./TVBracketView";
import TVHeader from "./TVHeader";
import TVMatchupView from "./TVMatchupView";
import { useState } from "react";
import { useTournamentRealtime } from "../hooks/use-tournament-realtime";

interface Props {
  tournament: TournamentFull
}

export default function TVTournamentPage({ tournament: initialTournament }: Props) {
  const { tournament } = useTournamentRealtime(initialTournament);

  const matches = tournament.matches;
  const inscribedCouples = tournament.couples.length;
  const tournamentName = tournament.name;

  const [viewMode, setViewMode] = useState<ViewMode>("matchup");
  // const [viewMode, setViewMode] = useState<ViewMode>(shouldShowMatchupView ? "matchup" : "bracket");
  const isBracketCreated = matches && matches.length > 0;

  // Calcular parejas vivas
  const eliminatedCoupleIds = new Set<string>();
  tournament.matches?.forEach(m => {
    if (m.winner_id && m.couple1_id && m.couple2_id) {
      const loserId = m.winner_id === m.couple1_id ? m.couple2_id : m.couple1_id;
      eliminatedCoupleIds.add(loserId);
    }
  });
  const aliveCouples = inscribedCouples - eliminatedCoupleIds.size;
  
  return (
    <div className="h-screen bg-zinc-50 text-black p-4 flex flex-col ">

      <TVHeader 
        tournamentName={tournamentName} 
        viewMode={viewMode}
        setViewMode={setViewMode} 
        inscribedCouples={inscribedCouples}
        aliveCouples={aliveCouples}
        isBracketCreated={isBracketCreated}
      />

      {!isBracketCreated ? (
        <div className=" h-full w-full flex justify-center items-center">
          <a className="text-3xl">El cuadro no ha sido generado</a>
        </div>
      ) : (
        <>
        <div className="flex-1 overflow-hidden">
          {viewMode === "matchup" ? (
            <TVMatchupView matches={matches} tournament={tournament} />
          ) : (
            <TVBracketView 
              matches={matches} 
              activeRound={tournament.current_round || Math.max(...matches.map(m => m.round), 1)} 
            />
          )}
        </div>
        </>

      )}

    </div>
  );
}