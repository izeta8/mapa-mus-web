interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return {
    title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} | Mapa Mus`,
  };
}

export default async function LegalPage({ params }: Props) {
  const { slug } = await params;
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">
        {slug.charAt(0).toUpperCase() + slug.slice(1)}
      </h1>
      <div className="prose">
        <p className="text-muted-foreground">
          (Contenido legal - Próximamente)
        </p>
      </div>
    </div>
  );
}