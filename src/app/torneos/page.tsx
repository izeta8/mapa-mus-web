import { Metadata } from "next";
import { getPublicActiveTournaments } from "@/services/tournaments";
import { TournamentExplorer } from "./components/TournamentExplorer";

export const metadata: Metadata = {
  title: "Mapa de Torneos de Mus | Mapa Mus",
  description: "Encuentra torneos de Mus en tu zona. Localiza campeonatos activos en el mapa interactivo y participa en los eventos más cercanos.",
};

export default async function TorneosPage() {
  const tournaments = await getPublicActiveTournaments();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  return (
    <div className="w-full h-full">
      <TournamentExplorer
        initialTournaments={tournaments || []}
        googleMapsApiKey={apiKey}
      />
    </div>
  );
}
