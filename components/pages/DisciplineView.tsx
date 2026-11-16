import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Wrap } from "@/components/ui/Wrap";
import { ProjectCard } from "@/components/blocks/ProjectCard";
import { SkillMatrix } from "@/components/blocks/SkillMatrix";
import { ThemeList } from "@/components/blocks/ThemeList";
import { CtaBand } from "@/components/blocks/CtaBand";
import type { CapabilityArea } from "@/data/types";
import { getCapabilities, getDisciplines, getExperience, getProjects, getSkillGroups } from "@/lib/content";
import { hrefTo } from "@/lib/paths";

const PATH: Record<CapabilityArea, string> = { engineering: "/engineering", "applied-ai": "/applied-ai", "data-ml": "/data-ml" };

export async function DisciplineView({ area }: { area: CapabilityArea }) {
  const [disciplines, themes, projects, skills, experience] = await Promise.all([
    getDisciplines(), getCapabilities(area), getProjects(), getSkillGroups(), getExperience(),
  ]);
  const page = disciplines.find((d) => d.area === area);
  if (!page) notFound();

  const selected = page.projectIds.map((id) => projects.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  const toolbox = page.skillGroupIds.map((id) => skills.find((g) => g.id === id)).filter((g): g is NonNullable<typeof g> => Boolean(g));
  const others = disciplines.filter((d) => d.area !== area);

  return (
    <>
      <PageHeader eyebrow="Discipline" title={page.title} lede={page.tagline}>
        {themes.length > 0 && (
          <nav aria-label="On this page">
            <ul className="flex flex-wrap gap-2">
              {themes.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="inline-block rounded-md border border-line-strong px-3 py-1.5 text-[13px] text-muted transition-colors hover:border-foreground hover:text-foreground">
                    {t.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </PageHeader>

      <section className="border-b border-line">
        <Wrap className="py-14 md:py-20">
          <p className="max-w-3xl text-[1.35rem] leading-[1.55] tracking-tight sm:text-2xl">{page.intro}</p>
        </Wrap>
      </section>

      <Section label="Capabilities" title="What I do, and the evidence">
        <ThemeList themes={themes} projects={projects} experience={experience} />
      </Section>

      {selected.length > 0 && (
        <Section label="Selected work" title="Case studies" tone="sunken" action={{ href: "/projects", label: "All projects" }}>
          <ul className="hairline-grid md:grid-cols-2">
            {selected.map((p) => (
              <li key={p.id}><ProjectCard project={p} href={hrefTo(`/projects/${p.id}`)} size="lg" /></li>
            ))}
          </ul>
        </Section>
      )}

      {toolbox.length > 0 && (
        <Section label="Toolbox" title="Technologies I use here">
          <SkillMatrix groups={toolbox} />
        </Section>
      )}

      <Section label="Keep exploring" title="Related disciplines" tone="sunken">
        <ul className="hairline-grid md:grid-cols-2">
          {others.map((o) => (
            <li key={o.area}>
              <Link href={hrefTo(PATH[o.area])} className="group flex h-full flex-col p-6 transition-colors hover:bg-surface sm:p-8">
                <span className="text-xl font-semibold tracking-tight transition-colors group-hover:text-accent">{o.title}</span>
                <span className="mt-2 text-[15px] text-muted">{o.tagline}</span>
                <span aria-hidden="true" className="mt-4 text-subtle transition-transform group-hover:translate-x-1 group-hover:text-accent">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand />
    </>
  );
}
