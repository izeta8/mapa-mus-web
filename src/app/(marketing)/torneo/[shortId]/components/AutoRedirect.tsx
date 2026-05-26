"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Smartphone } from "lucide-react";
import { openInApp } from "@/lib/utils/open-in-app";

interface AutoRedirectProps {
  shortId: string;
}

function shouldShowModal(): boolean {
  const isAndroid = /Android/i.test(navigator.userAgent);
  const hasNoRedirect =
    window.location.hash.includes("no-redirect") ||
    window.location.search.includes("no-redirect") ||
    sessionStorage.getItem("mapamus-no-redirect") === "true";
  return isAndroid && !hasNoRedirect;
}

export function AutoRedirect({ shortId }: AutoRedirectProps) {
  const [isOpen, setIsOpen] = useState(shouldShowModal);

  const handleOpenApp = () => {
    setIsOpen(false);
    openInApp(shortId);
  };

  const handleCancel = () => {
    sessionStorage.setItem("mapamus-no-redirect", "true");
    if (!window.location.hash.includes("no-redirect")) {
      window.location.hash = "no-redirect";
    }
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent
        size="default"
        className="bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-lg max-w-xs w-[90%] mx-auto"
      >
        <AlertDialogHeader className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-[#33AD6A]/10 flex items-center justify-center text-[#33AD6A] mb-3">
            <Smartphone className="w-6 h-6" />
          </div>
          <AlertDialogTitle className="text-lg font-bold text-[#1F1F1F]">
            ¿Abrir en la aplicación?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-[#737373] mt-2">
            Se ha detectado que estás usando un dispositivo móvil. Para una mejor experiencia de uso, ¿quieres abrir el torneo en la app de Mapa Mus?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 flex flex-col gap-2 sm:flex-row-reverse sm:justify-center">
          <AlertDialogAction
            onClick={handleOpenApp}
            className="w-full sm:w-auto px-5 py-2 h-9 bg-[#33AD6A] hover:bg-[#288A56] active:scale-[0.98] text-white font-semibold text-sm rounded-xl transition-all duration-200 cursor-pointer shadow-sm text-center flex items-center justify-center"
          >
            Abrir app
          </AlertDialogAction>
          <AlertDialogCancel
            onClick={handleCancel}
            className="w-full sm:w-auto px-5 py-2 h-9 bg-white hover:bg-[#F7F7F7] text-[#1F1F1F] border border-[#EAEAEA] font-semibold text-sm rounded-xl transition-all duration-200 cursor-pointer shadow-sm text-center flex items-center justify-center"
          >
            Seguir en la web
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
