"use client"

import { useState, useEffect } from "react";
import { mockPartidos, mockByes } from "@/data/mock-tournament";
import { getFontSize } from "../helpers";


export default function TVListaViewCompact() {
  
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
      <div className="flex flex-wrap gap-3 justify-evenly">
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
