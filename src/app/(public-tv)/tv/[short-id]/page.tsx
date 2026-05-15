
import { getTournamentByShortId } from "@/services/tournaments";
import TVTournamentPage from "./components/TVTournamentPage";

interface Props {
  params: Promise<{
    "short-id": string;
  }>;
}

export default async function Page({ params }: Props) {

  const { "short-id": shortId } = await params;
  const tournamentData = await getTournamentByShortId(shortId);

  if (!tournamentData) return <div>404</div>;

  return (
      <TVTournamentPage 
        tournamentName={tournamentData.name}
      />
  );
}
