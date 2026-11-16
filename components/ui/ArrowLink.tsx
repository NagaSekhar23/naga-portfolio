import Link from "next/link";
import type { ReactNode } from "react";
import { hrefTo } from "@/lib/paths";

/** Internal text link with a directional arrow. */
export function ArrowLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={hrefTo(href)} className={`group inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-accent ${className}`}>
      {children}
      <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
    </Link>
  );
}
