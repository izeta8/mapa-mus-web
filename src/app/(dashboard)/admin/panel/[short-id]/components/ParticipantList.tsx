"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2Icon, UserIcon } from "lucide-react";
import { deleteCouple } from "@/app/actions/tournaments";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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

export function ParticipantList({ couples }: { couples: any[] }) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    const result = await deleteCouple(id);
    setIsDeleting(null);

    if (result.success) {
      toast.success("Pareja eliminada correctamente");
    } else {
      toast.error("Error al eliminar: " + result.error);
    }
  };

  if (couples.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/10 rounded-2xl border-2 border-dashed">
        <p className="text-muted-foreground text-lg">No hay parejas inscritas todavía.</p>
      </div>
    );
  }

  return (
    <div className="border-2 rounded-2xl overflow-hidden bg-background shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[80px] text-center font-bold text-foreground h-14">Nº</TableHead>
            <TableHead className="font-bold text-foreground h-14">Jugador 1</TableHead>
            <TableHead className="font-bold text-foreground h-14">Jugador 2</TableHead>
            <TableHead className="w-[80px] text-right h-14 pr-6">Borrar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {couples.map((couple) => (
            <TableRow key={couple.id} className="hover:bg-muted/30 transition-colors h-16">
              <TableCell className="text-center">
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-black text-lg">
                  {couple.couple_number}
                </span>
              </TableCell>
              <TableCell className="font-semibold text-lg">
                <div className="flex items-center gap-3">
                  <UserIcon className="size-5 text-muted-foreground/50" />
                  {couple.player1_name}
                </div>
              </TableCell>
              <TableCell className="font-semibold text-lg">
                <div className="flex items-center gap-3">
                  <UserIcon className="size-5 text-muted-foreground/50" />
                  {couple.player2_name}
                </div>
              </TableCell>
              <TableCell className="text-right pr-6">
                <AlertDialog>
                  <AlertDialogTrigger 
                    render={
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10 size-10" 
                        disabled={isDeleting === couple.id}
                      >
                        <Trash2Icon className="size-5" />
                      </Button>
                    }
                  />
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar pareja?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Estás a punto de eliminar a la pareja nº {couple.couple_number} ({couple.player1_name} y {couple.player2_name}).
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDelete(couple.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
