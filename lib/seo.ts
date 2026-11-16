import { cacheLife, cacheTag } from "next/cache";
import type { Metadata } from "next";
import { getSite } from "@/lib/content";
import { canonicalUrl } from "@/lib/site-url";
import { CMS_TAG } from "@/sanity/lib/fetch";

/**
 * The cache boundary holds ONLY plain, serializable values (strings and arrays).
 * "use cache" stores its return value, and a URL instance cannot be stored or passed to
 * Client Components. So URLs and Metadata objects are built outside the cache.
 */
async function getSeoFields() {
  "use cache";
  cacheTag(CMS_TAG);
  cacheLife({ stale: 60, revalidate: 300, expire: 86400 });
  const site = await getSite();
  return {
    name: site.name,
    title: site.title,
    description: site.description,
    keywords: [...site.keywords],
  };
}

/** The generated Open Graph image (app/opengraph-image.tsx), stated explicitly on every route. */
const ogImage = () => [
  { url: canonicalUrl("/opengraph-image"), width: 1200, height: 630, type: "image/png" },
];

/** Site-wide defaults, inherited by any route that does not override them. */
export async function siteMetadata(): Promise<Metadata> {
  const seo = await getSeoFields();
  const url = canonicalUrl("/");
  return {
    metadataBase: new URL(canonicalUrl("/")),
    title: { default: seo.title, template: `%s · ${seo.name}` },
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: seo.name }],
    creator: seo.name,
    alternates: { canonical: url },
    openGraph: {
      type: "profile",
      url,
      siteName: seo.name,
      title: seo.title,
      description: seo.description,
      locale: "en_US",
      images: ogImage(),
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
    robots: { index: true, follow: true },
  };
}

/**
 * Metadata for one route. Every route sets its own canonical and og:url, so nothing inherits
 * the homepage URL. Open Graph title/description keep the site-wide values they already had,
 * and Twitter metadata is inherited from the layout unchanged.
 */
export async function pageMetadata(opts: {
  path: string;
  title?: string;
  description?: string;
  robots?: Metadata["robots"];
}): Promise<Metadata> {
  const seo = await getSeoFields();
  const url = canonicalUrl(opts.path);
  return {
    ...(opts.title ? { title: opts.title } : {}),
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.robots ? { robots: opts.robots } : {}),
    alternates: { canonical: url },
    openGraph: {
      type: "profile",
      url,
      siteName: seo.name,
      title: seo.title,
      description: seo.description,
      locale: "en_US",
      images: ogImage(),
    },
  };
}
