import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r bg-card p-4">
        <div className="mb-8">
          <h2 className="text-lg font-bold">Mapa Mus Bar</h2>
        </div>
        <nav className="space-y-2">
          <Link href="/admin/panel" className="block px-3 py-2 rounded-md hover:bg-accent">
            Mis Torneos
          </Link>
          <Link href="/admin/login" className="block px-3 py-2 rounded-md hover:bg-accent">
            Cerrar Sesión
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}