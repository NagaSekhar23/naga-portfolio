# CLAUDE.md — instructions for Claude Code

This file tells Claude Code how to work in this repository. Read it before changing anything. The same operating rules for other assistants are in [AGENTS.md](AGENTS.md).

## What this project is
A personal professional website for Naga Sekhar Madala, built with Next.js (App Router), TypeScript, Tailwind CSS v4 and Sanity CMS. Visitors read the public site. The owner edits content in the embedded Studio at `/studio`. The site is intended to deploy to Vercel from GitHub.

## Read these first, in order
1. [README.md](README.md) — overview and commands.
2. [TECHNICAL_DOCUMENTATION.md](TECHNICAL_DOCUMENTATION.md) — architecture, routes, data flow, environment variable names, SEO, security. This is the main reference.
3. [CONTENT_GUIDE.md](CONTENT_GUIDE.md) — how content is stored (local `data/` files versus Sanity), before you touch any content.
4. [CMS_SETUP.md](CMS_SETUP.md) — Sanity configuration. Read before any change to schemas, the Studio or CMS scripts.
5. [TROUBLESHOOTING.md](TROUBLESHOOTING.md) — known errors and their verified causes.

## Architecture in brief
- `app/(site)/` — public pages. Each route file is thin and calls a `*View.tsx` in `components/pages/`.
- `lib/content.ts` — **the only file pages use to read content.** It reads Sanity when configured and seeded, otherwise `data/`.
- `sanity/` — schemas (`sanity/schemaTypes/`), GROQ queries and mapping (`sanity/lib/cms.ts`), caching (`sanity/lib/fetch.ts`), the Studio structure and tools.
- `data/` — typed local content and the seed source.
- `lib/seo.ts` and `lib/site-url.ts` — all metadata and absolute URLs. Do not build URLs anywhere else.
- `scripts/` — seeding, verification and tests. Read the header comment of each script before running it.

## Coding conventions
- TypeScript strict mode. Keep types in `data/types.ts`; do not use `any` outside the CMS mapping layer (`sanity/lib/cms.ts` has a documented exception).
- Server components by default. Add `"use client"` only for real interactivity or browser APIs, and say why in a comment.
- Pages get content through `lib/content.ts` getters, never by importing `data/` or Sanity directly.
- Internal links inside pages must go through `hrefTo()` (`lib/paths.ts`) so that preview mode keeps working.
- External links use `ExternalLink` (`components/ui/ExternalLink.tsx`), which adds the new-tab attributes.
- Styling: Tailwind utilities plus the design tokens and type roles in `app/globals.css`. Keep the "Signal" editorial look. No gradients, glow effects or generic card templates (see ARCHITECTURE.md).
- Motion must respect `prefers-reduced-motion`.
- Do not add dependencies without a clear reason. Record new dependencies in the Technology stack table of TECHNICAL_DOCUMENTATION.md.
- Next.js 16 is in use. Before writing Next.js code, read the relevant guide in `node_modules/next/dist/docs/`, as [AGENTS.md](AGENTS.md) explains.

## How to make common changes safely

### Add a public page
1. Create `app/(site)/<name>/page.tsx`. Export `generateMetadata` that returns `pageMetadata({ path: "/<name>", title, description })` from `lib/seo.ts`.
2. Create the view in `components/pages/<Name>View.tsx` as an async server component that loads content with `lib/content.ts` getters.
3. Add the route to `data/routes.ts` (header menu, footer, sitemap) and to `components/pages/registry.tsx` (preview).
4. Add a link in `data/site.ts` `navItems` only if it belongs in the header.
5. Run the checks in the section below.

### Add or change a content type
1. Schema: `sanity/schemaTypes/` (+ register in `index.ts`).
2. Studio sidebar: `sanity/structure.ts`.
3. Query and mapper: `sanity/lib/cms.ts`, returning the same type as the local `data/` file.
4. Getter: `lib/content.ts`, using `pick()`.
5. Local data: `data/<file>.ts` and its type in `data/types.ts`.
6. Seed: `scripts/seed-docs.ts`, if documents should be seeded.
7. Verify: `npm run cms:verify` must still report that CMS output equals local content, and `npm run cms:test` must pass.

### Change content
- Content that lives in Sanity (see the table in CONTENT_GUIDE.md) is edited in the Studio, not in code.
- Local `data/` content is used only before seeding or when Sanity is unavailable. Do not edit `data/` expecting the live site to change once the dataset is seeded.

## Testing and verification
Run these before you report a change as finished:
```bash
npm run check      # content guard, TypeScript, lint, CMS verification, CMS tests, URL tests
npm run build      # production build; must finish with no warnings
```
Use `npm run cms:doctor` only when the owner asks you to check Sanity configuration. It reads `.env.local` and makes network requests. Do not paste its output containing values.

For UI changes, also check the affected pages at 390, 768 and 1440 pixels. Browser tests are not in the repository.

## Protecting secrets and private files
- **Never print, log, copy or commit values** from `.env.local`, Vercel or any token. Refer to variables by name only.
- Never add a secret-carrying variable with a `NEXT_PUBLIC_` prefix. Server-only names are listed in TECHNICAL_DOCUMENTATION.md §14.
- Do not create or modify `.env.local` or the contents of `private/`. Do not include the contents of the internal review notes in any file that could be published.
- Do not add references to external professional-network profiles, or to publications that the owner has removed, to any public content.
- The master resume lives in `private/`, which is git-ignored. Do not copy it into `public/`.

## Commands that require explicit owner approval
Do not run these unless the owner explicitly asks for that exact action in the current conversation:
- `npm run cms:seed` (any form). It writes to the live Sanity dataset.
- `npm run cms:seed -- --force`. It overwrites CMS documents and destroys edits.
- Any Sanity delete, patch or publish through scripts or the API.
- `git add .`, `git commit`, `git push`, `git reset`, `git rebase`, or any command that changes Git history.
- `vercel`, `vercel deploy`, or any action that creates or changes a Vercel project or domain.
- Deleting `.next/` while `npm run dev` is running in the same folder.
- Deleting or moving files in `public/documents/` or `private/`.
- Any command that installs or upgrades dependencies, unless the task is a dependency change.

Read-only commands (`git status`, `git log`, `npm run check`, `npm run build`, `npm run cms:verify`, `npm run cms:test`, `npm run seo:test`, `npm run cms:seed -- --dry-run`) are safe to run.

## Documentation maintenance
After a significant change, update the documents it affects in the same piece of work:
- Routes, components, data flow or configuration → TECHNICAL_DOCUMENTATION.md.
- Environment variables → TECHNICAL_DOCUMENTATION.md §14 and `.env.example` (names and empty values only).
- Content types or Studio behaviour → CMS_SETUP.md and CONTENT_GUIDE.md.
- A new recurring error and its fix → TROUBLESHOOTING.md.
- Any user-visible change → add an entry under "Unreleased" in CHANGELOG.md.
- Keep commands in the docs identical to `package.json` scripts.
- Do not put secrets, private contact details or internal review notes in any documentation file.
