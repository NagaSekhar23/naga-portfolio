/* eslint-disable @typescript-eslint/no-explicit-any -- GROQ results are untyped; every row is mapped into the typed models in data/types.ts right here. */
/**
 * CMS read layer: GROQ queries + mapping into the site's own types (data/types.ts),
 * so components are identical whether content comes from Sanity or from /data.
 */
import type {
  Achievement, Article, CapabilityTheme, CertificationGroup, DisciplinePage, EducationItem, ExperienceItem,
  ProfessionalLink, Profile, Project, Publication, SiteConfig, SkillGroup,
} from "@/data/types";
import { sanityFetch as liveFetch } from "./fetch";
import { IMAGE_PROJECTION, toImageAsset } from "./image";

type Fetcher = <T>(query: string) => Promise<T>;
let fetcher: Fetcher = liveFetch;
/** Test hook: lets scripts/verify-cms.ts run these exact queries against an in-memory dataset. */
export const __setFetcher = (f: Fetcher) => {
  fetcher = f;
};
const sanityFetch: Fetcher = (q) => fetcher(q);

/** Seeded documents use "<type>-<key>" ids; strip the prefix so ids match the site's own keys. */
const keyOf = (id: string) => id.replace(/^(professionalLink|skillGroup)-/, "");

const ORDER = "order(orderRank asc, _createdAt asc)";
const clean = <T extends object>(o: T): T =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== null && v !== undefined)) as T;

/** True once the dataset has been seeded (a profile document exists). */
export async function isSeeded(): Promise<boolean> {
  return Boolean(await sanityFetch<string | null>(`*[_id == "profile"][0]._id`));
}

export async function cmsProfile(): Promise<Profile | null> {
  const r = await sanityFetch<any>(`*[_id == "profile"][0]{
    name, headline, introduction, summary, about, location, availability, email,
    roles, domains, coursework, "stats": stats[]{value,label},
    "focusAreas": focusAreas[]{title,description},
    "disciplines": disciplines[]{title,description,href},
    "photo": photo${IMAGE_PROJECTION}
  }`);
  if (!r) return null;
  return {
    name: r.name ?? "",
    photo: toImageAsset(r.photo, r.name),
    headline: r.headline ?? "",
    introduction: r.introduction ?? "",
    disciplines: r.disciplines ?? [],
    roles: r.roles ?? [],
    location: r.location ?? "",
    availability: r.availability ?? "",
    email: r.email ?? "",
    summary: r.summary ?? "",
    about: r.about ?? [],
    focusAreas: r.focusAreas ?? [],
    domains: r.domains ?? [],
    stats: r.stats ?? [],
    socials: [],
  };
}

export const cmsCoursework = async (): Promise<string[] | null> =>
  sanityFetch<string[] | null>(`*[_id == "profile"][0].coursework`);

export async function cmsSite(base: SiteConfig): Promise<SiteConfig> {
  const [s, resume] = await Promise.all([
    sanityFetch<any>(`*[_id == "siteSettings"][0]{ title, description, keywords, footerText, "footerLinkIds": footerLinks[]->_id }`),
    sanityFetch<any>(`*[_id == "resume"][0]{ label, downloadName, "url": file.asset->url }`),
  ]);
  return {
    ...base,
    ...(s ? clean({ title: s.title, description: s.description, keywords: s.keywords, footerText: s.footerText, footerLinkIds: s.footerLinkIds?.map(keyOf) }) : {}),
    ...(resume?.url
      ? {
          resumeHref: `${resume.url}?dl=${encodeURIComponent(resume.downloadName || "resume.pdf")}`,
          resumeLabel: resume.label || base.resumeLabel,
        }
      : {}),
  };
}

export const cmsNav = async (): Promise<{ href: string; label: string }[] | null> =>
  sanityFetch<{ href: string; label: string }[] | null>(`*[_id == "siteSettings"][0].navItems[]{href,label}`);

export async function cmsExperience(): Promise<ExperienceItem[]> {
  const rows = await sanityFetch<any[]>(`*[_type == "experience"] | ${ORDER}{ _id, role, company, location, start, end, type, context, highlights, tech }`);
  return rows.map((r) => clean({ id: r._id, role: r.role, company: r.company, location: r.location ?? "", start: r.start, end: r.end, type: r.type, context: r.context ?? "", highlights: r.highlights ?? [], tech: r.tech ?? [] }) as ExperienceItem);
}

export async function cmsSkills(): Promise<SkillGroup[]> {
  const rows = await sanityFetch<any[]>(`*[_type == "skillGroup"] | ${ORDER}{ _id, title, skills }`);
  return rows.map((r) => ({ id: keyOf(r._id), title: r.title, skills: r.skills ?? [] }));
}

export async function cmsProjects(): Promise<Project[]> {
  const rows = await sanityFetch<any[]>(`*[_type == "project" && defined(slug.current)] | ${ORDER}{
    _id, "slug": slug.current, title, "category": category->title, featured, status, badge, summary,
    highlights, tech, body, links[]{label, href},
    "images": images[]${IMAGE_PROJECTION}
  }`);
  return rows.map((r) =>
    clean({
      id: r.slug,
      title: r.title,
      category: r.category ?? "Other",
      featured: r.featured || undefined,
      status: r.status,
      badge: r.badge,
      summary: r.summary ?? "",
      highlights: r.highlights ?? [],
      tech: r.tech ?? [],
      body: r.body?.length ? r.body : undefined,
      images: (r.images ?? []).map((i: any) => toImageAsset(i, r.title)).filter(Boolean),
      links: r.links?.length ? r.links : undefined,
    }) as Project,
  );
}

export const cmsProjectCategories = async (): Promise<string[]> =>
  sanityFetch<string[]>(`*[_type == "projectCategory"] | ${ORDER}.title`);

export async function cmsPublications(): Promise<Publication[]> {
  const rows = await sanityFetch<any[]>(`*[_type == "publication"] | ${ORDER}{ _id, type, title, authors, venue, publisher, year, date, doi, links[]{label,href}, note }`);
  return rows.map((r) => clean({ id: r._id, type: r.type, title: r.title, authors: r.authors?.length ? r.authors : undefined, venue: r.venue, publisher: r.publisher, year: r.year, date: r.date, doi: r.doi, links: r.links?.length ? r.links : undefined, note: r.note }) as Publication);
}

export async function cmsEducation(): Promise<EducationItem[]> {
  const rows = await sanityFetch<any[]>(`*[_type == "education"] | ${ORDER}{ _id, degree, institution, location, graduated, gpa, notes }`);
  return rows.map((r) => clean({ id: r._id, degree: r.degree, institution: r.institution, location: r.location ?? "", graduated: r.graduated ?? "", gpa: r.gpa ?? "", notes: r.notes?.length ? r.notes : undefined }) as EducationItem);
}

export async function cmsCertifications(): Promise<CertificationGroup[]> {
  const rows = await sanityFetch<any[]>(`*[_type == "certificationGroup"] | ${ORDER}{ _id, title, "items": items[]{name, issuer} }`);
  return rows.map((r) => ({ id: r._id, title: r.title, items: (r.items ?? []).map((i: any) => clean({ name: i.name, issuer: i.issuer })) }));
}

export async function cmsAchievements(): Promise<Achievement[]> {
  const rows = await sanityFetch<any[]>(`*[_type == "achievement"] | ${ORDER}{ _id, title, detail, year }`);
  return rows.map((r) => clean({ id: r._id, title: r.title, detail: r.detail, year: r.year }) as Achievement);
}

export async function cmsArticles(): Promise<Article[]> {
  const rows = await sanityFetch<any[]>(`*[_type == "article"] | order(date desc){ _id, "slug": slug.current, title, summary, date, publication, externalUrl, body, tags }`);
  return rows.map((r) =>
    clean({
      id: r._id,
      title: r.title,
      summary: r.summary ?? "",
      date: r.date,
      publication: r.publication ?? "",
      href: r.externalUrl,
      slug: r.externalUrl ? undefined : r.slug,
      body: !r.externalUrl && r.body?.length ? r.body : undefined,
      tags: r.tags?.length ? r.tags : undefined,
    }) as Article,
  );
}

export async function cmsLinks(): Promise<ProfessionalLink[]> {
  const rows = await sanityFetch<any[]>(`*[_type == "professionalLink"] | ${ORDER}{ _id, group, label, href, description, mark }`);
  return rows.map((r) => ({ id: keyOf(r._id), group: r.group, label: r.label, href: r.href, description: r.description ?? "", mark: r.mark ?? "↗" }));
}

export async function cmsCapabilities(): Promise<CapabilityTheme[]> {
  const rows = await sanityFetch<any[]>(`*[_type == "capabilityTheme"] | ${ORDER}{
    _id, area, title, summary,
    "items": items[]{ text, "projectIds": projects[]->slug.current, "experienceId": experience->_id }
  }`);
  return rows.map((r) => ({
    id: r._id,
    area: r.area,
    title: r.title,
    summary: r.summary ?? "",
    items: (r.items ?? []).map((i: any) => clean({ text: i.text, projectIds: i.projectIds?.filter(Boolean).length ? i.projectIds.filter(Boolean) : undefined, experienceId: i.experienceId ?? undefined })),
  }));
}

export async function cmsDisciplines(): Promise<DisciplinePage[]> {
  const rows = await sanityFetch<any[]>(`*[_type == "disciplinePage"]{
    area, title, tagline, intro,
    "skillGroupIds": skillGroups[]->_id,
    "projectIds": projects[]->slug.current
  }`);
  return rows.map((r) => ({
    area: r.area,
    title: r.title,
    tagline: r.tagline ?? "",
    intro: r.intro ?? "",
    skillGroupIds: (r.skillGroupIds ?? []).filter(Boolean).map(keyOf),
    projectIds: (r.projectIds ?? []).filter(Boolean),
  }));
}
