import { ViewMode } from "@/types/database";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { icons, Network, StretchHorizontal } from "lucide-react";

interface TVHeaderProps {
  tournamentName: string;
  viewMode: ViewMode;
  setViewMode: (viewMode: ViewMode) => void;
  inscribedCouples: number;
  aliveCouples: number;
  isBracketCreated: boolean;
}

interface TVModeSelectorProps {
  viewMode: ViewMode;
  setViewMode: (viewMode: ViewMode) => void;
}


export default function TVHeader({ tournamentName, viewMode, setViewMode, inscribedCouples, aliveCouples, isBracketCreated }: TVHeaderProps) {

  return (
    <header className="relative flex justify-between items-center shrink-0 mb-6 w-full">
      <div className="flex items-center gap-8">
        <div className="bg-black text-white px-6 py-3">
          <h1 className="text-5xl font-black tracking-tight uppercase">{tournamentName}</h1>
        </div>
        <div className="flex flex-col">
          <span className="text-base font-black text-zinc-400 tracking-wider">
            {isBracketCreated ? "PAREJAS VIVAS" : "TOTAL PAREJAS"}
          </span>
          <span className="text-4xl font-black text-zinc-850">
            {isBracketCreated ? `${aliveCouples}/${inscribedCouples}` : inscribedCouples}
          </span>
        </div>
      </div>

      {!isBracketCreated && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center">
          <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-wide">
            Parejas Inscritas
          </h2>
          <p className="text-sm font-semibold text-zinc-500 mt-1">
            Esperando a que el organizador inicie el sorteo del cuadro...
          </p>
        </div>
      )}

      {isBracketCreated && (
        <TVModeSelector viewMode={viewMode} setViewMode={setViewMode} />
      )}

    </header>
  )

}

function TVModeSelector({ viewMode, setViewMode }: TVModeSelectorProps) {

  const labelStyle = "px-5 py-5 text-xl flex items-center gap-4 pointer cursor-pointer rounded-xl transition-all"
  const iconStyle = "w-5 h-5 size-5 shrink-0"

  return (

    <Tabs defaultValue={viewMode}>
      <TabsList className="py-6 bg-zinc-100 rounded-2xl transition-all">

        {/* PAREJAS */}
        <TabsTrigger
          value="matchup"
          className={labelStyle}
          onClick={() => setViewMode("matchup")}
        >
          <StretchHorizontal className={iconStyle} />
          Enfrentamientos
        </TabsTrigger>

        {/* CUADRO */}
        <TabsTrigger
          value="bracket"
          className={labelStyle}
          onClick={() => setViewMode("bracket")}
        >
          <Network className={iconStyle} />
          Cuadro
        </TabsTrigger>

      </TabsList>
    </Tabs>
  )

}
