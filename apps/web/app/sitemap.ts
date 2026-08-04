import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/berita`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/agenda`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/kajian`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/galeri`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/download`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/pengumuman`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/tentang`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/tentang/struktur`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/tentang/pengurus`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];
}
