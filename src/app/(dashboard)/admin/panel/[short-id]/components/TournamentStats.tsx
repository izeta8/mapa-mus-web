import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrophyIcon, UsersIcon } from "lucide-react";
import { TournamentFull } from "@/types/database";

interface Props {
  tournament: TournamentFull;
  shortId: string;
}

export function TournamentStats({ tournament, shortId }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-3">
            <UsersIcon className="size-5 text-muted-foreground" />
            Participación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-black">{tournament.total_couples}</div>
          <p className="text-sm text-muted-foreground mt-2">
            Parejas inscritas actualmente
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-3">
            <TrophyIcon className="size-5 text-muted-foreground" />
            Premios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-medium leading-relaxed">
            {typeof tournament.prizes === 'string' 
              ? tournament.prizes 
              : JSON.stringify(tournament.prizes) !== '{}' 
                ? "Premios definidos" 
                : "No se han definido premios"}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Acceso Público</CardTitle>
          <CardDescription className="text-sm">Comparte este ID con los jugadores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 p-4 rounded-xl flex items-center justify-between border">
            <code className="text-2xl font-mono font-black tracking-widest">{shortId}</code>
            <Button variant="ghost" size="sm" className="font-bold">Copiar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
