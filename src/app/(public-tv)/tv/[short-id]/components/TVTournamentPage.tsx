"use client"

import { Match, ViewMode } from "@/types/database";
import TVBracketView from "./TVBracketView";
import TVHeader from "./TVHeader";
import TVMatchupView from "./TVMatchupView";
import { useState } from "react";

interface Props {
  tournamentName: string,
  matches: Match[],
  inscribedCouples: number
}

export default function TVTournamentPage({ tournamentName, matches, inscribedCouples }: Props) {

  const shouldShowMatchupView = matches.length >= 32;
  const [viewMode, setViewMode] = useState<ViewMode>(shouldShowMatchupView ? "matchup" : "bracket");
  const isBracketCreated = matches && matches.length > 0;
  
  return (
    <div className="h-screen bg-zinc-50 text-black p-4 flex flex-col ">

      <TVHeader 
        tournamentName={tournamentName} 
        viewMode={viewMode}
        setViewMode={setViewMode} 
        inscribedCouples={inscribedCouples}
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
            <TVMatchupView
              matches={matches}
            />
          ) : (
            <TVBracketView 
              matches={matches}
            />
          )}
      </div>
        </>

      )}

    </div>
  );
}