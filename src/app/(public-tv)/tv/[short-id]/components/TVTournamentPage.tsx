"use client"

import { TournamentFull } from "@/types/database";
import TVBracketView from "./TVBracketView";
import TVHeader from "./TVHeader";
import TVMatchupView from "./TVMatchupView";
import { useEffect, useRef } from "react";
import { useTournamentRealtime } from "@/hooks/use-tournament-realtime";
import { setTvViewMode } from "@/app/actions/tournaments";
import { TournamentQr } from "./TournamentQr";

interface Props {
  tournament: TournamentFull
}

export default function TVTournamentPage({ tournament: initialTournament }: Props) {
  const { tournament } = useTournamentRealtime(initialTournament);

  const matches = tournament.matches;
  const inscribedCouples = tournament.couples.length;
  const tournamentName = tournament.name;

  // Persisted in the DB so the view mode survives a TV browser refresh and can be
  // controlled remotely from the admin panel.
  const viewMode = tournament.tv_view_mode;
  const isBracketCreated = matches && matches.length > 0;

  // current_round counts down from the final (1 = Final, 2 = Semifinal, 3 = Cuartos, 4 = Octavos)
  const previousRoundRef = useRef(tournament.current_round);
  useEffect(() => {
    const previousRound = previousRoundRef.current;
    previousRoundRef.current = tournament.current_round;
    if (previousRound === 4 && tournament.current_round === 3) {
      setTvViewMode(tournament.id, "bracket");
    } else if (previousRound === 3 && tournament.current_round === 4) {
      setTvViewMode(tournament.id, "matchup");
    }
  }, [tournament.id, tournament.current_round]);

  // Calcular parejas vivas
  const eliminatedCoupleIds = new Set<string>();
  tournament.matches?.forEach(m => {
    if (m.winner_id && m.couple1_id && m.couple2_id) {
      const loserId = m.winner_id === m.couple1_id ? m.couple2_id : m.couple1_id;
      eliminatedCoupleIds.add(loserId);
    }
  });
  const aliveCouples = inscribedCouples - eliminatedCoupleIds.size;

  // Dynamic layout & sizes based on couples count to prevent vertical scroll
  const cols = inscribedCouples <= 2 ? 1 : inscribedCouples <= 8 ? 2 : inscribedCouples <= 12 ? 3 : inscribedCouples <= 32 ? 4 : inscribedCouples <= 40 ? 5 : 6;
  const rows = Math.max(1, Math.ceil(inscribedCouples / cols));

  const getLayoutConfig = (r: number) => {
    if (r <= 2) {
      return {
        fontSize: "4.5vh",
        connectorSize: "3vh",
        badgeSize: "7.5vh",
        padding: "1.5vh",
        gapX: "gap-x-12",
        borderWidth: "border-b-4",
      };
    }
    if (r <= 4) {
      return {
        fontSize: "3.5vh",
        connectorSize: "2.2vh",
        badgeSize: "6vh",
        padding: "1.2vh",
        gapX: "gap-x-10",
        borderWidth: "border-b-2",
      };
    }
    if (r <= 6) {
      return {
        fontSize: "2.8vh",
        connectorSize: "1.8vh",
        badgeSize: "5vh",
        padding: "0.8vh",
        gapX: "gap-x-8",
        borderWidth: "border-b-2",
      };
    }
    if (r <= 8) {
      return {
        fontSize: "2.2vh",
        connectorSize: "1.4vh",
        badgeSize: "4.0vh",
        padding: "0.6vh",
        gapX: "gap-x-6",
        borderWidth: "border-b",
      };
    }
    if (r <= 10) {
      return {
        fontSize: "1.8vh",
        connectorSize: "1.2vh",
        badgeSize: "3.2vh",
        padding: "0.4vh",
        gapX: "gap-x-4",
        borderWidth: "border-b",
      };
    }
    return {
      fontSize: "1.4vh",
      connectorSize: "1vh",
      badgeSize: "2.6vh",
      padding: "0.3vh",
      gapX: "gap-x-3",
      borderWidth: "border-b",
    };
  };

  const config = getLayoutConfig(rows);

  return (
    <div className="relative h-screen w-screen bg-white text-black p-6 flex flex-col overflow-hidden select-none">

      <TVHeader
        tournamentName={tournamentName}
        viewMode={viewMode}
        inscribedCouples={inscribedCouples}
        aliveCouples={aliveCouples}
        isBracketCreated={isBracketCreated}
      />

      {!isBracketCreated ? (
        <div className="flex-1 flex flex-col items-stretch justify-start py-2 mt-1 overflow-hidden bg-white min-h-0">
          {inscribedCouples === 0 ? (
            <div className="flex-1 w-full flex flex-col justify-center items-center text-zinc-400 font-bold text-2xl animate-pulse">
              Esperando las primeras inscripciones...
            </div>
          ) : (
            <div
              className={`w-full flex-1 overflow-hidden grid grid-flow-col ${config.gapX} gap-y-2 pr-2 min-h-0`}
              style={{
                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              }}
            >
              {[...tournament.couples]
                .sort((a, b) => a.couple_number - b.couple_number)
                .map((couple) => (
                  <div
                    key={couple.id}
                    className={`${config.borderWidth} border-zinc-100 flex items-center min-w-0`}
                    style={{
                      paddingTop: config.padding,
                      paddingBottom: config.padding,
                      gap: `clamp(0.5rem, 1.5vh, 2rem)`,
                    }}
                  >
                    <span
                      className="font-black text-white bg-[#33AD6A] flex items-center justify-center shrink-0 shadow-xs"
                      style={{
                        width: config.badgeSize,
                        height: config.badgeSize,
                        fontSize: `calc(${config.fontSize} * 1.1)`,
                        borderRadius: `calc(${config.badgeSize} * 0.25)`,
                      }}
                    >
                      {couple.couple_number}
                    </span>
                    <div
                      className="flex items-center min-w-0 flex-1"
                      style={{ gap: `calc(${config.fontSize} * 0.4)` }}
                    >
                      <span
                        className="font-black text-zinc-950 truncate"
                        style={{ fontSize: config.fontSize }}
                      >
                        {couple.player1_name || "—"}
                      </span>
                      <span
                        className="font-black text-zinc-400 shrink-0"
                        style={{ fontSize: config.connectorSize }}
                      >
                        y
                      </span>
                      <span
                        className="font-black text-zinc-950 truncate"
                        style={{ fontSize: config.fontSize }}
                      >
                        {couple.player2_name || "—"}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
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

      {/* Always-visible acquisition QR: scanning opens the player's "find your table" view. */}
      <div className="absolute bottom-6 right-6 z-20">
        <TournamentQr shortId={tournament.short_id} />
      </div>

    </div>
  );
}