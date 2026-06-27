"use client"

import { useState, useEffect, useRef, useCallback } from "react";
import { MatchWithCouples } from "@/types";
import BracketMatchCard from "./BracketMatchCard";
import { TournamentQr } from "./TournamentQr";

interface Props {
  matches: MatchWithCouples[];
  activeRound: number;
  shortId: string;
}

interface SVGConnection {
  id: string;
  path: string;
  isActive: boolean;
  isDashed: boolean;
}

interface BracketColumn {
  key: string;
  round: number;
  side: "left" | "center" | "right";
  label: string;
}

const getRoundLabel = (round: number, totalRounds: number): string => {
  if (round === 1) return "Finales";
  if (round === 2) return "Semifinales";
  if (round === 3) return "Cuartos";
  if (round === 4) return "Octavos";
  if (round === 5) return "Dieciseisavos";
  if (round === 6) return "Treintaidosavos";
  return `Ronda ${totalRounds - round + 1}`;
};


export default function TVBracketView({ matches, activeRound, shortId }: Props) {
  const [connections, setConnections] = useState<SVGConnection[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract main (non-consolation) matches to calculate the round structure
  const mainMatches = matches.filter((m) => !m.is_consolation);
  const totalRounds = Math.max(...mainMatches.map((m) => m.round), 1);

  // Build the symmetric column layout
  const columns: BracketColumn[] = [];
  if (totalRounds === 1) {
    columns.push({
      key: "center-1",
      round: 1,
      side: "center",
      label: "Finales",
    });
  } else {
    // Left columns: from totalRounds down to 2
    for (let r = totalRounds; r >= 2; r--) {
      columns.push({
        key: `left-${r}`,
        round: r,
        side: "left",
        label: getRoundLabel(r, totalRounds),
      });
    }

    // Center column: Round 1
    columns.push({
      key: "center-1",
      round: 1,
      side: "center",
      label: "Finales",
    });

    // Right columns: from 2 up to totalRounds
    for (let r = 2; r <= totalRounds; r++) {
      columns.push({
        key: `right-${r}`,
        round: r,
        side: "right",
        label: getRoundLabel(r, totalRounds),
      });
    }
  }

  // Get matches belonging to a specific side and round
  const getColumnMatches = useCallback((col: BracketColumn) => {
    if (col.side === "center") {
      return matches
        .filter((m) => m.round === 1)
        .sort((a, b) => {
          if (a.is_consolation !== b.is_consolation) {
            return a.is_consolation ? 1 : -1;
          }
          return (a.row_index ?? 0) - (b.row_index ?? 0);
        });
    }

    const roundMatches = matches.filter((m) => m.round === col.round && !m.is_consolation);
    const boundary = Math.pow(2, col.round - 2);

    if (col.side === "left") {
      return roundMatches
        .filter((m) => (m.row_index ?? 1) <= boundary)
        .sort((a, b) => (a.row_index ?? 0) - (b.row_index ?? 0));
    } else {
      return roundMatches
        .filter((m) => (m.row_index ?? 1) > boundary)
        .sort((a, b) => (a.row_index ?? 0) - (b.row_index ?? 0));
    }
  }, [matches]);

  const updateConnections = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newConnections: SVGConnection[] = [];

    matches.forEach((match) => {
      // Helper to check if a match is rendered on the Right side of the butterfly
      const isRightSide = match.round > 1 && (match.row_index ?? 1) > Math.pow(2, match.round - 2);

      // 1. Connect to next match (winner progression)
      if (match.next_match_id) {
        const childEl = document.getElementById(`bracket-match-${match.id}`);
        const parentEl = document.getElementById(`bracket-match-${match.next_match_id}`);
        const parentMatch = matches.find((m) => m.id === match.next_match_id);

        if (childEl && parentEl && parentMatch) {
          const childRect = childEl.getBoundingClientRect();
          const parentRect = parentEl.getBoundingClientRect();

          // Symmetrical X coordinates calculation
          const x1 = isRightSide
            ? childRect.left - containerRect.left
            : childRect.right - containerRect.left;
          const x2 = isRightSide
            ? parentRect.right - containerRect.left
            : parentRect.left - containerRect.left;

          const y1 = childRect.top + childRect.height / 2 - containerRect.top;
          const y2 = parentRect.top + parentRect.height / 2 - containerRect.top;

          const path = `M ${x1} ${y1} L ${x2} ${y2}`;

          const isActive = !!(
            match.winner_id &&
            (parentMatch.couple1_id === match.winner_id || parentMatch.couple2_id === match.winner_id)
          );

          newConnections.push({
            id: `${match.id}-to-next`,
            path,
            isActive,
            isDashed: false,
          });
        }
      }

      // 2. Connect to loser match (consolation drop-down)
      if (match.loser_match_id) {
        const childEl = document.getElementById(`bracket-match-${match.id}`);
        const parentEl = document.getElementById(`bracket-match-${match.loser_match_id}`);
        const loserMatch = matches.find((m) => m.id === match.loser_match_id);

        if (childEl && parentEl && loserMatch) {
          const childRect = childEl.getBoundingClientRect();
          const parentRect = parentEl.getBoundingClientRect();

          // Symmetrical X coordinates calculation for consolation connections
          const x1 = isRightSide
            ? childRect.left - containerRect.left
            : childRect.right - containerRect.left;
          const x2 = isRightSide
            ? parentRect.right - containerRect.left
            : parentRect.left - containerRect.left;

          const y1 = childRect.top + childRect.height / 2 - containerRect.top;
          const y2 = parentRect.top + parentRect.height / 2 - containerRect.top;

          const path = `M ${x1} ${y1} L ${x2} ${y2}`;

          const loserId = match.winner_id
            ? match.winner_id === match.couple1_id
              ? match.couple2_id
              : match.couple1_id
            : null;

          const isActive = !!(
            match.winner_id &&
            loserId &&
            (loserMatch.couple1_id === loserId || loserMatch.couple2_id === loserId)
          );

          newConnections.push({
            id: `${match.id}-to-loser`,
            path,
            isActive,
            isDashed: true,
          });
        }
      }
    });

    setConnections(newConnections);
  }, [matches]);

  useEffect(() => {
    const timer = setTimeout(updateConnections, 100);

    const handleResize = () => {
      updateConnections();
    };

    window.addEventListener("resize", handleResize);

    const observer = new MutationObserver(() => {
      updateConnections();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [updateConnections]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[500px] flex flex-row justify-between items-center p-6 bg-zinc-50/50 rounded-xl border border-zinc-200/60 overflow-hidden"
    >
      {/* SVG Canvas Overlay */}
      <svg className="absolute inset-0 pointer-events-none w-full h-full z-0">
        {connections.map((conn) => (
          <path
            key={conn.id}
            d={conn.path}
            fill="none"
            stroke={conn.isActive ? "#33AD6A" : "#EAEAEA"}
            strokeWidth={2}
            strokeDasharray={conn.isDashed ? "4,4" : undefined}
            className="transition-all duration-500"
          />
        ))}
      </svg>

      {/* Symmetrical Columns */}
      {(() => {
        const visibleColumns = columns.filter((col) => {
          // Always show Center (Finals) and Semifinals (Round 2)
          if (col.side === "center" || col.round <= 2) return true;
          // Show older rounds only if they are the active round or at most 1 round in the past
          return col.round <= activeRound + 1;
        });

        return visibleColumns.map((col) => {
          const columnMatches = getColumnMatches(col);
          const isFinalRound = col.round === 1;

          return (
            <div
              key={col.key}
              className="flex flex-col justify-around h-full flex-1 items-center z-10 select-none"
            >
              <div className="text-xs font-black tracking-widest text-zinc-500 uppercase mb-4 shrink-0">
                {col.label}
              </div>

              <div
                className={`flex flex-col justify-around flex-1 w-full items-center ${
                  isFinalRound ? "gap-8 justify-center" : ""
                }`}
              >
                {columnMatches.map((match) => (
                  <BracketMatchCard
                    key={match.id}
                    match={match}
                    matchesCount={columnMatches.length}
                  />
                ))}
              </div>
            </div>
          );
        });
      })()}

      {/* Acquisition QR centered at the bottom, over the empty central space. */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
        <TournamentQr shortId={shortId} />
      </div>
    </div>
  );
}