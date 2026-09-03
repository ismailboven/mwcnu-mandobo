"use server";

import { revalidatePath } from "next/cache";
import { CategoryCreateSchema, CategoryUpdateSchema } from "@mwcnu/validations";
import type { ActionResult } from "@/lib/types";
import { AuthError, MIN_LEVEL, requireLevel } from "@/lib/authz";
import {
  adminCreateCategory,
  adminDeleteCategory,
  adminUpdateCategory,
} from "@/repositories/category-repository";
import { createServerSupabase } from "@/lib/supabase/server";

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

export async function createCategoryAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = CategoryCreateSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Data kategori tidak valid.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const supabase = await createServerSupabase();
    await requireLevel(supabase, MIN_LEVEL.editor);
    const { id } = await adminCreateCategory(parsed.data);

    // TODO: logActivity("category.create", id)
    revalidatePath("/berita");
    revalidatePath("/admin/berita");
    revalidatePath("/admin/kategori");
    return { ok: true, data: { id }, message: "Kategori berhasil dibuat." };
  } catch (error) {
    return toActionResult(error, "Gagal membuat kategori.");
  }
}

export async function updateCategoryAction(id: string, input: unknown): Promise<ActionResult> {
  const parsed = CategoryUpdateSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Data kategori tidak valid.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const supabase = await createServerSupabase();
    await requireLevel(supabase, MIN_LEVEL.editor);
    await adminUpdateCategory(id, parsed.data);

    // TODO: logActivity("category.update", id)
    revalidatePath("/berita");
    revalidatePath("/admin/berita");
    revalidatePath("/admin/kategori");
    return { ok: true, message: "Kategori berhasil diperbarui." };
  } catch (error) {
    return toActionResult(error, "Gagal memperbarui kategori.");
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  try {
    const supabase = await createServerSupabase();
    await requireLevel(supabase, MIN_LEVEL.editor);
    await adminDeleteCategory(id);

    // TODO: logActivity("category.delete", id)
    revalidatePath("/berita");
    revalidatePath("/admin/berita");
    revalidatePath("/admin/kategori");
    return { ok: true, message: "Kategori dihapus." };
  } catch (error) {
    return toActionResult(error, "Gagal menghapus kategori.");
  }
}
