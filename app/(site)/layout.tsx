import { siteMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { SiteHeader } from "@/components/layout/Header";
import { CurrentHeader } from "@/components/layout/HeaderCurrent";
import { Footer } from "@/components/layout/Footer";
import { routes } from "@/data/routes";
import { getNavItems, getProfile, getProfessionalLinks, getSite } from "@/lib/content";

/** SEO comes from lib/seo.ts (cached plain data, URL built outside the cache). */
export const generateMetadata = siteMetadata;

/** Public-site chrome (header, footer, structured data). The Studio lives outside this group. */
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [nav, profile, links, site] = await Promise.all([getNavItems(), getProfile(), getProfessionalLinks(), getSite()]);

  // Structured data. sameAs = research + code profiles from the "Professional links" content.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    jobTitle: "Software & AI Engineer",
    description: site.description,
    email: `mailto:${profile.email}`,
    address: { "@type": "PostalAddress", addressLocality: "Atlanta", addressRegion: "GA", addressCountry: "US" },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "University of Alabama at Birmingham" },
      { "@type": "CollegeOrUniversity", name: "Bennett University" },
    ],
    sameAs: links.filter((l) => l.group === "code" || l.group === "research").map((l) => l.href),
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
      >
        Skip to content
      </a>
      {/* usePathname reads URL data, so it sits behind a Suspense boundary. The fallback is the same
          header without the current-page marker, so there is no layout shift. */}
      <Suspense fallback={<SiteHeader items={nav} routes={routes} name={site.name} resumeHref={site.resumeHref} path="" />}>
        <CurrentHeader items={nav} routes={routes} name={site.name} resumeHref={site.resumeHref} />
      </Suspense>
      <main id="main">{children}</main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
