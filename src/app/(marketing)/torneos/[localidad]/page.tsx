interface Props {
  params: Promise<{ localidad: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { localidad } = await params;
  return {
    title: `Torneos de Mus en ${localidad.charAt(0).toUpperCase() + localidad.slice(1)} | Mapa Mus`,
    description: `Encuentra los mejores torneos de Mus en ${localidad}. Torneos presenciales, horarios y ubicación.`,
  };
}

export default async function TorneosLocalidadPage({ params }: Props) {
  const { localidad } = await params;
  const localidadDisplay = localidad.charAt(0).toUpperCase() + localidad.slice(1);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        Torneos de Mus en {localidadDisplay}
      </h1>
      <p className="text-muted-foreground mb-8">
        Encuentra torneos de Mus en {localidadDisplay} y zona cercana.
      </p>
      <div className="text-sm text-muted-foreground">
        (Próximamente: lista de torneos activos)
      </div>
    </div>
  );
}