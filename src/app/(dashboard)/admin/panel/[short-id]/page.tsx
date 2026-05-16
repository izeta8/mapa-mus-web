
import { getTournamentFullDataByShortId } from "@/services/tournaments";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    "short-id": string;
  }>;
}

export default async function Page({ params }: Props) {

  const { "short-id": shortId } = await params;
  const tournamentData = await getTournamentFullDataByShortId(shortId);

  if (!tournamentData) {
    notFound();
  }

  return (
    <div>
      Estas en el torneo {shortId}
    </div>
  );
}
