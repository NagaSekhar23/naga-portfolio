import { cache } from "react";

/**
 * Per-request flag. The /preview route sets it before rendering; content getters read it
 * to fetch unpublished drafts instead of the cached published content. React `cache`
 * scopes the value to a single server render, so it can never leak between visitors.
 */
const store = cache(() => ({ preview: false }));
export const setPreview = (value: boolean) => {
  store().preview = value;
};
export const isPreview = () => store().preview;
