"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface NavLink {
  href: string;
  label: string;
}
interface RouteInfo extends NavLink {
  description: string;
}

interface Props {
  items: NavLink[];
  routes: RouteInfo[];
  name: string;
  resumeHref: string;
}

/**
 * Presentational header. It receives the current pathname as a prop and never reads the URL
 * itself, so it can render inside a Suspense fallback (where no URL data is available).
 * Pass path="" for the fallback: no item is marked current until the real pathname arrives.
 */
export function SiteHeader({ items, routes, name, resumeHref, path: pathname = "" }: Props & { path?: string }) {
  // The preview mirrors the public routes under /preview.
  const isPreviewPath = pathname.startsWith("/preview");
  const path = isPreviewPath ? pathname.replace(/^\/preview/, "") || "/" : pathname;
  const base = isPreviewPath ? "/preview" : "";
  // The menu is tied to the page it was opened on, so navigating closes it without an effect.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenFor(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => path === href || path.startsWith(`${href}/`);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200 ${scrolled || open ? "border-line bg-background/85 backdrop-blur-md" : "border-transparent"}`}>
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
        <Link href={base || "/"} className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight" aria-label={`${name} — home`}>
          <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-[5px] bg-foreground text-[11px] font-bold text-background">N</span>
          <span className="hidden sm:inline">{name}</span>
        </Link>

        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-1 text-[13px]">
            {items.map((n) => (
              <li key={n.href}>
                <Link
                  href={`${base}${n.href}`}
                  aria-current={isActive(n.href) ? "page" : undefined}
                  className={`relative rounded-md px-3 py-2 transition-colors ${isActive(n.href) ? "text-foreground" : "text-muted hover:text-foreground"}`}
                >
                  {n.label}
                  {isActive(n.href) && <span aria-hidden="true" className="absolute inset-x-3 -bottom-[17px] h-px bg-accent" />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href={`${base}/contact`} className="hidden rounded-md bg-foreground px-3.5 py-1.5 text-[13px] font-medium text-background transition-colors hover:bg-accent hover:text-accent-ink sm:inline-flex">
            Contact
          </Link>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-line-strong px-3 text-[13px] font-medium xl:hidden"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpenFor(open ? null : pathname)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <div id="site-menu" className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-background xl:hidden">
          <nav aria-label="Mobile" className="mx-auto max-w-[1200px] px-5 py-3 sm:px-8">
            <ul>
              {routes.map((r) => (
                <li key={r.href} className="border-b border-line">
                  <Link href={`${base}${r.href}`} aria-current={isActive(r.href) ? "page" : undefined} className="flex items-baseline justify-between gap-4 py-4">
                    <span className="display text-3xl">{r.label}</span>
                    <span className="max-w-[12rem] text-right text-xs leading-snug text-subtle">{r.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <a href={resumeHref} download className="mt-6 inline-flex rounded-md border border-line-strong px-4 py-2.5 text-sm font-medium">
              Download resume
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
