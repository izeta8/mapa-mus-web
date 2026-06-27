"use client";

import { Couple } from "@/types/database";
import { CoupleLiveStatus, formatCoupleLabel } from "./live-status";

interface LiveTableStatusProps {
  couple: Couple;
  status: CoupleLiveStatus;
  onChange: () => void;
}

/**
 * Presents the live status of the selected couple. Pure presentation: it renders the
 * `CoupleLiveStatus` it receives and exposes a "change couple" action.
 */
export function LiveTableStatus({ couple, status, onChange }: LiveTableStatusProps) {
  return (
    <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-10 h-10 shrink-0 rounded-lg bg-[#33AD6A] text-white font-black flex items-center justify-center">
            {couple.couple_number}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-[#737373]">Tu pareja</p>
            <p className="font-extrabold text-[#1F1F1F] truncate">
              {couple.player1_name?.trim() || "Jugador 1"}
              <span className="text-[#737373] font-normal"> - </span>
              {couple.player2_name?.trim() || "Jugador 2"}
            </p>
            <span className="sr-only">{formatCoupleLabel(couple)}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onChange}
          className="shrink-0 text-xs font-bold text-[#737373] hover:text-[#1F1F1F] underline underline-offset-2 cursor-pointer"
        >
          Cambiar
        </button>
      </div>

      <StatusBody status={status} />
    </div>
  );
}

function StatusBody({ status }: { status: CoupleLiveStatus }) {
  switch (status.kind) {
    case "playing":
      return (
        <div className="rounded-2xl bg-[#33AD6A] text-white p-6 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-white/80">Tu mesa</p>
          <p className="text-7xl font-black leading-none my-2">
            {status.tableNumber ?? "—"}
          </p>
          {status.opponent && (
            <p className="text-sm font-semibold text-white/90">
              Contra: {formatCoupleLabel(status.opponent)}
            </p>
          )}
        </div>
      );
    case "bye":
      return (
        <StatusMessage
          title="Descansas esta ronda"
          detail="Pasas directo a la siguiente ronda. Atento a la próxima mesa."
        />
      );
    case "won_round":
      return (
        <StatusMessage
          title="¡Ganaste tu partida!"
          detail="Espera al sorteo de la siguiente ronda para ver tu nueva mesa."
        />
      );
    case "champion":
      return (
        <StatusMessage
          title="🏆 ¡Campeones!"
          detail="Habéis ganado el torneo. ¡Enhorabuena!"
          highlight
        />
      );
    case "eliminated":
      return (
        <StatusMessage
          title="Quedaste eliminado"
          detail="¡Gracias por jugar! Nos vemos en el próximo torneo."
        />
      );
    case "waiting":
      return (
        <StatusMessage
          title="Esperando emparejamiento"
          detail="En cuanto el organizador asigne tu próxima mesa, aparecerá aquí."
        />
      );
    case "not_started":
      return (
        <StatusMessage
          title={`Inscrito como pareja Nº${status.coupleNumber}`}
          detail="El torneo aún no ha empezado. Tu mesa aparecerá aquí al comenzar."
        />
      );
  }
}

function StatusMessage({
  title,
  detail,
  highlight = false,
}: {
  title: string;
  detail: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-6 text-center ${
        highlight ? "bg-[#FFD700]/15 border border-[#FFD700]/40" : "bg-[#F7F7F7] border border-[#EAEAEA]"
      }`}
    >
      <p className="text-2xl font-black text-[#1F1F1F]">{title}</p>
      <p className="text-sm font-medium text-[#737373] mt-1">{detail}</p>
    </div>
  );
}
