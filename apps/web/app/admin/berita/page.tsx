import { ArticleList } from "@/components/admin/article-list";
import { adminListArticles } from "@/repositories/article-repository";
import { listActiveCategories } from "@/repositories/category-repository";

export const metadata = {
  title: "Manajemen Berita",
};

export default async function AdminBeritaPage() {
  const [articles, categories] = await Promise.all([adminListArticles(), listActiveCategories()]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Manajemen Berita</h1>

      <div className="mt-6">
        <ArticleList articles={articles} categories={categories} />
      </div>
    </div>
  );
}
