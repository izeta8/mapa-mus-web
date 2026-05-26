import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#EAEAEA]">
      <nav className="container mx-auto px-4 py-3 min-[500px]:py-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 min-[500px]:gap-3 font-extrabold text-lg min-[500px]:text-xl tracking-tight text-[#1F1F1F] group shrink-0"
          >
            <Image
              src="/logo.png"
              alt="Mapa Mus Logo"
              width={36}
              height={36}
              className="rounded-lg object-contain w-8 h-8 min-[500px]:w-9 min-[500px]:h-9 group-hover:scale-105 transition-transform duration-200"
            />
            <span>
              Mapa<span className="text-[#33AD6A]">Mus</span>
            </span>
          </Link>
          <a
            href="https://play.google.com/store/apps/details?id=com.izeta.mapamus"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold text-[#737373] hover:text-[#1F1F1F] bg-[#F7F7F7] hover:bg-[#F0F0F0] border border-[#EAEAEA] rounded-full transition-all duration-200"
          >
            Descargar App
          </a>
        </div>

        <div className="flex items-center gap-2 min-[500px]:gap-3">
          <Link
            href="/torneos"
            className="inline-flex items-center justify-center px-3 py-1.5 min-[500px]:px-4 min-[500px]:py-2 text-xs min-[500px]:text-sm font-semibold text-white bg-[#33AD6A] hover:bg-[#288A56] rounded-full shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98]"
          >
            Buscar Torneos
          </Link>
          <Link
            href="/admin/panel"
            className="inline-flex items-center justify-center px-3 py-1.5 min-[500px]:px-4 min-[500px]:py-2 text-xs min-[500px]:text-sm font-semibold text-[#1F1F1F] bg-white border border-[#EAEAEA] hover:border-[#1F1F1F] hover:bg-[#F7F7F7] rounded-full shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98]"
          >
            <span className="hidden min-[500px]:inline">Área de Organizadores</span>
            <span className="inline min-[500px]:hidden">Organización</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
