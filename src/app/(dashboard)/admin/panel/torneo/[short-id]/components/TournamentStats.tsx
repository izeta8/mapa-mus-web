import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TournamentFull } from "@/types/database";
import { UsersIcon, TimerIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  tournament: TournamentFull;
  shortId: string;
}

export function TournamentStats({ tournament, shortId }: Props) {

  const actualCouplesCount = tournament.couples?.length || 0;

  // Calcular parejas vivas
  const eliminatedCoupleIds = new Set<string>();
  tournament.matches?.forEach(m => {
    if (m.winner_id && m.couple1_id && m.couple2_id) {
      const loserId = m.winner_id === m.couple1_id ? m.couple2_id : m.couple1_id;
      eliminatedCoupleIds.add(loserId);
    }
  });
  const aliveCouplesCount = actualCouplesCount - eliminatedCoupleIds.size;
  
  // Calcular progreso de la ronda actual
  const currentRoundMatches = tournament.matches?.filter(m => m.round === tournament.current_round && !m.is_bye) || [];
  const completedMatches = currentRoundMatches.filter(m => m.winner_id !== null).length;
  const totalMatches = currentRoundMatches.length;
  const isOngoing = tournament.status === 'ongoing';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="shadow-sm border-muted">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <UsersIcon className="size-4" />
            Participación
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black">
              {isOngoing ? `${aliveCouplesCount}/${actualCouplesCount}` : actualCouplesCount}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              {isOngoing ? "Parejas vivas" : "Parejas"}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-muted">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <TimerIcon className="size-4" />
            Ronda {tournament.current_round}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black">
              {isOngoing ? `${completedMatches}/${totalMatches}` : "—"}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              {isOngoing ? "Partidos listos" : "Esperando inicio"}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-muted">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Acceso Público</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="bg-muted/30 p-2 pl-3 rounded-lg flex items-center justify-between border border-muted/50">
            <code className="text-lg font-mono font-bold tracking-widest">{shortId}</code>
            <Button variant="ghost" size="sm" className="h-8 px-3 text-xs font-bold hover:bg-muted/80">Copiar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
