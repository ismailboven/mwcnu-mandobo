import { CategoryManager } from "@/components/admin/category-manager";
import { adminListCategories } from "@/repositories/category-repository";

export const metadata = {
  title: "Manajemen Kategori",
};

export default async function AdminKategoriPage() {
  const categories = await adminListCategories();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Manajemen Kategori</h1>

      <div className="mt-6">
        <CategoryManager categories={categories} />
      </div>
    </div>
  );
}
