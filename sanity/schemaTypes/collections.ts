import { defineField, defineType } from "sanity";
import { orderable, stringList } from "./helpers";

const slugField = (source = "title") =>
  defineField({
    name: "slug",
    title: "URL slug",
    type: "slug",
    options: { source, maxLength: 80 },
    validation: (r) => r.required(),
  });

export const projectCategory = defineType({
  name: "projectCategory",
  title: "Project category",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Name", type: "string", validation: (r) => r.required() }),
    orderable("projectCategory"),
  ],
  preview: { select: { title: "title" } },
});

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  groups: [
    { name: "basics", title: "Basics", default: true },
    { name: "story", title: "Write-up" },
    { name: "media", title: "Images & links" },
  ],
  fields: [
    defineField({ name: "title", title: "Title", type: "string", group: "basics", validation: (r) => r.required() }),
    { ...slugField(), group: "basics" },
    defineField({ name: "category", title: "Category", type: "reference", to: [{ type: "projectCategory" }], group: "basics", validation: (r) => r.required() }),
    defineField({ name: "featured", title: "Featured (shows under the Featured tab)", type: "boolean", initialValue: false, group: "basics" }),
    defineField({ name: "status", title: "Status", type: "string", group: "basics", options: { list: ["Live", "In Progress"] } }),
    defineField({ name: "badge", title: "Highlight line (e.g. award)", type: "string", group: "basics" }),
    defineField({ name: "summary", title: "One-sentence summary", type: "text", rows: 2, group: "basics", validation: (r) => r.required() }),
    { ...stringList("highlights", "Highlights", "Outcome-first bullets. Only metrics you can support."), group: "basics" },
    { ...stringList("tech", "Technologies"), group: "basics" },
    defineField({ name: "body", title: "Detailed description", type: "blockContent", group: "story" }),
    defineField({
      name: "images",
      title: "Screenshots",
      type: "array",
      group: "media",
      of: [
        {
          type: "image",
          name: "screenshot",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string", validation: (r) => r.required() }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
        },
      ],
    }),
    defineField({ name: "links", title: "Links (GitHub, live demo, paper…)", type: "array", group: "media", of: [{ type: "linkItem" }] }),
    orderable("project"),
  ],
  orderings: [
    { title: "Title A–Z", name: "titleAsc", by: [{ field: "title", direction: "asc" }] },
    { title: "Recently edited", name: "updatedDesc", by: [{ field: "_updatedAt", direction: "desc" }] },
  ],
  preview: { select: { title: "title", subtitle: "summary", media: "images.0" } },
});

export const experience = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    defineField({ name: "role", title: "Job title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "company", title: "Company / organisation", type: "string", validation: (r) => r.required() }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "start", title: "Start (e.g. Jan 2026)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "end", title: "End (e.g. Dec 2025, or Present)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "type", title: "Note (e.g. 24-hour hackathon)", type: "string" }),
    defineField({ name: "context", title: "What the company / team does", type: "text", rows: 2 }),
    stringList("highlights", "Responsibilities & outcomes", "The first three show by default; the rest expand."),
    stringList("tech", "Technologies"),
    orderable("experience"),
  ],
  preview: { select: { title: "role", subtitle: "company" } },
});

export const capabilityTheme = defineType({
  name: "capabilityTheme",
  title: "Capability theme",
  type: "document",
  fields: [
    defineField({
      name: "area",
      title: "Appears on",
      type: "string",
      options: { list: [
        { title: "Software Engineering page", value: "engineering" },
        { title: "Applied AI page", value: "applied-ai" },
        { title: "Data & ML page", value: "data-ml" },
      ] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "title", title: "Theme title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 2 }),
    defineField({
      name: "items",
      title: "Work in this theme",
      type: "array",
      of: [
        {
          type: "object",
          name: "capabilityItem",
          fields: [
            defineField({ name: "text", title: "Description", type: "text", rows: 3, validation: (r) => r.required() }),
            defineField({ name: "projects", title: "Related projects", type: "array", of: [{ type: "reference", to: [{ type: "project" }] }] }),
            defineField({ name: "experience", title: "Related role", type: "reference", to: [{ type: "experience" }] }),
          ],
          preview: { select: { title: "text" } },
        },
      ],
    }),
    orderable("capabilityTheme"),
  ],
  preview: { select: { title: "title", subtitle: "area" } },
});

export const disciplinePage = defineType({
  name: "disciplinePage",
  title: "Discipline page",
  type: "document",
  fields: [
    defineField({
      name: "area",
      title: "Page",
      type: "string",
      readOnly: true,
      options: { list: [
        { title: "/engineering", value: "engineering" },
        { title: "/applied-ai", value: "applied-ai" },
        { title: "/data-ml", value: "data-ml" },
      ] },
    }),
    defineField({ name: "title", title: "Page title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "tagline", title: "Tagline", type: "string", validation: (r) => r.required() }),
    defineField({ name: "intro", title: "Introduction", type: "text", rows: 5, validation: (r) => r.required() }),
    defineField({ name: "projects", title: "Selected work", description: "Projects featured on this page, in order.", type: "array", of: [{ type: "reference", to: [{ type: "project" }] }] }),
    defineField({ name: "skillGroups", title: "Toolbox", description: "Skill categories shown on this page, in order.", type: "array", of: [{ type: "reference", to: [{ type: "skillGroup" }] }] }),
  ],
  preview: { select: { title: "title", subtitle: "tagline" } },
});

export const skillGroup = defineType({
  name: "skillGroup",
  title: "Skill category",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Category name", type: "string", validation: (r) => r.required() }),
    stringList("skills", "Skills", "One per line. Drag to reorder."),
    orderable("skillGroup"),
  ],
  preview: { select: { title: "title" } },
});

export const publication = defineType({
  name: "publication",
  title: "Publication / research output",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Exact title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: { list: [
        { title: "Journal article", value: "journal" },
        { title: "Conference paper", value: "conference" },
        { title: "Dataset", value: "dataset" },
        { title: "Book", value: "book" },
        { title: "Patent", value: "patent" },
        { title: "Other research", value: "research" },
      ] },
      validation: (r) => r.required(),
    }),
    stringList("authors", "Authors", "As printed on the paper. Your name is highlighted automatically."),
    defineField({ name: "venue", title: "Journal / conference / repository", type: "string" }),
    defineField({ name: "publisher", title: "Publisher", type: "string" }),
    defineField({ name: "year", title: "Year", type: "string" }),
    defineField({ name: "date", title: "Display date (e.g. Mar 2026)", type: "string" }),
    defineField({ name: "doi", title: "DOI", type: "string", description: "Bare DOI, e.g. 10.1016/j.csbj.2025.10.063 — the link is built for you." }),
    defineField({ name: "links", title: "Other links (PDF, PubMed Central…)", type: "array", of: [{ type: "linkItem" }] }),
    defineField({ name: "note", title: "Note", type: "string" }),
    orderable("publication"),
  ],
  orderings: [
    { title: "Title A–Z", name: "titleAsc", by: [{ field: "title", direction: "asc" }] },
    { title: "Year (newest first)", name: "yearDesc", by: [{ field: "year", direction: "desc" }] },
    { title: "Recently edited", name: "updatedDesc", by: [{ field: "_updatedAt", direction: "desc" }] },
  ],
  preview: { select: { title: "title", subtitle: "venue" } },
});

export const education = defineType({
  name: "education",
  title: "Education",
  type: "document",
  fields: [
    defineField({ name: "degree", title: "Degree", type: "string", validation: (r) => r.required() }),
    defineField({ name: "institution", title: "Institution", type: "string", validation: (r) => r.required() }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "graduated", title: "Graduation (e.g. Dec 2025)", type: "string" }),
    defineField({ name: "gpa", title: "GPA (display text)", type: "string" }),
    stringList("notes", "Notes (capstone, leadership…)"),
    orderable("education"),
  ],
  preview: { select: { title: "degree", subtitle: "institution" } },
});

export const certificationGroup = defineType({
  name: "certificationGroup",
  title: "Certification group",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Group name (e.g. Cloud)", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "items",
      title: "Certifications",
      type: "array",
      of: [
        {
          type: "object",
          name: "certification",
          fields: [
            defineField({ name: "name", title: "Certification", type: "string", validation: (r) => r.required() }),
            defineField({ name: "issuer", title: "Issuer", type: "string" }),
          ],
          preview: { select: { title: "name", subtitle: "issuer" } },
        },
      ],
    }),
    orderable("certificationGroup"),
  ],
  preview: { select: { title: "title" } },
});

export const achievement = defineType({
  name: "achievement",
  title: "Achievement",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "detail", title: "Detail", type: "text", rows: 2 }),
    defineField({ name: "year", title: "Year / date (display text)", type: "string" }),
    orderable("achievement"),
  ],
  preview: { select: { title: "title", subtitle: "year" } },
});

export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    slugField(),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "date", title: "Publish date", type: "date", validation: (r) => r.required() }),
    defineField({ name: "publication", title: "Where it appears (e.g. Medium, this site)", type: "string", initialValue: "This site" }),
    defineField({
      name: "externalUrl",
      title: "External URL (optional)",
      description: "If the article lives elsewhere, link to it here. Leave empty to host it on this site using the text below.",
      type: "url",
      validation: (r) => r.uri({ scheme: ["https", "http"] }),
    }),
    defineField({ name: "body", title: "Article text", type: "blockContent", hidden: ({ document }) => Boolean(document?.externalUrl) }),
    stringList("tags", "Tags"),
  ],
  orderings: [{ title: "Newest first", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "date" } },
});

export const professionalLink = defineType({
  name: "professionalLink",
  title: "Professional link",
  type: "document",
  fields: [
    defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "href", title: "URL", type: "url", validation: (r) => r.required().uri({ scheme: ["https", "http"] }) }),
    defineField({
      name: "group",
      title: "Group",
      type: "string",
      options: { list: [
        { title: "Research profiles", value: "research" },
        { title: "Publications", value: "publications" },
        { title: "Code", value: "code" },
        { title: "Live demonstrations", value: "demos" },
        { title: "Writing", value: "writing" },
      ] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "description", title: "Description", type: "string" }),
    defineField({ name: "mark", title: "Short text badge (e.g. GH, IEEE)", type: "string", validation: (r) => r.max(5) }),
    orderable("professionalLink"),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});
