import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { previewClient } from "@/sanity/lib/client";

/**
 * Called by Studio's Presentation tool with a short-lived, Sanity-issued secret.
 * Only a signed-in Studio user can obtain that secret, so strangers cannot enable drafts.
 */
export const { GET } = defineEnableDraftMode({ client: previewClient });
