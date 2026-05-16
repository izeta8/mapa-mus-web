"use client";

import { useState } from "react";
import { TournamentFull, MatchWithCouples } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrophyIcon, MapPinIcon, CheckIcon, Loader2Icon, Undo2Icon } from "lucide-react";
import { updateMatchTable, setMatchWinner, rollbackMatchWinner } from "@/app/actions/tournaments";
import { toast } from "sonner";

interface Props {
  tournament: TournamentFull;
}

export function MatchManagement({ tournament }: Props) {

  // Get all unique rounds from the matches
  const rounds = Array.from(new Set(tournament.matches.map(m => m.round))).sort((a, b) => b - a);
  
  // The default active round is the highest one that has incomplete matches
  const defaultRound = Math.max(...tournament.matches.filter(m => m.status !== 'completed' || m.is_bye).map(m => m.round), rounds[0] || 1);
  
  const [activeTab, setActiveRound] = useState(defaultRound.toString());

  return (
    <div className="flex flex-col h-full">
      <Tabs value={activeTab} onValueChange={setActiveRound} className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="bg-muted/50 p-1 h-12">
            {rounds.map((round) => (
              <TabsTrigger 
                key={round} 
                value={round.toString()}
                className="px-6 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Ronda {round}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="text-sm font-medium text-muted-foreground bg-muted px-4 py-2 rounded-full border">
            Estado: <span className="text-primary font-bold">En Juego (Live)</span>
          </div>
        </div>

        {rounds.map((round) => (
          <TabsContent key={round} value={round.toString()} className="mt-0">
            <div className="grid grid-cols-1 gap-4">
              {tournament.matches
                .filter((m) => m.round === round)
                .sort((a, b) => a.row_index - b.row_index)
                .map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function MatchCard({ match }: { match: MatchWithCouples }) {
  const [table, setTable] = useState(match.table_number || "");
  const [isUpdatingTable, setIsUpdatingTable] = useState(false);
  const [isSettingWinner, setIsSettingWinner] = useState<string | null>(null);
  const [isRollingBack, setIsRollingBack] = useState(false);

  const isCompleted = match.status === 'completed';
  const isBye = match.is_bye;

  const handleTableUpdate = async () => {
    if (table === match.table_number) return;
    setIsUpdatingTable(true);
    const result = await updateMatchTable(match.id, table || null);
    setIsUpdatingTable(false);
    if (result.success) {
      toast.success("Mesa actualizada");
    } else {
      toast.error("Error: " + result.error);
    }
  };

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
        
        {/* Mesa Info */}
        <div className="w-full md:w-48 bg-muted/50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-dashed">
          <label className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1">
            <MapPinIcon className="size-3" /> Mesa
          </label>
          <div className="flex items-center gap-2">
            <Input 
              value={table}
              onChange={(e) => setTable(e.target.value)}
              onBlur={handleTableUpdate}
              placeholder="--"
              className="h-12 w-20 text-center text-2xl font-black bg-background border-2"
              disabled={isCompleted}
            />
            {isUpdatingTable && <Loader2Icon className="size-4 animate-spin text-primary" />}
          </div>
        </div>

        {/* Enfrentamiento */}
        <div className="flex-1 p-6 flex items-center justify-around gap-4">
          {/* Pareja 1 */}
          <div className={`flex flex-col items-center gap-4 flex-1 transition-all ${match.winner_id === match.couple1_id ? 'scale-105' : isCompleted ? 'opacity-40 grayscale' : ''}`}>
             <div className="size-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-2xl">
              {match.couple1?.couple_number || '?'}
            </div>
            <div className="text-center">
              <p className="font-bold text-xl leading-tight truncate max-w-[150px]">{match.couple1?.player1_name}</p>
              <p className="font-bold text-xl leading-tight text-muted-foreground truncate max-w-[150px]">{match.couple1?.player2_name}</p>
            </div>
            
            {match.winner_id === match.couple1_id ? (
              <div className="flex flex-col items-center gap-2">
                <div className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-black flex items-center gap-1 shadow-sm">
                  <TrophyIcon className="size-3" /> GANADOR
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-muted-foreground hover:text-destructive h-7"
                  onClick={handleRollback}
                  disabled={isRollingBack}
                >
                  <Undo2Icon className="size-3 mr-1" /> {isRollingBack ? "..." : "Deshacer"}
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => match.couple1_id && handleSetWinner(match.couple1_id)}
                disabled={!!isSettingWinner || isRollingBack || !match.couple1_id || !match.couple2_id}
                className="w-full font-bold h-10"
                variant={isCompleted ? "ghost" : "outline"}
              >
                {isSettingWinner === match.couple1_id ? <Loader2Icon className="size-4 animate-spin" /> : isCompleted ? "Corregir" : "Gana"}
              </Button>
            )}
          </div>

          <div className="text-3xl font-black text-muted-foreground/20 italic">VS</div>

          {/* Pareja 2 */}
          <div className={`flex flex-col items-center gap-4 flex-1 transition-all ${match.winner_id === match.couple2_id ? 'scale-105' : isCompleted ? 'opacity-40 grayscale' : ''}`}>
             <div className="size-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-2xl">
              {match.couple2?.couple_number || '?'}
            </div>
            <div className="text-center">
              <p className="font-bold text-xl leading-tight truncate max-w-[150px]">{match.couple2?.player1_name}</p>
              <p className="font-bold text-xl leading-tight truncate max-w-[150px]">{match.couple2?.player2_name}</p>
            </div>

            {match.winner_id === match.couple2_id ? (
              <div className="flex flex-col items-center gap-2">
                <div className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-black flex items-center gap-1 shadow-sm">
                  <TrophyIcon className="size-3" /> GANADOR
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-muted-foreground hover:text-destructive h-7"
                  onClick={handleRollback}
                  disabled={isRollingBack}
                >
                  <Undo2Icon className="size-3 mr-1" /> {isRollingBack ? "..." : "Deshacer"}
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => match.couple2_id && handleSetWinner(match.couple2_id)}
                disabled={!!isSettingWinner || isRollingBack || !match.couple1_id || !match.couple2_id}
                className="w-full font-bold h-10"
                variant={isCompleted ? "ghost" : "outline"}
              >
                {isSettingWinner === match.couple2_id ? <Loader2Icon className="size-4 animate-spin" /> : isCompleted ? "Corregir" : "Gana"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
