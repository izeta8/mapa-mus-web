
import { Suspense } from "react";
import { TournamentList } from "./components/TournamentList";

export default async function AdminPanelPage() {

  const organizerId = "70aa85c1-cb3b-4420-83fe-7b958efebc43"

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mis Torneos</h1>

      <Suspense
        fallback={
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin flex"></div>
             <span>Cargando los torneos...</span>
          </div>
        }
      >
        <TournamentList organizerId={organizerId} />
      </Suspense>

    </div>
  );
}
