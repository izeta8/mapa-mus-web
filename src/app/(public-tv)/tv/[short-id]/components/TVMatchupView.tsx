"use client"

import { useState, useEffect } from "react";
import { getFontSize } from "../helpers";
import { MatchWithCouples, TournamentFull } from "@/types/database";
import { MatchupCardStyles } from "@/types";

interface Props {
  matches: MatchWithCouples[],
  tournament: TournamentFull,
}

export default function TVMatchupView({ matches, tournament }: Props) {

  // TV now follows the organizer's current_round
  const activeRound = tournament.current_round || Math.max(...matches.map(m => m.round), 1);

  // Filter matches to show only those from the current TV round
  const currentRoundMatches = matches.filter(m => m.round === activeRound);

  // Matches being played (have two couples)
  const playingMatches = currentRoundMatches.filter(m => !m.is_bye && m.couple1 && m.couple2).sort((a, b) => Number(a.table_number) - Number(b.table_number));

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

  const playingMatchStyles = getFontSize(playingMatches.length, "partido", dimensions.width, dimensions.height * 0.65);
  const byeMatchStyles = getFontSize(byes.length, "bye", dimensions.width, dimensions.height);

  return (
    <div className="h-full w-full flex flex-col" style={{ display: "grid", gridTemplateRows: "65% 35%", gridTemplateColumns: "1fr", gap: "8px", padding: "8px" }}>

      {/* PLAYING COUPLES - 70% */}
      <div className="flex flex-wrap gap-3 justify-evenly items-center content-center h-full">
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
              <span className="text-m font-black">PASAN DIRECTO</span>
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

export const MatchupCard = ({ match, playingMatchStyles }: MatchupCardProps) => {

  if (match.couple1 === null && match.couple2 === null) {
    return
  }

  const hasWinner = !!match.winner_id;
  const isWinner1 = hasWinner && match.winner_id === match.couple1_id;
  const isWinner2 = hasWinner && match.winner_id === match.couple2_id;

  const winnerColor = "#b6f3bb";
  const loserColor = "#fecaca";

  const splitBackground = hasWinner ? {
    background: `linear-gradient(to right, ${isWinner1 ? winnerColor : loserColor} 50%, ${isWinner2 ? winnerColor : loserColor} 50%)`
  } : {};

  // Badge calculations for classification matches in Round 1
  const isRound1 = match.round === 1;
  let badgeText = "";
  let badgeStyles = "";
  let cardBorderClass = "border-black";

  if (isRound1) {
    if (!match.is_consolation) {
      badgeText = "🏆 GRAN FINAL (1º/2º)";
      badgeStyles = "bg-amber-100 text-amber-800 border-amber-300";
      cardBorderClass = "border-amber-500 shadow-lg shadow-amber-500/10";
    } else {
      const rowIndex = match.row_index ?? 2;
      if (rowIndex === 2) {
        badgeText = "🥉 3er y 4º PUESTO";
        badgeStyles = "bg-zinc-100 text-zinc-700 border-zinc-300";
        cardBorderClass = "border-zinc-400 shadow-sm";
      } else {
        badgeText = `🏅 ${2 * rowIndex - 1}º y ${2 * rowIndex}º PUESTO`;
        badgeStyles = "bg-zinc-100 text-zinc-600 border-zinc-200";
        cardBorderClass = "border-zinc-300 shadow-sm";
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {isRound1 && badgeText && (
        <span className={`px-3 py-1 rounded-full border font-black uppercase tracking-wide text-center shrink-0 ${badgeStyles} ${playingMatchStyles.badge}`}>
          {badgeText}
        </span>
      )}
      <div
        className={`flex flex-col items-center justify-center border-2 ${cardBorderClass} bg-white shadow-md aspect-3/2 transition-all duration-500 ${playingMatchStyles.container}`}
        style={splitBackground}
      >
        <div className={`font-bold ${hasWinner ? 'text-zinc-700' : 'text-zinc-400'} mb-1 ${playingMatchStyles.mesa}`}>MESA {match.table_number}</div>
        <div className="grid grid-cols-3 text-center items-center gap-3">
          <span className={`font-black text-zinc-900 ${playingMatchStyles.numero} transition-transform`}>
            {match.couple1?.couple_number}
          </span>
          <span className={`font-bold  ${playingMatchStyles.vs} ${hasWinner ? 'text-zinc-600' : 'text-zinc-300'} `}>vs</span>
          <span className={`font-black text-zinc-900 ${playingMatchStyles.numero} transition-transform`}>
            {match.couple2?.couple_number}
          </span>
        </div>
      </div>
    </div>
  )

}