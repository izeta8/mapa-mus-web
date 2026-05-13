export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <section className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4">Mapa Mus</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Encuentra torneos de Mus cerca de ti
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="#"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:opacity-90"
          >
            Descargar App
          </a>
          <a
            href="/admin/login"
            className="px-6 py-3 border border-input bg-background rounded-md hover:bg-accent"
          >
            Soy Bar
          </a>
        </div>
      </section>
    </div>
  );
}