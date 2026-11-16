import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { CMS_TAG } from "@/sanity/lib/fetch";

/**
 * Sanity webhook target. Verifies Sanity's signature with SANITY_REVALIDATE_SECRET, so
 * only Sanity can trigger it. On publish, the next visit gets fresh content.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return new NextResponse("Revalidation is not configured", { status: 501 });

  const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true);
  if (!isValidSignature) return new NextResponse("Invalid signature", { status: 401 });

  revalidateTag(CMS_TAG, { expire: 0 });
  return NextResponse.json({ revalidated: true, type: body?._type ?? null, now: Date.now() });
}
