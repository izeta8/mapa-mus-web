"use client";

import { useEffect, useState } from "react";
import { StretchHorizontal, Network, Loader2Icon } from "lucide-react";
import { setTvViewMode } from "@/app/actions/tournaments";
import { ViewMode } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface Props {
  tournamentId: string;
  currentMode: ViewMode;
}

export function TvViewModeToggle({ tournamentId, currentMode }: Props) {
  const [liveMode, setLiveMode] = useState(currentMode);
  const [lastPropMode, setLastPropMode] = useState(currentMode);
  const [isPending, setIsPending] = useState(false);

  // Mantenerse al día con el valor del servidor (ej. tras revalidatePath en esta misma sesión)
  if (currentMode !== lastPropMode) {
    setLastPropMode(currentMode);
    setLiveMode(currentMode);
  }

  // Escuchar cambios remotos (ej. el cambio automático octavos<->cuartos disparado desde la TV,
  // o el organizador cambiando el modo desde otro dispositivo).
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`admin-tv-view-mode-${tournamentId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'tournaments',
          filter: `id=eq.${tournamentId}`,
        },
        (payload) => {
          const newMode = (payload.new as { tv_view_mode?: ViewMode }).tv_view_mode;
          if (newMode) {
            setLiveMode(newMode);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tournamentId]);

  const handleChange = async (mode: ViewMode) => {
    if (mode === liveMode || isPending) return;

    setIsPending(true);
    setLiveMode(mode);
    const result = await setTvViewMode(tournamentId, mode);
    setIsPending(false);

    if (result.success) {
      toast.success(mode === "bracket" ? "TV cambiada a vista de Cuadro" : "TV cambiada a vista de Enfrentamientos");
    } else {
      setLiveMode(currentMode);
      toast.error("Error: " + result.error);
    }
  };

  return (
    <div className="flex items-center h-12 rounded-md border bg-muted/50 p-1 gap-1">
      <button
        type="button"
        disabled={isPending}
        onClick={() => handleChange("matchup")}
        title="Mostrar Enfrentamientos en la TV"
        className={`flex items-center gap-2 px-4 h-full rounded-sm text-sm font-bold transition-all cursor-pointer disabled:cursor-not-allowed ${
          liveMode === "matchup" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <StretchHorizontal className="size-4" />
        Enfrentamientos
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => handleChange("bracket")}
        title="Mostrar Cuadro en la TV"
        className={`flex items-center gap-2 px-4 h-full rounded-sm text-sm font-bold transition-all cursor-pointer disabled:cursor-not-allowed ${
          liveMode === "bracket" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {isPending ? <Loader2Icon className="size-4 animate-spin" /> : <Network className="size-4" />}
        Cuadro
      </button>
    </div>
  );
}
