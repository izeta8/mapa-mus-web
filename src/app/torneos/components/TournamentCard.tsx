import Link from "next/link";
import { Tournament, Prize } from "@/types/database";
import { SafeDate } from "@/components/ui/custom/SafeDate";
import { Calendar, MapPin, Award, MapPinned, ExternalLink, Ticket } from "lucide-react";

interface TournamentCardProps {
  tournament: Tournament;
  onClick?: () => void;
  isSelected?: boolean;
  isCompact?: boolean;
}

export function TournamentCard({
  tournament,
  onClick,
  isSelected = false,
  isCompact = false,
}: TournamentCardProps) {
  // Parse prizes
  const prizes = Array.isArray(tournament.prizes)
    ? (tournament.prizes as unknown as Prize[])
    : [];

  // Extract first prize for displaying
  const firstPrize = prizes.find((p) => p.rank === 1);

  // Format price
  const priceLabel =
    tournament.price_per_couple === null || tournament.price_per_couple === 0
      ? "Gratuito"
      : `${tournament.price_per_couple}€ / pareja`;

  const statusLabels: Record<typeof tournament.status, string> = {
    planned: "Inscripción Abierta",
    ongoing: "En Juego",
    finished: "Finalizado",
    canceled: "Cancelado",
    revision_pending: "Pendiente de Revisión",
  };

  const statusColors: Record<typeof tournament.status, string> = {
    planned: "bg-[#33AD6A]/10 text-[#288A56] border-[#33AD6A]/20",
    ongoing: "bg-amber-50 text-amber-700 border-amber-200",
    finished: "bg-neutral-100 text-neutral-600 border-neutral-200",
    canceled: "bg-red-50 text-red-700 border-red-200",
    revision_pending: "bg-blue-50 text-blue-700 border-blue-200",
  };

  if (isCompact) {
    return (
      <div className="p-4 bg-white border border-[#EAEAEA] rounded-2xl shadow-sm space-y-3">
        <h3 className="font-extrabold text-base text-[#1F1F1F] leading-tight line-clamp-1">
          {tournament.name}
        </h3>

        <div className="space-y-1.5 text-xs text-[#737373]">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#33AD6A] shrink-0" />
            <SafeDate date={tournament.tournament_date} className="font-medium" />
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#33AD6A] shrink-0" />
            <span className="truncate">{tournament.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Ticket className="w-3.5 h-3.5 text-[#33AD6A] shrink-0" />
            <span className="font-medium text-zinc-700">{priceLabel}</span>
          </div>
          {firstPrize && (
            <div className="flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-[#33AD6A] shrink-0" />
              <span className="font-semibold text-zinc-700 truncate">
                1º Premio: {firstPrize.description}
                {firstPrize.cash > 0 ? ` (${firstPrize.cash}€)` : ""}
              </span>
            </div>
          )}
        </div>

        <Link
          href={`/torneo/${tournament.short_id}`}
          className="block w-full text-center py-2 bg-[#33AD6A] hover:bg-[#288A56] text-white text-xs font-bold rounded-xl transition-all duration-200 hover:shadow-md active:scale-[0.98] cursor-pointer"
        >
          Ver Detalles e Inscribirse
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`p-5 bg-white border rounded-2xl transition-all duration-200 flex flex-col justify-between ${
        isSelected
          ? "border-[#33AD6A] ring-1 ring-[#33AD6A] shadow-md bg-[#33AD6A]/[0.01]"
          : "border-[#EAEAEA] shadow-sm"
      }`}
    >
      <div className="space-y-3">
        <h3 className="font-extrabold text-lg text-[#1F1F1F] leading-snug">
          {tournament.name}
        </h3>

        <div className="space-y-2 text-sm text-[#737373]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#33AD6A] shrink-0" />
            <SafeDate date={tournament.tournament_date} className="font-medium text-zinc-700" />
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#33AD6A] shrink-0" />
            <span className="truncate text-zinc-700">{tournament.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-[#33AD6A] shrink-0" />
            <span className="font-medium text-zinc-700">{priceLabel}</span>
          </div>

          {firstPrize && (
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#33AD6A] shrink-0" />
              <span className="font-semibold text-zinc-800 truncate">
                1º Premio: {firstPrize.description}
                {firstPrize.cash > 0 ? ` (${firstPrize.cash}€)` : ""}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center gap-2">
        <button
          onClick={onClick}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-[#737373] hover:text-[#288A56] bg-neutral-100 hover:bg-[#33AD6A]/10 border border-neutral-200 hover:border-[#33AD6A]/30 rounded-xl transition-all duration-200 active:scale-[0.97] cursor-pointer"
        >
          <MapPinned className="w-3.5 h-3.5" />
          Ver en el mapa
        </button>
        <Link
          href={`/torneo/${tournament.short_id}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-[#288A56] hover:text-white bg-[#33AD6A]/10 hover:bg-[#33AD6A] border border-[#33AD6A]/20 hover:border-transparent rounded-xl transition-all duration-200 active:scale-[0.97] cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Ir al torneo
        </Link>
      </div>
    </div>
  );
}
