import { PageHeader } from "@/components/ui/PageHeader";
import { Photo } from "@/components/ui/Photo";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Wrap } from "@/components/ui/Wrap";
import { LinkList } from "@/components/blocks/LinkList";
import { CtaBand } from "@/components/blocks/CtaBand";
import { getLinkGroups, getProfessionalLinks, getProfile, getSite } from "@/lib/content";

export async function AboutView() {
  const [profile, site, links, groups] = await Promise.all([getProfile(), getSite(), getProfessionalLinks(), getLinkGroups()]);
  return (
    <>
      <PageHeader eyebrow="About" title={profile.name} lede={profile.summary} />

      <section className="border-b border-line">
        <Wrap className="grid gap-12 py-16 md:py-24 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-6 lg:col-span-7">
            {profile.about.map((p, i) => (
              <p key={p} className={i === 0 ? "text-2xl leading-snug tracking-tight sm:text-[1.7rem]" : "text-[17px] leading-[1.75] text-muted"}>
                {p}
              </p>
            ))}
          </div>
          <aside className="lg:col-span-4 lg:col-start-9" aria-label="Profile summary">
            <div className="lg:sticky lg:top-24">
              <div className="max-w-xs">
                <Photo photo={profile.photo} name={profile.name} />
              </div>
              <dl className="mt-8 space-y-4 text-sm">
                <div><dt className="label">Location</dt><dd className="mt-1">{profile.location}</dd></div>
                <div><dt className="label">Availability</dt><dd className="mt-1">{profile.availability}</dd></div>
                <div>
                  <dt className="label">Email</dt>
                  <dd className="mt-1"><a href={`mailto:${profile.email}`} className="underline decoration-line-strong underline-offset-4 hover:text-accent">{profile.email}</a></dd>
                </div>
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href={site.resumeHref} download>{site.resumeLabel}</ButtonLink>
              </div>
            </div>
          </aside>
        </Wrap>
      </section>

      <Section label="How I work" title="Focus areas">
        <dl className="hairline-grid md:grid-cols-2">
          {profile.focusAreas.map((f) => (
            <div key={f.title} className="p-6 sm:p-8">
              <dt className="text-lg font-semibold tracking-tight">{f.title}</dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-muted">{f.description}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section label="Industries" title="Domains I’ve worked in" tone="sunken">
        <ul className="flex flex-wrap gap-2">
          {profile.domains.map((d) => (
            <li key={d} className="rounded-md border border-line-strong bg-surface px-3.5 py-1.5 text-sm">{d}</li>
          ))}
        </ul>
      </Section>

      <Section label="Elsewhere" title="Profiles, code and publications">
        <LinkList links={links} groups={groups} />
      </Section>

      <CtaBand />
    </>
  );
}
