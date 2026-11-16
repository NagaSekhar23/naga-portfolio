import { isPreview } from "@/sanity/lib/preview";

/**
 * Internal links stay inside the draft preview (/preview/…) while previewing,
 * and are unchanged on the public site. Files, API routes and the Studio are never rewritten.
 */
export function hrefTo(href: string): string {
  if (!isPreview() || !href.startsWith("/")) return href;
  if (/^\/(documents|api|studio|preview|images)(\/|$)/.test(href)) return href;
  return href === "/" ? "/preview" : `/preview${href}`;
}
