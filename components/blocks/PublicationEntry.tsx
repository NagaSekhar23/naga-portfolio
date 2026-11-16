import type { Publication } from "@/data/types";
import { doiUrl } from "@/lib/content";
import { ExternalLink } from "@/components/ui/ExternalLink";

const ME = "Naga Sekhar Madala";

export function PublicationEntry({ p }: { p: Publication }) {
  const meta = [p.venue, p.date ?? p.year].filter(Boolean).join(" · ");
  return (
    <li className="reveal py-6">
      <h4 className="text-[17px] font-semibold leading-snug tracking-tight">{p.title}</h4>
      {p.authors && p.authors.length > 0 && (
        <p className="mt-1.5 text-sm text-muted">
          {p.authors.map((a, i) => (
            <span key={a + i}>
              {i > 0 && ", "}
              {a === ME ? <strong className="font-semibold text-foreground">{a}</strong> : a}
            </span>
          ))}
        </p>
      )}
      {meta && <p className="mt-1 text-sm italic text-muted">{meta}</p>}
      {p.note && <p className="mt-1 text-sm text-subtle">{p.note}</p>}
      {(p.doi || p.links?.length) && (
        <p className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 text-sm">
          {p.doi && <ExternalLink href={doiUrl(p.doi)}>DOI {p.doi}</ExternalLink>}
          {p.links?.map((l) => (
            <ExternalLink key={l.href} href={l.href}>{l.label}</ExternalLink>
          ))}
        </p>
      )}
    </li>
  );
}
