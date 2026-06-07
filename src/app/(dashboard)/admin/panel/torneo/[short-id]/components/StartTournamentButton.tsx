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
  prizes?: unknown;
}

export function StartTournamentButton({ tournamentId, couplesCount, prizes }: Props) {
  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);

  // Resolve default prizes count from tournament JSON
  const defaultPrizes = (prizes && Array.isArray(prizes)) ? prizes.length : 2;
  const [inputValue, setInputValue] = useState(defaultPrizes.toString());

  // Calculate numeric value in real-time to update the UI as the user types
  const parsedValue = parseInt(inputValue);
  const positionsPreview = isNaN(parsedValue) ? 0 : parsedValue;

  const handleBlur = () => {
    let val = parseInt(inputValue) || 2;
    val = Math.max(2, val); // At least 2 positions
    setInputValue(val.toString());
  };

  const handleStart = async () => {
    if (couplesCount < 2) {
      toast.error("Se necesitan al menos 2 parejas para empezar el torneo");
      return;
    }

    // Use current input value (in case user clicks start button without triggering blur)
    let finalPositions = parseInt(inputValue) || 2;
    finalPositions = Math.max(2, finalPositions);

    setIsPending(true);
    const result = await generateBracket(tournamentId, finalPositions);
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
          <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
            Se cerrarán las inscripciones y se generará el cuadro de partidos con las {couplesCount} parejas actuales. Esta acción no se puede deshacer fácilmente.

            <div className="flex flex-col gap-2 mt-4 p-4 bg-muted/30 rounded-lg border border-dashed text-left">
              <label className="text-sm font-bold text-foreground">
                Puestos a determinar:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={2}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onBlur={handleBlur}
                  className="w-20 px-3 py-1.5 border rounded bg-background font-bold text-center text-foreground"
                />
                <span className="text-xs text-muted-foreground leading-snug">
                  {positionsPreview <= 2 ? (
                    "Solo se jugará la Gran Final (1º y 2º puesto)."
                  ) : (
                    <span>
                      Se disputarán partidos para determinar hasta el <strong className="text-foreground font-bold">4º puesto</strong> (Gran Final y 3er/4º puesto).
                      {positionsPreview > 4 && (
                        <span className="block mt-1 text-amber-600 font-medium font-semibold">
                          ⚠️ Los {positionsPreview - 4} puestos restantes (del 5º al {positionsPreview}º) deberán ser gestionados manualmente.
                        </span>
                      )}
                    </span>
                  )}
                </span>
              </div>
            </div>
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
