"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Input, Label, Textarea } from "@mwcnu/ui";
import { ArticleCreateSchema } from "@mwcnu/validations";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { createArticleAction, updateArticleAction } from "@/features/articles/actions";
import type { ActionResult } from "@/lib/types";

type ArticleFormValues = z.input<typeof ArticleCreateSchema>;

interface CategoryOption {
  id: string;
  name: string;
}

interface ArticleFormProps {
  categories: CategoryOption[];
  article?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string | null;
    cover_image_url: string | null;
    category_id: string | null;
    status: string;
    is_featured: boolean;
  };
}

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Terbit" },
  { value: "scheduled", label: "Jadwal" },
] as const;

export function ArticleForm({ categories, article }: ArticleFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(ArticleCreateSchema),
    defaultValues: {
      title: article?.title ?? "",
      slug: article?.slug ?? "",
      excerpt: article?.excerpt ?? "",
      content: article?.content ?? "",
      coverImageUrl: article?.cover_image_url ?? "",
      categoryId: article?.category_id ?? "",
      status: (article?.status as ArticleFormValues["status"]) ?? "draft",
      isFeatured: article?.is_featured ?? false,
    },
  });

  const onSubmit = async (values: ArticleFormValues) => {
    setSubmitError(null);

    const result: ActionResult<{ id: string }> = article
      ? await updateArticleAction(article.id, values)
      : await createArticleAction(values);

    if (!result.ok) {
      setSubmitError(result.message);
      return;
    }

    const targetId = article?.id ?? result.data?.id;
    router.push(targetId ? `/admin/berita/${targetId}/edit` : "/admin/berita");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitError ? (
        <p className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">{submitError}</p>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="title">Judul</Label>
        <Input
          id="title"
          placeholder="Judul berita"
          aria-invalid={Boolean(errors.title)}
          {...register("title")}
        />
        {errors.title ? <p className="text-destructive text-sm">{errors.title.message}</p> : null}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="slug">Slug (kosongkan untuk otomatis)</Label>
          <Input id="slug" placeholder="kegiatan-hari-santri" {...register("slug")} />
          {errors.slug ? <p className="text-destructive text-sm">{errors.slug.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryId">Kategori</Label>
          <select
            id="categoryId"
            className="border-border bg-background focus-visible:ring-ring h-10 w-full rounded-lg border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
            {...register("categoryId")}
          >
            <option value="">Tanpa kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId ? (
            <p className="text-destructive text-sm">{errors.categoryId.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Ringkasan (maks. 300 karakter)</Label>
        <Textarea id="excerpt" rows={2} placeholder="Ringkasan singkat" {...register("excerpt")} />
        {errors.excerpt ? (
          <p className="text-destructive text-sm">{errors.excerpt.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Konten</Label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <RichTextEditor value={field.value ?? ""} onChange={field.onChange} />
          )}
        />
        {errors.content ? (
          <p className="text-destructive text-sm">{errors.content.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverImageUrl">URL Cover</Label>
        <Input
          id="coverImageUrl"
          type="url"
          placeholder="https://...gambar.jpg"
          {...register("coverImageUrl")}
        />
        {errors.coverImageUrl ? (
          <p className="text-destructive text-sm">{errors.coverImageUrl.message}</p>
        ) : null}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            className="border-border bg-background focus-visible:ring-ring h-10 w-full rounded-lg border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
            {...register("status")}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.status ? (
            <p className="text-destructive text-sm">{errors.status.message}</p>
          ) : null}
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="accent-primary size-4" {...register("isFeatured")} />
            Jadikan berita unggulan
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : article ? "Simpan Perubahan" : "Simpan Berita"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/berita")}>
          Batal
        </Button>
      </div>
    </form>
  );
}
