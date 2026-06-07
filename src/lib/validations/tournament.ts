import { z } from "zod";

const ContactSchema = z.object({
  name: z.string(),
  phone: z.string().nullable().optional(),
  is_whatsapp: z.boolean().optional().default(false),
  instagram: z.string().nullable().optional(),
  facebook: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});

const PrizeSchema = z.object({
  rank: z.number(),
  description: z.string(),
  cash: z.number().optional().default(0),
  tags: z.array(z.string()).optional().default([]),
});

export const TournamentSchema = z.object({
  name: z.string().min(1, "El nombre del torneo es obligatorio.").trim(),
  tournamentDate: z.string().min(1, "La fecha del torneo es obligatoria."),
  location: z.string().min(1, "La ubicación del torneo es obligatoria.").trim(),
  pricePerCouple: z.number({ message: "El precio por pareja es obligatorio." }).min(0, "El precio no puede ser negativo."),
  maxSpots: z.number().nullable().optional().default(null),
  kingsModality: z.enum(["4", "8"]),
  pointsModality: z.enum(["20", "30", "40"]).nullable().optional().default(null),
  posterUrl: z.string().min(1, "El póster del torneo es obligatorio."),
  latitude: z.number({ message: "El marcador en el mapa es obligatorio." }),
  longitude: z.number({ message: "El marcador en el mapa es obligatorio." }),
  contacts: z.array(ContactSchema).optional().default([]),
  prizes: z.array(PrizeSchema).optional().default([]),
  rules: z.array(z.string()).optional().default([]),
  registrationDetails: z.string().optional().default(""),
  status: z.enum(["planned", "revision_pending", "finished", "canceled", "ongoing"]).optional(),
});
