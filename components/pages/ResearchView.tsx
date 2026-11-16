import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { PublicationEntry } from "@/components/blocks/PublicationEntry";
import { CtaBand } from "@/components/blocks/CtaBand";
import type { PublicationType } from "@/data/types";
import { getProfessionalLinks, getPublications } from "@/lib/content";

const groups: { id: string; types: PublicationType[]; title: string }[] = [
  { id: "journal", types: ["journal"], title: "Journal articles" },
  { id: "conference", types: ["conference"], title: "Conference papers" },
  { id: "datasets", types: ["dataset", "book", "research"], title: "Datasets, books & other research" },
  { id: "patents", types: ["patent"], title: "Patent applications" },
];

export async function ResearchView() {
  const [pubs, links] = await Promise.all([getPublications(), getProfessionalLinks()]);
  const profiles = links.filter((l) => l.group === "research");
  const present = groups.filter((g) => pubs.some((p) => g.types.includes(p.type)));

  return (
    <>
      <PageHeader
        eyebrow="Research"
        title="Publications, datasets and patents"
        lede="Interpretable deep learning for biology, edge AI, and AI-driven cybersecurity."
      >
        <nav aria-label="Research sections">
          <ul className="flex flex-wrap gap-2">
            {[{ id: "profiles", title: "Research profiles" }, ...present].map((g) => (
              <li key={g.id}>
                <a href={`#${g.id}`} className="inline-block rounded-md border border-line-strong px-3 py-1.5 text-[13px] text-muted transition-colors hover:border-foreground hover:text-foreground">
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      {profiles.length > 0 && (
        <Section id="profiles" label="Find my work" title="Research profiles">
          <ul className="hairline-grid sm:grid-cols-2">
            {profiles.map((l) => (
              <li key={l.id}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="group flex h-full items-start gap-4 p-6 transition-colors hover:bg-surface">
                  <span aria-hidden="true" className="grid h-10 min-w-10 place-items-center rounded-md border border-line-strong px-2 font-mono text-xs font-semibold">{l.mark}</span>
                  <span>
                    <span className="block font-semibold tracking-tight group-hover:text-accent">
                      {l.label} <span aria-hidden="true">↗</span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </span>
                    <span className="mt-1 block text-sm leading-snug text-muted">{l.description}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {present.map((g, i) => {
        const items = pubs.filter((p) => g.types.includes(p.type));
        return (
          <Section key={g.id} id={g.id} label={`${items.length} ${items.length === 1 ? "entry" : "entries"}`} title={g.title} tone={i % 2 === 0 ? "sunken" : "default"}>
            <ul className="divide-y divide-line border-y border-line">
              {items.map((p) => <PublicationEntry key={p.id} p={p} />)}
            </ul>
          </Section>
        );
      })}
      <CtaBand title="Interested in collaborating on research?" />
    </>
  );
}
