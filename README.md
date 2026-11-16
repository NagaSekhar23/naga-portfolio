# Naga Sekhar Madala — Professional portfolio

A personal professional website: experience, applied AI, software engineering, machine learning and data science work, projects with case studies, research and publications, education, writing and contact details. Content is edited in a private workspace (Sanity Studio) built into the same site.

**Built with:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Sanity CMS v6 · Vercel (deployment target)

---

## What the site includes

- **Home** — a short introduction with four entry points: Applied AI, Software Engineering, Machine Learning and Data Science.
- **Discipline pages** — `/engineering`, `/applied-ai`, `/data-ml`: each explains the work with linked evidence and case studies.
- **Projects** — a searchable, filterable and sortable directory, plus a case study page for every project.
- **Research** — journal articles, conference papers, datasets, books and patents, with DOI links.
- **Experience, Education, Writing, Contact**, and an **About** page with professional links and the resume.
- **Content workspace** at `/studio` — edit everything in forms, upload images and the resume PDF, preview drafts and publish.
- **SEO** — unique titles, descriptions, canonical URLs, Open Graph and Twitter metadata, a sitemap and robots file.

## Repository structure (overview)

```
app/              pages, layouts, API routes, SEO files (see TECHNICAL_DOCUMENTATION.md §4–5)
components/       page views, content blocks and UI primitives
data/             local typed content (fallback and CMS seed source)
lib/              content access layer, SEO helpers, site URL configuration
sanity/           CMS schemas, queries, Studio structure and tools
scripts/          seeding, verification and tests
public/           the public resume PDF and image folders
```

## Prerequisites

- **Node.js 20.9 or newer** (check with `node -v`). Download from nodejs.org.
- **npm** (installed with Node.js).
- **Git** (for version control and deployment).
- A **Sanity account** — only needed to use the CMS. The site also runs without one, using the local content files.

## Quick start (local)

```bash
git clone https://github.com/NagaSekhar23/naga-portfolio.git
cd naga-portfolio
npm install
cp .env.example .env.local      # then fill in values (see "Environment setup")
npm run dev                     # http://localhost:3000
```

Open http://localhost:3000 for the site and http://localhost:3000/studio for the workspace.

## Environment setup

1. Copy `.env.example` to `.env.local`. This file is git-ignored.
2. Fill in the values. `.env.example` lists every variable and what it is for. The most important ones:

| Variable | Needed for |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | connecting the site and Studio to Sanity |
| `NEXT_PUBLIC_SANITY_DATASET` | the dataset name (`production`) |
| `NEXT_PUBLIC_SITE_URL` | your public domain (canonical links, sitemap) |

Tokens and secrets (`SANITY_API_READ_TOKEN`, `SANITY_REVALIDATE_SECRET`, `SANITY_API_WRITE_TOKEN`) are described in [CMS_SETUP.md](CMS_SETUP.md). **Never commit them, and never prefix them with `NEXT_PUBLIC_`.**

Restart `npm run dev` after changing `.env.local`.

## Development commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server at http://localhost:3000 |
| `npm run build` | Creates a production build (must finish with no warnings) |
| `npm start` | Serves the production build (run `npm run build` first) |
| `npm run lint` | Runs ESLint |
| `npx tsc --noEmit` | Type-checks the whole project |

## Testing and checks

| Command | What it checks |
| --- | --- |
| `npm run check` | The full gate: content guard, TypeScript, lint, CMS verification, CMS tests and URL tests. Run before any commit. |
| `npm run cms:verify` | CMS queries return exactly the local content (no Sanity account needed) |
| `npm run cms:test` | Migration tests: ordering, idempotent re-runs, error reporting (no Sanity account needed) |
| `npm run seo:test` | Site URL and canonical URL configuration |
| `npm run cms:doctor` | Live Sanity check: project, dataset, CORS and token permissions. Reads `.env.local`; prints no values. |

More detail: [TECHNICAL_DOCUMENTATION.md §19](TECHNICAL_DOCUMENTATION.md#19-testing-and-validation).

## Sanity Studio access

- Local: http://localhost:3000/studio
- Production: `https://<your-domain>/studio`

Sign in with an account that has been invited to the Sanity project. Before the Studio can sign in from a browser, the site's address must be on Sanity's CORS list with **Allow credentials** ticked. Full instructions: [CMS_SETUP.md](CMS_SETUP.md).

## Deployment overview

The site is designed for **Vercel** (Hobby plan), deployed from this GitHub repository. Vercel detects Next.js automatically. You set the environment variables in the Vercel project, connect your domain, and configure Sanity's production CORS origin and the publish webhook.

Step-by-step instructions: [DEPLOY.md](DEPLOY.md).

## Documentation

| Document | Read it when |
| --- | --- |
| [TECHNICAL_DOCUMENTATION.md](TECHNICAL_DOCUMENTATION.md) | you need to understand how the code works (the main reference) |
| [CONTENT_GUIDE.md](CONTENT_GUIDE.md) | you want to add or change content |
| [CMS_SETUP.md](CMS_SETUP.md) | you are setting up or maintaining Sanity |
| [DEPLOY.md](DEPLOY.md) | you are publishing the site |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | something is not working |
| [ARCHITECTURE.md](ARCHITECTURE.md) | you want the visual design system and page composition |
| [CLAUDE.md](CLAUDE.md) | you use Claude Code to change the project |
| [AGENTS.md](AGENTS.md) | you use OpenAI Codex or another coding agent |
| [CHANGELOG.md](CHANGELOG.md) | you want to see what changed and when |

## Licence and contact

This is a personal site. Contact the owner through the form on the Contact page.
