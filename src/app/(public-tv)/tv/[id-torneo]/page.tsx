"use client";

import { useState, use } from "react";
import { ViewMode, Partido, Ronda } from "@/types/tournament";
import { mockPartidos, mockByes, NUM_PAREJAS, DEBE_MOSTRAR_LISTA } from "@/data/mock-tournament";

interface Props {
  params: Promise<{ "id-torneo": string }>;
}

export default function TVTournamentPage({ params }: Props) {
  const { "id-torneo": idTorneo } = use(params);
  const [viewMode, setViewMode] = useState<ViewMode>(DEBE_MOSTRAR_LISTA ? "lista" : "bracket");

  return (
    <div className="h-screen bg-zinc-50 text-black p-4 flex flex-col">
      <header className="flex justify-between items-center shrink-0 mb-4">
        <div className="flex items-center gap-4">
          <div className="bg-black text-white px-4 py-2">
            <h1 className="text-3xl font-black tracking-tight">TORNEO #{idTorneo}</h1>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-zinc-500">TOTAL PAREJAS</span>
            <span className="text-2xl font-black text-zinc-700">{NUM_PAREJAS}</span>
          </div>
        </div>
        <button
          onClick={() => setViewMode(viewMode === "lista" ? "bracket" : "lista")}
          className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 font-bold text-sm transition-colors"
        >
          {viewMode === "lista" ? "Ver Árbol" : "Ver Lista"}
        </button>
      </header>

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

function getFontSize(totalItems: number, type: "partido" | "bye"): { container: string; numero: string; mesa: string; vs: string; badge: string } {
  const cardWidth = totalItems <= 8 ? "w-44" : totalItems <= 16 ? "w-40" : totalItems <= 32 ? "w-36" : totalItems <= 48 ? "w-32" : totalItems <= 64 ? "w-28" : "w-24";

  if (type === "partido") {
    if (totalItems <= 8) return { container: `${cardWidth} px-6 py-4`, numero: "text-6xl", mesa: "text-lg", vs: "text-base", badge: "text-sm" };
    if (totalItems <= 16) return { container: `${cardWidth} px-5 py-3`, numero: "text-5xl", mesa: "text-base", vs: "text-sm", badge: "text-xs" };
    if (totalItems <= 32) return { container: `${cardWidth} px-4 py-2`, numero: "text-4xl", mesa: "text-sm", vs: "text-xs", badge: "text-xs" };
    if (totalItems <= 48) return { container: `${cardWidth} px-3 py-2`, numero: "text-3xl", mesa: "text-xs", vs: "text-[10px]", badge: "text-[10px]" };
    if (totalItems <= 64) return { container: `${cardWidth} px-2 py-1`, numero: "text-2xl", mesa: "text-[10px]", vs: "text-[8px]", badge: "text-[8px]" };
    return { container: `${cardWidth} px-2 py-1`, numero: "text-xl", mesa: "text-[8px]", vs: "text-[6px]", badge: "text-[6px]" };
  } else {
    if (totalItems <= 8) return { container: `${cardWidth} px-5 py-3`, numero: "text-5xl", mesa: "text-base", vs: "text-base", badge: "text-sm" };
    if (totalItems <= 16) return { container: `${cardWidth} px-4 py-2`, numero: "text-4xl", mesa: "text-sm", vs: "text-sm", badge: "text-xs" };
    if (totalItems <= 32) return { container: `${cardWidth} px-3 py-2`, numero: "text-3xl", mesa: "text-xs", vs: "text-xs", badge: "text-xs" };
    if (totalItems <= 48) return { container: `${cardWidth} px-2 py-1`, numero: "text-2xl", mesa: "text-[10px]", vs: "text-[10px]", badge: "text-[10px]" };
    if (totalItems <= 64) return { container: `${cardWidth} px-2 py-1`, numero: "text-xl", mesa: "text-[10px]", vs: "text-[8px]", badge: "text-[8px]" };
    return { container: `${cardWidth} px-2 py-0.5`, numero: "text-lg", mesa: "text-[8px]", vs: "text-[6px]", badge: "text-[6px]" };
  }
}

function TVListaViewCompact() {
  const rondaActual = "1/32";
  const partidosRonda = mockPartidos.filter(p => p.ronda === rondaActual);
  const byes = mockByes.filter(p => p.ronda === rondaActual);

  const partidoStyles = getFontSize(partidosRonda.length, "partido");
  const byeStyles = getFontSize(byes.length, "bye");

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex flex-wrap gap-3">
        {partidosRonda.map((partido) => (
          <div
            key={partido.id}
            className={`flex flex-col items-center border-2 border-black bg-white shadow-md ${partidoStyles.container}`}
          >
            <div className={`font-bold text-zinc-400 mb-1 ${partidoStyles.mesa}`}>MESA {partido.mesa}</div>
            <div className="flex items-center gap-3">
              <span className={`font-black text-zinc-900 ${partidoStyles.numero}`}>{partido.parejaA}</span>
              <span className={`font-bold text-zinc-300 ${partidoStyles.vs}`}>vs</span>
              <span className={`font-black text-zinc-900 ${partidoStyles.numero}`}>{partido.parejaB}</span>
            </div>
          </div>
        ))}
      </div>

      {byes.length > 0 && (
        <div className="mt-6 flex gap-4">
          <div className="border-4 border-black bg-zinc-100 p-4 flex flex-col justify-center">
            <div className="bg-zinc-800 text-white px-4 py-2 mb-3 inline-block">
              <span className="text-xl font-black">PASAN DIRECTO</span>
              <span className="text-xl font-black text-zinc-300 italic"> ({byes.length} PAREJAS)</span>              
            </div>
            <div className="flex flex-wrap gap-2">
              {byes.map((bye) => (
                <div
                  key={bye.id}
                  className={`border border-zinc-400 bg-white text-center ${byeStyles.container}`}
                >
                  <span className={`font-black text-zinc-800 ${byeStyles.numero}`}>{bye.pareja}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-48 shrink-0 flex flex-col items-center justify-center gap-3 border-4 border-black bg-white p-4">
            <div className="w-28 h-28 border-4 border-black flex items-center justify-center">
              <span className="text-xs font-bold text-zinc-400">QR</span>
            </div>
            <span className="text-lg font-black text-center">ESCÁNEAME</span>
            <span className="text-lg font-black text-zinc-500 text-center">Y consulta tu mesa en la app</span>
          </div>
        </div>
      )}
    </div>
  );
}

function TVBracketViewFull({ partidos }: { partidos: Partido[] }) {
  const getPartidos = (ronda: Ronda) => partidos.filter(p => p.ronda === ronda);
  
  const ronda16 = getPartidos("1/16");
  const ronda8 = getPartidos("1/8");
  const ronda4 = getPartidos("1/4");
  const ronda2 = getPartidos("1/2");
  const final = getPartidos("Final");

  return (
    <div className="w-full h-full flex items-center justify-center gap-2">
      <div className="flex flex-col gap-2 flex-[3] min-w-0">
        <div className="bg-zinc-300 text-center py-1">
          <span className="font-black text-sm">1/16</span>
        </div>
        {ronda16.map((p) => (
          <div key={p.id} className="border border-black bg-white px-2 py-1 flex justify-between items-center">
            <span className={`font-black ${p.ganador === "A" ? "bg-black text-white px-2" : ""}`}>
              {p.parejaA}
            </span>
            <span className="font-bold text-zinc-400 text-xs">M{p.mesa}</span>
            <span className={`font-black ${p.ganador === "B" ? "bg-black text-white px-2" : ""}`}>
              {p.parejaB}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 flex-[2] min-w-0">
        <div className="bg-zinc-300 text-center py-1">
          <span className="font-black text-sm">1/8</span>
        </div>
        {ronda8.map((p) => (
          <div key={p.id} className="border border-black bg-white px-2 py-1 flex justify-between items-center">
            <span className="font-black">{p.parejaA ?? "-"}</span>
            <span className="font-bold text-zinc-400 text-xs">vs</span>
            <span className="font-black">{p.parejaB ?? "-"}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 flex-[1.5] min-w-0">
        <div className="bg-zinc-300 text-center py-1">
          <span className="font-black text-sm">1/4</span>
        </div>
        {ronda4.map((p) => (
          <div key={p.id} className="border border-black bg-white px-2 py-1 flex justify-between items-center">
            <span className="font-black">{p.parejaA ?? "-"}</span>
            <span className="font-bold text-zinc-400 text-xs">vs</span>
            <span className="font-black">{p.parejaB ?? "-"}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 flex-[1] min-w-0">
        <div className="bg-zinc-400 text-center py-1">
          <span className="font-black text-sm text-white">1/2</span>
        </div>
        {ronda2.map((p) => (
          <div key={p.id} className="border-2 border-black bg-white px-2 py-1 flex justify-between items-center">
            <span className="font-black">{p.parejaA ?? "-"}</span>
            <span className="font-bold text-zinc-400 text-xs">vs</span>
            <span className="font-black">{p.parejaB ?? "-"}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <div className="bg-black text-center py-1">
          <span className="font-black text-sm text-white">FINAL</span>
        </div>
        {final.map((p) => (
          <div key={p.id} className="border-4 border-black bg-white p-2 flex justify-between items-center">
            <span className="font-black text-xl">{p.parejaA ?? "-"}</span>
            <span className="font-bold text-zinc-400 text-sm">vs</span>
            <span className="font-black text-xl">{p.parejaB ?? "-"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}