import type { ReactNode } from "react";

interface Props {
  href: string;
  children: ReactNode;
  className?: string;
  plain?: boolean;
}

/** All outbound links go through this: new tab, noopener, announced to screen readers. */
export function ExternalLink({ href, children, className = "", plain }: Props) {
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent ${className}`}
    >
      {children}
      {external && !plain && <span aria-hidden="true"> ↗</span>}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
