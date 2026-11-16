import { defineField, defineType } from "sanity";
import { stringList } from "./helpers";

const pageRoutes = [
  { title: "About", value: "/about" },
  { title: "Engineering", value: "/engineering" },
  { title: "Applied AI", value: "/applied-ai" },
  { title: "Data & ML", value: "/data-ml" },
  { title: "Projects", value: "/projects" },
  { title: "Research", value: "/research" },
  { title: "Experience", value: "/experience" },
  { title: "Education", value: "/education" },
  { title: "Writing", value: "/writing" },
  { title: "Contact", value: "/contact" },
];

export const profile = defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  groups: [
    { name: "hero", title: "Hero & introduction", default: true },
    { name: "about", title: "About" },
    { name: "details", title: "Details" },
  ],
  fields: [
    defineField({ name: "name", title: "Full name", type: "string", group: "hero", validation: (r) => r.required() }),
    defineField({ name: "headline", title: "Headline", type: "string", group: "hero", description: "The large line in the hero.", validation: (r) => r.required() }),
    defineField({ name: "introduction", title: "Introduction", type: "text", rows: 4, group: "hero", validation: (r) => r.required() }),
    defineField({
      name: "disciplines",
      title: "Areas of focus (hero)",
      description: "The four disciplines under the introduction. Drag to reorder.",
      type: "array",
      group: "hero",
      of: [
        {
          type: "object",
          name: "discipline",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
            defineField({ name: "href", title: "Links to page", type: "string", options: { list: pageRoutes }, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "title", subtitle: "href" } },
        },
      ],
    }),
    defineField({
      name: "photo",
      title: "Profile photo",
      type: "image",
      group: "hero",
      options: { hotspot: true },
      description: "Portrait, ideally 4:5. If empty, a monogram is shown.",
      fields: [defineField({ name: "alt", title: "Alt text", type: "string", validation: (r) => r.required() })],
    }),
    defineField({ name: "summary", title: "Short summary (used on the Resume section)", type: "text", rows: 3, group: "hero" }),
    defineField({
      name: "about",
      title: "Biography",
      description: "One entry per paragraph. The first paragraph is shown larger.",
      type: "array",
      group: "about",
      of: [{ type: "text", rows: 4 }],
    }),
    defineField({
      name: "focusAreas",
      title: "Focus areas (About section)",
      type: "array",
      group: "about",
      of: [
        {
          type: "object",
          name: "focusArea",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        },
      ],
    }),
    { ...stringList("domains", "Domains", "Industries you have worked in."), group: "about" },
    {
      ...stringList("roles", "Role labels", "Short role titles, e.g. Software Engineer."),
      group: "details",
    },
    defineField({ name: "location", title: "Location", type: "string", group: "details" }),
    defineField({ name: "availability", title: "Availability", type: "string", group: "details" }),
    defineField({ name: "email", title: "Contact email", type: "string", group: "details", validation: (r) => r.required().email() }),
    defineField({
      name: "stats",
      title: "Headline statistics",
      description: "Four figures in the band under the hero. Only use numbers you can support.",
      type: "array",
      group: "details",
      of: [
        {
          type: "object",
          name: "stat",
          fields: [
            defineField({ name: "value", title: "Value", type: "string", validation: (r) => r.required() }),
            defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        },
      ],
      validation: (r) => r.max(4),
    }),
    { ...stringList("coursework", "Selected coursework", "Shown under Education."), group: "details" },
  ],
  preview: { select: { title: "name", subtitle: "headline" } },
});


export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "seo", title: "SEO", default: true },
    { name: "nav", title: "Navigation" },
    { name: "footer", title: "Footer" },
  ],
  fields: [
    defineField({ name: "title", title: "SEO title", type: "string", group: "seo", validation: (r) => r.required().max(70) }),
    defineField({ name: "description", title: "SEO description", type: "text", rows: 3, group: "seo", validation: (r) => r.required().max(200) }),
    { ...stringList("keywords", "SEO keywords"), group: "seo" },
    defineField({
      name: "navItems",
      title: "Header navigation",
      description: "The links in the top bar, in order. Contact is always shown as a button.",
      type: "array",
      group: "nav",
      of: [
        {
          type: "object",
          name: "navItem",
          fields: [
            defineField({ name: "href", title: "Page", type: "string", options: { list: pageRoutes }, validation: (r) => r.required() }),
            defineField({ name: "label", title: "Menu label", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        },
      ],
    }),
    defineField({ name: "footerText", title: "Footer text", type: "string", group: "footer", description: "Defaults to © Name · Location." }),
    defineField({
      name: "footerLinks",
      title: "Footer links",
      type: "array",
      group: "footer",
      of: [{ type: "reference", to: [{ type: "professionalLink" }] }],
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});

export const resume = defineType({
  name: "resume",
  title: "Resume",
  type: "document",
  fields: [
    defineField({
      name: "file",
      title: "Resume file (PDF)",
      type: "file",
      options: { accept: "application/pdf,.pdf" },
      description: "Upload a new file to replace the downloadable resume. PDF recommended.",
    }),
    defineField({ name: "label", title: "Button label", type: "string", initialValue: "Download resume (PDF)" }),
    defineField({ name: "downloadName", title: "Downloaded file name", type: "string", initialValue: "Naga_Sekhar_Madala_Resume.pdf" }),
  ],
  preview: { prepare: () => ({ title: "Resume" }) },
});
