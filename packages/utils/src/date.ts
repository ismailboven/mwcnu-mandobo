const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
] as const;

const DAYS_ID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"] as const;

/**
 * Format tanggal gaya Indonesia: "Senin, 4 Agustus 2026".
 */
export function formatDateID(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return `${DAYS_ID[d.getDay()]}, ${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Format tanggal pendek: "4 Agu 2026".
 */
export function formatDateShortID(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return `${d.getDate()} ${MONTHS_ID[d.getMonth()]?.slice(0, 3)} ${d.getFullYear()}`;
}

/**
 * Format tanggal numerik ringkas: "23/02/2026".
 */
export function formatDateNumericID(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "—";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

/**
 * Format angka gaya Indonesia (pemisah ribuan titik).
 */
export function formatNumberID(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value);
}

/**
 * Selisih waktu relatif: "3 hari lalu".
 */
export function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  const units: Array<[number, string]> = [
    [31536000, "tahun"],
    [2592000, "bulan"],
    [604800, "minggu"],
    [86400, "hari"],
    [3600, "jam"],
    [60, "menit"],
  ];
  for (const [secs, label] of units) {
    const v = Math.floor(seconds / secs);
    if (v >= 1) return `${v} ${label} lalu`;
  }
  return "baru saja";
}
