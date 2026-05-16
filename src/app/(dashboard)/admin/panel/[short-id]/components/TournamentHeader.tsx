import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TvIcon, SettingsIcon, PlayIcon, MapPinIcon, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { TournamentFull } from "@/types/database";

interface Props {
  tournament: TournamentFull;
  shortId: string;
}

export function TournamentHeader({ tournament, shortId }: Props) {
  const isPlanned = tournament.status === "planned";
  const isFinished = tournament.status === "finished";

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
      <div>
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">{tournament.name}</h1>
          <Badge 
            variant={isPlanned ? "outline" : isFinished ? "secondary" : "default"}
            className="capitalize px-3 py-1 text-sm font-semibold"
          >
            {tournament.status === "planned" ? "Planeado / Inscripción" : 
             tournament.status === "finished" ? "Finalizado" : 
             tournament.status === "revision_pending" ? "En Revisión" : "Cancelado"}
          </Badge>
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
                ? new Date(tournament.tournament_date).toLocaleDateString() 
                : "Fecha no definida"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="lg" className="h-12 px-6 text-base">
          <Link href={`/tv/${shortId}`} target="_blank">
            <TvIcon data-icon="inline-start" className="size-5" />
            Modo TV
          </Link>
        </Button>
        <Button variant="outline" size="lg" className="h-12 px-6 text-base">
          <SettingsIcon data-icon="inline-start" className="size-5" />
          Configurar
        </Button>
        {isPlanned && (
          <Button size="lg" className="h-12 px-8 text-base font-bold bg-primary text-primary-foreground">
            <PlayIcon data-icon="inline-start" className="size-5" />
            Comenzar Torneo
          </Button>
        )}
      </div>
    </div>
  );
}
