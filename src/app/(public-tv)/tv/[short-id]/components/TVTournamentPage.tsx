"use client"

import { ViewMode } from "@/types/database";
import TVBracketViewFull from "./TVBracketViewFull";
import TVHeader from "./TVHeader";
import TVListaViewCompact from "./TVListaViewCompact";
import { mockPartidos, NUM_PAREJAS, DEBE_MOSTRAR_LISTA } from "@/data/mock-tournament";
import { useState } from "react";

interface Props {
  tournamentName: string,
}

export default function TVTournamentPage({ tournamentName }: Props) {

  const [viewMode, setViewMode] = useState<ViewMode>(DEBE_MOSTRAR_LISTA ? "lista" : "bracket");

  return (
    <div className="h-screen bg-zinc-50 text-black p-4 flex flex-col ">
      <TVHeader 
        tournamentName={tournamentName} 
        setViewMode={setViewMode} 
        numParejas={NUM_PAREJAS}
      />

      <div className="flex-1 overflow-hidden">
        {viewMode === "lista" ? (
          <TVListaViewCompact />
        ) : (
          <TVBracketViewFull partidos={mockPartidos} />
        )}
      </div>
    </div>
  );
}