"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";
import { generateBracket } from "@/app/actions/generate-bracket";
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
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";

interface Props {
  tournamentId: string;
  couplesCount: number;
}

export function StartTournamentButton({ tournamentId, couplesCount }: Props) {
  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);

  const handleStart = async () => {
    if (couplesCount < 2) {
      toast.error("Se necesitan al menos 2 parejas para empezar el torneo");
      return;
    }

    setIsPending(true);
    const result = await generateBracket(tournamentId);
    setIsPending(false);

    if (result.success) {
      toast.success(result.message);
      setOpen(false);
    } else {
      toast.error("Error al iniciar el torneo: " + result.error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger 
        render={
          <Button size="lg" className="h-12 px-8 text-base font-bold bg-primary text-primary-foreground" disabled={isPending}>
            <PlayIcon data-icon="inline-start" className="size-5" />
            {isPending ? "Iniciando..." : "Comenzar Torneo"}
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Comenzar el torneo ahora?</AlertDialogTitle>
          <AlertDialogDescription>
            Se cerrarán las inscripciones y se generará el cuadro de partidos con las {couplesCount} parejas actuales. Esta acción no se puede deshacer fácilmente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleStart} className="bg-primary text-primary-foreground">
            Confirmar e Iniciar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
