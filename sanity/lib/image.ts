import type { ImageAsset } from "@/data/types";

interface SanityImageField {
  alt?: string;
  caption?: string;
  asset?: { url?: string; metadata?: { dimensions?: { width: number; height: number } } } | null;
}

/** Map a Sanity image field (with dereferenced asset) to the site's ImageAsset type. */
export function toImageAsset(img: SanityImageField | null | undefined, fallbackAlt = ""): ImageAsset | undefined {
  const url = img?.asset?.url;
  const dim = img?.asset?.metadata?.dimensions;
  if (!url || !dim) return undefined;
  return { src: url, alt: img?.alt || fallbackAlt, width: dim.width, height: dim.height, caption: img?.caption };
}

/** GROQ fragment that resolves an image field's URL and dimensions. */
export const IMAGE_PROJECTION = `{ alt, caption, asset->{ url, metadata { dimensions { width, height } } } }`;
