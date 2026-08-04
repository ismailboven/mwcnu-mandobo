import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const ArticleCreateSchema = z.object({
  title: z.string().trim().min(10, "Judul minimal 10 karakter").max(160, "Judul maksimal 160 karakter"),
  slug: z
    .string()
    .trim()
    .regex(slugRegex, "Slug harus kebab-case (contoh: kegiatan-hari-santri)")
    .optional(),
  excerpt: z.string().trim().max(300, "Ringkasan maksimal 300 karakter").optional(),
  content: z.string().min(1, "Konten tidak boleh kosong"),
  coverImageUrl: z.string().url("URL cover tidak valid").optional(),
  categoryId: z.string().uuid("Kategori tidak valid").optional(),
  tagIds: z.array(z.string().uuid("Tag tidak valid")).default([]),
  status: z.enum(["draft", "published", "scheduled"]).default("draft"),
  scheduledFor: z.string().datetime().optional(),
  isFeatured: z.boolean().default(false),
});

export type ArticleCreateInput = z.infer<typeof ArticleCreateSchema>;

export const ArticleUpdateSchema = ArticleCreateSchema.partial();

export type ArticleUpdateInput = z.infer<typeof ArticleUpdateSchema>;
