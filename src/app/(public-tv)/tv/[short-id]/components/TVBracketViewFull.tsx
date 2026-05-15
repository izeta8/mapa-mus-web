"use client"

import { Match } from "@/types/database";

export default function TVBracketViewFull({ partidos }: { partidos: Match[] }) {

  const getPartidos = (ronda: Round) => partidos.filter(p => p.ronda === ronda);
  
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