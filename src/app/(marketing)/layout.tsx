import Link from "next/link";
import Image from "next/image";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F7]">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#EAEAEA]">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 font-extrabold text-xl tracking-tight text-[#1F1F1F] group">
            <Image
              src="/logo.png"
              alt="Mapa Mus Logo"
              width={36}
              height={36}
              className="rounded-lg object-contain group-hover:scale-105 transition-transform duration-200"
            />
            <span>Mapa<span className="text-[#33AD6A]">Mus</span></span>
          </Link>
          <div className="flex items-center gap-8">
            <a
              href="https://play.google.com/store/apps/details?id=com.izeta.mapamus"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-[#33AD6A] hover:bg-[#288A56] rounded-full shadow-sm hover:shadow transition-all duration-200"
            >
              Descargar App
            </a>
            <Link
              href="/admin/panel"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-[#1F1F1F] bg-white border border-[#EAEAEA] hover:border-[#1F1F1F] hover:bg-[#F7F7F7] rounded-full shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98]"
            >
              Área de Organizaciones
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-white border-t border-[#EAEAEA] py-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-[#737373]">
            © {new Date().getFullYear()} Mapa Mus. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}