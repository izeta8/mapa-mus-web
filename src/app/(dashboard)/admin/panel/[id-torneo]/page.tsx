interface Props {
  params: Promise<{ "id-torneo": string }>;
}

export default async function TournamentDetailPage({ params }: Props) {
  const { "id-torneo": idTorneo } = await params;
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Torneo #{idTorneo}</h1>
      <div className="text-muted-foreground">
        (Dashboard de gestión del tournament - Próximamente)
      </div>
    </div>
  );
}