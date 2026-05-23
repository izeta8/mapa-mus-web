import Image from "next/image";

export function PhoneMockup() {
  return (
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
  );
}
