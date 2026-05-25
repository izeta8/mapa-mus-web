"use client";

import { useState } from "react";
import { Tournament } from "@/types/database";
import {
  Bean,
  Calendar,
  ChevronDown,
  Crown,
  Edit,
  Euro,
  MapPin,
  Users,
} from "lucide-react";
import Link from "next/link";
import { SafeDate } from "@/components/ui/custom/SafeDate";

interface TournamentGroupedListProps {
  initialTournaments: Tournament[];
}

const STATUS_ORDER = ["revision_pending", "planned", "finished", "canceled"] as const;
type StatusType = typeof STATUS_ORDER[number];

const STATUS_LABELS: Record<StatusType, string> = {
  revision_pending: "En Revisión",
  planned: "Planeados",
  finished: "Finalizados",
  canceled: "Cancelados",
};

const STATUS_DOTS: Record<StatusType, string> = {
  revision_pending: "bg-amber-500",
  planned: "bg-blue-500",
  finished: "bg-zinc-400",
  canceled: "bg-red-500",
};

const BADGE_STYLES: Record<StatusType, string> = {
  revision_pending: "bg-amber-50 text-amber-700 border-amber-200",
  planned: "bg-blue-50 text-blue-700 border-blue-200",
  finished: "bg-zinc-50 text-zinc-600 border-zinc-200",
  canceled: "bg-red-50 text-red-700 border-red-200",
};

export function TournamentGroupedList({ initialTournaments }: TournamentGroupedListProps) {
  // Setup accordion sections: revision_pending and planned expanded by default, others collapsed.
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    revision_pending: true,
    planned: true,
    finished: false,
    canceled: false,
  });

  const toggleSection = (status: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  // Group tournaments by status
  const grouped: Record<StatusType, Tournament[]> = {
    revision_pending: [],
    planned: [],
    finished: [],
    canceled: [],
  };

  initialTournaments.forEach((tournament) => {
    const status = tournament.status?.toLowerCase() as StatusType;
    if (STATUS_ORDER.includes(status)) {
      grouped[status].push(tournament);
    } else {
      console.warn(`Unexpected tournament status: ${tournament.status}`);
      grouped["planned"].push(tournament);
    }
  });

  // Sort each group by tournament_date descending (newest to oldest)
  const getTimestamp = (dateStr: string | Date | null | undefined) => {
    if (!dateStr) return 0;
    return new Date(dateStr).getTime();
  };

  STATUS_ORDER.forEach((status) => {
    grouped[status].sort((a, b) => getTimestamp(b.tournament_date) - getTimestamp(a.tournament_date));
  });

  return (
    <div className="space-y-6">
      {STATUS_ORDER.map((status) => {
        const list = grouped[status];
        const isOpen = !!openSections[status];
        const label = STATUS_LABELS[status];
        const count = list.length;

        return (
          <div key={status} className="border-b border-zinc-100 last:border-0 pb-6 last:pb-0">
            {/* Minimalist Accordion Header */}
            <button
              onClick={() => toggleSection(status)}
              className="w-full flex items-center justify-between py-3 cursor-pointer text-left select-none group"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOTS[status]}`} />
                <span className="font-bold text-xs tracking-wider text-zinc-500 uppercase group-hover:text-zinc-800 transition-colors">
                  {label}
                </span>
                <span className="text-xs text-zinc-400 font-medium">
                  ({count})
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Accordion Content */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
              }`}
            >
              {isOpen && (
                <div className="mt-4">
                  {count === 0 ? (
                    <div className="py-8 border border-zinc-150 border-dashed rounded-2xl text-center text-zinc-400 text-xs bg-zinc-50/20">
                      No hay torneos en esta sección.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {list.map((tournament) => (
                        <Link href={`/admin/panel/torneo/${tournament.short_id}`} key={tournament.id}>
                          <div className="group/card relative flex flex-col h-full bg-white border border-zinc-200 hover:border-[#33AD6A] rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                            
                            {/* Card Header: Title & Status Badge */}
                            <div className="flex justify-between items-start gap-3 mb-4">
                              <h4 className="font-bold text-base sm:text-lg text-zinc-900 group-hover/card:text-[#33AD6A] transition-colors line-clamp-2 leading-snug">
                                {tournament.name}
                              </h4>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 border ${BADGE_STYLES[status]}`}
                              >
                                {label}
                              </span>
                            </div>

                            {/* Card Body: Details */}
                            <div className="grow space-y-2.5 text-xs text-zinc-600 mb-5">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-zinc-400 shrink-0" />
                                <SafeDate date={tournament.tournament_date} className="font-medium text-zinc-700" />
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-zinc-400 shrink-0" />
                                <span className="truncate text-zinc-700">{tournament.location}</span>
                              </div>

                              <div className="border-t border-zinc-100 my-2.5" />

                              {/* Specs Grid */}
                              <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-[11px]">
                                <div className="flex items-center gap-1.5">
                                  <Crown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                  <span className="truncate text-zinc-700">
                                    {tournament.kings_modality === "8" ? "A 8 Reyes" : "A 4 Reyes"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Bean className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                  <span className="truncate text-zinc-700">
                                    {tournament.points_modality ? `A ${tournament.points_modality} tantos` : "Tantos: N/D"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Euro className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                  <span className="truncate text-zinc-700">
                                    {tournament.price_per_couple ? `${tournament.price_per_couple}€` : "Gratuito"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Users className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                  <span className="truncate text-zinc-700">
                                    {tournament.max_spots ? `Máx ${tournament.max_spots} parej.` : "Sin límite"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Card Footer: Edit Button */}
                            <Link
                              href={`/admin/panel/torneo/${tournament.short_id}/editar`}
                              className="w-full inline-flex items-center justify-center px-4 py-2 border border-zinc-200 hover:border-[#33AD6A] hover:bg-green-50/20 text-zinc-600 hover:text-[#288A56] text-xs font-semibold rounded-xl transition-all duration-200 gap-1.5 cursor-pointer"
                              onClick={(e) => {
                                // Prevent clicking the edit button from navigating to the tournament dashboard
                                e.stopPropagation();
                              }}
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Editar Torneo</span>
                            </Link>

                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
