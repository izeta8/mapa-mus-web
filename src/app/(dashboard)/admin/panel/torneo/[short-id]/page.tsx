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
    <div className="container mx-auto p-8 max-w-screen-2xl">
      <TournamentHeader tournament={tournament} shortId={shortId} />

      <TournamentStats tournament={tournament} shortId={shortId} />
      
      <TournamentManagement tournament={tournament} />
    </div>
  );
}
