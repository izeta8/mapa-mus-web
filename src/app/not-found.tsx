import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center px-6 py-24 sm:py-32 lg:px-8 bg-zinc-50 select-none">
      <div className="text-center max-w-md border border-zinc-200 bg-white p-8 rounded-xl shadow-xs">
        <p className="text-sm font-black tracking-widest text-emerald-600 uppercase">Error 404</p>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">Página no encontrada</h1>
        <p className="mt-6 text-base leading-7 text-zinc-500">
          Vaya, parece que la dirección que buscas no existe o ha sido movida. ¡No te preocupes, hay muchos torneos de Mus esperándote!
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/torneos"
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-lg text-sm shadow-sm transition-colors text-center"
          >
            Buscar Torneos
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto border border-zinc-300 hover:bg-zinc-50 text-zinc-700 font-bold px-6 py-3 rounded-lg text-sm transition-colors text-center"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
