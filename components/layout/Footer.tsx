import Link from "next/link";
import { routes } from "@/data/routes";
import { getProfessionalLinks, getProfile, getSite } from "@/lib/content";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Wrap } from "@/components/ui/Wrap";

const DEFAULT_FOOTER_IDS = ["github", "ieee-xplore", "google-scholar"];
const col = (...hrefs: string[]) => hrefs.map((h) => routes.find((r) => r.href === h)!).filter(Boolean);

export async function Footer() {
  const [profile, links, site] = await Promise.all([getProfile(), getProfessionalLinks(), getSite()]);
  const ids = site.footerLinkIds?.length ? site.footerLinkIds : DEFAULT_FOOTER_IDS;
  const elsewhere = ids.map((id) => links.find((l) => l.id === id)).filter((l): l is NonNullable<typeof l> => Boolean(l));

  const columns = [
    { title: "Profile", items: col("/about", "/experience", "/education", "/contact") },
    { title: "Disciplines", items: col("/engineering", "/applied-ai", "/data-ml") },
    { title: "Work", items: col("/projects", "/research", "/writing") },
  ];

  return (
    <footer className="border-t border-line bg-surface-2/40">
      <Wrap className="grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <p className="text-[15px] font-semibold tracking-tight">{profile.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">{profile.headline}</p>
          <p className="mt-4 text-sm text-subtle">{profile.location}</p>
          <a href={`mailto:${profile.email}`} className="mt-1 inline-block text-sm underline decoration-line-strong underline-offset-4 hover:text-accent">
            {profile.email}
          </a>
        </div>
        {columns.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h2 className="label">{c.title}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {c.items.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="text-muted transition-colors hover:text-foreground">{r.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <nav aria-label="Elsewhere">
          <h2 className="label">Elsewhere</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {elsewhere.map((l) => (
              <li key={l.id}>
                <ExternalLink href={l.href} className="text-muted no-underline">{l.label}</ExternalLink>
              </li>
            ))}
          </ul>
        </nav>
      </Wrap>
      <div className="border-t border-line">
        <Wrap className="flex flex-col gap-2 py-6 text-xs text-subtle sm:flex-row sm:justify-between">
          <p>{site.footerText || `© ${profile.name}`}</p>
          <p>Built with Next.js and Sanity</p>
        </Wrap>
      </div>
    </footer>
  );
}
