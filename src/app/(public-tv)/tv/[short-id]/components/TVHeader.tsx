import { ViewMode } from "@/types/database";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Network, StretchHorizontal } from "lucide-react";

interface TVHeaderProps {
  tournamentName: string;
  setViewMode: (viewMode: ViewMode) => void;
  inscribedCouples: number;
  isBracketCreated: boolean;
}

interface TVModeSelectorProps {
  setViewMode: (viewMode: ViewMode) => void;
}


export default function TVHeader({tournamentName, setViewMode, inscribedCouples, isBracketCreated}: TVHeaderProps) {

  return (
    <header className="flex justify-between items-center shrink-0 mb-4">
        <div className="flex items-center gap-4">
          <div className="bg-black text-white px-4 py-2">
            <h1 className="text-3xl font-black tracking-tight">{tournamentName}</h1>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-zinc-500">TOTAL PAREJAS</span>
            <span className="text-2xl font-black text-zinc-700">{inscribedCouples}</span>
          </div>
        </div>
     
        {isBracketCreated && (
          <TVModeSelector setViewMode={setViewMode} />
        )}

      </header>
  )

}

function TVModeSelector({ setViewMode }: TVModeSelectorProps) {

  return (
    <Tabs defaultValue="matchup">
      <TabsList>

        {/* PAREJAS */}
        <TabsTrigger  
          value="matchup" 
          className="p-4 pointer"
          onClick={() => setViewMode("matchup")}
        >
          <StretchHorizontal />
          Enfrentamientos
        </TabsTrigger>
        
        {/* CUADRO */}
        <TabsTrigger  
          value="bracket" 
          className="p-4 pointer"
          onClick={() => setViewMode("bracket")}
        >
          <Network/>
          Cuadro
        </TabsTrigger>
      
      </TabsList>
    </Tabs>
  )

}
