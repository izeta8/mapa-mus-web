import { Match } from "@/types/database";

export interface Bye {
  id: number;
  ronda: string;
  pareja: number;
}

function generarPartidos32(): { a: number; b: number; mesa: number }[] {
  const pairs: { a: number; b: number; mesa: number }[] = [];
  for (let i = 0; i < 32; i++) {
    pairs.push({ a: i * 2 + 1, b: i * 2 + 2, mesa: i + 1 });
  }
  return pairs;
}

const partidos32 = generarPartidos32();

export const mockPartidos: Match[] = [
  ...partidos32.map((p, i) => ({
    id: i + 1,
    ronda: "1/32" as const,
    parejaA: p.a,
    parejaB: p.b,
    mesa: p.mesa,
    ganador: null,
    nextMatchId: null,
  })),
];

export const mockByes: Bye[] = [
  { id: 1, ronda: "1/32", pareja: 65 },
  { id: 2, ronda: "1/32", pareja: 66 },
  { id: 3, ronda: "1/32", pareja: 67 },
  { id: 4, ronda: "1/32", pareja: 68 },
  { id: 5, ronda: "1/32", pareja: 69 },
  { id: 6, ronda: "1/32", pareja: 70 },
  { id: 7, ronda: "1/32", pareja: 71 },
  { id: 8, ronda: "1/32", pareja: 72 },
  { id: 9, ronda: "1/32", pareja: 73 },
  { id: 10, ronda: "1/32", pareja: 74 },
  { id: 11, ronda: "1/32", pareja: 75 },
  { id: 12, ronda: "1/32", pareja: 76 },
  { id: 13, ronda: "1/32", pareja: 77 },
  { id: 14, ronda: "1/32", pareja: 78 },
  { id: 15, ronda: "1/32", pareja: 79 },
  { id: 16, ronda: "1/32", pareja: 80 },
  { id: 17, ronda: "1/32", pareja: 81 },
  { id: 18, ronda: "1/32", pareja: 82 },
  { id: 19, ronda: "1/32", pareja: 83 },
  { id: 20, ronda: "1/32", pareja: 84 },
  { id: 21, ronda: "1/32", pareja: 85 },
  { id: 22, ronda: "1/32", pareja: 86 },
  { id: 23, ronda: "1/32", pareja: 87 },
  { id: 24, ronda: "1/32", pareja: 88 },
  { id: 25, ronda: "1/32", pareja: 89 },
  { id: 26, ronda: "1/32", pareja: 90 },
  { id: 27, ronda: "1/32", pareja: 91 },
  { id: 28, ronda: "1/32", pareja: 92 },
  { id: 29, ronda: "1/32", pareja: 93 },
  { id: 30, ronda: "1/32", pareja: 94 },
  { id: 31, ronda: "1/32", pareja: 95 },
  { id: 32, ronda: "1/32", pareja: 96 },
  { id: 33, ronda: "1/32", pareja: 97 },
  { id: 34, ronda: "1/32", pareja: 98 },
  { id: 35, ronda: "1/32", pareja: 99 },
  { id: 36, ronda: "1/32", pareja: 100 },
];

export const NUM_PAREJAS = 100;
export const DEBE_MOSTRAR_LISTA = NUM_PAREJAS >= 32;