import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Photo } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { Wrap } from "@/components/ui/Wrap";
import { ProjectCard } from "@/components/blocks/ProjectCard";
import { CtaBand } from "@/components/blocks/CtaBand";
import { getArticles, getExperience, getProfile, getProjects, getPublications, getSite } from "@/lib/content";
import { hrefTo } from "@/lib/paths";

const d = (i: number) => ({ "--i": i }) as React.CSSProperties;

export async function HomeView() {
  const [profile, site, projects, publications, experience, articles] = await Promise.all([
    getProfile(), getSite(), getProjects(), getPublications(), getExperience(), getArticles(),
  ]);

  const featured = (projects.filter((p) => p.featured).length ? projects.filter((p) => p.featured) : projects).slice(0, 4);
  const lines = profile.headline.split(/(?<=[.!?])\s+/);
  const current = experience[0];

  const count = (...types: string[]) => publications.filter((p) => types.includes(p.type)).length;
  const researchStats = [
    { n: count("journal"), label: "Peer-reviewed journal article" },
    { n: count("conference"), label: "IEEE conference papers" },
    { n: count("dataset", "book"), label: "Open datasets & books" },
    { n: count("patent"), label: "Patent applications" },
  ].filter((s) => s.n > 0);

  return (
    <>
      {/* Hero */}
      <section aria-labelledby="hero-title" className="border-b border-line">
        <Wrap className="grid gap-12 pb-16 pt-32 md:pt-44 lg:grid-cols-12 lg:items-end lg:gap-10 lg:pb-24">
          <div className="lg:col-span-8">
            <p className="label enter" style={d(0)}>{profile.name} · {profile.location}</p>
            <h1 id="hero-title" className="display display-hero enter mt-6" style={d(1)}>
              {lines.map((line, i) => (
                <span key={line} className={`block ${i > 0 ? "italic text-muted" : ""}`}>{line.replace(/-/g, "\u2011")}</span>
              ))}
            </h1>
            <p className="lede enter mt-8 max-w-2xl" style={d(2)}>{profile.introduction}</p>
            <div className="enter mt-9 flex flex-wrap items-center gap-x-5 gap-y-3" style={d(3)}>
              <ButtonLink href="/projects">View projects</ButtonLink>
              <ButtonLink href={site.resumeHref} variant="secondary" download>Download resume</ButtonLink>
              <ButtonLink href="/about" variant="quiet">About me →</ButtonLink>
            </div>
          </div>
          <div className="enter lg:col-span-4" style={d(3)}>
            <div className="max-w-[15rem] sm:max-w-[20rem] lg:ml-auto lg:max-w-none">
              <Photo photo={profile.photo} name={profile.name} />
            </div>
          </div>
        </Wrap>

        {/* Disciplines: the four entry points */}
        <Wrap className="pb-0">
          <ul className="hairline-grid enter grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={d(4)} aria-label="Areas of focus">
            {profile.disciplines.map((f, i) => (
              <li key={f.title}>
                <Link href={hrefTo(f.href)} className="group flex h-full flex-col p-6 transition-colors hover:bg-surface">
                  <span className="label">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mt-4 text-[17px] font-semibold leading-snug tracking-tight transition-colors group-hover:text-accent">{f.title}</span>
                  <span className="mt-2 text-sm leading-relaxed text-muted">{f.description}</span>
                  <span aria-hidden="true" className="mt-auto pt-5 text-subtle transition-transform duration-200 group-hover:translate-x-1 group-hover:text-accent">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </Wrap>
        <div className="h-16 md:h-24" />
      </section>

      {/* Proof points */}
      <section aria-label="Highlights" className="border-b border-line bg-surface-2/50">
        <Wrap>
          <dl className="grid grid-cols-2 divide-x divide-line lg:grid-cols-4">
            {profile.stats.map((s, i) => (
              <div key={s.label} className={`px-0 py-8 ${i % 2 === 1 ? "pl-5 sm:pl-8" : "pr-5 sm:pr-8"} lg:px-8 lg:first:pl-0`}>
                <dd className="display text-4xl sm:text-5xl">{s.value}</dd>
                <dt className="mt-2 max-w-[14rem] text-[13px] leading-snug text-muted">{s.label}</dt>
              </div>
            ))}
          </dl>
        </Wrap>
      </section>

      {/* Selected work */}
      <Section label="Selected work" title="Systems I’ve built and shipped" action={{ href: "/projects", label: "All projects" }}>
        <ul className="hairline-grid md:grid-cols-2">
          {featured.map((p) => (
            <li key={p.id}>
              <ProjectCard project={p} href={hrefTo(`/projects/${p.id}`)} size="lg" />
            </li>
          ))}
        </ul>
      </Section>

      {/* Current role */}
      {current && (
        <Section label="Currently" tone="sunken" action={{ href: "/experience", label: "Full experience" }}>
          <div className="grid gap-8 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-16">
            <div>
              <p className="font-mono text-xs text-muted">{current.start} – {current.end}</p>
              <h2 className="display display-section mt-3">{current.role}</h2>
              <p className="mt-2 text-muted">{current.company} · {current.location}</p>
            </div>
            <div>
              <p className="lede max-w-2xl">{current.context}</p>
              <ul className="mt-6 max-w-2xl space-y-3 text-[15px] leading-[1.7]">
                {current.highlights.slice(0, 3).map((h) => (
                  <li key={h} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[0.8em] h-px w-3 shrink-0 bg-accent" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      )}

      {/* Research */}
      {researchStats.length > 0 && (
        <Section label="Research" title="Peer-reviewed researcher and author" action={{ href: "/research", label: "Publications & profiles" }}>
          <dl className="hairline-grid grid-cols-2 lg:grid-cols-4">
            {researchStats.map((s) => (
              <Link key={s.label} href={hrefTo("/research")} className="group block p-6 transition-colors hover:bg-surface sm:p-8">
                <dd className="display text-5xl transition-colors group-hover:text-accent">{s.n}</dd>
                <dt className="mt-2 text-sm text-muted">{s.label}</dt>
              </Link>
            ))}
          </dl>
        </Section>
      )}

      {/* Writing teaser (only when there are articles) */}
      {articles.length > 0 && (
        <Section label="Writing" title="Recent writing" tone="sunken" action={{ href: "/writing", label: "All writing" }}>
          <ul className="divide-y divide-line border-y border-line">
            {articles.slice(0, 3).map((a) => (
              <li key={a.id} className="grid gap-1 py-5 md:grid-cols-[9rem_1fr] md:gap-8">
                <p className="font-mono text-xs text-muted md:pt-1.5">{a.date}</p>
                <div>
                  <p className="font-semibold tracking-tight">{a.title}</p>
                  <p className="mt-1 text-sm text-muted">{a.summary}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <CtaBand />
    </>
  );
}
