<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Shared instructions for AI coding agents (OpenAI Codex and others)

This section is for agents that do not read CLAUDE.md. The rules overlap on purpose. For detail on architecture and commands, read [TECHNICAL_DOCUMENTATION.md](TECHNICAL_DOCUMENTATION.md). For Claude Code specifics, see [CLAUDE.md](CLAUDE.md).

## Project conventions
- Next.js 16 App Router, TypeScript (strict), Tailwind CSS v4, React 19, Sanity v6 Studio embedded at `/studio`.
- Read Next.js guides in `node_modules/next/dist/docs/` before writing framework code, as the block above requires. APIs differ from older releases.
- Use the `@/` import alias (maps to the project root).
- Server components by default. Add `"use client"` only when needed, and keep the client boundary small.
- Put shared types in `data/types.ts`.

## Architecture rules
- Pages read content only through `lib/content.ts`. Do not import `data/` or `sanity/` from pages or components.
- All CMS reads go through the `cms*` functions in `sanity/lib/cms.ts`, which map to the `data/types.ts` shapes. Keep outputs identical to `data/`; `npm run cms:verify` enforces this.
- Build every absolute URL with `canonicalUrl()` from `lib/site-url.ts`. Build page metadata with `pageMetadata()` or `siteMetadata()` from `lib/seo.ts`.
- Never return `URL` or `Metadata` objects from a `"use cache"` function. Only plain serializable values may be cached.
- Read URL data (`usePathname`, `useSearchParams`, `params`) only inside a `<Suspense>` boundary.
- Internal links that must work in preview use `hrefTo()` from `lib/paths.ts`.

## Important files
| File | Why it matters |
| --- | --- |
| `lib/content.ts` | The content switch (Sanity or `data/`) |
| `sanity/lib/cms.ts` | GROQ queries and mapping |
| `sanity/lib/fetch.ts` | Caching tag `sanity`, preview switch |
| `sanity/schemaTypes/*.ts` | Document schemas |
| `sanity/structure.ts`, `sanity.config.ts` | Studio sidebar and plugins |
| `lib/seo.ts`, `lib/site-url.ts` | Metadata and URLs |
| `app/(site)/layout.tsx`, `app/layout.tsx` | Site chrome and root setup |
| `components/pages/registry.tsx` | Preview route resolution |
| `app/api/revalidate/route.ts` | Signed webhook |
| `next.config.ts` | Headers, image hosts, experimental flags |
| `scripts/seed-plan.ts`, `scripts/seed-docs.ts` | Seeding order and documents (do not run seeding without approval) |

## Development workflow
1. Read the relevant section of TECHNICAL_DOCUMENTATION.md and CONTENT_GUIDE.md.
2. Make the smallest change that solves the task. Do not reorganise files unless asked.
3. Run `npm run check`. Fix failures; do not weaken checks to pass them.
4. Run `npm run build`. It must finish with no warnings.
5. For UI changes, check 390, 768 and 1440 pixels.
6. Update the affected documentation and add a CHANGELOG entry under "Unreleased".

## Testing requirements
- `npm run check` must pass before a change is complete.
- `npm run build` must finish with no warnings.
- Do not add `eslint-disable` or `@ts-ignore` to silence real problems. If one is unavoidable, explain it in a comment.
- Tests that touch Sanity must be offline unless the owner asks for a live check.

## Security and privacy rules
- Never print, log, copy, commit or document values of tokens, secrets or `.env.local` entries. Use variable names only.
- Do not create `NEXT_PUBLIC_` variables that carry secrets.
- Keep `private/` and the internal review notes out of public content and out of Git.
- Do not add references to external professional-network profiles or to publications the owner has removed.
- Do not add analytics, tracking or third-party scripts without the owner's approval.

## CMS rules
- Editing live content happens in the Studio. Agents must not write to the live dataset unless the owner explicitly asks for that change.
- Seeding (`npm run cms:seed`) is one-time setup and must not be re-run without approval. `--force` is destructive. Use `--dry-run` to inspect.
- Test documents must be clearly named, created only for a test, and deleted afterwards.
- Changes to schemas must be reflected in the Studio structure, the queries, the mapper, the local data type and the seed.

## SEO requirements
- Every public route has a unique title and description, its own canonical URL and its own `og:url`.
- Preview and Studio pages are not indexed.
- The sitemap and robots file are generated from `data/routes.ts`, projects and articles.
- Headings: one `h1` per page. Images have alt text.

## Documentation maintenance requirements
- Keep the documents listed in README.md accurate after significant changes.
- Keep commands identical to `package.json`. Keep environment variable names identical to `.env.example`.
- Do not duplicate long passages between CLAUDE.md and this file. Refer to the other file instead.
- Never record secrets, private contact information or internal review content in documentation.
