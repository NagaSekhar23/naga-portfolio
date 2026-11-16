import { PageHeader } from "@/components/ui/PageHeader";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Wrap } from "@/components/ui/Wrap";
import { ContactForm } from "@/components/blocks/ContactForm";
import { getProfessionalLinks, getProfile, getSite } from "@/lib/content";

const DEFAULT_IDS = ["github", "ieee-xplore", "google-scholar"];

export async function ContactView() {
  const [profile, links, site] = await Promise.all([getProfile(), getProfessionalLinks(), getSite()]);
  const ids = site.footerLinkIds?.length ? site.footerLinkIds : DEFAULT_IDS;
  const direct = ids.map((id) => links.find((l) => l.id === id)).filter((l): l is NonNullable<typeof l> => Boolean(l));
  return (
    <>
      <PageHeader eyebrow="Contact" title="Get in touch" lede={`Open to software, AI and data engineering roles, research collaboration and conversations. ${profile.availability}.`} />
      <section className="border-b border-line">
        <Wrap className="grid gap-14 py-16 md:py-24 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="label">Email</h2>
            <p className="mt-3">
              <a href={`mailto:${profile.email}`} className="display break-all text-3xl underline decoration-accent decoration-1 underline-offset-8 transition-colors hover:text-accent sm:text-4xl">
                {profile.email}
              </a>
            </p>
            <dl className="mt-10 space-y-6 text-sm">
              <div><dt className="label">Based in</dt><dd className="mt-1">{profile.location}</dd></div>
              <div><dt className="label">Availability</dt><dd className="mt-1">{profile.availability}</dd></div>
              {direct.length > 0 && (
                <div>
                  <dt className="label">Elsewhere</dt>
                  <dd className="mt-2 space-y-1.5">
                    {direct.map((l) => <p key={l.id}><ExternalLink href={l.href}>{l.label}</ExternalLink></p>)}
                  </dd>
                </div>
              )}
            </dl>
            <div className="mt-10"><ButtonLink href={site.resumeHref} variant="secondary" download>{site.resumeLabel}</ButtonLink></div>
          </div>
          <div className="lg:col-span-7">
            <h2 className="label mb-6">Send a message</h2>
            <ContactForm email={profile.email} />
          </div>
        </Wrap>
      </section>
    </>
  );
}
