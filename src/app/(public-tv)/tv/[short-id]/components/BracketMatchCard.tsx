import { MatchWithCouples, CoupleInfo } from "@/types";

interface Props {
  match: MatchWithCouples;
  matchesCount: number;
}

const getCouplePlayersName = (couple: CoupleInfo | null): string => {
  if (!couple) return "";
  const p1 = couple.player1_name?.trim().split(" ")[0] || "";
  const p2 = couple.player2_name?.trim().split(" ")[0] || "";
  if (p1 && p2) return `(${p1}/${p2})`;
  if (p1 || p2) return `(${p1 || p2})`;
  return "";
};

export default function BracketMatchCard({ match, matchesCount }: Props) {
  const hasWinner = !!match.winner_id;
  const isWinner1 = hasWinner && match.winner_id === match.couple1_id;
  const isWinner2 = hasWinner && match.winner_id === match.couple2_id;

  let badgeLabel = "";
  let badgeStyles = "";
  let borderClass = "border-zinc-200/80";
  const bgClass = "bg-white";

  // Determine card styles and badge information
  if (match.round === 1) {
    if (!match.is_consolation) {
      badgeLabel = "FINAL";
      badgeStyles = "bg-amber-100 text-amber-800 border-amber-200";
      borderClass = "border-amber-400 shadow-md shadow-amber-500/5";
    } else {
      const rowIndex = match.row_index ?? 2;
      if (rowIndex === 2) {
        badgeLabel = "3º/4º PUESTO";
        badgeStyles = "bg-zinc-100 text-zinc-700 border-zinc-200";
        borderClass = "border-zinc-300";
      } else {
        badgeLabel = `${2 * rowIndex - 1}º/${2 * rowIndex}º`;
        badgeStyles = "bg-zinc-50 text-zinc-600 border-zinc-200";
        borderClass = "border-zinc-300";
      }
    }
  } else if (match.round === 2) {
    badgeLabel = "SEMIFINAL";
    badgeStyles = "bg-emerald-50 text-emerald-800 border-emerald-100";
  }

  // Active playing status highlight
  const isPlaying = !hasWinner && match.couple1 && match.couple2 && !match.is_bye;
  if (isPlaying && match.round !== 1) {
    borderClass = "border-zinc-800 ring-1 ring-zinc-800/10";
  }

  // Dynamic layout parameters based on match density in the column
  // Note: Density is halved in butterfly layout, so compact sizes are rarely needed.
  const isCompact = matchesCount > 4;
  const isSuperCompact = matchesCount > 8;

  const cardWidth = isSuperCompact ? "w-28" : isCompact ? "w-36" : "w-44";
  const rowPadding = isSuperCompact ? "px-2 py-1" : isCompact ? "px-2.5 py-1" : "px-3 py-1.5";
  const fontSize = isSuperCompact ? "text-[10px]" : isCompact ? "text-[11px] font-semibold" : "text-sm font-semibold";
  const headerFontSize = isSuperCompact ? "text-[8px] py-0.5 px-1" : isCompact ? "text-[9px] py-0.5 px-1.5" : "text-[10px] py-1 px-2";

  return (
    <div
      id={`bracket-match-${match.id}`}
      className={`flex flex-col border bg-white rounded-lg shadow-xs overflow-hidden transition-all duration-300 select-none ${cardWidth} ${borderClass} ${bgClass}`}
    >
      {/* Header Info - hidden in super compact to save vertical space */}
      {!isSuperCompact && (
        <div className={`bg-zinc-50 border-b border-zinc-100 font-black text-zinc-500 flex justify-between items-center ${headerFontSize}`}>
          <span className="uppercase">
            {match.is_bye ? "EXENTO" : match.table_number ? `MESA ${match.table_number}` : "SIN MESA"}
          </span>
          {badgeLabel && (
            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black tracking-wider border uppercase ${badgeStyles}`}>
              {badgeLabel}
            </span>
          )}
        </div>
      )}

      {/* Couple 1 Row */}
      <div
        className={`${rowPadding} flex justify-between items-center transition-colors ${
          isWinner1
            ? "bg-emerald-50 text-emerald-950 font-black"
            : hasWinner && match.couple1_id
            ? "text-zinc-400"
            : "text-zinc-800"
        } ${fontSize}`}
      >
        <span className="truncate flex-1 min-w-0">
          {match.couple1 ? (
            isCompact ? `P.${match.couple1.couple_number}` : `P.${match.couple1.couple_number} ${getCouplePlayersName(match.couple1)}`
          ) : (
            "TBD"
          )}
        </span>
        {isWinner1 && <span className="shrink-0 ml-1.5 text-xs font-bold text-emerald-600">🏆</span>}
      </div>

      {/* Middle Divider */}
      <div className="h-px bg-zinc-100" />

      {/* Couple 2 Row */}
      <div
        className={`${rowPadding} flex justify-between items-center transition-colors ${
          isWinner2
            ? "bg-emerald-50 text-emerald-950 font-black"
            : hasWinner && match.couple2_id
            ? "text-zinc-400"
            : "text-zinc-800"
        } ${fontSize}`}
      >
        <span className="truncate flex-1 min-w-0">
          {match.is_bye ? (
            <span className="italic text-zinc-400">Pasa Directo</span>
          ) : match.couple2 ? (
            isCompact ? `P.${match.couple2.couple_number}` : `P.${match.couple2.couple_number} ${getCouplePlayersName(match.couple2)}`
          ) : (
            "TBD"
          )}
        </span>
        {isWinner2 && <span className="shrink-0 ml-1.5 text-xs font-bold text-emerald-600">🏆</span>}
      </div>
    </div>
  );
}
