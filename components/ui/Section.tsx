import type { ReactNode } from "react";
import { ArrowLink } from "./ArrowLink";
import { Wrap } from "./Wrap";

interface Props {
  label?: string;
  title?: string;
  id?: string;
  action?: { href: string; label: string };
  children: ReactNode;
  tone?: "default" | "sunken";
}

export function Section({ label, title, id, action, children, tone = "default" }: Props) {
  return (
    <section id={id} aria-labelledby={title && id ? `${id}-h` : undefined} className={`border-b border-line ${tone === "sunken" ? "bg-surface-2/50" : ""}`}>
      <Wrap className="py-16 md:py-24">
        {(label || title) && (
          <div className="reveal mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-3 md:mb-14">
            <div>
              {label && <p className="label">{label}</p>}
              {title && (
                <h2 id={id ? `${id}-h` : undefined} className="display display-section mt-3 max-w-2xl">
                  {title}
                </h2>
              )}
            </div>
            {action && <ArrowLink href={action.href}>{action.label}</ArrowLink>}
          </div>
        )}
        {children}
      </Wrap>
    </section>
  );
}
