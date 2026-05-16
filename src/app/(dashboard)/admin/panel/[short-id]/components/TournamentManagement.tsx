import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TournamentFull } from "@/types/database";
import { ParticipantList } from "./ParticipantList";
import { AddParticipantForm } from "./AddParticipantForm";

interface Props {
  tournament: TournamentFull;
}

export function TournamentManagement({ tournament }: Props) {
  const isPlanned = tournament.status === "planned";
  
  // Ordenar parejas por número para que la lista sea predecible
  const sortedCouples = [...(tournament.couples || [])].sort((a, b) => a.couple_number - b.couple_number);
  
  // Calcular el siguiente número de pareja
  const nextCoupleNumber = sortedCouples.length > 0 
    ? Math.max(...sortedCouples.map(c => c.couple_number)) + 1 
    : 1;

  return (
    <Card className="h-full min-h-150 shadow-sm flex flex-col border-2">
      <CardHeader className="p-8 pb-4">
        <CardTitle className="text-2xl font-bold">Gestión del Torneo</CardTitle>
        <CardDescription className="text-base">
          {isPlanned 
            ? "Gestiona los participantes antes de empezar el sorteo inicial." 
            : "Controla los partidos y resultados de la ronda actual."}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-8 pt-4 flex-1 flex flex-col">
        {isPlanned ? (
          <div className="flex flex-col h-full">
            <AddParticipantForm 
              tournamentId={tournament.id} 
              nextCoupleNumber={nextCoupleNumber} 
            />
            
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-6 flex items-center justify-between">
                Participantes Inscritos
                <span className="text-sm font-normal text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  Total: {sortedCouples.length}
                </span>
              </h3>
              
              <ParticipantList couples={sortedCouples} />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center rounded-2xl bg-muted/20 border-2 border-dashed">
            <div className="text-center p-12">
              <h3 className="text-2xl font-bold mb-3">Rondas en curso</h3>
              <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                El torneo ya ha comenzado. Aquí aparecerán los enfrentamientos y resultados.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
