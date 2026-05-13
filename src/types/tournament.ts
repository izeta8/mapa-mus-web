export type Ronda =
  | "1/32"
  | "1/16"
  | "1/8"
  | "1/4"
  | "1/2"
  | "Final";

export interface Partido {
  id: number;
  ronda: Ronda;
  parejaA: number | null;
  parejaB: number | null;
  mesa: number | null;
  ganador: "A" | "B" | null;
  nextMatchId: number | null;
}

export type ViewMode = "lista" | "bracket";

export interface Tournament {
  id: string;
  nombre: string;
  localidad: string;
  fecha: string;
  numParejas: number;
  partidoActivo: Partido[];
}