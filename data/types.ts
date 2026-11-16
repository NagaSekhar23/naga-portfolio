import type { PortableTextBlock } from "@portabletext/types";

/**
 * Content schemas for the portfolio.
 * Every section on the site is rendered from typed data in /data.
 * To add content, append an entry to the relevant data file — no component changes needed.
 */

export interface Link {
  label: string;
  href: string;
}

export interface ImageAsset {
  /** Path under /public, e.g. "/images/profile/naga.jpg" */
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export interface Profile {
  name: string;
  /** Portrait. Leave undefined to show a monogram placeholder. */
  photo?: ImageAsset;
  headline: string;
  /** Opening introduction shown in the hero. */
  introduction: string;
  /** The four disciplines shown in the hero. Order = display order. */
  disciplines: { title: string; description: string; href: string }[];
  roles: string[];
  location: string;
  availability: string;
  email: string;
  summary: string;
  about: string[];
  focusAreas: { title: string; description: string }[];
  domains: string[];
  stats: { value: string; label: string }[];
  socials: Link[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  /** Display strings, e.g. "Jan 2026" */
  start: string;
  end: string;
  type?: string;
  context: string;
  highlights: string[];
  tech: string[];
}

export interface SkillGroup {
  id: string;
  title: string;
  skills: string[];
}

export interface Project {
  id: string;
  title: string;
  /** Must match a value in projectCategories */
  category: string;
  summary: string;
  highlights: string[];
  tech: string[];
  featured?: boolean;
  status?: "Live" | "In Progress";
  badge?: string;
  /** Longer write-up shown on the project detail page (one string per paragraph). */
  description?: string[];
  /** Rich-text write-up (from the CMS). Takes precedence over `description`. */
  body?: PortableTextBlock[];
  /** Screenshots shown on the detail page. Files live in /public/images/projects/. */
  images?: ImageAsset[];
  /** GitHub, live demo, paper, etc. */
  links?: Link[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduated: string;
  gpa: string;
  notes?: string[];
}

export type PublicationType = "journal" | "conference" | "dataset" | "book" | "patent" | "research";

export interface Publication {
  id: string;
  type: PublicationType;
  title: string;
  authors?: string[];
  venue?: string;
  publisher?: string;
  year?: string;
  /** Display date, e.g. "Mar 2026" */
  date?: string;
  /** Bare DOI, e.g. "10.1016/j.csbj.2025.10.063" — the site builds the doi.org link. */
  doi?: string;
  links?: Link[];
  note?: string;
}

export type LinkGroup = "code" | "research" | "publications" | "demos" | "writing";

export interface ProfessionalLink {
  id: string;
  group: LinkGroup;
  label: string;
  href: string;
  description: string;
  /** Short text mark used as a logo, e.g. "GH", "IEEE". */
  mark: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  /** ISO date, e.g. "2026-03-14" */
  date: string;
  publication: string; // e.g. "Medium", "Dev.to", "This site"
  /** External URL. Omit when the article is hosted here via `body`. */
  href?: string;
  /** URL slug for articles hosted on this site (/writing/<slug>). */
  slug?: string;
  /** Rich-text article body (hosted articles). */
  body?: PortableTextBlock[];
  tags?: string[];
}

export interface CertificationGroup {
  id: string;
  title: string;
  items: { name: string; issuer?: string }[];
}

export interface Achievement {
  id: string;
  title: string;
  detail?: string;
  year?: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  resumeHref: string;
  resumeLabel: string;
  keywords: string[];
  /** Footer line; defaults to © Name · Location. */
  footerText?: string;
  /** ids of professional links shown in the footer. */
  footerLinkIds?: string[];
}

export type CapabilityArea = "engineering" | "applied-ai" | "data-ml";

/** One capability theme on a discipline page. Items reference verified projects/roles by id. */
export interface CapabilityTheme {
  id: string;
  area: CapabilityArea;
  title: string;
  summary: string;
  items: {
    text: string;
    /** project slugs — rendered as links to the project case studies */
    projectIds?: string[];
    /** experience id */
    experienceId?: string;
  }[];
}

/** A discipline page: /engineering, /applied-ai, /data-ml */
export interface DisciplinePage {
  area: CapabilityArea;
  title: string;
  tagline: string;
  intro: string;
  /** skill group ids shown as the toolbox */
  skillGroupIds: string[];
  /** project slugs shown as selected work */
  projectIds: string[];
}
