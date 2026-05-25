import { Header } from "./components/Header";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F7]">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="bg-white border-t border-[#EAEAEA] py-8">
        <div className="container mx-auto px-4 flex flex-col sm:flex-col items-center justify-center gap-2">
          <p className="text-center sm:text-left text-sm text-[#737373]">
            © {new Date().getFullYear()} Mapa Mus. Todos los derechos reservados.
          </p>
          <p className="text-sm text-[#737373]">
            Contacto:{" "}
            <a
              href="mailto:mapamusapp@gmail.com"
              className="text-[#33AD6A] hover:underline font-semibold"
            >
              mapamusapp@gmail.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

