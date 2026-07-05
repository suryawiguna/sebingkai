import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { landings } from "@/lib/landings";

// Indexable routes only — /demo is noindex and intentionally excluded.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = [
    { path: "/", priority: 1 },
    { path: "/faq", priority: 0.6 },
  ];

  return [
    ...staticPaths.map(({ path, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority,
    })),
    ...landings.map((l) => ({
      url: `${SITE_URL}/${l.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
