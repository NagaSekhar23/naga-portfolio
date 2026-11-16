import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[1200px] flex-col justify-center px-5 sm:px-8 lg:px-10">
      <p className="label">404</p>
      <h1 className="display display-page mt-4">Page not found</h1>
      <p className="lede mt-5 max-w-md">That page doesn’t exist, or it has moved.</p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:bg-accent hover:text-accent-ink">Back home</Link>
        <Link href="/projects" className="rounded-md border border-line-strong px-5 py-2.5 text-sm font-medium hover:border-foreground">View projects</Link>
      </div>
    </div>
  );
}
