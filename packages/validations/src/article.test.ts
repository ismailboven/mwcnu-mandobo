import { describe, expect, it } from "vitest";
import { ArticleCreateSchema } from "./article";

describe("ArticleCreateSchema", () => {
  it("menerima input minimal yang valid", () => {
    const result = ArticleCreateSchema.safeParse({
      title: "Kegiatan Peringatan Hari Santri 2026",
      content: "Berita tentang kegiatan Hari Santri.",
    });
    expect(result.success).toBe(true);
  });

  it("menolak judul yang terlalu pendek", () => {
    const result = ArticleCreateSchema.safeParse({ title: "abc", content: "isi" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("title"))).toBe(true);
    }
  });

  it("menolak slug yang bukan kebab-case", () => {
    const result = ArticleCreateSchema.safeParse({
      title: "Judul Berita Panjang",
      content: "isi",
      slug: "Judul Salah",
    });
    expect(result.success).toBe(false);
  });

  it("menerima slug kebab-case yang valid", () => {
    const result = ArticleCreateSchema.safeParse({
      title: "Judul Berita Panjang",
      content: "isi",
      slug: "kegiatan-hari-santri",
    });
    expect(result.success).toBe(true);
  });
});