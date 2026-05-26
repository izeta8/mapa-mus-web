"use client";

import { useState, useMemo } from "react";
import { Tournament } from "@/types/database";
import { TournamentCard } from "./TournamentCard";
import { TournamentMap } from "./TournamentMap";
import { Map, List, Search, MapPin } from "lucide-react";

import { TournamentDetailSidebar } from "./TournamentDetailSidebar";

interface TournamentExplorerProps {
  initialTournaments: Tournament[];
  googleMapsApiKey: string;
}

export function TournamentExplorer({
  initialTournaments,
  googleMapsApiKey,
}: TournamentExplorerProps) {
  const [tournaments] = useState<Tournament[]>(initialTournaments);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileView, setMobileView] = useState<"map" | "list">("map");

  // Client-side text filtering for name or location (Scalable foundation for future filters)
  const filteredTournaments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return tournaments;
    return tournaments.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.location.toLowerCase().includes(query)
    );
  }, [tournaments, searchQuery]);

  const handleSelectTournament = (tournament: Tournament | null) => {
    setSelectedTournament(tournament);
    // If a tournament is selected on mobile list, auto-switch to map to show it
    if (tournament && mobileView === "list") {
      setMobileView("map");
    }
  };

  return (
    <div className="w-full flex flex-col h-full bg-[#F7F7F7] relative overflow-hidden">
      {/* Main Split Layout */}
      <div className="flex-1 flex w-full overflow-hidden relative">
        
        {/* Sidebar list or detail view: Visible on desktop, toggleable on mobile */}
        <div
          className={`w-full md:w-[380px] bg-white border-r border-[#EAEAEA] flex flex-col shrink-0 overflow-hidden ${
            mobileView === "list" ? "flex" : "hidden md:flex"
          }`}
        >
          {selectedTournament ? (
            <TournamentDetailSidebar
              tournament={selectedTournament}
              onBack={() => handleSelectTournament(null)}
            />
          ) : (
            <>
              {/* Sticky Filter Header inside Sidebar */}
              <div className="p-4 border-b border-[#EAEAEA] bg-white shrink-0 space-y-3">
                <h2 className="text-lg font-black text-[#1F1F1F] tracking-tight">
                  Torneos Disponibles
                </h2>
                <div className="relative w-full">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filtrar por nombre o dirección..."
                    className="w-full h-10 pl-9 pr-4 bg-[#F7F7F7] hover:bg-neutral-100 focus:bg-white border border-[#EAEAEA] focus:border-[#33AD6A] focus:ring-1 focus:ring-[#33AD6A] outline-none rounded-xl text-xs transition-all"
                  />
                </div>
              </div>

              {/* Scrollable List Container */}
              <div className="flex-1 overflow-y-auto">
                {filteredTournaments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 h-full min-h-[250px]">
                    <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center border border-neutral-100 text-neutral-400">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1F1F1F]">No se encontraron torneos</p>
                      <p className="text-xs text-[#737373] mt-1 max-w-[240px] mx-auto">
                        Intenta cambiar tu búsqueda o vuelve más tarde para nuevos torneos.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      {filteredTournaments.length} torneo{filteredTournaments.length !== 1 ? "s" : ""} encontrado{filteredTournaments.length !== 1 ? "s" : ""}
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {filteredTournaments.map((tournament) => (
                        <TournamentCard
                          key={tournament.id}
                          tournament={tournament}
                          isSelected={false}
                          onClick={() => handleSelectTournament(tournament)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Map View: Visible on desktop, toggleable on mobile */}
        <div
          className={`flex-1 h-full relative overflow-hidden ${
            mobileView === "map" ? "block" : "hidden md:block"
          }`}
        >
          <TournamentMap
            tournaments={filteredTournaments}
            selectedTournament={selectedTournament}
            onSelectTournament={setSelectedTournament}
            apiKey={googleMapsApiKey}
          />
        </div>
      </div>

      {/* Floating Mobile Toggle Button */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 md:hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
        <button
          onClick={() => setMobileView(mobileView === "map" ? "list" : "map")}
          className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-neutral-50 text-[#1F1F1F] rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] font-bold text-xs transition-all duration-200 active:scale-95 cursor-pointer border border-neutral-200"
        >
          {mobileView === "map" ? (
            <>
              <List className="w-4 h-4 text-[#33AD6A]" />
              <span>Ver Lista</span>
            </>
          ) : (
            <>
              <Map className="w-4 h-4 text-[#33AD6A]" />
              <span>Ver Mapa</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
