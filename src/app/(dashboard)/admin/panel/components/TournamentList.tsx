import { getOrganizerTournaments } from "@/services/tournaments";
import { Bean, Calendar, Coins, Crown, Edit, Euro, MapPin, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { SafeDate } from "@/components/ui/custom/SafeDate";

export async function TournamentList({ organizerId }: { organizerId: string }) {
  const tournaments = await getOrganizerTournaments(organizerId);

  if (!tournaments || tournaments.length === 0) {
    return (
      <div className="border border-dashed border-zinc-300 rounded-xl p-8 text-center bg-zinc-50">
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">No hay torneos</h3>
        <p className="text-zinc-500 mb-4">Aún no has creado ningún torneo. ¡Anímate a organizar el primero!</p>
        <Link
          href="/admin/panel/torneo/crear"
          className="inline-flex items-center justify-center px-4 py-2.5 bg-[#33AD6A] hover:bg-[#288A56] active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm gap-2 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Crear Torneo
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {tournaments.map((tournament) => (

        <Link href={`/admin/panel/torneo/${tournament.short_id}`} key={tournament.id}>
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
                <SafeDate date={tournament.tournament_date} />
              </div>
              <div className="flex items-center text-sm text-zinc-600">
                <MapPin className="w-4 h-4 mr-2.5 text-zinc-400 shrink-0" />
                <span className="truncate">{tournament.location}</span>
              </div>

              <div className="flex items-center text-sm text-zinc-600">
                <Crown className="w-4 h-4 mr-2.5 text-zinc-400 shrink-0" />
                {tournament.kings_modality === '8' ? 'A 8 Reyes' : 'A 4 Reyes'}
              </div>

              <div className="flex items-center text-sm text-zinc-600">
                <Bean className="w-4 h-4 mr-2.5 text-zinc-400 shrink-0" />
                {tournament.points_modality ? `A ${tournament.points_modality} tantos` : 'Sin Definir'}
              </div>

              <div className="flex items-center text-sm text-zinc-600">
                <Euro className="w-4 h-4 mr-2.5 text-zinc-400 shrink-0" />
                {tournament.price_per_couple ? `${tournament.price_per_couple}€` : 'Sin definir'}
              </div>

              <div className="flex items-center text-sm text-zinc-600">
                <Users className="w-4 h-4 mr-1.5 text-zinc-400" />
                {tournament.max_spots ? `Max ${tournament.max_spots} parejas` : 'Sin límite'}
              </div>
            </div>

            <Link
              href="/admin/panel/torneo/editar"
              className="inline-flex items-center justify-center px-4 py-2.5 bg-[#33AD6A] hover:bg-[#288A56] active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm gap-2 cursor-pointer"
            >
              <Edit />
              Editar Torneo
            </Link>

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