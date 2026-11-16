/**
 * CONTENT ACCESS LAYER — the only file components/pages use to read content.
 *
 * Source of truth:
 *   1. Sanity CMS (edited at /studio) when NEXT_PUBLIC_SANITY_PROJECT_ID is set AND the
 *      dataset has been seeded (a "profile" document exists).
 *   2. Otherwise the typed files in /data (also the seed for the CMS).
 * If Sanity is unreachable, the site silently falls back to /data instead of failing.
 */
import * as data from "@/data";
import type {
  Achievement, Article, CapabilityArea, CapabilityTheme, CertificationGroup, DisciplinePage, EducationItem, ExperienceItem,
  ProfessionalLink, Profile, Project, Publication, SiteConfig, SkillGroup,
} from "@/data/types";
import { isSanityConfigured } from "@/sanity/env";
import * as cms from "@/sanity/lib/cms";

async function pick<T>(fromCms: () => Promise<T | null | undefined>, local: () => T): Promise<T> {
  if (!isSanityConfigured) return local();
  try {
    if (!(await cms.isSeeded())) return local();
    return (await fromCms()) ?? local();
  } catch (error) {
    console.warn("[content] Sanity unavailable, using local data:", (error as Error).message);
    return local();
  }
}

export const getSite = (): Promise<SiteConfig> => pick(() => cms.cmsSite(data.site), () => data.site);
export const getNavItems = (): Promise<{ href: string; label: string }[]> =>
  pick(async () => {
    const nav = await cms.cmsNav();
    return nav?.length ? nav : null;
  }, () => data.navItems);
export const getProfile = (): Promise<Profile> => pick(cms.cmsProfile, () => data.profile);
export const getExperience = (): Promise<ExperienceItem[]> => pick(cms.cmsExperience, () => data.experience);
export const getSkillGroups = (): Promise<SkillGroup[]> => pick(cms.cmsSkills, () => data.skillGroups);
export const getProjects = (): Promise<Project[]> => pick(cms.cmsProjects, () => data.projects);
export const getProjectCategories = (): Promise<string[]> =>
  pick(cms.cmsProjectCategories, () => [...data.projectCategories]);
export const getProject = async (id: string): Promise<Project | undefined> =>
  (await getProjects()).find((p) => p.id === id);
export const getEducation = (): Promise<EducationItem[]> => pick(cms.cmsEducation, () => data.education);
export const getCoursework = (): Promise<string[]> => pick(cms.cmsCoursework, () => data.coursework);
export const getPublications = (): Promise<Publication[]> => pick(cms.cmsPublications, () => data.publications);
export const getCertificationGroups = (): Promise<CertificationGroup[]> =>
  pick(cms.cmsCertifications, () => data.certificationGroups);
export const getAchievements = (): Promise<Achievement[]> => pick(cms.cmsAchievements, () => data.achievements);
export const getCapabilities = async (area?: CapabilityArea): Promise<CapabilityTheme[]> => {
  const all = await pick(cms.cmsCapabilities, () => data.capabilities);
  return area ? all.filter((t) => t.area === area) : all;
};
export const getDisciplines = (): Promise<DisciplinePage[]> => pick(cms.cmsDisciplines, () => data.disciplines);
export const getDiscipline = async (area: CapabilityArea): Promise<DisciplinePage | undefined> =>
  (await getDisciplines()).find((d) => d.area === area);
export const getProfessionalLinks = (): Promise<ProfessionalLink[]> => pick(cms.cmsLinks, () => data.professionalLinks);
export const getLinkGroups = async () => data.linkGroups;

export const getArticles = async (): Promise<Article[]> => {
  const list = await pick(cms.cmsArticles, () => data.articles);
  return [...list].sort((a, b) => b.date.localeCompare(a.date));
};
export const getArticle = async (slug: string): Promise<Article | undefined> =>
  (await getArticles()).find((a) => a.slug === slug);

/** Helpers (pure; safe to use anywhere) */
export const doiUrl = (doi: string) => `https://doi.org/${doi}`;
export const sectionNumber = (ids: string[], id: string) => String(ids.indexOf(id) + 1).padStart(2, "0");
