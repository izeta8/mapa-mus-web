"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { FileQuestion, Mail, ArrowLeft } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export default function AdminNotFound() {
  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-[#F7F7F7] min-h-[500px] select-none">
      <Card className="max-w-md w-full border border-zinc-200/80 shadow-xs bg-white">
        <CardContent className="p-8 flex flex-col items-center text-center">
          <div className="size-16 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-500 mb-6 border">
            <FileQuestion className="size-8" />
          </div>
          <h2 className="text-2xl font-black text-zinc-800 tracking-tight">
            Página no encontrada
          </h2>
          <p className="mt-4 text-sm text-zinc-500 leading-relaxed">
            La sección o torneo al que intentas acceder no existe, ha sido eliminado o no dispones de los permisos necesarios.
          </p>
          
          <div className="mt-8 w-full flex flex-col gap-3">
            <Link
              href="/admin/panel"
              className="inline-flex w-full items-center justify-center gap-2 bg-[#33AD6A] hover:bg-[#288A56] text-white font-bold h-11 px-6 rounded-xl text-sm transition-all duration-200 shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Panel
            </Link>

            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <button className="inline-flex w-full items-center justify-center gap-2 border border-zinc-300 hover:bg-zinc-50 text-zinc-700 font-bold h-11 px-6 rounded-xl text-sm transition-all duration-200 cursor-pointer">
                    <Mail className="w-4 h-4 text-zinc-500" />
                    Soporte / Contacto
                  </button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Soporte y Contacto</AlertDialogTitle>
                  <AlertDialogDescription>
                    Si tienes alguna consulta, sugerencia o necesitas soporte técnico, ponte en contacto con nosotros.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="my-2 p-4 bg-[#F7F7F7] rounded-xl border border-[#EAEAEA] flex flex-col gap-2">
                  <div className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">Contacto</div>
                  <div className="text-sm font-bold text-[#1F1F1F]">Equipo de Soporte de Mapa Mus</div>
                  <div className="text-sm text-[#33AD6A] font-bold select-all">mapamusapp@gmail.com</div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cerrar</AlertDialogCancel>
                  <a
                    href="mailto:mapamusapp@gmail.com"
                    className="inline-flex items-center justify-center h-8 gap-1.5 px-4 text-xs font-semibold text-white bg-[#33AD6A] hover:bg-[#288A56] rounded-md shadow-sm hover:shadow transition-all duration-200"
                  >
                    Enviar Correo
                  </a>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
