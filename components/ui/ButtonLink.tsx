import Link from "next/link";
import type { ReactNode } from "react";
import { hrefTo } from "@/lib/paths";

interface Props {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "quiet";
  external?: boolean;
  download?: boolean;
  size?: "md" | "sm";
}

const variants = {
  primary: "bg-foreground text-background hover:bg-accent hover:text-accent-ink",
  secondary: "border border-line-strong text-foreground hover:border-foreground",
  quiet: "text-foreground hover:text-accent",
};

export function ButtonLink({ href, children, variant = "primary", external, download, size = "md" }: Props) {
  const sizing = variant === "quiet" ? "py-2.5 text-sm" : size === "sm" ? "px-3.5 py-1.5 text-[13px]" : "px-5 py-2.5 text-sm";
  const cls = `inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-150 ${sizing} ${variants[variant]}`;
  if (external || download || href.startsWith("mailto:") || /^https?:/.test(href)) {
    return (
      <a href={href} download={download || undefined} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={cls}>
        {children}
        {external && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }
  return (
    <Link href={hrefTo(href)} className={cls}>
      {children}
    </Link>
  );
}
