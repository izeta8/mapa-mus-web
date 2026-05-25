import { Info, Download } from 'lucide-react';

interface AppPromoBannerProps {
  shortId: string;
}

export function AppPromoBanner({ shortId }: AppPromoBannerProps) {
  return (
    <div className="mb-8 bg-white border border-[#EAEAEA] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#33AD6A]/10 flex items-center justify-center text-[#33AD6A]">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <p className="font-semibold text-[#1F1F1F]">¿Tienes la aplicación Mapa Mus?</p>
          <p className="text-xs text-[#737373]">Entérate de todos los partidos de mus a tu alrededor.</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
        <a
          href={`mapamus://tournament/${shortId}`}
          className="px-5 py-2.5 bg-[#33AD6A] text-white font-semibold text-sm rounded-xl hover:bg-[#288A56] transition-all text-center flex-1 sm:flex-initial shadow-sm hover:scale-[1.02] active:scale-[0.98]"
        >
          Abrir en App
        </a>
        <a
          href="https://play.google.com/store/apps/details?id=com.izeta.mapamus"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-white hover:bg-[#F7F7F7] text-[#1F1F1F] border border-[#EAEAEA] font-semibold text-sm rounded-xl transition-all text-center flex-1 sm:flex-initial flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Download className="w-4 h-4 text-[#33AD6A]" />
          Play Store
        </a>
      </div>
    </div>
  );
}
