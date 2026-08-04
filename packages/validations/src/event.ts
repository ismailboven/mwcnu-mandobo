import { z } from "zod";

export const EventCreateSchema = z.object({
  title: z.string().trim().min(5, "Judul minimal 5 karakter").max(160),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug harus kebab-case")
    .optional(),
  description: z.string().max(2000).optional(),
  eventType: z.enum(["kajian", "rapat", "peringatan", "pelatihan", "sosial"]),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional(),
  location: z.string().max(200).optional(),
  locationUrl: z.string().url().optional(),
  organizer: z.string().max(160).optional(),
  picName: z.string().max(160).optional(),
  picPhone: z.string().max(32).optional(),
  coverImageUrl: z.string().url().optional(),
  isFeatured: z.boolean().default(false),
});

export type EventCreateInput = z.infer<typeof EventCreateSchema>;

export const EventUpdateSchema = EventCreateSchema.partial();

export type EventUpdateInput = z.infer<typeof EventUpdateSchema>;
