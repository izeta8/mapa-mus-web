import { getTournamentFullDataByShortId } from "@/services/tournaments";
import { notFound } from "next/navigation";
import { TournamentHeader } from "./components/TournamentHeader";
import { TournamentStats } from "./components/TournamentStats";
import { TournamentManagement } from "./components/TournamentManagement";

interface Props {
  params: Promise<{
    "short-id": string;
  }>;
}

export default async function Page({ params }: Props) {
  const { "short-id": shortId } = await params;
  const tournament = await getTournamentFullDataByShortId(shortId);

  if (!tournament) {
    notFound();
  }

  return (
    // h-[calc(100vh-64px)] calcula el alto exacto de la pantalla restando el padding del layout (p-8 = 64px)
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden">

      {/* Capa En Desarrollo */}
      <div className="z-10 bg-white/80 absolute inset-0 flex items-center justify-center backdrop-blur-[1px]">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-xl font-bold text-neutral-800">En Desarrollo</p>
        </div>
      </div>

      {/* Contenedor interno clonando el tamaño exacto sin dejar que desborde */}
      <div className="w-full h-full overflow-hidden max-w-screen-2xl mx-auto">
        <TournamentHeader tournament={tournament} shortId={shortId} />
        <TournamentStats tournament={tournament} shortId={shortId} />
        <TournamentManagement tournament={tournament} />
      </div>
    </div>
  );
}