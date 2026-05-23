import Image from "next/image";
import { Mail } from "lucide-react";

export default function HomePage() {
  return (
    <div className="w-full bg-[#F7F7F7] text-[#1F1F1F] font-sans selection:bg-[#33AD6A]/20 selection:text-[#288A56]">

      {/* Hero Section - Reduced top padding to move content up closer to header */}
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

              {/* App Download Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                {/* Google Play Badge */}
                <a
                  href="https://play.google.com/store/apps/details?id=com.izeta.mapamus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 bg-black text-white hover:bg-neutral-900 rounded-xl flex items-center px-4 transition-all duration-200 border border-neutral-800 shadow-sm hover:shadow hover:scale-[1.02]"
                  aria-label="Descargar en Google Play"
                >
                  <svg className="w-5 h-5 fill-current mr-3" viewBox="0 0 24 24">
                    <path d="M5.25 3.03C5.12 3.16 5 3.39 5 3.69v16.62c0 .3.12.53.25.66l.06.06L15.42 11l-.11-.11L5.31 2.97l-.06.06zM18.8 9.35l-3.32-1.9-3.41 3.43 3.42 3.42 3.31-1.89c.94-.54.94-1.42 0-1.96l.01-.1zM15.41 12.87L5.33 22.95c.16.17.43.2.74.02l12.72-7.27-3.38-2.83zM15.41 11.13L18.79 8.3 6.07 1.03c-.31-.18-.58-.15-.74.02l10.08 10.08z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-[8px] text-neutral-400 font-semibold uppercase tracking-wider">Disponible en</p>
                    <p className="text-xs font-bold -mt-0.5">Google Play</p>
                  </div>
                </a>
              </div>

            </div>

            {/* Right Phone Mockup - Showing actual MapScreen interface */}
            <div className="lg:col-span-5 flex justify-center relative">

              {/* CSS Phone Mockup */}
              <div className="w-[280px] h-[560px] bg-[#1F1F1F] rounded-[28px] p-3 shadow-2xl relative">
                {/* Notch / Speaker */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-36 bg-[#1F1F1F] rounded-b-2xl z-20 flex items-center justify-center">
                  <div className="w-12 h-1 bg-neutral-800 rounded-full mb-1"></div>
                </div>

                {/* Screen Content Container */}
                <div className="w-full h-full bg-[#1F1F1F] rounded-[18px] overflow-hidden relative select-none">
                  <Image
                    src="/map-screenshot.jpg"
                    alt="Vista de la pantalla de mapa de Mapa Mus"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Organizer Section */}
      <section className="py-20 bg-white border-b border-[#EAEAEA]">
        <div className="container mx-auto px-4 max-w-3xl text-center space-y-6">
          <div className="w-12 h-12 bg-[#33AD6A]/10 rounded-full flex items-center justify-center text-[#33AD6A] mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#1F1F1F]">
            ¿Organizas torneos de Mus en tu local?
          </h2>
          <p className="text-sm text-[#737373] leading-relaxed max-w-xl mx-auto">
            Estamos en fase de pruebas y añadiendo los primeros torneos a mano. Si quieres subir tus propios torneos a la plataforma para que aparezcan en el mapa, escríbenos un correo para darte acceso al portal.
          </p>
          <a
            href="mailto:mapamusapp@gmail.com"
            className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold text-white bg-[#33AD6A] hover:bg-[#288A56] rounded-xl transition-all duration-200 shadow-sm"
          >
            Contactar (mapamusapp@gmail.com)
          </a>
        </div>
      </section>

    </div>
  );
}