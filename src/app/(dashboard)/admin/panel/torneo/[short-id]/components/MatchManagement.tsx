"use client";

import { useState } from "react";
import { TournamentFull, MatchWithCouples } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrophyIcon, MapPinIcon, CheckIcon, Loader2Icon, Undo2Icon, ChevronRightIcon } from "lucide-react";
import { setMatchWinner, rollbackMatchWinner, advanceTournamentRound, revertTournamentRound } from "@/app/actions/tournaments";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
  tournament: TournamentFull;
}

export function MatchManagement({ tournament }: Props) {

  // Obtener todas las rondas únicas de los partidos
  const rounds = Array.from(new Set(tournament.matches.map(m => m.round))).sort((a, b) => b - a);

  // La ronda del torneo que manda (lo que ve la TV)
  const tournamentCurrentRound = tournament.current_round || rounds[0] || 1;

  // Estado local para la pestaña que estamos mirando el organizador
  const [activeTab, setActiveTab] = useState(tournamentCurrentRound.toString());
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isReverting, setIsReverting] = useState(false);
  const [revertDialogOpen, setRevertDialogOpen] = useState(false);

  // Verificar si la ronda que estamos mirando está completa
  const currentTabMatches = tournament.matches.filter(m => m.round === parseInt(activeTab));
  const isRoundComplete = currentTabMatches.length > 0 && currentTabMatches.every(m => m.winner_id !== null || m.is_bye);

  // Verificar si es la ronda que está actualmente "en la TV"
  const isViewingCurrentTournamentRound = parseInt(activeTab) === tournamentCurrentRound;

  // Verificar si ya hay resultados registrados en la ronda activa o siguientes (números de ronda menores o iguales)
  const hasSubsequentResults = tournament.matches.some(
    m => m.round <= tournamentCurrentRound && m.winner_id !== null && !m.is_bye
  );

  const handleAdvanceRound = async () => {
    const nextRound = tournamentCurrentRound - 1;
    if (nextRound < 1) {
      toast.info("¡Este es el último partido del torneo!");
      return;
    }

    setIsAdvancing(true);
    const result = await advanceTournamentRound(tournament.id, nextRound);
    setIsAdvancing(false);

    if (result.success) {
      toast.success(`Ronda ${nextRound} anunciada en TV`);
      setActiveTab(nextRound.toString());
    } else {
      toast.error("Error: " + result.error);
    }
  };

  const handleRevertRound = async () => {
    const prevRound = tournamentCurrentRound + 1;
    if (prevRound > rounds[0]) {
      return;
    }

    setIsReverting(true);
    const result = await revertTournamentRound(tournament.id, prevRound);
    setIsReverting(false);

    if (result.success) {
      toast.success(`Ronda revertida a la Ronda ${prevRound}`);
      setActiveTab(prevRound.toString());
      setRevertDialogOpen(false);
    } else {
      toast.error("Error al revertir ronda: " + result.error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="bg-muted/50 p-1 h-12">
            {rounds.map((round) => (
              <TabsTrigger
                key={round}
                value={round.toString()}
                className="px-6 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2"
              >
                Ronda {round}
                {round === tournamentCurrentRound && (
                  <span className="size-2 bg-emerald-500 rounded-full animate-pulse" title="Ronda en TV" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex items-center gap-4">
            {/* Botón de Retroceder Ronda con Modal */}
            {isViewingCurrentTournamentRound && tournamentCurrentRound < rounds[0] && (
              <AlertDialog open={revertDialogOpen} onOpenChange={setRevertDialogOpen}>
                <AlertDialogTrigger
                  render={
                    <Button
                      disabled={isReverting}
                      variant="outline"
                      className="border-destructive/30 text-destructive hover:bg-destructive/10 font-bold h-12 px-6 shadow-sm"
                    >
                      {isReverting ? <Loader2Icon className="size-5 animate-spin mr-2" /> : <Undo2Icon className="size-5 mr-2" />}
                      Volver a Ronda {tournamentCurrentRound + 1}
                    </Button>
                  }
                />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Volver a la Ronda {tournamentCurrentRound + 1}?</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {hasSubsequentResults ? (
                        <span>
                          <strong className="text-destructive font-bold">¡Atención!</strong> Ya se han registrado resultados en la Ronda {tournamentCurrentRound}.
                          Si vuelves atrás y modificas algún resultado en la Ronda {tournamentCurrentRound + 1}, se <strong className="text-foreground font-bold">anularán automáticamente</strong> los resultados de los partidos siguientes que dependan de ese cambio para mantener la coherencia del cuadro.
                        </span>
                      ) : (
                        `Esto cambiará la ronda activa en la TV a la Ronda ${tournamentCurrentRound + 1} para que puedas modificar o revisar sus resultados. Los emparejamientos y resultados de otras ramas del torneo que no sean modificadas permanecerán intactos.`
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRevertRound} className="bg-primary text-primary-foreground">
                      Confirmar y volver
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {/* Botón de Avanzar Ronda */}
            {isRoundComplete && isViewingCurrentTournamentRound && tournamentCurrentRound > 1 && (
              <Button
                onClick={handleAdvanceRound}
                disabled={isAdvancing}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 px-6 shadow-lg animate-in zoom-in-95 duration-300"
              >
                {isAdvancing ? <Loader2Icon className="size-5 animate-spin mr-2" /> : <ChevronRightIcon className="size-5 mr-2" />}
                Anunciar Ronda {tournamentCurrentRound - 1} en TV
              </Button>
            )}

            <div className="text-sm font-medium text-muted-foreground bg-muted px-4 py-2 rounded-full border">
              Ronda Actual: <span className="text-primary font-bold">Ronda {tournamentCurrentRound}</span>
            </div>
          </div>
        </div>

        {rounds.map((round) => {
          const roundMatches = tournament.matches.filter((m) => m.round === round);
          const mainMatches = roundMatches.filter((m) => !m.is_consolation).sort((a, b) => a.row_index - b.row_index);
          const consolationMatches = roundMatches.filter((m) => m.is_consolation).sort((a, b) => a.row_index - b.row_index);

          return (
            <TabsContent key={round} value={round.toString()} className="mt-0">
              <div className="flex flex-col gap-8">
                {mainMatches.length > 0 && (
                  <div className="flex flex-col gap-4">
                    {consolationMatches.length > 0 && (
                      <h3 className="text-lg font-black text-foreground/80 flex items-center gap-2 px-1">
                        🏆 Gran Final
                      </h3>
                    )}
                    <div className="grid grid-cols-1 gap-4">
                      {mainMatches.map((match) => (
                        <MatchCard 
                          key={match.id} 
                          match={match} 
                          isActiveRound={round === tournamentCurrentRound}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {consolationMatches.length > 0 && (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-black text-foreground/80 flex items-center gap-2 px-1 border-t pt-6 border-dashed border-muted-foreground/20">
                      🥉 3er y 4º Puesto
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {consolationMatches.map((match) => (
                        <MatchCard 
                          key={match.id} 
                          match={match} 
                          isActiveRound={round === tournamentCurrentRound}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

function MatchCard({ match, isActiveRound }: { match: MatchWithCouples; isActiveRound: boolean }) {
  const [isSettingWinner, setIsSettingWinner] = useState<string | null>(null);
  const [isRollingBack, setIsRollingBack] = useState(false);

  const isCompleted = match.winner_id !== null;
  const isBye = match.is_bye;

  const handleSetWinner = async (coupleId: string) => {
    // Si ya había un ganador, primero deshacemos (limpieza automática)
    if (isCompleted) {
      setIsRollingBack(true);
      await rollbackMatchWinner(match.id);
      setIsRollingBack(false);
    }

    setIsSettingWinner(coupleId);
    const result = await setMatchWinner(match.id, coupleId);
    setIsSettingWinner(null);
    if (result.success) {
      toast.success("Resultado guardado");
    } else {
      toast.error("Error: " + result.error);
    }
  };

  const handleRollback = async () => {
    setIsRollingBack(true);
    const result = await rollbackMatchWinner(match.id);
    setIsRollingBack(false);
    if (result.success) {
      toast.success("Resultado anulado");
    } else {
      toast.error("Error: " + result.error);
    }
  };

  if (isBye) {
    return (
      <Card className="bg-muted/30 border-dashed opacity-80">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="size-12 bg-zinc-200 rounded-lg flex items-center justify-center font-black text-zinc-500">
              PASA
            </div>
            <div>
              <p className="font-bold text-lg text-zinc-600">
                {match.couple1?.player1_name} y {match.couple1?.player2_name}
              </p>
              <p className="text-sm text-zinc-400">Pasan directo a la siguiente ronda</p>
            </div>
          </div>
          <CheckIcon className="size-6 text-emerald-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden transition-all border-2 ${isCompleted ? 'bg-muted/5' : 'bg-background hover:border-primary/30 shadow-sm'}`}>
      <CardContent className="p-0 flex flex-col md:flex-row">
        {/* Mesa Info (Solo Lectura) */}
        <div className="w-1/2 md:w-48 bg-muted/50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-dashed">
          <label className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1">
            <MapPinIcon className="size-3" /> Mesa
          </label>
          <div className="text-4xl font-black text-foreground">
            {match.table_number || "--"}
          </div>
        </div>

        {/* Enfrentamiento */}
        <div className="flex-1 p-6 flex items-center justify-around gap-4">
          {/* Pareja 1 */}
          <div className={`flex flex-col items-center gap-4 flex-1 transition-all ${isCompleted && match.winner_id === match.couple1_id ? 'scale-105' : isCompleted ? 'opacity-40 grayscale' : ''}`}>
            <div className="size-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-2xl">
              {match.couple1?.couple_number || '?'}
            </div>
            <div className="text-center">
              <p className="font-bold text-xl leading-tight truncate max-w-[150px]">{match.couple1?.player1_name}</p>
              <p className="font-bold text-xl leading-tight text-muted-foreground truncate max-w-[150px]">{match.couple1?.player2_name}</p>
            </div>

            {isCompleted && match.winner_id === match.couple1_id ? (
              <div className="flex flex-col items-center gap-2">
                <div className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-black flex items-center gap-1 shadow-sm">
                  <TrophyIcon className="size-3" /> GANADOR
                </div>
                {isActiveRound && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground hover:text-destructive h-7"
                    onClick={handleRollback}
                    disabled={isRollingBack}
                  >
                    <Undo2Icon className="size-3 mr-1" /> {isRollingBack ? "..." : "Deshacer"}
                  </Button>
                )}
              </div>
            ) : !isCompleted && isActiveRound ? (
              <Button
                onClick={() => match.couple1_id && handleSetWinner(match.couple1_id)}
                disabled={!!isSettingWinner || isRollingBack || !match.couple1_id || !match.couple2_id}
                className="w-full font-bold h-10"
                variant="outline"
              >
                {isSettingWinner === match.couple1_id ? <Loader2Icon className="size-4 animate-spin" /> : "Gana"}
              </Button>
            ) : null}
          </div>

          <div className="text-3xl font-black text-muted-foreground/20 italic">VS</div>

          {/* Pareja 2 */}
          <div className={`flex flex-col items-center gap-4 flex-1 transition-all ${isCompleted && match.winner_id === match.couple2_id ? 'scale-105' : isCompleted ? 'opacity-40 grayscale' : ''}`}>
            <div className="size-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-2xl">
              {match.couple2?.couple_number || '?'}
            </div>
            <div className="text-center">
              <p className="font-bold text-xl leading-tight truncate max-w-[150px]">{match.couple2?.player1_name}</p>
              <p className="font-bold text-xl leading-tight text-muted-foreground truncate max-w-[150px]">{match.couple2?.player2_name}</p>
            </div>

            {isCompleted && match.winner_id === match.couple2_id ? (
              <div className="flex flex-col items-center gap-2">
                <div className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-black flex items-center gap-1 shadow-sm">
                  <TrophyIcon className="size-3" /> GANADOR
                </div>
                {isActiveRound && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground hover:text-destructive h-7"
                    onClick={handleRollback}
                    disabled={isRollingBack}
                  >
                    <Undo2Icon className="size-3 mr-1" /> {isRollingBack ? "..." : "Deshacer"}
                  </Button>
                )}
              </div>
            ) : !isCompleted && isActiveRound ? (
              <Button
                onClick={() => match.couple2_id && handleSetWinner(match.couple2_id)}
                disabled={!!isSettingWinner || isRollingBack || !match.couple1_id || !match.couple2_id}
                className="w-full font-bold h-10"
                variant="outline"
              >
                {isSettingWinner === match.couple2_id ? <Loader2Icon className="size-4 animate-spin" /> : "Gana"}
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
