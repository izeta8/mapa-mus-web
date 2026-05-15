"use client";

import { useState, use } from "react";
import { ViewMode, Match, Round } from "@/types/database";
import { mockPartidos, NUM_PAREJAS, DEBE_MOSTRAR_LISTA } from "@/data/mock-tournament";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  params: Promise<{ "id-torneo": string }>;
}

export default function TournamentDetailPage({ params }: Props) {
  const { "id-torneo": idTorneo } = use(params);
  const [partidos, setPartidos] = useState<Match[]>(mockPartidos);
  const [viewMode, setViewMode] = useState<ViewMode>(DEBE_MOSTRAR_LISTA ? "lista" : "bracket");
  
  const [parejaA, setParejaA] = useState("");
  const [parejaB, setParejaB] = useState("");
  const [mesa, setMesa] = useState("");

  const getRondaActual = (): Round => {
    const activeMatches = partidos.filter(p => p.ganador === null && p.parejaA !== null && p.parejaB !== null);
    if (activeMatches.length > 0) {
      return activeMatches[0].ronda;
    }
    return "1/16";
  };

  const handleAddPartido = () => {
    if (!parejaA || !parejaB || !mesa) return;
    const newId = Math.max(...partidos.map(p => p.id)) + 1;
    const ronda: Round = getRondaActual();
    const newPartido: Match = {
      id: newId,
      ronda,
      parejaA: parseInt(parejaA),
      parejaB: parseInt(parejaB),
      mesa: parseInt(mesa),
      ganador: null,
      nextMatchId: null,
    };
    setPartidos([...partidos, newPartido]);
    setParejaA("");
    setParejaB("");
    setMesa("");
  };

  const handleSetGanador = (partidoId: number, ganador: "A" | "B") => {
    setPartidos(partidos.map(p => 
      p.id === partidoId ? { ...p, ganador } : p
    ));
  };

  const rondaActual = getRondaActual();
  const partidosRonda = partidos.filter(p => p.ronda === rondaActual);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Torneo #{idTorneo}</h1>
          <p className="text-muted-foreground">Ronda actual: {rondaActual}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Vista:</span>
          <Button
            variant={viewMode === "lista" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("lista")}
          >
            Lista
          </Button>
          <Button
            variant={viewMode === "bracket" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("bracket")}
          >
            Árbol
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Pareja A</label>
              <Input
                type="number"
                placeholder="Nº"
                className="w-24"
                value={parejaA}
                onChange={(e) => setParejaA(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Pareja B</label>
              <Input
                type="number"
                placeholder="Nº"
                className="w-24"
                value={parejaB}
                onChange={(e) => setParejaB(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Mesa</label>
              <Input
                type="number"
                placeholder="#"
                className="w-20"
                value={mesa}
                onChange={(e) => setMesa(e.target.value)}
              />
            </div>
            <Button onClick={handleAddPartido} className="mb-0">
              Añadir
            </Button>
          </div>
        </CardContent>
      </Card>

      {viewMode === "lista" ? (
        <div className="space-y-4">
          {partidosRonda.map((partido) => (
            <Card key={partido.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground text-sm">Mesa {partido.mesa ?? "-"}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold">{partido.parejaA ?? "-"}</span>
                    <span className="text-muted-foreground">vs</span>
                    <span className="text-2xl font-bold">{partido.parejaB ?? "-"}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={partido.ganador === "A" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSetGanador(partido.id, "A")}
                    disabled={!partido.parejaA || !partido.parejaB}
                  >
                    Gana {partido.parejaA ?? "A"}
                  </Button>
                  <Button
                    variant={partido.ganador === "B" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSetGanador(partido.id, "B")}
                    disabled={!partido.parejaA || !partido.parejaB}
                  >
                    Gana {partido.parejaB ?? "B"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <BracketView partidos={partidos} />
      )}
    </div>
  );
}

function BracketView({ partidos }: { partidos: Match[] }) {
  const rondas: Round[] = ["1/16", "1/8", "1/4", "1/2", "Final"];
  const getPartidosPorRonda = (ronda: Round) => partidos.filter(p => p.ronda === ronda);

  return (
    <div className="flex gap-8 overflow-x-auto pb-4">
      {rondas.map((ronda) => (
        <div key={ronda} className="flex flex-col gap-4 min-w-[200px]">
          <h3 className="text-center font-semibold text-muted-foreground">{ronda}</h3>
          {getPartidosPorRonda(ronda).map((partido) => (
            <Card key={partido.id} className="p-3">
              <div className="flex justify-between items-center">
                <span className={partido.ganador === "A" ? "font-bold" : ""}>
                  {partido.parejaA ?? "-"}
                </span>
                <span className="text-muted-foreground text-sm">vs</span>
                <span className={partido.ganador === "B" ? "font-bold" : ""}>
                  {partido.parejaB ?? "-"}
                </span>
              </div>
              {partido.mesa && (
                <p className="text-xs text-muted-foreground text-center mt-1">
                  Mesa {partido.mesa}
                </p>
              )}
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
}