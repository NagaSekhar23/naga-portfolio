import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { portableComponents } from "@/components/ui/PortableTextComponents";
import { TagList } from "@/components/ui/Tag";
import { Wrap } from "@/components/ui/Wrap";
import { CtaBand } from "@/components/blocks/CtaBand";
import { getProjects } from "@/lib/content";
import { hrefTo } from "@/lib/paths";

export async function ProjectView({ slug }: { slug: string }) {
  const all = await getProjects();
  const project = all.find((p) => p.id === slug);
  if (!project) notFound();

  const idx = all.findIndex((p) => p.id === slug);
  const prev = all[idx - 1];
  const next = all[idx + 1];
  const related = all.filter((p) => p.category === project.category && p.id !== slug).slice(0, 2);

  return (
    <>
      <header className="border-b border-line">
        <Wrap className="pb-14 pt-32 md:pb-20 md:pt-40">
          <ArrowLink href="/projects" className="[&>span]:order-first [&>span]:rotate-180">All projects</ArrowLink>
          <p className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="label">{project.category}</span>
            {project.status && <span className="font-mono text-[11px] uppercase tracking-wider text-accent">● {project.status}</span>}
          </p>
          <h1 className="display display-page mt-4 max-w-4xl">{project.title}</h1>
          {project.badge && <p className="mt-4 font-medium text-accent">{project.badge}</p>}
          <p className="lede mt-6 max-w-2xl">{project.summary}</p>
        </Wrap>
      </header>

      <section className="border-b border-line">
        <Wrap className="grid gap-12 py-14 md:py-20 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            {project.images && project.images.length > 0 && (
              <div className="mb-14 space-y-8">
                {project.images.map((img) => (
                  <figure key={img.src}>
                    <Image src={img.src} alt={img.alt} width={img.width} height={img.height} className="h-auto w-full rounded-sm border border-line" sizes="(min-width: 1024px) 50rem, 100vw" priority />
                    {img.caption && <figcaption className="mt-2 text-sm text-subtle">{img.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            )}

            {project.body?.length ? (
              <div className="mb-14"><PortableText value={project.body} components={portableComponents} /></div>
            ) : (
              project.description?.map((para) => <p key={para} className="mb-5 text-[17px] leading-[1.75] text-foreground/90">{para}</p>)
            )}

            <h2 className="label border-b border-line pb-3">Outcomes</h2>
            <ul className="mt-6 space-y-5 text-[17px] leading-[1.7]">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-4">
                  <span aria-hidden="true" className="mt-[0.85em] h-px w-4 shrink-0 bg-accent" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:col-span-4" aria-label="Project details">
            <div className="space-y-8 border-t border-line pt-6 lg:sticky lg:top-24">
              {project.links && project.links.length > 0 && (
                <div>
                  <h2 className="label">Links</h2>
                  <ul className="mt-3 space-y-2 text-sm">
                    {project.links.map((l) => (
                      <li key={l.href}><ExternalLink href={l.href}>{l.label}</ExternalLink></li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <h2 className="label">Built with</h2>
                <div className="mt-3"><TagList items={project.tech} label={`Technologies used in ${project.title}`} /></div>
              </div>
            </div>
          </aside>
        </Wrap>
      </section>

      {related.length > 0 && (
        <section className="border-b border-line bg-surface-2/50">
          <Wrap className="py-14 md:py-20">
            <h2 className="label">More in {project.category}</h2>
            <ul className="mt-6 grid gap-6 md:grid-cols-2">
              {related.map((p) => (
                <li key={p.id}>
                  <Link href={hrefTo(`/projects/${p.id}`)} className="group block border-t border-line-strong pt-4">
                    <span className="font-semibold tracking-tight transition-colors group-hover:text-accent">{p.title}</span>
                    <span className="mt-1 block text-sm text-muted">{p.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Wrap>
        </section>
      )}

      <nav aria-label="Adjacent projects" className="border-b border-line">
        <Wrap className="grid gap-6 py-10 sm:grid-cols-2">
          <div>{prev && (
            <Link href={hrefTo(`/projects/${prev.id}`)} className="group block">
              <span className="label">← Previous</span>
              <span className="mt-1 block font-medium group-hover:text-accent">{prev.title}</span>
            </Link>
          )}</div>
          <div className="sm:text-right">{next && (
            <Link href={hrefTo(`/projects/${next.id}`)} className="group block">
              <span className="label">Next →</span>
              <span className="mt-1 block font-medium group-hover:text-accent">{next.title}</span>
            </Link>
          )}</div>
        </Wrap>
      </nav>
      <CtaBand />
    </>
  );
}
