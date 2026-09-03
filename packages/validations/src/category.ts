import { z } from "zod";

export const CategoryCreateSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(60, "Nama maksimal 60 karakter"),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug harus kebab-case (contoh: kegiatan-hari-santri)")
    .optional(),
  isActive: z.boolean().optional(),
});

export type CategoryCreateInput = z.infer<typeof CategoryCreateSchema>;

export const CategoryUpdateSchema = CategoryCreateSchema.partial();

export type CategoryUpdateInput = z.infer<typeof CategoryUpdateSchema>;
