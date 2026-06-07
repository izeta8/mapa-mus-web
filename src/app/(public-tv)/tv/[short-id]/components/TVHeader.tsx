import { ViewMode } from "@/types/database";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Network, StretchHorizontal } from "lucide-react";

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
    <header className="flex justify-between items-center shrink-0 mb-6 w-full">
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

      {isBracketCreated && (
        <TVModeSelector viewMode={viewMode} setViewMode={setViewMode} />
      )}

    </header>
  )

}

function TVModeSelector({ viewMode, setViewMode }: TVModeSelectorProps) {

  return (
    <Tabs defaultValue={viewMode}>
      <TabsList className="py-6 bg-zinc-100 rounded-2xl transition-all">

        {/* PAREJAS */}
        <TabsTrigger
          value="matchup"
          className="px-10 py-5 text-2xl flex items-center gap-4 pointer cursor-pointer rounded-xl transition-all"
          onClick={() => setViewMode("matchup")}
        >
          <StretchHorizontal className="w-8 h-8 size-8 shrink-0" />
          Enfrentamientos
        </TabsTrigger>

        {/* CUADRO */}
        <TabsTrigger
          value="bracket"
          className="px-10 py-5 text-xl flex items-center gap-4 pointer cursor-pointer rounded-xl transition-all"
          onClick={() => setViewMode("bracket")}
        >
          <Network className="w-8 h-8 size-8 shrink-0" />
          Cuadro
        </TabsTrigger>

      </TabsList>
    </Tabs>
  )

}
