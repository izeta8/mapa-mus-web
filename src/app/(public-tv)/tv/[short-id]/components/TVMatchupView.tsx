"use client"

import { useState, useEffect } from "react";
import { getFontSize } from "../helpers";
import { MatchWithCouples, TournamentFull } from "@/types/database";
import { TournamentQr } from "./TournamentQr";

interface Props {
  matches: MatchWithCouples[],
  tournament: TournamentFull,
}

const getGridDimensions = (count: number) => {
  if (count <= 1) return { cols: 1, rows: 1 };
  if (count <= 2) return { cols: 2, rows: 1 };
  if (count <= 4) return { cols: 2, rows: 2 };
  if (count <= 6) return { cols: 3, rows: 2 };
  if (count <= 8) return { cols: 4, rows: 2 };
  if (count <= 12) return { cols: 4, rows: 3 };
  if (count <= 16) return { cols: 4, rows: 4 };
  if (count <= 20) return { cols: 5, rows: 4 };
  if (count <= 24) return { cols: 6, rows: 4 };
  const cols = Math.ceil(Math.sqrt(count * 1.5));
  const rows = Math.ceil(count / cols);
  return { cols, rows };
};

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

  const byeMatchStyles = getFontSize(byes.length, "bye", dimensions.width, dimensions.height);
  const { cols, rows } = getGridDimensions(playingMatches.length);
  const gridTemplateRows = byes.length > 0 ? "65% 35%" : "1fr auto";

  return (
    <div className="h-full w-full flex flex-col" style={{ display: "grid", gridTemplateRows, gridTemplateColumns: "1fr", gap: "8px", padding: "8px" }}>

      {/* PLAYING COUPLES - 70% */}
      <div
        className="grid justify-center items-center w-full h-full gap-4 p-2 overflow-hidden min-h-0"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
      >
        {playingMatches.map((match) => (
          <div key={match.id} className="w-full h-full flex items-center justify-center overflow-hidden min-h-0 min-w-0">
            <MatchupCard match={match} />
          </div>
        ))}
      </div>

      {/* BOTTOM ROW: byes (when present) + always-visible acquisition QR in its own column */}
      <div className="flex gap-4 overflow-hidden">

        {byes.length > 0 ? (
          /* BYES CONTAINER */
          <div className="border-4 border-black bg-zinc-100 p-3 flex-1 flex flex-col">
            <div className="bg-zinc-800 text-white px-4 py-1 mb-2 shrink-0">
              <span className="text-xl font-black">PASAN DIRECTO</span>
              <span className="text-sm font-black text-zinc-300 italic"> ({byes.length} PAREJAS)</span>
            </div>
            <div className="flex flex-wrap gap-4 overflow-hidden justify-center items-center h-full">
              {byes.map((bye) => (
                <div
                  key={bye.id}
                  className={`border border-zinc-400 bg-white text-center ${byeMatchStyles.container}`}
                >
                  <span className={`font-black text-zinc-800 text-3xl ${byeMatchStyles.numero}`}>{bye.couple1?.couple_number}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {/* The QR sits in its own column, bottom-aligned, so it never covers the byes list */}
        <div className="shrink-0 self-end">
          <TournamentQr shortId={tournament.short_id} />
        </div>

      </div>

    </div>
  );
}

interface MatchupCardProps {
  match: MatchWithCouples
}

export const MatchupCard = ({ match }: MatchupCardProps) => {

  if (match.couple1 === null && match.couple2 === null) {
    return null;
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
    <div className="flex flex-col items-center justify-center w-full h-full max-w-[380px] max-h-[253px] aspect-[3/2] overflow-hidden select-none p-1">
      {isRound1 && badgeText && (
        <span
          className={`px-3 py-0.5 rounded-full border font-black uppercase tracking-wide text-center shrink-0 mb-1 ${badgeStyles}`}
          style={{ fontSize: "clamp(10px, 3cqw, 20px)" }}
        >
          {badgeText}
        </span>
      )}
      <div
        className={`flex flex-col items-center justify-center border-2 ${cardBorderClass} bg-white shadow-md aspect-[3/2] w-full h-full transition-all duration-500`}
        style={{
          containerType: "size",
          ...splitBackground,
        }}
      >
        <div
          className={`font-bold ${hasWinner ? 'text-zinc-700' : 'text-zinc-400'} mb-1`}
          style={{ fontSize: "8cqw", lineHeight: 1 }}
        >
          MESA {match.table_number}
        </div>
        <div className="grid grid-cols-3 text-center items-center w-full" style={{ gap: "2cqw" }}>
          <span
            className="font-black text-zinc-900 transition-transform truncate px-1"
            style={{ fontSize: "18cqw", lineHeight: 1 }}
          >
            {match.couple1?.couple_number}
          </span>
          <span
            className={`font-bold ${hasWinner ? 'text-zinc-600' : 'text-zinc-300'}`}
            style={{ fontSize: "8cqw", lineHeight: 1 }}
          >
            vs
          </span>
          <span
            className="font-black text-zinc-900 transition-transform truncate px-1"
            style={{ fontSize: "18cqw", lineHeight: 1 }}
          >
            {match.couple2?.couple_number}
          </span>
        </div>
      </div>
    </div>
  )
}