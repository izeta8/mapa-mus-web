import { z } from "zod";

export const TournamentSchema = z.object({
  name: z.string().min(1, "El nombre del torneo es obligatorio.").trim(),
  tournamentDate: z.string().min(1, "La fecha del torneo es obligatoria."),
  location: z.string().min(1, "La ubicación del torneo es obligatoria.").trim(),
  pricePerCouple: z.number({ message: "El precio por pareja es obligatorio." }).min(0, "El precio no puede ser negativo."),
  maxSpots: z.number().nullable().optional().default(null),
  kingsModality: z.enum(["4", "8"]),
  pointsModality: z.enum(["20", "30", "40"]).nullable().optional().default(null),
  posterUrl: z.string().min(1, "El póster del torneo es obligatorio."),
});
