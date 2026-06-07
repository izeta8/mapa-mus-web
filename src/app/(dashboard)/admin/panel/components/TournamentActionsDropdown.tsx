'use client'

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "@base-ui/react/menu";
import { MoreVertical, Trash2, FileText, Globe } from "lucide-react";
import { toast } from "sonner";
import { deleteTournament, changeTournamentStatusToDraft, publishTournament } from "@/app/actions/tournaments";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface TournamentActionsDropdownProps {
  tournamentId: string;
  currentStatus: string;
  tournamentName: string;
  isOrganizerVerified?: boolean;
}

export function TournamentActionsDropdown({
  tournamentId,
  currentStatus,
  tournamentName,
  isOrganizerVerified = false,
}: TournamentActionsDropdownProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSetDraft = (e: React.MouseEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await changeTournamentStatusToDraft(tournamentId);
      if (res.success) {
        toast.success("Torneo cambiado a borrador con éxito.");
        router.refresh();
      } else {
        toast.error(res.error || "Ocurrió un error al cambiar el estado del torneo.");
      }
    });
  };

  const handlePublish = (e: React.MouseEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await publishTournament(tournamentId);
      if (res.success) {
        toast.success("Torneo publicado con éxito.");
        router.refresh();
      } else {
        toast.error(res.error || "Ocurrió un error al publicar el torneo.");
      }
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await deleteTournament(tournamentId);
      if (res.success) {
        toast.success("Torneo eliminado con éxito.");
        setIsDeleteDialogOpen(false);
        router.refresh();
      } else {
        toast.error(res.error || "Ocurrió un error al eliminar el torneo.");
      }
    });
  };

  return (
    <>
      <Menu.Root>
        <Menu.Trigger className="p-1 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer text-zinc-500 hover:text-zinc-800 outline-none flex items-center justify-center">
          <MoreVertical className="w-4 h-4" />
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner side="bottom" align="end" sideOffset={4}>
            <Menu.Popup className="z-50 min-w-[160px] bg-white border border-[#EAEAEA] rounded-xl shadow-md p-1 focus:outline-none animate-in fade-in-0 zoom-in-95 duration-100">
              {currentStatus !== "revision_pending" && (
                <Menu.Item
                  onClick={handleSetDraft}
                  disabled={isPending}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-neutral-50 hover:text-zinc-900 rounded-lg cursor-pointer transition-colors outline-none focus:bg-neutral-50 disabled:opacity-50"
                >
                  <FileText className="w-3.5 h-3.5 text-zinc-400" />
                  Mover a Borrador
                </Menu.Item>
              )}
              {currentStatus === "revision_pending" && isOrganizerVerified && (
                <Menu.Item
                  onClick={handlePublish}
                  disabled={isPending}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#288A56] hover:bg-green-50 hover:text-[#288A56] rounded-lg cursor-pointer transition-colors outline-none focus:bg-green-50 disabled:opacity-50"
                >
                  <Globe className="w-3.5 h-3.5 text-[#33AD6A]" />
                  Publicar Torneo
                </Menu.Item>
              )}
              
              <Menu.Item
                onClick={(e) => { e.preventDefault(); setIsDeleteDialogOpen(true); }}
                disabled={isPending}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg cursor-pointer transition-colors outline-none focus:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                Eliminar Torneo
              </Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>

      {/* Delete confirmation modal */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar Torneo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará de forma permanente el torneo <strong>{tournamentName}</strong> junto con todas sus parejas, enfrentamientos e inscripciones. No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="inline-flex items-center justify-center h-8 gap-1.5 px-4 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              {isPending ? "Eliminando..." : "Eliminar Torneo"}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
