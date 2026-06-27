"use client";

import { QRCodeSVG } from "qrcode.react";
import { getTournamentPublicUrl } from "@/lib/utils/tournament-url";

interface TournamentQrProps {
  shortId: string;
  /** Pixel size of the QR graphic. */
  size?: number;
  /** Extra classes on the card, e.g. `h-full` to match a sibling's height. */
  className?: string;
}

/**
 * QR shown on the bar TV. Scanning it opens the zero-install web view where each
 * player finds their table. This is the customer-acquisition hook, so it is meant to
 * be always visible (it does not depend on byes or the active view).
 */
export function TournamentQr({ shortId, size = 128, className = "" }: TournamentQrProps) {
  const url = getTournamentPublicUrl(shortId);

  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 border-4 border-black bg-white p-3 shadow-lg ${className}`}
    >
      <QRCodeSVG value={url} size={size} level="M" marginSize={0} />
      <span className="text-xs font-black text-center text-black">ESCÁNEAME</span>
      <span className="text-sm font-bold text-zinc-500 text-center leading-tight">
        Escanea para ver tu mesa
      </span>
    </div>
  );
}
