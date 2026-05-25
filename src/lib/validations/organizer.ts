import { z } from "zod";

export const ContactSchema = z.object({
  name: z.string().trim().nullable().optional(),
  phone: z.string().trim().nullable().optional(),
  is_whatsapp: z.boolean().default(false),
  instagram: z.string().trim().nullable().optional(),
  facebook: z.string().trim().nullable().optional(),
  email: z.string().trim().nullable().optional(),
  description: z.string().trim().nullable().optional(),
}).superRefine((val, ctx) => {
  const hasOtherFields = (val.phone && val.phone.trim()) || 
                         (val.instagram && val.instagram.trim()) || 
                         (val.facebook && val.facebook.trim()) || 
                         (val.email && val.email.trim()) || 
                         (val.description && val.description.trim());
  if (hasOtherFields && (!val.name || !val.name.trim())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "El nombre es obligatorio si rellenas otros datos de contacto.",
      path: ["name"],
    });
  }
});

export const OrganizerSchema = z.object({
  name: z.string().min(1, "El nombre de la organización es obligatorio.").trim(),
  slug: z.string()
    .min(1, "El enlace personalizado es obligatorio.")
    .toLowerCase()
    .trim()
    .regex(/^[a-z0-9-_]+$/, "El enlace personalizado solo puede contener letras, números, guiones y guiones bajos."),
  address: z.string().trim().nullable().optional().transform(v => v || null),
  contacts: z.array(ContactSchema).default([]),
  latitude: z.number().nullable().optional().default(null),
  longitude: z.number().nullable().optional().default(null),
  logoUrl: z.string().nullable().optional().transform(v => v || null),
});
