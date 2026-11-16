# Technical documentation

This is the reference for how the portfolio is built and how its parts communicate. It describes the code as it exists in this repository. Where something depends on an external account or setting, it says so.

Companion documents: [README.md](README.md) (start here), [CLAUDE.md](CLAUDE.md) and [AGENTS.md](AGENTS.md) (rules for AI coding assistants), [CONTENT_GUIDE.md](CONTENT_GUIDE.md), [CMS_SETUP.md](CMS_SETUP.md), [DEPLOY.md](DEPLOY.md), [TROUBLESHOOTING.md](TROUBLESHOOTING.md), [ARCHITECTURE.md](ARCHITECTURE.md) (design system), [CHANGELOG.md](CHANGELOG.md).

---

## 1. System overview

The portfolio is a statically-rendered, mostly read-only website with a private content workspace:

- **Public website** — Next.js App Router pages under `app/(site)/`. Pages render content that comes from either the Sanity CMS or the typed TypeScript files in `data/`.
- **Content workspace** — Sanity Studio, embedded in the same Next.js app at `/studio`. Only invited Sanity project members can sign in.
- **Hosting target** — Vercel (Hobby plan), built from a GitHub repository.

Content flow in one sentence: *editors change documents in Sanity → the website reads published documents through GROQ queries → Next.js caches them under a tag → a signed webhook clears that tag on publish.*

---

## 2. Technology stack and versions

Versions below are taken from `package.json`.

| Area | Package | Version range |
| --- | --- | --- |
| Framework | `next` | `16.4.6` (exact) |
| UI | `react`, `react-dom` | `19.3.0` (exact) |
| Language | `typescript` | `^5` |
| Styling | `tailwindcss`, `@tailwindcss/turbopack` | `4.3.3` (exact) |
| CMS | `sanity` | `^6.23.0` |
| CMS integration | `next-sanity` | `^13.4.0` |
| Studio UI | `@sanity/ui` / `@sanity/icons` | `^4.4.12` / `^5.3.0` |
| Studio plugins | `@sanity/vision`, `@sanity/orderable-document-list` | `^6.23.0` / `^2.0.29` |
| Studio styling | `styled-components` | `^6.6.0` |
| Rich text | `@portabletext/react`, `@portabletext/types` | `^8.0.1` / `^4.0.2` |
| Image URLs | `@sanity/image-url` | `^2.1.1` (installed; see §6) |
| Ordering | `lexorank` | `^1.0.5` (used by the seed script) |
| Script runner | `tsx` | `^4.23.15` |
| Linting | `eslint`, `eslint-config-next` | `^9` / `16.4.6` |
| Node.js | `engines` field | `>=20.9.0` |

Fonts are loaded with `next/font/google`: Geist, Geist Mono and Instrument Serif (`app/layout.tsx`).

Next.js configuration (`next.config.ts`) enables two experimental features that the code relies on:
- `cacheComponents: true` — allows the `"use cache"` directive and enforces Suspense around request-time data.
- `partialPrefetching: true` — navigation prefetching.

---

## 3. Application architecture

```
Browser ──► Next.js (App Router, server components by default)
              │
              ├─ app/layout.tsx            fonts, viewport, base metadataBase, <html>/<body>
              ├─ app/(site)/layout.tsx     site chrome: header, footer, JSON-LD, SEO metadata
              │     └─ app/(site)/<route>/page.tsx   thin route files
              │            └─ components/pages/*View.tsx    page composition (async server components)
              │                   ├─ components/blocks/*    domain blocks (cards, timelines, lists)
              │                   └─ components/ui/*        primitives (buttons, sections, links)
              │
              ├─ lib/content.ts            THE content access layer (only file pages use for content)
              │     ├─ data/*.ts           local typed content (fallback and CMS seed)
              │     └─ sanity/lib/cms.ts   GROQ queries mapped into data/types.ts models
              │            └─ sanity/lib/fetch.ts  "use cache" + tag "sanity" (published) / drafts (preview)
              │
              ├─ app/studio/[[...tool]]    embedded Sanity Studio (uses sanity.config.ts)
              ├─ app/api/*                 webhook + draft-mode endpoints
              └─ app/sitemap.ts, robots.ts, opengraph-image.tsx, icon.svg, not-found.tsx
```

Key principles that the code follows:
1. **Pages never import `data/` directly for content.** They call functions in `lib/content.ts`. This keeps the CMS switch in one place.
2. **Server by default.** Only interactive pieces are client components (`"use client"`): the header and its URL-reading wrapper (`components/layout/Header.tsx`, `HeaderCurrent.tsx`), the project directory (`components/blocks/ProjectsExplorer.tsx`), the contact form (`components/blocks/ContactForm.tsx`), and the Studio configuration and Overview tool (`sanity.config.ts`, `sanity/studio/overview.tsx`).
3. **One source of truth at a time.** Once the Sanity dataset contains a `profile` document, the site reads from Sanity. Before that (or if Sanity is unreachable), it reads `data/`. See §9.

---

## 4. Repository structure

```
naga-portfolio/
├── app/                          Next.js App Router
│   ├── layout.tsx                root layout: fonts, viewport, base metadata
│   ├── globals.css               Tailwind import + design tokens + type roles + motion
│   ├── (site)/                   public website (route group; not part of the URL)
│   │   ├── layout.tsx            header/footer, SEO metadata, JSON-LD
│   │   ├── page.tsx              "/" home
│   │   ├── about/ applied-ai/ contact/ data-ml/ education/ engineering/
│   │   ├── experience/ projects/ research/ writing/      (each has page.tsx)
│   │   ├── projects/[slug]/      case study pages
│   │   ├── writing/[slug]/       article pages (hosted articles only)
│   │   └── preview/[[...path]]/  draft preview mirror (Studio only)
│   ├── studio/[[...tool]]/       embedded Sanity Studio
│   ├── api/revalidate/           POST webhook (signed)
│   ├── api/draft-mode/enable/    GET (Sanity-issued preview secret)
│   ├── api/draft-mode/disable/   GET
│   ├── not-found.tsx             404 page
│   ├── sitemap.ts  robots.ts     /sitemap.xml and /robots.txt
│   ├── opengraph-image.tsx       generated 1200×630 PNG at /opengraph-image
│   └── icon.svg                  favicon at /icon.svg
├── components/
│   ├── layout/                   Header.tsx, HeaderCurrent.tsx, Footer.tsx
│   ├── pages/                    *View.tsx page compositions + registry.tsx (preview routing)
│   ├── blocks/                   ProjectCard, ProjectsExplorer, ThemeList, SkillMatrix,
│   │                             PublicationEntry, ExperienceTimeline, LinkList, CtaBand, ContactForm
│   └── ui/                       Wrap, PageHeader, Section, ButtonLink, ArrowLink, ExternalLink,
│                                 Tag, Photo, PortableTextComponents
├── data/                         typed local content (fallback + seed source) — see §8
├── lib/
│   ├── content.ts                content access layer (pick: Sanity or local)
│   ├── seo.ts                    siteMetadata() and pageMetadata()
│   ├── site-url.ts               siteUrl() and canonicalUrl() — the one base-URL source
│   └── paths.ts                  hrefTo(): keeps links inside /preview while previewing
├── sanity/
│   ├── env.ts                    public Sanity identifiers (project ID, dataset, API version)
│   ├── schemaTypes/              document and object schemas — see §10
│   ├── structure.ts              Studio sidebar (desk structure)
│   ├── studio/                   Logo.tsx, theme.ts, overview.tsx (Overview dashboard tool)
│   └── lib/                      client.ts, fetch.ts, preview.ts, cms.ts, image.ts
├── scripts/                      seeding, verification and tests — see §19
├── public/
│   ├── documents/Naga_Sekhar_Madala_Resume.pdf   public resume (the only resume served)
│   └── images/profile/, images/projects/         folders for photos and screenshots (currently empty)
├── private/                      git-ignored; holds private files only (never served)
├── sanity.config.ts              Studio configuration (plugins, schema, preview locations)
├── next.config.ts                Next.js configuration and security headers
├── package.json                  scripts and dependencies
├── .env.example                  names of all environment variables (no values)
├── .gitignore                    excludes secrets, private files, build output
├── eslint.config.mjs             lint rules
├── tsconfig.json                 TypeScript settings (`@/*` maps to the project root)
└── *.md                          documentation (see the list at the top)
```

---

## 5. Route architecture

Every public route is listed below with its source file and what it renders. The route group `(site)` does not appear in URLs.

| URL | Source | Renders | Content source |
| --- | --- | --- | --- |
| `/` | `app/(site)/page.tsx` → `HomeView` | Curated introduction, disciplines, featured projects, current role, research counts, writing teaser, CTA | Profile, projects, experience, publications, articles |
| `/about` | `about/page.tsx` → `AboutView` | Biography, focus areas, domains, professional links, resume | Profile, professional links |
| `/engineering` | `engineering/page.tsx` → `DisciplineView area="engineering"` | Discipline intro, capability themes, case studies, toolbox | Discipline page, capability themes, projects, skills |
| `/applied-ai` | `applied-ai/page.tsx` → `DisciplineView area="applied-ai"` | As above | As above |
| `/data-ml` | `data-ml/page.tsx` → `DisciplineView area="data-ml"` | As above | As above |
| `/projects` | `projects/page.tsx` → `ProjectsView` | Searchable, filterable, sortable directory | Projects, project categories |
| `/projects/[slug]` | `projects/[slug]/page.tsx` → `ProjectView` | Case study: outcomes, rich-text write-up, screenshots, links, related projects | Project by slug |
| `/research` | `research/page.tsx` → `ResearchView` | Research profiles, journal, conference, datasets and books, patents | Publications, professional links |
| `/experience` | `experience/page.tsx` → `ExperienceView` | Career timeline | Experience |
| `/education` | `education/page.tsx` → `EducationView` | Degrees, coursework, certifications, achievements | Education, certifications, achievements |
| `/writing` | `writing/page.tsx` → `WritingView` | Article list (or "in preparation" notice when empty) | Articles |
| `/writing/[slug]` | `writing/[slug]/page.tsx` → `ArticleView` | Hosted article with rich text (returns 404 for external-link articles) | Article by slug |
| `/contact` | `contact/page.tsx` → `ContactView` | Email, profile links, resume, form that opens the visitor's mail app | Profile, professional links, site settings |
| `/preview/[[...path]]` | `preview/[[...path]]/page.tsx` | Mirror of the public pages showing **unpublished** drafts; refused unless draft mode is on | Drafts (preview client) |

Other URLs:

| URL | Source | Purpose |
| --- | --- | --- |
| `/studio` (and sub-paths) | `studio/[[...tool]]/page.tsx` | Sanity Studio |
| `/api/revalidate` | `api/revalidate/route.ts` | POST webhook from Sanity; clears the `sanity` cache tag |
| `/api/draft-mode/enable` | `api/draft-mode/enable/route.ts` | GET; enables draft mode when given a valid Sanity-issued preview secret |
| `/api/draft-mode/disable` | `api/draft-mode/disable/route.ts` | GET; disables draft mode and redirects to `/` |
| `/sitemap.xml` | `sitemap.ts` | Sitemap: home, every top-level route, every project, every hosted article |
| `/robots.txt` | `robots.ts` | Allows all crawlers and points to the sitemap |
| `/opengraph-image` | `opengraph-image.tsx` | Social-sharing image (PNG, 1200×630) |
| `/icon.svg` | `icon.svg` | Favicon |
| any other URL | `not-found.tsx` | 404 page |

Routes are generated at build time where possible. `generateStaticParams` in the project, article and preview routes lists the known slugs. The build output marks each route as static (`○`), partially prerendered (`◐`) or dynamic (`ƒ`). The two API routes are dynamic.

The preview registry (`components/pages/registry.tsx`) maps path segments to the same page views the public routes use: `about`, `engineering`, `applied-ai`, `data-ml`, `projects`, `research`, `experience`, `education`, `writing`, `contact`, plus `projects/<slug>` and `writing/<slug>`. Unknown paths return 404.

---

## 6. Page rendering and data flow

### Layouts and metadata
- **Root layout** (`app/layout.tsx`): loads fonts, sets the viewport and themeColor, and exports a `metadata` object containing only `metadataBase` (from `siteUrl()`). It covers routes outside the site group, such as the Studio, so their URLs resolve correctly.
- **Site layout** (`app/(site)/layout.tsx`): exports `generateMetadata = siteMetadata` (see §16). It renders the skip link, the header, `<main id="main">`, the footer, and a JSON-LD `Person` block. The JSON-LD `sameAs` list is built from professional links in the `code` and `research` groups.
- **Page metadata**: every public page returns `pageMetadata({ path, title, description })` from `lib/seo.ts`. That sets its own canonical URL and `og:url`.

### Page views
Each route file is intentionally thin. For example, `app/(site)/projects/page.tsx` exports `generateMetadata` and renders `<ProjectsView />`. The `*View.tsx` files are async server components. They call content functions in parallel with `Promise.all`, then compose blocks and UI primitives. Example from `ProjectsView`: it fetches projects and categories, then renders `ProjectsExplorer` with the projects.

### Header navigation
`components/layout/Header.tsx` is a client component that does not read the URL. It receives the current path as a prop. `components/layout/HeaderCurrent.tsx` reads `usePathname()` and renders the header with that path. It sits inside `<Suspense>` in the site layout, with a fallback that renders the same header without a current-page marker. This avoids URL-data-outside-Suspense errors (see TROUBLESHOOTING.md).

### Content reads
Every page reads content through `lib/content.ts`. Each getter follows the same rule, implemented in its `pick()` helper:
1. If `NEXT_PUBLIC_SANITY_PROJECT_ID` is not set → use `data/`.
2. Otherwise check `cms.isSeeded()` (does a `profile` document exist?). If not → use `data/`.
3. Otherwise run the Sanity query for that content type. If the result is `null` or `undefined` → use `data/`.
4. If any Sanity call throws, log a warning (`[content] Sanity unavailable …`) and use `data/`.

Consequence: the public site never fails because Sanity is unreachable. It quietly serves the local copy instead.

### Caching
- Published Sanity reads go through `fetchPublished()` in `sanity/lib/fetch.ts`. It is marked `"use cache"`, tagged `sanity`, and uses `cacheLife({ stale: 60, revalidate: 300, expire: 86400 })`. In practice, changes appear within roughly five minutes without a webhook.
- The webhook (`app/api/revalidate`) calls `revalidateTag("sanity", { expire: 0 })`, which expires the cache immediately.
- Site metadata reads (`getSeoFields()` in `lib/seo.ts`) use the same tag and lifetime.
- Only plain serializable values may be returned from `"use cache"` functions. Returning `URL` objects or `Metadata` objects from them causes a runtime error. That is why `new URL(...)` and metadata objects are built outside the cache.

---

## 7. Component architecture

| Layer | Folder | Rules |
| --- | --- | --- |
| Primitives | `components/ui/` | No content knowledge. Props in, markup out. `ExternalLink` adds `target="_blank"` and `rel="noopener noreferrer"` and an accessible "(opens in a new tab)" label. |
| Blocks | `components/blocks/` | Domain-shaped building blocks. Props are the data types from `data/types.ts`. `ProjectsExplorer` and `ContactForm` are the only client blocks. |
| Page views | `components/pages/` | Async server components that load content and compose blocks. |
| Layout | `components/layout/` | Header (client), HeaderCurrent (client, URL-aware), Footer (server). |

Internal links that must keep working in preview go through `hrefTo()` in `lib/paths.ts`. It prefixes `/preview` only while preview mode is active, and it leaves files, API routes, the Studio and images untouched.

Important reusable pieces:
- `PageHeader` — label, display title, lede, optional content. Used at the top of inner pages.
- `Section` — numbered-free section wrapper with an optional label, title and action link.
- `ProjectCard` — used in featured lists and the directory. Takes an explicit `href`, so it can be used in preview.
- `ThemeList` — capability themes with links to the projects and roles that evidence them.
- `PortableTextComponents` — renders Sanity rich text (headings, lists, links, images) for project write-ups and articles.

---

## 8. Centralized content files (`data/`)

`data/` holds typed TypeScript content. It is the fallback source and the source of the initial CMS seed. Once the CMS is seeded, editing these files does **not** change the live site. See CONTENT_GUIDE.md.

| File | Exports | Purpose |
| --- | --- | --- |
| `types.ts` | interfaces: `Profile`, `ExperienceItem`, `Project`, `SkillGroup`, `EducationItem`, `Publication`, `ProfessionalLink`, `Article`, `CertificationGroup`, `Achievement`, `SiteConfig`, `CapabilityTheme`, `DisciplinePage`, `CapabilityArea`, `ImageAsset` | Shared shapes used by `data/`, `lib/content.ts` and the CMS mappers |
| `site.ts` | `site`, `navItems` | Site name, title, description, keywords, resume path and label; header navigation |
| `routes.ts` | `routes`, `routeLabel` | Public route labels and descriptions for the header menu and footer |
| `profile.ts` | `profile` | Name, headline, introduction, disciplines (hero entry points), biography, focus areas, domains, stats, contact details |
| `experience.ts` | `experience` | Roles (newest first), dates, highlights, technologies |
| `projects.ts` | `projects`, `projectCategories` | Projects with categories, featured flag, highlights, technologies, links and optional images/description |
| `capabilities.ts` | `capabilities` | Capability themes for the three discipline pages, each linked to project and role ids |
| `disciplines.ts` | `disciplines` | Copy and selected projects/skill groups for `/engineering`, `/applied-ai`, `/data-ml` |
| `skills.ts` | `skillGroups` | Skill categories and skills |
| `education.ts` | `education`, `coursework` | Degrees and coursework |
| `certifications.ts` | `certificationGroups` | Certification groups |
| `achievements.ts` | `achievements` | Awards and recognition |
| `research.ts` | `publications` | Journal, conference, dataset, book and patent records |
| `publications.ieee.ts` | `ieeePapers` | Conference paper records used by `research.ts` |
| `links.ts` | `professionalLinks`, `linkGroups` | External profiles and destinations, grouped |
| `articles.ts` | `articles` | Local articles (currently empty) |
| `index.ts` | re-exports everything | Allows `import { … } from "@/data"` |

---

## 9. Sanity CMS architecture

### Configuration
- `sanity.config.ts` defines the workspace. Its `basePath` is `/studio`, so the Studio is served by `app/studio/[[...tool]]/page.tsx`.
- Project and dataset come from `sanity/env.ts`, which reads `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` (default `production`). API version: `2026-01-01`.
- Plugins: `overviewTool()` (custom Overview screen), `structureTool({ structure })` (sidebar), `presentationTool(...)` (preview), `visionTool(...)` (GROQ query tool).
- Theme: `sanity/studio/theme.ts`. Logo: `sanity/studio/Logo.tsx`.

### Desk structure (`sanity/structure.ts`)
The sidebar is grouped by where content appears on the site:
- **Identity & site:** Home & profile (singleton), Site settings (singleton), Resume (singleton), Professional links.
- **Discipline pages:** Engineering, Applied AI and Data & ML pages (singletons, with fixed IDs `disciplinePage-engineering`, `disciplinePage-applied-ai`, `disciplinePage-data-ml`), capability themes, skills.
- **Projects:** all projects (drag to reorder), browse & sort, featured, in progress, live, by category; project categories.
- **Research & publications:** all (drag to reorder), browse & sort, and one list per publication type.
- **Experience**, **Education & credentials** (education, certifications, achievements), **Writing** (articles), and **Quick create** shortcuts.

### Singletons
`profile`, `siteSettings`, `resume` and `disciplinePage` are singletons. They cannot be created from the "new document" menu, and their unpublish, delete and duplicate actions are removed (`sanity.config.ts`). Their IDs are fixed (`profile`, `siteSettings`, `resume`, `disciplinePage-<area>`).

### Ordering
List documents carry an `orderRank` field (LexoRank) written by `@sanity/orderable-document-list`. Drag-and-drop in the Studio updates it, and the site sorts by `orderRank asc` where a list has a curated order.

### Queries (`sanity/lib/cms.ts`)
Each `cms*` function runs one GROQ query and maps the result into the `data/types.ts` shape. Components never see raw Sanity documents. Document references are dereferenced in the query (for example `"projectIds": projects[]->slug.current`), and empty optional fields are removed so they match the local data shape. A test (`npm run cms:verify`) confirms that these mappings produce exactly the same output as `data/`.

---

## 10. CMS schemas and document types

Schemas are in `sanity/schemaTypes/`, registered in `sanity/schemaTypes/index.ts`.

| Type | Kind | Key fields | Where it appears |
| --- | --- | --- | --- |
| `profile` (singleton) | document | name, headline, introduction, summary, about (paragraphs), focusAreas, disciplines (with `href`), domains, roles, location, availability, email, stats (max 4), photo (with alt), coursework | Home hero, About, contact |
| `siteSettings` (singleton) | document | title, description (≤200 chars), keywords, navItems (page + label), footerText, footerLinks (references to `professionalLink`) | SEO, header navigation, footer |
| `resume` (singleton) | document | file (PDF upload), label, downloadName | "Download resume" buttons (when a file is uploaded) |
| `disciplinePage` (singleton) | document | area, title, tagline, intro, projects (references), skillGroups (references) | `/engineering`, `/applied-ai`, `/data-ml` |
| `capabilityTheme` | document | area, title, summary, items (text, projects, experience reference) | Discipline pages |
| `skillGroup` | document | title, skills (list) | Discipline toolbox |
| `projectCategory` | document | title | Project filters |
| `project` | document | title, slug, category (reference), featured, status (`Live`/`In Progress`), badge, summary, highlights, tech, body (rich text), images (with alt), links | `/projects`, `/projects/[slug]`, home |
| `experience` | document | role, company, location, start, end, type, context, highlights, tech | `/experience`, home |
| `publication` | document | title, type (journal/conference/dataset/book/patent/research), authors, venue, publisher, year, date, doi, links, note | `/research` |
| `education` | document | degree, institution, location, graduated, gpa, notes | `/education` |
| `certificationGroup` | document | title, items (name, issuer) | `/education` |
| `achievement` | document | title, detail, year | `/education` |
| `article` | document | title, slug, summary, date, publication, externalUrl, body (rich text), tags | `/writing`, `/writing/[slug]` |
| `professionalLink` | document | label, href, group (research/publications/code/demos/writing), description, mark | About, Research, Contact, footer |
| `blockContent` | array type | Rich text: paragraphs, headings, quotes, lists, bold/italic/code, links, images with alt text | Project body, article body |
| `linkItem` | object type | label, href | Project links, publication links |

Notes:
- Schemas enforce required fields and URL schemes in the Studio. The API does not run these validations, so changes made directly through the API bypass them.
- Images use Sanity's image type with hotspot cropping. Their alt text is required in the Studio.

---

## 11. How CMS data is fetched and rendered

Example path for the home page's project list:
1. `HomeView` calls `getProjects()` from `lib/content.ts`.
2. `getProjects()` calls `pick(cms.cmsProjects, () => data.projects)`.
3. `pick` checks configuration and seeding (§6). If Sanity is in use, `cmsProjects()` runs a GROQ query (`*[_type == "project" && defined(slug.current)] | order(orderRank asc){…}`) through `sanityFetch`.
4. `sanityFetch` checks `isPreview()`. Normally it calls `fetchPublished()`, which is cached under the `sanity` tag. In preview it calls `fetchDrafts()`, which is not cached and uses the server-only preview token.
5. The result is mapped to `Project[]` and rendered by `ProjectCard`.

Images returned by the query are resolved to URLs on `cdn.sanity.io` (the only remote image host allowed in `next.config.ts`). Local images use `next/image` with explicit dimensions.

---

## 12. Draft mode and preview

Draft preview lets an editor see unpublished changes on the real site layout.

Flow:
1. In the Studio, the **Preview** tab (Presentation tool) opens `/preview` in an iframe-style workspace.
2. The Presentation tool calls `/api/draft-mode/enable` with a short-lived secret issued by Sanity. `defineEnableDraftMode` (from `next-sanity`) validates it using the preview client. Only a signed-in Studio user can obtain it.
3. Next.js sets the draft-mode cookie. `/preview/[[...path]]` now calls `setPreview(true)`, which lets `sanityFetch` read drafts for that request only (React `cache` scope; never shared between visitors).
4. Internal links are rewritten to `/preview/...` by `hrefTo()`. A banner reads "Draft preview — not public".
5. `/api/draft-mode/disable` ends the session and redirects to `/`.

Requirement: draft reads use `SANITY_API_READ_TOKEN`, a Viewer token. **Without it, the preview page cannot read drafts** and shows the "only available from the Studio" notice when draft mode is not active. The public site does not need this token.

Limitations (verified in code):
- The header and footer in preview show published navigation and footer text.
- Preview locations are defined per document type in `sanity.config.ts`, so the Presentation tool opens a relevant page for each document. Some types map to a page list rather than one page.

---

## 13. API routes and their purposes

| Route | Method | Guard | Behaviour |
| --- | --- | --- | --- |
| `/api/revalidate` | POST | Sanity signature check with `SANITY_REVALIDATE_SECRET` (`parseBody` from `next-sanity/webhook`) | Missing secret → 501. Invalid signature → 401. Otherwise calls `revalidateTag("sanity", { expire: 0 })` and returns JSON `{ revalidated, type, now }`. |
| `/api/draft-mode/enable` | GET | Sanity-issued preview secret, checked by `defineEnableDraftMode` | Enables draft mode. Requires the preview client (and the read token) to be configured. |
| `/api/draft-mode/disable` | GET | none (harmless) | Disables draft mode and redirects to `/`. |

Response headers for `/api/*` are `Cache-Control: no-store` (`next.config.ts`).

---

## 14. Environment variables

Only names are listed here. Values belong in `.env.local` (local development) or the Vercel project settings (production). Never commit values. See `.env.example` for the full list with empty values.

| Name | Read by | Public? | Purpose | Required? |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `lib/site-url.ts` | yes (inlined at build) | Canonical base URL for canonicals, `og:url`, sitemap, robots | Yes in production (otherwise falls back to `VERCEL_URL`, then localhost) |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `sanity/env.ts`, `sanity.config.ts`, scripts | yes | Sanity project. When unset, the site uses `data/` only. | Yes for the CMS |
| `NEXT_PUBLIC_SANITY_DATASET` | `sanity/env.ts`, scripts | yes | Sanity dataset (default `production`) | Yes for the CMS |
| `SANITY_API_READ_TOKEN` | `sanity/lib/client.ts` (server only) | **no** | Viewer token for draft reads (Preview) | Optional |
| `SANITY_REVALIDATE_SECRET` | `app/api/revalidate/route.ts` (server only) | **no** | Verifies webhook signatures | Needed after deployment |
| `SANITY_API_WRITE_TOKEN` | `scripts/migrate-to-sanity.ts`, `scripts/check-sanity-config.ts` (local scripts only) | **no** | Editor token for the one-off seed and the doctor's write test | Local only; never on Vercel |
| `VERCEL_URL` | `lib/site-url.ts` | set by Vercel | Fallback base URL on Vercel deployments | Set automatically |

Rules enforced by the code and checks:
- Only variables with the `NEXT_PUBLIC_` prefix may appear in client-side code. `npm run cms:doctor` fails if a variable containing TOKEN, SECRET, PASSWORD or PRIVATE is prefixed.
- `.gitignore` excludes `.env*` (except `.env.example`).

---

## 15. Authentication and authorization boundaries

| Boundary | Mechanism | Notes |
| --- | --- | --- |
| Reading published content | No authentication. The Sanity dataset is public. | Anyone can read published documents through the API. Drafts are not included without a token. |
| Writing content | Sanity project membership. Only invited members can sign in to the Studio and publish. | Manage members in the Sanity dashboard. |
| Studio sign-in from a browser | Sanity sign-in with CORS credentials. The origin must be in the project's CORS list with **Allow credentials**. | Configured in the Sanity dashboard, not in code (see CMS_SETUP.md). |
| Draft reads on the website | `SANITY_API_READ_TOKEN`, server-only, used in `sanity/lib/client.ts`. | Never sent to the browser. |
| Enabling draft mode | Sanity-issued preview secret checked by `defineEnableDraftMode`. | Strangers cannot enable it. |
| Publish-triggered revalidation | HMAC signature checked by `parseBody` with `SANITY_REVALIDATE_SECRET`. | Unsigned requests get 401. |
| Local seeding | `SANITY_API_WRITE_TOKEN`, used only by local scripts. | Not referenced by any app route. |
| Studio and preview pages | `X-Robots-Tag: noindex, nofollow` and `Cache-Control: no-store` headers, plus `robots` metadata for preview. | Keeps them out of search results and caches. |

The contact form does not send anything from the server. It opens the visitor's mail client with a pre-filled message to the portfolio email address.

---

## 16. SEO, metadata, canonical URLs, sitemap, robots and Open Graph

### Base URL
`lib/site-url.ts` is the only place that builds site URLs:
- `siteUrl()` returns `NEXT_PUBLIC_SITE_URL` (trailing slash removed), else `https://${VERCEL_URL}`, else `http://localhost:3000`.
- `canonicalUrl(path)` joins a path onto `siteUrl()`. `"/"` becomes the bare origin.

### Metadata helpers (`lib/seo.ts`)
- `siteMetadata()` is the layout default. It sets `metadataBase`, the title template `%s · <name>`, the description, keywords, authors, canonical and `og:url` for `/`, Open Graph (type `profile`, locale `en_US`, the generated image), Twitter `summary_large_image`, and `robots: index, follow`.
- `pageMetadata({ path, title?, description?, robots? })` is used by every public page. It sets the page's own canonical and `og:url`, and passes the title and description through. Open Graph title and description keep the site-wide values, and Twitter metadata is inherited from the layout. Next.js replaces the whole `openGraph` object when a child defines one, so each page repeats the full object.

### Per-page values
| Route | Title | Canonical / og:url |
| --- | --- | --- |
| `/` | site title (layout default) | origin |
| `/about`, `/engineering`, `/applied-ai`, `/data-ml`, `/projects`, `/research`, `/experience`, `/education`, `/writing`, `/contact` | per-page title with the site name appended by the template | own path |
| `/projects/[slug]` | project title | `/projects/<slug>` |
| `/writing/[slug]` | article title | `/writing/<slug>` |
| `/preview/...` | "Preview" | the public path it mirrors, with `robots: noindex, nofollow` |

Canonical and `og:url` were verified to match each page's own path across all 47 sitemap URLs.

### Open Graph image
`app/opengraph-image.tsx` generates a 1200×630 PNG. Both helpers state its URL (`canonicalUrl("/opengraph-image")`) explicitly, so every page emits `og:image`.

### Sitemap and robots
- `app/sitemap.ts` lists the home page, every route in `data/routes.ts`, every project and every hosted article. It uses `siteUrl()` through the site settings.
- `app/robots.ts` allows all crawlers and points to `<site url>/sitemap.xml`. Studio and preview pages are excluded from indexing with headers and metadata rather than `robots.txt`.

### Structured data and other tags
- The site layout emits a JSON-LD `Person` block (name, URL, description, email, location, education, and `sameAs` links to the professional profiles in the `code` and `research` groups).
- Pages use one `h1` (verified by the audit in §19). Images have alt text. Links that open a new tab say so for screen readers.

---

## 17. Styling and responsive design conventions

- Tailwind CSS v4. `app/globals.css` starts with `@import "tailwindcss"`.
- **Design tokens** are CSS variables on `:root` (background, surface, foreground, muted, subtle, line, accent). Dark values are set in a `prefers-color-scheme: dark` media query. They are mapped to Tailwind colour names in `@theme inline` (for example `bg-surface`, `text-muted`, `border-line`).
- **Type roles** are utility classes in `globals.css`: `.display`, `.display-hero`, `.display-page`, `.display-section`, `.label`, `.lede`. Fonts are Geist, Geist Mono and Instrument Serif via CSS variables.
- **Layout primitives:** `Wrap` (1200px maximum width with responsive side gutters), `Section`, `PageHeader`, `hairline-grid` (a bordered grid built from 1px gaps).
- **Breakpoints** follow Tailwind defaults (`sm`, `md`, `lg`, `xl`). The desktop navigation shows from `xl` (1280px) and the mobile menu below it.
- **Motion:** `.enter` (fade-up on load) and `.reveal` (scroll-linked, via CSS `animation-timeline: view()`) are enabled only when reduced motion is not requested. Content is visible without them.
- **Focus:** `:focus-visible` outline in the accent colour.

The design direction ("Signal") is documented in ARCHITECTURE.md.

---

## 18. Images and public assets

| Asset | Location | Served at |
| --- | --- | --- |
| Public resume (PDF) | `public/documents/Naga_Sekhar_Madala_Resume.pdf` | `/documents/Naga_Sekhar_Madala_Resume.pdf` |
| Favicon | `app/icon.svg` | `/icon.svg` |
| Social image | generated by `app/opengraph-image.tsx` | `/opengraph-image` |
| Profile photo | `public/images/profile/` (empty; the page shows a monogram until a photo is set) | path set in `data/profile.ts` or the CMS |
| Project screenshots | `public/images/projects/` (empty) | path set in `data/projects.ts` or uploaded in the CMS |
| CMS images | Sanity CDN (`cdn.sanity.io`) | URLs returned by GROQ queries |

Resume precedence: if a PDF is uploaded to the `resume` document in Sanity, its CDN URL is used for the download buttons. Otherwise the bundled PDF in `public/documents/` is used. The master DOCX is kept in `private/`, which is git-ignored and never served.

---

## 19. Testing and validation

| Command | What it checks | Notes |
| --- | --- | --- |
| `npm run check:content` | Scans `app`, `components`, `data`, `lib`, `public`, `sanity`, `scripts` and `sanity.config.ts` for a forbidden term. | Protects against accidental external-profile references in site code. Documentation files are not scanned. |
| `npx tsc --noEmit` | TypeScript type-check of the whole project. | Run from the project root. |
| `npm run lint` | ESLint with the Next.js Core Web Vitals and TypeScript rules. | Unused variables starting with `_` are allowed. |
| `npm run cms:verify` | Runs the site's GROQ queries against an in-memory copy of the seed documents, then compares the output with `data/` field by field. (16 checks.) | Needs no Sanity account. |
| `npm run cms:test` | Offline migration tests with an in-memory Sanity double that enforces Sanity's reference rule. Covers planning, idempotent re-runs, mid-run failure recovery, error messages, cycles, duplicates and force mode. (22 checks.) | Needs no Sanity account. |
| `npm run seo:test` | Tests `siteUrl()` and `canonicalUrl()` under different environment settings. (8 checks.) | Restores the environment it changed. |
| `npm run cms:doctor` | Checks `.env.local` (keys only), project and dataset reachability, dataset visibility, CORS (including Allow credentials), each token's permissions (write test is a dry run), secret hygiene and `.gitignore` coverage. | Makes read requests and one dry-run write. Reads `.env.local` through Node's `--env-file-if-exists`. |
| `npm run check` | All of the above except `cms:doctor`: `check:content`, `tsc --noEmit`, `lint`, `cms:verify`, `cms:test`, `seo:test`. | The standard pre-commit gate. |
| `npm run build` | Production build, including TypeScript and static generation. | Must finish with no warnings. |

Checks that were run manually during development but are **not** in the repository:
- Browser tests at 390, 768 and 1440 pixels (no horizontal overflow, mobile menu behaviour, search empty state, reduced motion, no console errors).
- A route audit of every URL in the sitemap (status codes, broken internal links, one `h1` per page, alt text, SEO tags, no secret-like strings in served HTML).

If these need to run regularly, they are candidates for a future Playwright test suite. They are not present in the repository today.

---

## 20. Build and production behaviour

- `npm run build` runs `next build` with Turbopack. The last recorded build generated 63 pages, and the sitemap lists 47 URLs (home, 10 section pages and 36 project pages). Exact counts change with content.
- Static pages are generated at build time, so the content present at build time is baked into their HTML. Sanity content is refreshed by the caching rules in §6, or by a rebuild.
- `npm start` serves the production build. It does not reload content from disk.
- Build warnings are treated as failures in this project. The build has been verified with zero warnings.
- The `.next/` folder is build output and is git-ignored. Deleting it is safe; the next build recreates it. Do not delete it while `npm run dev` is running in the same folder (see TROUBLESHOOTING.md).

---

## 21. Deployment architecture

- **Source:** GitHub repository (`main` branch).
- **Hosting:** Vercel, with the Next.js framework preset. No `vercel.json` is required.
- **Build:** `npm install` and `npm run build`. Node.js 20.9 or newer (set in `package.json` → `engines`).
- **Runtime:** Vercel serves static pages from its CDN. The API routes and the Studio run as server functions.
- **Environment:** variables from §14, set in the Vercel project for Production (and Preview if desired).
- **Content:** Sanity's hosted dataset. Publishing in the Studio sends a signed webhook to `/api/revalidate` on the production domain.
- **Domain:** `NEXT_PUBLIC_SITE_URL` must match the production domain. It is used for canonical URLs, the sitemap and robots.

See DEPLOY.md for the step-by-step process.

---

## 22. Security and privacy considerations

- **No secrets in code or docs.** Only variable names appear in documentation. Tokens are created in the provider dashboards and stored in `.env.local` or Vercel.
- **Server-only tokens.** `SANITY_API_READ_TOKEN`, `SANITY_REVALIDATE_SECRET` and `SANITY_API_WRITE_TOKEN` have no `NEXT_PUBLIC_` prefix. `cms:doctor` checks this.
- **Least privilege.** Public site reads need no token. Preview needs a Viewer token. The Editor token is used only for the one-off seed and is not needed on Vercel.
- **Private files.** `private/` and the internal review notes are git-ignored. The master resume is kept there.
- **Public resume.** Only the reviewed PDF in `public/documents/` is served. Personal details that the owner has not approved for publication are omitted from it.
- **Headers** (`next.config.ts`): `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN` (the Studio preview frames the site from the same origin), and a `Permissions-Policy` that disables camera, microphone and geolocation.
- **No-index and no-cache** headers apply to `/studio`, `/preview` and `/api`.
- **Forms.** The contact form has no server endpoint. Nothing is stored or transmitted by the site.
- **External links** use `rel="noopener noreferrer"`.

Consider adding a Content Security Policy in a future change. It is not configured today.

---

## 23. Known limitations and future extension points

Verified limitations:
- **Studio sign-in** needs the local origin in Sanity's CORS list with **Allow credentials** enabled. This is a dashboard setting; the repository cannot enforce it.
- **Draft preview** needs `SANITY_API_READ_TOKEN`. Without it, the Preview tab shows a notice.
- **Revalidation webhook** only works after deployment, because Sanity must reach a public URL.
- **Without the webhook**, published changes appear after the cache lifetime (about five minutes), or after a redeploy for statically generated pages.
- **Static HTML** is generated at build time for the slugs returned by `generateStaticParams`. The repository does not set `dynamicParams`, so the behaviour for slugs added after a build is Next.js's default. **Requires confirmation after deployment:** open a newly added project's page on production before relying on it.
- **Articles:** the local article list and the CMS article list were both empty when this was written (the CMS had 0 `article` documents), so the Writing page shows the "in preparation" notice.
- **Contact form** is client-side only (see §15).
- **Open Graph title** is the site-wide title on every page. Per-page social titles would require changing existing metadata.
- **Automated browser tests** are not in the repository (see §19).
- **Preview header and footer** show published content.

Extension points:
- **New public page:** add a folder under `app/(site)/`, export `generateMetadata` with `pageMetadata`, compose a `*View.tsx`, and add the route to `data/routes.ts`, the registry (for preview) and the sitemap automatically. See CLAUDE.md for the checklist.
- **New content type:** add a schema in `sanity/schemaTypes/`, register it in `index.ts`, add a structure entry in `sanity/structure.ts`, add a query in `sanity/lib/cms.ts`, a getter in `lib/content.ts`, and a local `data/` file. Update `scripts/seed-docs.ts` if it should be seeded.
- **Replacing the CMS:** rewrite the `cms*` functions in `sanity/lib/cms.ts` to return the same types. `lib/content.ts` and the pages stay unchanged.
- **Analytics, contact backend or search:** not present. Each would be a new integration.
