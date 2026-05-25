"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, UserIcon, HashIcon } from "lucide-react";
import { addCouple } from "@/app/actions/tournaments";
import { toast } from "sonner";

interface Props {
  tournamentId: string;
  nextCoupleNumber: number;
}

export function AddParticipantForm({ tournamentId, nextCoupleNumber }: Props) {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!player1.trim() || !player2.trim()) {
      toast.error("Debes introducir el nombre de ambos jugadores");
      return;
    }

    setIsPending(true);
    const result = await addCouple({
      tournamentId,
      player1,
      player2,
      coupleNumber: nextCoupleNumber
    });

    setIsPending(false);

    if (result.success) {
      setPlayer1("");
      setPlayer2("");
      toast.success("Pareja añadida correctamente");
    } else {
      toast.error("Error al añadir la pareja: " + result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4 bg-muted/30 p-6 rounded-2xl border-2 border-dashed mb-8">
      <div className="flex-1 min-w-[200px]">
        <label className="text-sm font-bold mb-2 flex items-center gap-2">
          <UserIcon className="size-4 text-muted-foreground" /> Jugador 1
        </label>
        <Input 
          placeholder="Nombre del primer jugador..." 
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
          className="h-12 text-lg bg-background"
        />
      </div>

      <div className="flex-1 min-w-[200px]">
        <label className="text-sm font-bold mb-2 flex items-center gap-2">
          <UserIcon className="size-4 text-muted-foreground" /> Jugador 2
        </label>
        <Input 
          placeholder="Nombre del segundo jugador..." 
          value={player2}
          onChange={(e) => setPlayer2(e.target.value)}
          className="h-12 text-lg bg-background"
        />
      </div>

      <div className="w-24">
        <label className="text-sm font-bold mb-2 flex items-center gap-2">
          <HashIcon className="size-4" /> Nº
        </label>
        <Input 
          value={nextCoupleNumber}
          disabled
          className="h-12 text-lg text-center font-bold bg-muted"
        />
      </div>
      <Button 
        type="submit" 
        size="lg" 
        className="h-12 px-8 font-bold"
        disabled={isPending}
      >
        <PlusIcon data-icon="inline-start" className="size-5" />
        {isPending ? "Añadiendo..." : "Inscribir"}
      </Button>
    </form>
  );
}
