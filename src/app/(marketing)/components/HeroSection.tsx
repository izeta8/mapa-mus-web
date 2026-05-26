import Link from "next/link";
import { PhoneMockup } from "./PhoneMockup";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-4 pb-16 lg:pt-8 lg:pb-20 bg-white border-b border-[#EAEAEA]">
      {/* Subtle background grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-[#33AD6A]/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-7 flex flex-col space-y-6 text-left">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#33AD6A]/10 text-[#288A56] text-xs font-bold rounded-full border border-[#33AD6A]/20 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#33AD6A] animate-pulse"></span>
              <span>Fase Beta Pública</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1F1F1F] leading-[1.1] tracking-tight">
              Descubre y participa en torneos de <span className="text-[#33AD6A]">Mus</span>
            </h1>
            
            <p className="text-lg text-[#737373] leading-relaxed max-w-xl">
              Tu mapa de referencia para competir al mus. Localiza torneos en tu zona, accede a sus bases al instante y mantente al día de cada campeonato, todo de forma gratuita y en segundos.
            </p>
            
            {/* App Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-2 items-center">
              <Link
                href="/torneos"
                className="h-12 px-6 bg-[#33AD6A] hover:bg-[#288A56] text-white font-extrabold text-sm rounded-xl flex items-center justify-center transition-all duration-200 shadow-md hover:shadow hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Buscar Torneos en la Web
              </Link>

              {/* Google Play Badge */}
              <a
                href="https://play.google.com/store/apps/details?id=com.izeta.mapamus"
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 bg-white text-[#1F1F1F] hover:bg-[#F7F7F7] border border-[#EAEAEA] hover:border-neutral-300 rounded-xl flex items-center px-4 transition-all duration-200 shadow-sm hover:shadow hover:scale-[1.02] active:scale-[0.98]"
                aria-label="Descargar en Google Play"
              >
                <svg className="w-5 h-5 fill-current mr-3 text-neutral-700" viewBox="0 0 24 24">
                  <path d="M5.25 3.03C5.12 3.16 5 3.39 5 3.69v16.62c0 .3.12.53.25.66l.06.06L15.42 11l-.11-.11L5.31 2.97l-.06.06zM18.8 9.35l-3.32-1.9-3.41 3.43 3.42 3.42 3.31-1.89c.94-.54.94-1.42 0-1.96l.01-.1zM15.41 12.87L5.33 22.95c.16.17.43.2.74.02l12.72-7.27-3.38-2.83zM15.41 11.13L18.79 8.3 6.07 1.03c-.31-.18-.58-.15-.74.02l10.08 10.08z" />
                </svg>
                <div className="text-left">
                  <p className="text-[8px] text-neutral-400 font-semibold uppercase tracking-wider">Disponible en</p>
                  <p className="text-xs font-bold -mt-0.5">Google Play</p>
                </div>
              </a>
            </div>

          </div>

          {/* Right Phone Mockup */}
          <div className="lg:col-span-5 flex justify-center relative">
            <PhoneMockup />
          </div>

        </div>
      </div>
    </section>
  );
}
