"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ArticleCreateSchema, ArticleUpdateSchema } from "@mwcnu/validations";
import type { ActionResult } from "@/lib/types";
import { AuthError, MIN_LEVEL, requireLevel } from "@/lib/authz";
import {
  adminCreateArticle,
  adminSoftDeleteArticle,
  adminUpdateArticle,
} from "@/repositories/article-repository";
import { createServerSupabase } from "@/lib/supabase/server";

const ArticleFieldSchema = z.object({
  categoryId: z.string().uuid("Kategori tidak valid").nullable().optional(),
  status: z.enum(["draft", "published", "scheduled", "archived"]).optional(),
  isFeatured: z.boolean().optional(),
});

function toActionResult(
  error: unknown,
  fallbackMessage: string
): Extract<ActionResult, { ok: false }> {
  if (error instanceof AuthError) {
    return { ok: false, code: error.code, message: error.message };
  }
  return {
    ok: false,
    code: "INTERNAL_ERROR",
    message: error instanceof Error ? error.message : fallbackMessage,
  };
}

export async function createArticleAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = ArticleCreateSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Data berita tidak valid.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const supabase = await createServerSupabase();
    const { userId } = await requireLevel(supabase, MIN_LEVEL.editor);
    const { id } = await adminCreateArticle(parsed.data, userId);

    // TODO: logActivity("article.create", id)
    revalidatePath("/berita");
    revalidatePath("/admin/berita");
    return { ok: true, data: { id }, message: "Berita berhasil disimpan." };
  } catch (error) {
    return toActionResult(error, "Gagal menyimpan berita.");
  }
}

export async function updateArticleAction(
  id: string,
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const parsed = ArticleUpdateSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Data berita tidak valid.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const supabase = await createServerSupabase();
    await requireLevel(supabase, MIN_LEVEL.editor);
    await adminUpdateArticle(id, parsed.data);

    // TODO: logActivity("article.update", id)
    revalidatePath("/berita");
    revalidatePath("/admin/berita");
    revalidatePath(`/admin/berita/${id}/edit`);
    return { ok: true, data: { id }, message: "Berita berhasil diperbarui." };
  } catch (error) {
    return toActionResult(error, "Gagal memperbarui berita.");
  }
}

/** Perubahan cepat satu kolom (kategori / status) dari tabel admin. */
export async function updateArticleFieldAction(id: string, input: unknown): Promise<ActionResult> {
  const parsed = ArticleFieldSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, code: "VALIDATION_ERROR", message: "Data tidak valid." };
  }

  try {
    const supabase = await createServerSupabase();
    await requireLevel(supabase, MIN_LEVEL.editor);
    await adminUpdateArticle(id, parsed.data);

    // TODO: logActivity("article.update_field", id)
    revalidatePath("/berita");
    revalidatePath("/admin/berita");
    return { ok: true, message: "Perubahan disimpan." };
  } catch (error) {
    return toActionResult(error, "Gagal menyimpan perubahan.");
  }
}

export async function deleteArticleAction(id: string): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabase();
    await requireLevel(supabase, MIN_LEVEL.admin);
    await adminSoftDeleteArticle(id);

    // TODO: logActivity("article.delete", id)
    revalidatePath("/berita");
    revalidatePath("/admin/berita");
    return { ok: true, message: "Berita dihapus." };
  } catch (error) {
    return toActionResult(error, "Gagal menghapus berita.");
  }
}

export async function deleteArticlesAction(ids: string[]): Promise<ActionResult> {
  if (ids.length === 0) {
    return { ok: true, message: "Tidak ada berita yang dipilih." };
  }

  try {
    const supabase = await createServerSupabase();
    await requireLevel(supabase, MIN_LEVEL.admin);
    for (const id of ids) {
      await adminSoftDeleteArticle(id);
    }

    // TODO: logActivity("article.delete_many", ids.length)
    revalidatePath("/berita");
    revalidatePath("/admin/berita");
    return { ok: true, message: `${ids.length} berita dihapus.` };
  } catch (error) {
    return toActionResult(error, "Gagal menghapus berita.");
  }
}
