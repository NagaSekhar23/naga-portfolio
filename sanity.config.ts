"use client";

/**
 * Sanity Studio config — the private content workspace, served at /studio (see app/studio).
 * Authentication is handled by Sanity: only people invited to the project can sign in.
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { defineLocations, presentationTool } from "sanity/presentation";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes, singletonTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
import { overviewTool } from "./sanity/studio/overview";
import { Logo } from "./sanity/studio/Logo";
import { studioTheme } from "./sanity/studio/theme";

const where = (...pages: [string, string][]) =>
  defineLocations({ locations: pages.map(([title, href]) => ({ title, href })) });

const AREA_PAGE: Record<string, [string, string]> = {
  engineering: ["Engineering", "/preview/engineering"],
  "applied-ai": ["Applied AI", "/preview/applied-ai"],
  "data-ml": ["Data & ML", "/preview/data-ml"],
};

export default defineConfig({
  name: "portfolio",
  title: "Naga — Workspace",
  basePath: "/studio",
  projectId: projectId || "missing-project-id",
  dataset,
  theme: studioTheme,
  studio: { components: { logo: Logo } },
  schema: {
    types: schemaTypes,
    // Singletons can't be created or duplicated from the "new document" menu.
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.includes(schemaType)),
  },
  document: {
    actions: (input, context) =>
      singletonTypes.includes(context.schemaType)
        ? input.filter(({ action }) => action && !["unpublish", "delete", "duplicate"].includes(action))
        : input,
  },
  plugins: [
    overviewTool(),
    structureTool({ structure, title: "Content" }),
    // "Preview" = unpublished drafts rendered on the real site pages before publishing.
    presentationTool({
      title: "Preview",
      previewUrl: {
        initial: "/preview",
        previewMode: { enable: "/api/draft-mode/enable", disable: "/api/draft-mode/disable" },
      },
      resolve: {
        locations: {
          profile: where(["Home", "/preview"], ["About", "/preview/about"], ["Contact", "/preview/contact"]),
          siteSettings: where(["Home", "/preview"]),
          resume: where(["Contact", "/preview/contact"], ["About", "/preview/about"]),
          professionalLink: where(["About", "/preview/about"], ["Contact", "/preview/contact"], ["Research", "/preview/research"]),
          experience: where(["Experience", "/preview/experience"], ["Home", "/preview"]),
          education: where(["Education", "/preview/education"]),
          certificationGroup: where(["Education", "/preview/education"]),
          achievement: where(["Education", "/preview/education"]),
          publication: where(["Research", "/preview/research"]),
          skillGroup: where(["Engineering", "/preview/engineering"], ["Applied AI", "/preview/applied-ai"], ["Data & ML", "/preview/data-ml"]),
          projectCategory: where(["Projects", "/preview/projects"]),
          article: defineLocations({
            select: { title: "title", slug: "slug.current" },
            resolve: (doc) => ({
              locations: [
                ...(doc?.slug ? [{ title: doc.title || "Article", href: `/preview/writing/${doc.slug}` }] : []),
                { title: "Writing", href: "/preview/writing" },
              ],
            }),
          }),
          project: defineLocations({
            select: { title: "title", slug: "slug.current" },
            resolve: (doc) => ({
              locations: [
                ...(doc?.slug ? [{ title: doc.title || "Project", href: `/preview/projects/${doc.slug}` }] : []),
                { title: "Projects", href: "/preview/projects" },
              ],
            }),
          }),
          capabilityTheme: defineLocations({
            select: { title: "title", area: "area" },
            resolve: (doc) => ({ locations: doc?.area && AREA_PAGE[doc.area] ? [{ title: AREA_PAGE[doc.area][0], href: AREA_PAGE[doc.area][1] }] : [] }),
          }),
          disciplinePage: defineLocations({
            select: { title: "title", area: "area" },
            resolve: (doc) => ({ locations: doc?.area && AREA_PAGE[doc.area] ? [{ title: AREA_PAGE[doc.area][0], href: AREA_PAGE[doc.area][1] }] : [] }),
          }),
        },
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
