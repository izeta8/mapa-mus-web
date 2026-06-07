"use client";

import { useState, useEffect } from "react";
import { Menu } from "@base-ui/react/menu";
import { Share2, Link2 } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  tournamentName: string;
}

// Custom WhatsApp SVG Icon
function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function ShareButton({ tournamentName }: ShareButtonProps) {
  const [mounted, setMounted] = useState(false);
  const [isShareSupported, setIsShareSupported] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
      setIsShareSupported(typeof navigator !== "undefined" && !!navigator.share);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  const getShareText = () => {
    return `¡Anímate al torneo de Mus: ${tournamentName}! Consulta todos los detalles en Mapa Mus.`;
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: tournamentName,
        text: getShareText(),
        url: window.location.href,
      });
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        toast.error("No se pudo abrir el menú de compartir de tu dispositivo.");
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("¡Enlace copiado al portapapeles!", {
        description: "Ya puedes compartirlo donde quieras.",
      });
    } catch {
      toast.error("No se pudo copiar el enlace al portapapeles.");
    }
  };

  const handleWhatsAppShare = () => {
    const shareUrl = window.location.href;
    const text = `${getShareText()} ${shareUrl}`;
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const buttonContent = (
    <>
      <Share2 className="w-4 h-4 text-[#33AD6A] group-hover:scale-110 transition-transform" />
      Compartir torneo
    </>
  );

  const buttonClassName =
    "w-full py-2.5 px-4 bg-white hover:bg-[#F7F7F7] text-[#1F1F1F] border border-[#EAEAEA] font-bold text-sm rounded-xl transition-all text-center flex items-center justify-center gap-2 shadow-sm hover:scale-[1.01] active:scale-[0.99] cursor-pointer group outline-none";

  if (!mounted) {
    return (
      <button className={buttonClassName} disabled>
        {buttonContent}
      </button>
    );
  }

  if (isShareSupported) {
    return (
      <button onClick={handleNativeShare} className={buttonClassName}>
        {buttonContent}
      </button>
    );
  }

  return (
    <Menu.Root>
      <Menu.Trigger className={buttonClassName}>{buttonContent}</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner side="bottom" align="center" sideOffset={8}>
          <Menu.Popup className="z-50 min-w-[220px] bg-white border border-[#EAEAEA] rounded-xl shadow-md p-1 focus:outline-none animate-in fade-in-0 zoom-in-95 duration-100">
            <Menu.Item
              onClick={handleCopyLink}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-neutral-50 hover:text-zinc-900 rounded-lg cursor-pointer transition-colors outline-none focus:bg-neutral-50"
            >
              <Link2 className="w-4 h-4 text-zinc-400" />
              Copiar enlace
            </Menu.Item>
            <Menu.Item
              onClick={handleWhatsAppShare}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-[#288A56] hover:bg-green-50 hover:text-[#288A56] rounded-lg cursor-pointer transition-colors outline-none focus:bg-green-50"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
              Compartir por WhatsApp
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
