import { QrCode, Tv } from "lucide-react";

export default function TVNotFound() {
  return (
    <div className="h-screen w-full bg-zinc-50 text-zinc-900 flex flex-col justify-center items-center p-8 select-none">
      <div className="max-w-xl w-full text-center flex flex-col items-center">
        
        {/* Large TV Error Icon */}
        <div className="size-20 bg-zinc-100 rounded-3xl flex items-center justify-center text-zinc-400 mb-8 border border-zinc-200 shadow-xs">
          <Tv className="size-10" />
        </div>

        {/* Big Alert Typography */}
        <h1 className="text-sm font-black tracking-widest text-zinc-400 uppercase">
          Pantalla de TV Pública
        </h1>
        <h2 className="text-4xl font-black text-zinc-900 mt-2 tracking-tight">
          Torneo no Encontrado
        </h2>
        
        <p className="text-zinc-500 text-lg mt-6 leading-relaxed max-w-md">
          El identificador de este torneo no existe, ha sido eliminado o la dirección introducida en la TV es incorrecta.
        </p>

        {/* QR Code Container for B2C recovery */}
        <div className="mt-12 flex flex-col items-center border border-zinc-200 bg-white p-6 rounded-2xl shadow-xs">
          <div className="size-40 border-2 border-zinc-950 flex items-center justify-center p-3 relative bg-white">
            {/* Mock QR corners */}
            <div className="absolute top-2 left-2 size-8 border-4 border-zinc-950" />
            <div className="absolute top-2 right-2 size-8 border-4 border-zinc-950" />
            <div className="absolute bottom-2 left-2 size-8 border-4 border-zinc-950" />
            <div className="size-28 border border-dashed border-zinc-300 flex items-center justify-center text-zinc-300">
              <QrCode className="size-12 text-zinc-400" />
            </div>
          </div>
          <span className="text-xs font-black text-zinc-900 uppercase tracking-widest mt-4">
            ESCÁNEAME
          </span>
          <span className="text-sm font-bold text-zinc-500 mt-1 text-center">
            Escanea para buscar tu torneo en Mapa Mus
          </span>
        </div>

      </div>
    </div>
  );
}
