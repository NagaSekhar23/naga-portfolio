# Architecture & design system

## 1. Two experiences, one design language

| | Public website | Private workspace |
| --- | --- | --- |
| Where | `/`, `/about`, … (app/(site)) | `/studio` (embedded Sanity Studio) |
| For | Recruiters, engineers, researchers | You |
| Pattern | Editorial pages, scroll, read | Sidebar → list → editor, forms, drafts |
| Access | Public, static, cached | Sanity sign-in; invited members only |

## 2. Public site map
| Route | Purpose | Content source |
| --- | --- | --- |
| `/` | Curated intro: statement, 4 entry points, proof points, 4 featured projects, current role, research counts, CTA | Home & profile, Projects (featured), Experience, Research |
| `/about` | Biography, focus areas, domains, profiles & links, resume | Home & profile, Professional links |
| `/engineering` `/applied-ai` `/data-ml` | Discipline pages: intro → capability themes (with evidence + links) → case studies → toolbox | Discipline pages, Capability themes, Projects, Skills |
| `/projects` | Searchable, filterable, sortable directory | Projects, categories |
| `/projects/[slug]` | Case study: outcomes, rich-text write-up, screenshots, links, related | Projects |
| `/research` | Profiles (IEEE, Scholar, Zenodo), journal, conference, datasets/books, patents | Research & publications, Links |
| `/experience` | Full career timeline | Experience |
| `/education` | Degrees, certifications, achievements | Education & credentials |
| `/writing`, `/writing/[slug]` | Articles (hosted or external) | Writing |
| `/contact` | Email, form (opens mail app), links, resume | Home & profile, Links |
| `/preview/...` | Mirror of every route showing **unpublished drafts** (Studio only) | — |

## 3. Design system — "Signal"
- **Type:** Geist (UI/body), Geist Mono (labels, data), Instrument Serif (statements only: hero, page and section titles). Fluid scale via `clamp()`. Roles live in `app/globals.css` (`.display`, `.label`, `.lede`).
- **Colour:** warm neutral canvas / near-black dark mode, hairline rules, **one** cobalt accent used for state and emphasis (never decoration). All text pairs meet WCAG AA.
- **Structure:** 12-column grid in a 1200px wrap; sections separated by hairlines; "hairline grids" replace card chrome. Corners ≤ 6px. No gradients, no glows.
- **Navigation:** fixed header with active-route indicator; full-screen mobile sheet with descriptions; footer sitemap.
- **Motion:** only (a) entry fade-up on page headers, (b) scroll reveal via CSS `animation-timeline: view()`, (c) state transitions. Fully disabled under `prefers-reduced-motion`; content is visible if animation is unsupported.
- **Components:** `components/ui` (Wrap, PageHeader, Section, ButtonLink, ArrowLink, ExternalLink, TagList, Photo), `components/blocks` (ProjectCard, ThemeList, SkillMatrix, PublicationEntry, ExperienceTimeline, LinkList, CtaBand, ProjectsExplorer, ContactForm), `components/pages/*View.tsx` (one view per route).

## 4. CMS architecture
```
Sanity dataset ──GROQ──▶ sanity/lib/cms.ts ──maps to──▶ data/types.ts ──▶ lib/content.ts ──▶ pages/components
                              ▲                                                  │ falls back to /data when
                    sanity/lib/fetch.ts (use cache + tag "sanity")               │ Sanity is unset/unreachable
Webhook (signed) ──▶ /api/revalidate ──▶ revalidateTag("sanity")
Studio Preview ──▶ /api/draft-mode/enable (Sanity-issued secret) ──▶ /preview/* (draft perspective, token server-only)
```
- **Workspace:** custom *Overview* home (counts, drafts needing publish, recent edits, quick actions); *Content* sidebar grouped by public page with filtered/sorted views (Featured, In progress, By category, by publication type, drag-to-reorder lists); *Preview* (Presentation) that maps each document to the page where it appears; brand theme.
- **Drafts/publish:** Sanity's draft → publish workflow with status badges and toast feedback. Public site shows published only.
- **Security:** Studio auth by Sanity; write token only used locally by `npm run cms:seed`; read token and webhook secret are server-only env vars; `/studio`, `/preview`, `/api` are `noindex`/`no-store`; revalidation verifies Sanity's signature; draft mode requires a Studio-issued one-time secret.

## 5. Content migration
`npm run cms:seed` copies everything in `/data` into Sanity (131 documents: profile, site settings, resume record, 36 projects + 6 categories, 8 roles, 16 skill groups, 20 capability themes, 3 discipline pages, 17 publications/research records, 2 degrees, 4 certification groups, 7 achievements, 9 links). `npm run cms:verify` proves the Sanity read path returns content identical to `/data`.
