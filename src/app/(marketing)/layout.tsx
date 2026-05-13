import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">Mapa Mus</Link>
          <div className="flex gap-4">
            <Link href="/torneos/zarautz" className="hover:underline">Torneos</Link>
            <Link href="/admin/login" className="hover:underline">Bar</Link>
          </div>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">
            © 2026 Mapa Mus. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}