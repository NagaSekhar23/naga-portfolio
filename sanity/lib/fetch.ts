import { cacheLife, cacheTag } from "next/cache";
import { client, previewClient } from "./client";
import { isPreview } from "./preview";

export const CMS_TAG = "sanity";

async function fetchPublished<T>(query: string): Promise<T> {
  "use cache";
  cacheTag(CMS_TAG);
  cacheLife({ stale: 60, revalidate: 300, expire: 86400 });
  return client.fetch<T>(query);
}

async function fetchDrafts<T>(query: string): Promise<T> {
  // Uncached on purpose: drafts must always be fresh and are never stored.
  return previewClient.fetch<T>(query);
}

/** Fetch from Sanity: cached + tag-revalidated normally, live drafts in preview. */
export const sanityFetch = <T>(query: string): Promise<T> =>
  isPreview() ? fetchDrafts<T>(query) : fetchPublished<T>(query);
