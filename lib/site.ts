// Canonical site origin used by metadata, sitemap, and robots. Override in
// deploy env with NEXT_PUBLIC_SITE_URL (no trailing slash needed).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://sebingkai.id"
).replace(/\/$/, "");
