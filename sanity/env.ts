// Public identifiers only. A Sanity project ID and dataset name are NOT secrets
// (they appear in every Sanity-powered site's network requests). Tokens live in
// server-only env vars and are never imported by client code.
export const apiVersion = "2026-01-01";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

/** True when a Sanity project is configured. Otherwise the site falls back to /data. */
export const isSanityConfigured = Boolean(projectId);
