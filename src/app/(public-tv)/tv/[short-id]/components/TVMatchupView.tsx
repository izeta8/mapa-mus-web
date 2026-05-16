"use client"

import { useState, useEffect } from "react";
import { getFontSize } from "../helpers";
import { MatchWithCouples } from "@/types/database";
import { MatchupCardStyles } from "@/types";

interface Props {
  matches: MatchWithCouples[],
}

export default function TVMatchupView({matches}: Props) {
  
  // The active round is the highest round (furthest from the final) that still has matches
  // that are not completed (or the first round if everything is just starting).
  const activeRound = Math.max(...matches.filter(m => m.status !== 'completed' || m.is_bye).map(m => m.round), 1);

  // Filter matches to show ONLY those from the round that should be displayed on TV
  const currentRoundMatches = matches.filter(m => m.round === activeRound);

  // Matches being played (have two couples)
  const playingMatches = currentRoundMatches.filter(m => !m.is_bye && m.couple1 && m.couple2);
  
  // Couples that advance directly in THIS ROUND (are byes at this level)
  const byes = currentRoundMatches.filter(m => m.is_bye && m.couple1).sort((a, b) => Number(a.couple1?.couple_number) - Number(b.couple1?.couple_number))

  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({ width: window.innerWidth - 32, height: window.innerHeight - 150 });
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const playingMatchStyles = getFontSize(playingMatches.length, "partido", dimensions.width);
  const byeMatchStyles     = getFontSize(byes.length, "bye", dimensions.width, dimensions.height);

  return (
    <div className="h-full w-full flex flex-col" style={{ display: "grid", gridTemplateRows: "65% 35%", gridTemplateColumns: "1fr", gap: "8px", padding: "8px" }}>
      
      {/* PLAYING COUPLES - 70% */}
      <div className="flex flex-wrap gap-3 justify-evenly">
        {playingMatches.map((match) => (
          <MatchupCard 
            key={match.id}
            match={match}
            playingMatchStyles={playingMatchStyles}
          />
        ))}
      </div>

      {/* BYES COUPLES - 30% */}
      {byes.length > 0 && (
        <div className="flex gap-4 overflow-hidden">
          
          {/* BYES CONTAINER */}
          <div className="border-4 border-black bg-zinc-100 p-3 flex-1 flex flex-col">
            <div className="bg-zinc-800 text-white px-4 py-1 mb-2 shrink-0">
              <span className="text-sm font-black">PASAN DIRECTO</span>
              <span className="text-sm font-black text-zinc-300 italic"> ({byes.length} PAREJAS)</span>              
            </div>
            <div className="flex flex-wrap gap-2 overflow-hidden justify-center items-center h-full">
              {byes.map((bye) => (
                <div
                  key={bye.id}
                  className={`border border-zinc-400 bg-white text-center ${byeMatchStyles.container}`}
                >
                  <span className={`font-black text-zinc-800 text-xl ${byeMatchStyles.numero}`}>{bye.couple1?.couple_number}</span>
                </div>
              ))}
            </div>
          </div>
            
          {/* QR CONTAINER */}
          <div className="w-36 shrink-0 flex flex-col items-center justify-center gap-2 border-4 border-black bg-white p-2">
            <div className="w-28 h-28 border-2 border-black flex items-center justify-center">
              <span className="text-xl font-bold text-zinc-400">QR</span>
            </div>
            <span className="text-xs font-black text-center">ESCÁNEAME</span>
            <span className="text-sm font-bold  text-zinc-500 text-center">Busca tu mesa en la app</span>
          </div>
          
        </div>
      )}

    </div>
  );
}

interface MatchupCardProps {
  match: MatchWithCouples,
  playingMatchStyles: MatchupCardStyles
}

export const MatchupCard = ({match, playingMatchStyles}: MatchupCardProps) => {

  if (match.couple1 === null && match.couple2 === null) {
    return
  }

  return (
    <div
      className={`flex flex-col items-center justify-center border-2 border-black bg-white shadow-md ${playingMatchStyles.container}`}
    >
      <div className={`font-bold text-zinc-400 mb-1 ${playingMatchStyles.mesa}`}>MESA {match.table_number}</div>
      <div className="flex items-center gap-3">
        <span className={`font-black text-zinc-900 ${playingMatchStyles.numero}`}>{match.couple1?.couple_number}</span>
        <span className={`font-bold text-zinc-300 ${playingMatchStyles.vs}`}>vs</span>
        <span className={`font-black text-zinc-900 ${playingMatchStyles.numero}`}>{match.couple2?.couple_number}</span>
      </div>
    </div>
  )

}