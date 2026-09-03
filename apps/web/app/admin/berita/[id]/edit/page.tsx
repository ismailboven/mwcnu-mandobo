import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@mwcnu/ui";
import { ArticleForm } from "@/components/admin/article-form";
import { listActiveCategories } from "@/repositories/category-repository";
import { adminGetArticle } from "@/repositories/article-repository";

export const metadata = {
  title: "Edit Berita",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminBeritaEditPage({ params }: Props) {
  const { id } = await params;
  const [article, categories] = await Promise.all([adminGetArticle(id), listActiveCategories()]);

  if (!article) notFound();

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Edit Berita</h1>
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/berita">
            <ArrowLeft className="size-4" />
            Kembali
          </Link>
        </Button>
      </div>

      <div className="mt-6">
        <ArticleForm
          categories={categories}
          article={{
            id: article.id,
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt,
            content: article.content,
            cover_image_url: article.cover_image_url,
            category_id: article.category_id,
            status: article.status,
            is_featured: article.is_featured,
          }}
        />
      </div>
    </div>
  );
}
