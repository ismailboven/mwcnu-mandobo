import type { Metadata } from "next";

/**
 * Helper pembuat metadata SEO yang aman terhadap exactOptionalPropertyTypes.
 * Referensi: docs/17_SEO_GUIDELINES.md
 */
export function buildMetadata(options: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
}): Metadata {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    title: options.title,
    ...(options.description ? { description: options.description } : {}),
    ...(options.path
      ? { alternates: { canonical: new URL(options.path, base).toString() } }
      : {}),
    ...(options.image
      ? {
          openGraph: {
            images: [{ url: new URL(options.image, base).toString() }],
          },
        }
      : {}),
  };
}
