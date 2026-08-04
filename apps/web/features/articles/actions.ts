"use server";

import { revalidatePath } from "next/cache";
import { ArticleCreateSchema } from "@mwcnu/validations";
import type { ActionResult } from "@/lib/types";

/**
 * Contoh Server Action sesuai pola `docs/10_API_SPECIFICATION.md`.
 * Langkah produksi: requireEditor guard -> repository.create -> logActivity -> revalidate.
 */
export async function createArticleAction(input: unknown): Promise<ActionResult> {
  const parsed = ArticleCreateSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Data berita tidak valid.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // TODO: `await requireEditor(supabase)` lalu `articleRepo.create(...)`
  // TODO: `logActivity("article.create", article.id)`

  revalidatePath("/berita");
  return { ok: true, message: "Berita berhasil disimpan." };
}
