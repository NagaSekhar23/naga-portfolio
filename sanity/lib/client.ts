import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

/** Public, read-only client (published content only). No token. */
export const client = createClient({
  projectId: projectId || "missing-project-id",
  dataset,
  apiVersion,
  useCdn: false, // freshness is handled by Next cache tags + webhook
});

/**
 * Server-only client with a read token, used for draft previews.
 * SANITY_API_READ_TOKEN has no NEXT_PUBLIC_ prefix, so it can never reach the browser.
 */
export const previewClient = client.withConfig({
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: "drafts",
  useCdn: false,
});
