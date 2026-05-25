"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building, Trophy, X, Mail, ShieldAlert } from "lucide-react";
import { SignOutButton } from "./SignOutButton";
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
import { requestAccountVerification } from "@/app/actions/auth";
import { toast } from "sonner";

const NAV_LINKS = [
  { href: "/admin/panel", label: "Mis Torneos", icon: Trophy },
  { href: "/admin/panel/organizador/editar", label: "Editar Organizador", icon: Building },
];

export interface SidebarProps {
  orgName: string | null;
  isVerified: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ orgName, isVerified, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [isPending, setIsPending] = useState(false);

  const handleRequestVerification = async () => {
    setIsPending(true);
    try {
      const res = await requestAccountVerification();
      if (res.success) {
        toast.success(res.message || "Solicitud de verificación recibida con éxito.");
      } else {
        toast.error(res.error || "No se pudo enviar la solicitud.");
      }
    } catch {
      toast.error("Ocurrió un error al enviar la solicitud de verificación.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 border-r bg-white p-5 flex flex-col justify-between shadow-sm shrink-0 transition-transform duration-200 ease-in-out
        min-[700px]:static min-[700px]:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div>
        <div className="mb-8 border-b pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-[#1F1F1F] tracking-tight">
              Mapa<span className="text-[#33AD6A]">Mus</span> <span className="text-xs font-semibold px-2 py-0.5 bg-[#33AD6A]/10 text-[#288A56] rounded-full border border-[#33AD6A]/20">Organizador</span>
            </h2>
            {orgName && (
              <p className="text-xs text-neutral-500 font-medium mt-1 truncate max-w-[180px]">
                {orgName}
              </p>
            )}
          </div>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="p-1 text-neutral-500 hover:bg-[#F3F4F6] rounded-lg min-[700px]:hidden focus:outline-none cursor-pointer"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-1">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                  ${isActive
                    ? "bg-[#33AD6A]/10 text-[#288A56]"
                    : "text-neutral-700 hover:bg-[#F3F4F6]"
                  }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t pt-4 space-y-2">
        {!isVerified && (
          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col gap-2.5">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-800">Cuenta no verificada</h4>
                <p className="text-[11px] text-neutral-500 font-medium leading-relaxed mt-1">
                  Los torneos que publiques no serán visibles hasta que un administrador los valide.
                </p>
              </div>
            </div>

            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <button className="w-full text-center px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer shadow-xs">
                    Saber más
                  </button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Verificación de Cuenta</AlertDialogTitle>
                  <AlertDialogDescription>
                    Su cuenta no está verificada por los administradores de MapaMus. Los torneos que publiques no serán visibles por la gente hasta que algun administrador lo valide.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cerrar</AlertDialogCancel>
                  <button
                    disabled={isPending}
                    onClick={handleRequestVerification}
                    className="inline-flex items-center justify-center h-8 px-4 text-xs font-semibold text-white bg-[#33AD6A] hover:bg-[#288A56] disabled:bg-neutral-200 disabled:text-neutral-500 rounded-md shadow-sm transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isPending ? "Solicitando..." : "Solicitar Verificación"}
                  </button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <button className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-semibold text-neutral-500 hover:bg-[#F3F4F6] hover:text-neutral-900 transition-all duration-200 text-left cursor-pointer">
                <Mail className="w-5 h-5 text-neutral-400" />
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
        <SignOutButton />
      </div>
    </aside>
  );
}
