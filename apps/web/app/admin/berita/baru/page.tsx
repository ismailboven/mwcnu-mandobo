import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@mwcnu/ui";
import { ArticleForm } from "@/components/admin/article-form";
import { listActiveCategories } from "@/repositories/category-repository";

export const metadata = {
  title: "Buat Berita",
};

export default async function AdminBeritaBaruPage() {
  const categories = await listActiveCategories();

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Buat Berita</h1>
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/berita">
            <ArrowLeft className="size-4" />
            Kembali
          </Link>
        </Button>
      </div>

      <div className="mt-6">
        <ArticleForm categories={categories} />
      </div>
    </div>
  );
}
