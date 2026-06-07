import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TvIcon, MapPinIcon, CalendarIcon, PencilIcon } from "lucide-react";
import Link from "next/link";
import { TournamentFull } from "@/types/database";
import { StartTournamentButton } from "./StartTournamentButton";
import { ResetTournamentButton } from "./ResetTournamentButton";
import { SafeDate } from "@/components/ui/custom/SafeDate";

interface Props {
  tournament: TournamentFull;
  shortId: string;
}

export function TournamentHeader({ tournament, shortId }: Props) {
  const isPlanned = tournament.status === "planned";
  const isOngoing = tournament.status === "ongoing";
  const isFinished = tournament.status === "finished";
  const isEditable = tournament.status === "planned" || tournament.status === "revision_pending";
  const isPlannedOrDraft = tournament.status === "planned" || tournament.status === "revision_pending";

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
      <div>
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">{tournament.name}</h1>
          <Badge 
            variant={isPlanned ? "outline" : isOngoing ? "default" : isFinished ? "secondary" : "secondary"}
            className="capitalize px-3 py-1 text-sm font-semibold"
          >
            {tournament.status === "planned" ? "Planeado / Inscripción" : 
             tournament.status === "ongoing" ? "En Juego (Live)" : 
             tournament.status === "finished" ? "Finalizado" : 
             tournament.status === "revision_pending" ? "En Revisión" : "Cancelado"}
          </Badge>
          {tournament.is_test && (
            <Badge 
              variant="outline"
              className="px-3 py-1 text-sm font-bold bg-amber-50 text-amber-800 border-amber-200 uppercase tracking-wide"
            >
              🧪 Modo Prueba
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPinIcon className="size-5" />
            <span className="text-lg">{tournament.location || "Ubicación no definida"}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="size-5" />
            <span className="text-lg">
              {tournament.tournament_date 
                ? <SafeDate date={tournament.tournament_date} />
                : "Fecha no definida"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isEditable && (
          <Link href={`/admin/panel/torneo/${shortId}/editar`}>
            <Button variant="outline" size="lg" className="h-12 px-6 text-base cursor-pointer gap-2">
              <PencilIcon className="size-4" />
              Editar
            </Button>
          </Link>
        )}
        <Link href={`/tv/${shortId}`} target="_blank">
          <Button variant="outline" size="lg" className="h-12 px-6 text-base cursor-pointer">
            <TvIcon data-icon="inline-start" className="size-5" />
            Modo TV
          </Button>
        </Link>
        {isPlannedOrDraft && (
          <StartTournamentButton 
            tournamentId={tournament.id} 
            couplesCount={tournament.couples.length} 
            prizes={tournament.prizes}
          />
        )}
        {isOngoing && (
          <ResetTournamentButton 
            tournamentId={tournament.id}
          />
        )}
      </div>
    </div>
  );
}
