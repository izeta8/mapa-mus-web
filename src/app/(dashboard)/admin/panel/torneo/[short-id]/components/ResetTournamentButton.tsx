"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { resetTournament } from "@/app/actions/tournaments";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

interface Props {
  tournamentId: string;
}

export function ResetTournamentButton({ tournamentId }: Props) {
  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleReset = async () => {
    if (confirmText !== "DESHACER") {
      toast.error("Por favor, escribe DESHACER exactamente en mayúsculas para confirmar.");
      return;
    }

    setIsPending(true);
    try {
      const result = await resetTournament(tournamentId);
      if (result.success) {
        toast.success(result.message || "Sorteo deshecho correctamente.");
        setConfirmText("");
        setOpen(false);
      } else {
        toast.error("Error al deshacer el sorteo: " + result.error);
      }
    } catch (err) {
      toast.error("Error inesperado al deshacer el sorteo.");
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  const isConfirmed = confirmText === "DESHACER";

  return (
    <AlertDialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) {
        setConfirmText(""); // Reset input text on close
      }
    }}>
      <AlertDialogTrigger
        render={
          <Button 
            variant="outline" 
            size="lg" 
            className="h-12 px-6 text-base cursor-pointer gap-2 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
            disabled={isPending}
          >
            <RotateCcw className="size-4" />
            {isPending ? "Deshaciendo..." : "Deshacer Sorteo"}
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Deshacer sorteo y reabrir inscripciones?</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed flex flex-col gap-4">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-left font-medium">
              ⚠️ <strong>¡CUIDADO!</strong> Esta acción eliminará los enfrentamientos, mesas y resultados actuales, permitiéndote volver a la fase de inscripción para añadir o quitar parejas antes de realizar un nuevo sorteo. El nuevo sorteo generará emparejamientos y orden de mesas diferentes.
            </div>

            <div className="flex flex-col gap-2 mt-2 text-left text-zinc-800">
              <label htmlFor="confirm-reset-input" className="text-sm font-bold text-foreground">
                Para confirmar, escribe la palabra <strong className="text-red-700 font-extrabold font-black">DESHACER</strong> en mayúsculas:
              </label>
              <Input
                id="confirm-reset-input"
                type="text"
                placeholder="DESHACER"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full font-bold uppercase tracking-wider text-center"
                disabled={isPending}
                autoFocus
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleReset}
            disabled={!isConfirmed || isPending}
            className="font-bold cursor-pointer"
          >
            {isPending ? "Procesando..." : "Confirmar y Deshacer Sorteo"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
