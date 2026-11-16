import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { resolvePage } from "@/components/pages/registry";
import { setPreview } from "@/sanity/lib/preview";
import { pageMetadata } from "@/lib/seo";

/** Preview pages are not indexed; their canonical points at the public page they mirror. */
export async function generateMetadata({ params }: PageProps<"/preview/[[...path]]">): Promise<Metadata> {
  const { path = [] } = await params;
  const publicPath = path.length ? `/${path.join("/")}` : "/";
  return pageMetadata({ path: publicPath, title: "Preview", robots: { index: false, follow: false } });
}

// Cache Components needs one param to validate the catch-all; real paths render on request.
export function generateStaticParams() {
  return [{ path: [] as string[] }];
}

async function PreviewContent({ params }: { params: Promise<{ path?: string[] }> }) {
  const { isEnabled } = await draftMode();
  if (!isEnabled) {
    return (
      <div className="mx-auto max-w-xl px-5 pb-24 pt-44">
        <p className="label">Preview</p>
        <h1 className="display display-section mt-3">Preview is only available from the Studio</h1>
        <p className="mt-4 text-muted">Open the workspace at /studio, sign in, and use the Preview tab to see unpublished changes.</p>
      </div>
    );
  }
  setPreview(true); // everything below renders unpublished drafts, for this request only
  const { path = [] } = await params;
  const view = resolvePage(path);
  if (!view) notFound();
  return (
    <>
      <div role="status" className="fixed bottom-4 left-4 z-[60] rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-ink shadow">
        Draft preview — not public
      </div>
      {view}
    </>
  );
}

export default function PreviewPage({ params }: PageProps<"/preview/[[...path]]">) {
  return (
    <Suspense fallback={<p className="px-5 pt-44 text-muted">Loading preview…</p>}>
      <PreviewContent params={params} />
    </Suspense>
  );
}
