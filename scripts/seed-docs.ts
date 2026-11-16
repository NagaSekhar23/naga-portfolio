/**
 * Builds the Sanity documents that mirror the current content in /data.
 * Pure function (no network). Used by migrate-to-sanity.ts and verify-cms.ts.
 */
import { LexoRank } from "lexorank";
import * as data from "../data";

type Doc = { _id: string; _type: string; [k: string]: unknown };

let n = 0;
const key = () => `k${(n++).toString(36)}`;
const withKeys = <T extends object>(arr: T[] | undefined) => (arr ?? []).map((o) => ({ _key: key(), ...o }));
const ref = (id: string) => ({ _type: "reference", _ref: id });
const refKeyed = (id: string) => ({ _key: key(), _type: "reference", _ref: id });
const slugify = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Sequential LexoRank values so the Studio's drag-and-drop list starts in today's order. */
function ranker() {
  let r = LexoRank.middle();
  return () => {
    r = r.genNext();
    return r.toString();
  };
}

export function buildDocuments(): Doc[] {
  const docs: Doc[] = [];
  const p = data.profile;

  docs.push({
    _id: "profile", _type: "profile",
    name: p.name, headline: p.headline, introduction: p.introduction, summary: p.summary,
    disciplines: withKeys(p.disciplines), about: p.about, focusAreas: withKeys(p.focusAreas),
    domains: p.domains, roles: p.roles, location: p.location, availability: p.availability,
    email: p.email, stats: withKeys(p.stats), coursework: data.coursework,
  });

  const footerIds = ["github", "ieee-xplore", "google-scholar"];
  docs.push({
    _id: "siteSettings", _type: "siteSettings",
    title: data.site.title, description: data.site.description, keywords: data.site.keywords,
    navItems: withKeys(data.navItems),
    footerLinks: footerIds.map((id) => refKeyed(`professionalLink-${id}`)),
  });

  // Resume: file left empty on purpose (upload a PDF in the Studio). Site keeps using the
  // bundled file until one is uploaded.
  docs.push({ _id: "resume", _type: "resume", label: "Download resume (PDF)", downloadName: "Naga_Sekhar_Madala_Resume.pdf" });

  const add = <T>(type: string, items: T[], idOf: (i: T) => string, map: (i: T) => object) => {
    const next = ranker();
    for (const i of items) docs.push({ _id: `${type}-${idOf(i)}`, _type: type, ...map(i), orderRank: next() });
  };

  add("projectCategory", [...data.projectCategories], slugify, (c) => ({ title: c }));
  add("experience", data.experience, (e) => e.id, ({ id: _id, ...e }) => e);
  add("skillGroup", data.skillGroups, (g) => g.id, ({ id: _id, ...g }) => g);
  add("project", data.projects, (x) => x.id, (x) => ({
    title: x.title, slug: { _type: "slug", current: x.id },
    category: ref(`projectCategory-${slugify(x.category)}`),
    featured: Boolean(x.featured), status: x.status, badge: x.badge, summary: x.summary,
    highlights: x.highlights, tech: x.tech,
    body: x.description?.map((t) => ({ _key: key(), _type: "block", style: "normal", markDefs: [], children: [{ _key: key(), _type: "span", marks: [], text: t }] })),
    links: withKeys(x.links),
  }));
  add("capabilityTheme", data.capabilities, (t) => t.id, (t) => ({
    area: t.area, title: t.title, summary: t.summary,
    items: t.items.map((i) => ({
      _key: key(), text: i.text,
      projects: (i.projectIds ?? []).map((id) => refKeyed(`project-${id}`)),
      experience: i.experienceId ? ref(`experience-${i.experienceId}`) : undefined,
    })),
  }));
  for (const d of data.disciplines)
    docs.push({
      _id: `disciplinePage-${d.area}`, _type: "disciplinePage",
      area: d.area, title: d.title, tagline: d.tagline, intro: d.intro,
      projects: d.projectIds.map((id) => refKeyed(`project-${id}`)),
      skillGroups: d.skillGroupIds.map((id) => refKeyed(`skillGroup-${id}`)),
    });
  add("publication", data.publications, (x) => x.id, ({ id: _id, ...x }) => ({ ...x, links: x.links ? withKeys(x.links) : undefined }));
  add("education", data.education, (x) => x.id, ({ id: _id, ...x }) => x);
  add("certificationGroup", data.certificationGroups, (x) => x.id, (x) => ({ title: x.title, items: withKeys(x.items) }));
  add("achievement", data.achievements, (x) => x.id, ({ id: _id, ...x }) => x);
  add("professionalLink", data.professionalLinks, (x) => x.id, ({ id: _id, ...x }) => x);
  for (const a of data.articles)
    docs.push({ _id: `article-${a.id}`, _type: "article", title: a.title, slug: { _type: "slug", current: a.slug ?? a.id }, summary: a.summary, date: a.date, publication: a.publication, externalUrl: a.href, tags: a.tags });

  // Drop undefined values (Sanity rejects them).
  return docs.map((d) => JSON.parse(JSON.stringify(d)));
}
