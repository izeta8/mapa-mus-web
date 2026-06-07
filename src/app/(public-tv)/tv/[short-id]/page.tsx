
import { getTournamentFullDataByShortId } from "@/services/tournaments";
import TVTournamentPage from "./components/TVTournamentPage";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    "short-id": string;
  }>;
}

export default async function Page({ params }: Props) {

  const { "short-id": shortId } = await params;
  const tournamentData = await getTournamentFullDataByShortId(shortId);

  if (!tournamentData || (
    tournamentData.status !== "planned" && 
    tournamentData.status !== "ongoing" && 
    tournamentData.status !== "revision_pending"
  )) {
    notFound();
  }

  return (
      <TVTournamentPage 
        tournament={tournamentData}
      />
  );
}
