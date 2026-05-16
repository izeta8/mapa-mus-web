import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UsersIcon } from "lucide-react";
import { TournamentFull } from "@/types/database";

interface Props {
  tournament: TournamentFull;
}

export function TournamentManagement({ tournament }: Props) {
  const isPlanned = tournament.status === "planned";

  return (
    <Card className="h-full min-h-[500px] shadow-sm flex flex-col border-2">
      <CardHeader className="p-8 pb-4">
        <CardTitle className="text-2xl font-bold">Gestión del Torneo</CardTitle>
        <CardDescription className="text-base">
          {isPlanned 
            ? "Gestiona los participantes antes de empezar el sorteo inicial." 
            : "Controla los partidos y resultados de la ronda actual."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center m-8 mt-4 rounded-2xl bg-muted/20 border-2 border-dashed">
        <div className="text-center p-12">
          <div className="size-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <UsersIcon className="size-10 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Próximo paso: Lista de Participantes</h3>
          <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
            Aquí aparecerán las parejas inscritas. Podrás añadir nuevas o eliminarlas antes de generar el sorteo inicial.
          </p>
          <Button variant="secondary" size="lg" className="px-8 h-12 font-semibold">
            Ver documentación de ayuda
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
