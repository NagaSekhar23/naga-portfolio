import type { ProfessionalLink } from "@/data/types";
import { ExternalLink } from "@/components/ui/ExternalLink";

interface Props {
  links: ProfessionalLink[];
  groups: { id: string; title: string; blurb: string }[];
}

/** Professional links grouped by purpose. */
export function LinkList({ links, groups }: Props) {
  return (
    <div className="space-y-10">
      {groups.map((g) => {
        const items = links.filter((l) => l.group === g.id);
        if (!items.length) return null;
        return (
          <section key={g.id} aria-labelledby={`links-${g.id}`}>
            <h3 id={`links-${g.id}`} className="label border-b border-line pb-3">{g.title}</h3>
            <ul className="divide-y divide-line">
              {items.map((l) => (
                <li key={l.id} className="grid gap-1 py-4 sm:grid-cols-[1fr_1.4fr] sm:gap-8">
                  <p className="font-medium"><ExternalLink href={l.href}>{l.label}</ExternalLink></p>
                  <p className="text-sm leading-relaxed text-muted">{l.description}</p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
