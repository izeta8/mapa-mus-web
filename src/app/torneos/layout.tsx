import { Header } from "../(marketing)/components/Header";

export default function TorneosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col bg-[#F7F7F7] overflow-hidden">
      <Header />
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>
    </div>
  );
}
