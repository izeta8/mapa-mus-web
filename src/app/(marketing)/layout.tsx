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
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-[#737373]">
            © {new Date().getFullYear()} Mapa Mus. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
