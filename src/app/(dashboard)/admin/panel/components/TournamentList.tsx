import { getOrganizerTournaments } from "@/services/tournaments";
import { Calendar, Coins, Crown, MapPin, Users } from "lucide-react";
import Link from "next/link";

export async function TournamentList({ organizerId }: { organizerId: string }) {
  const tournaments = await getOrganizerTournaments(organizerId);

  if (!tournaments || tournaments.length === 0) {
    return (
      <div className="border border-dashed border-zinc-300 rounded-xl p-8 text-center bg-zinc-50">
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">No hay torneos</h3>
        <p className="text-zinc-500 mb-4">Aún no has creado ningún torneo. ¡Anímate a organizar el primero!</p>
        {/* Aquí iría un botón <Link href="/admin/tournaments/new" className="...btn...">Crear Torneo</Link> */}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {tournaments.map((tournament) => (

        <Link href={`/admin/panel/${tournament.short_id}`} key={tournament.id}>
          <div className="group relative flex flex-col h-full bg-white border border-zinc-200 rounded-xl p-5 hover:border-green-400 hover:shadow-md transition-all duration-200">
            
            {/* --- CABECERA: Título y Estado --- */}
            <div className="flex justify-between items-start gap-4 mb-4">
              <h3 className="font-bold text-lg leading-tight text-zinc-900 group-hover:text-green-600 transition-colors line-clamp-2">
                {tournament.name}
              </h3>
              <StatusBadge status={tournament.status} />
            </div>

            {/* --- CUERPO: Detalles rápidos --- */}
            <div className="grow space-y-2.5 mb-6">
              <div className="flex items-center text-sm text-zinc-600">
                <Calendar className="w-4 h-4 mr-2.5 text-zinc-400 shrink-0" />
                {new Date(tournament.tournament_date).toLocaleDateString("es-ES", { 
                  weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' 
                })}
              </div>
              
              <div className="flex items-center text-sm text-zinc-600">
                <MapPin className="w-4 h-4 mr-2.5 text-zinc-400 shrink-0" />
                <span className="truncate">{tournament.location}</span>
              </div>

              <div className="flex items-center text-sm text-zinc-600">
                <Crown className="w-4 h-4 mr-2.5 text-zinc-400 shrink-0" />
                {tournament.kings_modality === '8' ? 'A 8 Reyes' : 'A 4 Reyes'}
              </div>
            </div>

            {/* --- PIE: Cifras y Datos (Separado por una línea) --- */}
            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-sm">
              <div className="flex items-center font-medium text-zinc-900">
                <Users className="w-4 h-4 mr-1.5 text-zinc-400" />
                {tournament.max_spots ? `Max ${tournament.max_spots} par.` : 'Sin límite'}
              </div>
              <div className="flex items-center font-bold text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-md">
                <Coins className="w-4 h-4 mr-1.5 text-amber-500" />
                {tournament.price_per_couple ? `${tournament.price_per_couple}€` : 'Gratis'}
              </div>
            </div>

          </div>
        </Link>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {

  let bgColor = "bg-zinc-100 text-zinc-700";
  let label = status;

  switch (status.toLowerCase()) {
    case 'planned':
      bgColor = "bg-blue-100 text-blue-700";
      label = "Planeado";
      break;
    case 'revision_pending':
      bgColor = "bg-amber-100 text-amber-700";
      label = "En Revisión";
      break;
    case 'finished':
      bgColor = "bg-zinc-100 text-zinc-600";
      label = "Finalizado";
      break;
    case 'canceled':
      bgColor = "bg-red-100 text-red-700";
      label = "Cancelado";
      break;
    default:
      // Fallback por si en el futuro añades otro estado y se te olvida actualizar aquí
      bgColor = "bg-zinc-100 text-zinc-500";
      label = status;
      break;
  }

  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shrink-0 ${bgColor}`}>
      {label}
    </span>
  );
}