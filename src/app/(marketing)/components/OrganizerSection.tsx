import { Mail } from "lucide-react";

export function OrganizerSection() {
  return (
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
  );
}
