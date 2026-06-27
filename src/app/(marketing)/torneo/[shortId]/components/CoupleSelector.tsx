"use client";

import { Couple } from "@/types/database";
import { formatCoupleLabel } from "./live-status";

interface CoupleSelectorProps {
  couples: Couple[];
  onSelect: (coupleId: string) => void;
}

/**
 * Lets the player pick their couple from the list. Stateless: it only reports the
 * chosen couple upwards, persistence is handled by the parent.
 */
export function CoupleSelector({ couples, onSelect }: CoupleSelectorProps) {
  return (
    <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-extrabold text-[#1F1F1F]">¿Cuál es tu pareja?</h2>
      <p className="text-sm text-[#737373] mt-1 mb-5">
        Selecciónala para ver en qué mesa te toca jugar, en directo.
      </p>

      {couples.length === 0 ? (
        <p className="text-sm font-medium text-[#737373] py-4 text-center">
          Todavía no hay parejas inscritas.
        </p>
      ) : (
        <ul className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
          {couples.map((couple) => (
            <li key={couple.id}>
              <button
                type="button"
                onClick={() => onSelect(couple.id)}
                className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl border border-[#EAEAEA] bg-white hover:border-[#33AD6A] hover:bg-[#33AD6A]/5 transition-colors cursor-pointer"
              >
                <span className="w-9 h-9 shrink-0 rounded-lg bg-[#33AD6A] text-white font-black flex items-center justify-center">
                  {couple.couple_number}
                </span>
                <span className="font-semibold text-[#1F1F1F]">
                  {couple.player1_name?.trim() || "Jugador 1"}
                  <span className="text-[#737373] font-normal"> - </span>
                  {couple.player2_name?.trim() || "Jugador 2"}
                </span>
                <span className="sr-only">{formatCoupleLabel(couple)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
