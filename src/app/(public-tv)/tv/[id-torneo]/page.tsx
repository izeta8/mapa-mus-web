"use client";

import { useState, use, useEffect } from "react";
import { ViewMode, Partido, Ronda } from "@/types/tournament";
import { mockPartidos, mockByes, NUM_PAREJAS, DEBE_MOSTRAR_LISTA } from "@/data/mock-tournament";

interface Props {
  params: Promise<{ "id-torneo": string }>;
}

export default function TVTournamentPage({ params }: Props) {
  const { "id-torneo": idTorneo } = use(params);
  const [viewMode, setViewMode] = useState<ViewMode>(DEBE_MOSTRAR_LISTA ? "lista" : "bracket");

  return (
    <div className="h-screen bg-zinc-50 text-black p-4 flex flex-col ">
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

function getFontSize(totalItems: number, type: "partido" | "bye", containerWidth: number, containerHeight?: number): { container: string; numero: string; mesa: string; vs: string; badge: string } {
  const gap = 12;
  
  const isBye = type === "bye";
  const itemsPerRow = isBye ? 12 : Math.ceil(Math.sqrt(totalItems * 1.5));
  const rows = Math.ceil(totalItems / itemsPerRow);
  
  let cardWidth: number;
  if (isBye && containerHeight) {
    const maxRows = 2;
    const maxRowsHeight = containerHeight * 0.25;
    const rowHeight = 60;
    const actualRows = Math.min(rows, maxRows);
    const availableRowsHeight = maxRowsHeight - (actualRows * gap);
    const cardHeight = availableRowsHeight / actualRows;
    cardWidth = Math.min(80, cardHeight * 1.2);
  } else {
    const availableWidth = containerWidth - (itemsPerRow * gap) - (gap * 2);
    cardWidth = Math.max(80, Math.min(280, Math.floor(availableWidth / itemsPerRow)));
  }
  
  const widthClass = cardWidth <= 80 ? "w-16" : cardWidth <= 100 ? "w-20" : cardWidth <= 120 ? "w-24" : cardWidth <= 140 ? "w-28" : cardWidth <= 160 ? "w-32" : cardWidth <= 180 ? "w-36" : cardWidth <= 200 ? "w-40" : "w-44";
  
  const sizes = {
    "w-16": { num: "text-sm", mesa: "text-[6px]", vs: "text-[4px]", badge: "text-[6px]", px: "px-1", py: "py-0.5" },
    "w-20": { num: "text-base", mesa: "text-[8px]", vs: "text-[6px]", badge: "text-[8px]", px: "px-1", py: "py-0.5" },
    "w-24": { num: "text-lg", mesa: "text-[8px]", vs: "text-[8px]", badge: "text-[8px]", px: "px-2", py: "py-0.5" },
    "w-28": { num: "text-xl", mesa: "text-[10px]", vs: "text-[8px]", badge: "text-[10px]", px: "px-2", py: "py-1" },
    "w-32": { num: "text-2xl", mesa: "text-xs", vs: "text-[10px]", badge: "text-xs", px: "px-3", py: "py-1" },
    "w-36": { num: "text-2xl", mesa: "text-sm", vs: "text-xs", badge: "text-sm", px: "px-3", py: "py-1" },
    "w-40": { num: "text-3xl", mesa: "text-base", vs: "text-sm", badge: "text-base", px: "px-4", py: "py-2" },
    "w-44": { num: "text-4xl", mesa: "text-base", vs: "text-sm", badge: "text-base", px: "px-4", py: "py-2" },
  };

  const size = sizes[widthClass as keyof typeof sizes] || sizes["w-24"];
  return { container: `${widthClass} ${size.px} ${size.py}`, numero: size.num, mesa: size.mesa, vs: size.vs, badge: size.badge };
}

function TVListaViewCompact() {
  const rondaActual = "1/32";
  const partidosRonda = mockPartidos.filter(p => p.ronda === rondaActual);
  const byes = mockByes.filter(p => p.ronda === rondaActual);

  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({ width: window.innerWidth - 32, height: window.innerHeight - 150 });
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const partidoStyles = getFontSize(partidosRonda.length, "partido", dimensions.width);
  const byeStyles = getFontSize(byes.length, "bye", dimensions.width, dimensions.height);

  return (
    <div className="h-full w-full flex flex-col" style={{ display: "grid", gridTemplateRows: "65% 35%", gridTemplateColumns: "1fr", gap: "8px", padding: "8px" }}>
      
      {/* PLAYING COUPLES - 70% */}
      <div className="flex flex-wrap gap-3 justify-between overflow-hidden">
        {partidosRonda.map((partido) => (
          <div
            key={partido.id}
            className={`flex flex-col items-center justify-center border-2 border-black bg-white shadow-md ${partidoStyles.container}`}
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
                  className={`border border-zinc-400 bg-white text-center ${byeStyles.container}`}
                >
                  <span className={`font-black text-zinc-800 text-xl ${byeStyles.numero}`}>{bye.pareja}</span>
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

function TVBracketViewFull({ partidos }: { partidos: Partido[] }) {
  const getPartidos = (ronda: Ronda) => partidos.filter(p => p.ronda === ronda);
  
  const ronda16 = getPartidos("1/16");
  const ronda8 = getPartidos("1/8");
  const ronda4 = getPartidos("1/4");
  const ronda2 = getPartidos("1/2");
  const final = getPartidos("Final");

  return (
    <div className="w-full h-full flex items-center justify-center gap-2">
      <div className="flex flex-col gap-2 flex-3 min-w-0">
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

      <div className="flex flex-col gap-2 flex-2 min-w-0">
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

      <div className="flex flex-col gap-2 flex-1 min-w-0">
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