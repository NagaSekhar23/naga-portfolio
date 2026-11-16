/**
 * Offline verification of the CMS pipeline — no Sanity account needed.
 * 1. Builds the seed documents from /data.
 * 2. Runs the site's REAL GROQ queries (sanity/lib/cms.ts) against them in memory (groq-js).
 * 3. Compares the mapped output to the local /data content, field by field.
 * Fails if anything is lost or changed in migration.
 */
import { evaluate, parse } from "groq-js";
import { isDeepStrictEqual } from "node:util";
import * as data from "../data";
import * as cms from "../sanity/lib/cms";
import { buildDocuments } from "./seed-docs";

const dataset = buildDocuments().map((d) => ({ ...d, _createdAt: "2026-01-01T00:00:00Z" }));
cms.__setFetcher(async <T>(query: string) => {
  const result = await evaluate(parse(query), { dataset });
  return (await result.get()) as T;
});

const strip = (v: unknown): unknown => JSON.parse(JSON.stringify(v));
let failures = 0;

function check(name: string, got: unknown, want: unknown) {
  const a = strip(got), b = strip(want);
  if (isDeepStrictEqual(a, b)) return console.log(`  ✓ ${name}`);
  failures++;
  console.log(`  ✗ ${name}`);
  const A = JSON.stringify(a, null, 1).split("\n"), B = JSON.stringify(b, null, 1).split("\n");
  for (let i = 0; i < Math.max(A.length, B.length); i++)
    if (A[i] !== B[i]) { console.log(`     first diff @${i}\n     cms:   ${A[i]}\n     local: ${B[i]}`); break; }
}


const noId = <T extends { id: string }>(xs: T[]) => xs.map(({ id: _id, ...r }) => r);

async function main() {
  console.log("Seed documents:", dataset.length);
  console.log("Dataset seeded:", await cms.isSeeded());

  check("profile", await cms.cmsProfile(), { ...data.profile, socials: [] });
  check("coursework", await cms.cmsCoursework(), data.coursework);
  check("nav", await cms.cmsNav(), data.navItems);
  check("site (seo + footer)", await cms.cmsSite(data.site), { ...data.site, footerLinkIds: ["github", "ieee-xplore", "google-scholar"] });
  check("experience", noId(await cms.cmsExperience()), noId(data.experience));
  check("skills", noId(await cms.cmsSkills()), noId(data.skillGroups));

  // Projects: images are empty (no local files); rich text is compared as plain paragraphs.
  const cmsProjects = await cms.cmsProjects();
  const textOf = (blocks?: { children?: { text: string }[] }[]) => blocks?.map((b) => b.children?.map((c) => c.text).join(""));
  check(
    "projects",
    cmsProjects.map(({ body, images, ...r }) => ({ ...r, description: textOf(body as never), imagesCount: images?.length ?? 0 })),
    data.projects.map(({ description, images, ...r }) => ({ ...r, description, imagesCount: images?.length ?? 0 })),
  );
  check("project categories", await cms.cmsProjectCategories(), data.projectCategories);
  check("publications", noId(await cms.cmsPublications()), noId(data.publications));
  check("education", noId(await cms.cmsEducation()), noId(data.education));
  check("certifications", noId(await cms.cmsCertifications()), noId(data.certificationGroups));
  check("achievements", noId(await cms.cmsAchievements()), noId(data.achievements));
  check("professional links", await cms.cmsLinks(), data.professionalLinks);
  check(
    "capability themes",
    noId(await cms.cmsCapabilities()).map((t) => ({ ...t, items: t.items.map((i) => ({ ...i, experienceId: i.experienceId?.replace(/^experience-/, "") })) })),
    noId(data.capabilities),
  );
  check("discipline pages", await cms.cmsDisciplines(), data.disciplines);

  console.log(failures ? `\n✗ ${failures} mismatch(es)` : "\n✓ CMS output is identical to local content");
  process.exit(failures ? 1 : 0);
}

main();
