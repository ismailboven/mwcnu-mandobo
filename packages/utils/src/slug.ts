/**
 * Ubah teks menjadi slug kebab-case yang aman untuk URL.
 * Contoh: "Kegiatan Hari Santri 2026!" -> "kegiatan-hari-santri-2026"
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // buang diacritics (é -> e)
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Buat slug unik bila slug sudah dipakai (tambahkan akhiran angka).
 */
export function uniqueSlug(base: string, existing: string[]): string {
  if (!existing.includes(base)) return base;
  let i = 2;
  while (existing.includes(`${base}-${i}`)) i += 1;
  return `${base}-${i}`;
}