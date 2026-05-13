interface Props {
  params: Promise<{ "id-torneo": string }>;
}

export default async function TVTournamentPage({ params }: Props) {
  const { "id-torneo": idTorneo } = await params;
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-6xl font-bold mb-8">Torneo #{idTorneo}</h1>
      <p className="text-3xl text-gray-400 mb-12">
        Emparejamientos en vivo
      </p>
      <div className="text-2xl text-gray-500">
        (QR Code para vincular app - Próximamente)
      </div>
    </div>
  );
}