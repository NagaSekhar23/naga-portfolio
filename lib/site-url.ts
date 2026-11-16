/**
 * The public base URL, used for canonical links, Open Graph, sitemap and robots.
 * Order: NEXT_PUBLIC_SITE_URL (set this to your custom domain on Vercel), then Vercel's own
 * deployment URL, then localhost for local development.
 */
export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

/** Absolute URL for a site path, built from siteUrl(). "/" becomes the bare origin. */
export function canonicalUrl(path: string): string {
  const clean = path === "/" || path === "" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl()}${clean}`;
}
