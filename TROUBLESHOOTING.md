# Troubleshooting

Entries marked **Observed** were reproduced in this project. Entries marked **General** are common causes for these tools, not verified against this project. Commands refer to `package.json`.

## Installation

**Observed — `npm install` reports vulnerabilities.** `npm install` reported 24 advisories (22 moderate, 2 high) in dependencies of Sanity's Studio, during the Sanity installation. They were not fixed with `npm audit fix --force`, which would change major versions. Review with `npm audit` and decide deliberately.

**General — `npm install` fails with a Node version error.** The project needs Node.js 20.9 or newer (`engines` in `package.json`). Check with `node -v`. Upgrade Node, then delete `node_modules` and run `npm install` again.

**Observed — Turbopack fails when `node_modules` is a symlink.** A test copy of the project that linked to `node_modules` failed to build with "Could not find the Next.js package". Use a real `node_modules` folder in any copy you build.

## Development server

**Observed — "Another next dev server is already running."** Starting a second `next dev` in the same folder stopped with this message and pointed at port 3000, where the first server was running. Stop the other process (the message shows its process ID), or start on a different port with `npx next dev -p 3001`.

**Observed — `rm -rf .next` fails with "Directory not empty".** A running `next dev` writes to `.next/` while you delete it. Stop the development server first, then delete the folder. Deleting `.next/` is otherwise safe, because the next build recreates it.

**Observed — old content still appears after a change.** Sanity content is cached for up to five minutes (see TECHNICAL_DOCUMENTATION.md §6). A production build also stores the content it was built with, so a rebuild is needed to change static pages. Wait a few minutes, rebuild, or set up the publish webhook (DEPLOY.md §4).

**Observed — "Only plain objects can be passed to Client Components … URL objects are not supported" (`[ Cache ]` prefix).** Cause: a `"use cache"` function returned a `Metadata` object containing `new URL(...)`. Cached values must be plain data. Fix: build URLs and metadata outside the cache (`lib/seo.ts` does this). If it reappears, look for a `"use cache"` function that returns a `URL`, `Map`, class instance or similar.

**Observed — "Next.js encountered URL data outside of Suspense."** Cause: the header called `usePathname()` outside a Suspense boundary. Fix: `components/layout/HeaderCurrent.tsx` reads the pathname inside `<Suspense>` in `app/(site)/layout.tsx`. Any new client component that calls `usePathname`, `useSearchParams` or reads `params` needs the same treatment.

**Observed — `metadataBase` warning during build.** Fixed by setting `metadataBase` in the root layout from `siteUrl()`. If it reappears, check that `lib/site-url.ts` returns a valid absolute URL.

## TypeScript

**Observed — errors in `.next/types/validator.ts` after moving routes.** Generated route types are stale after routes move. Fix: run `npx next build` (or stop `npm run dev` and delete `.next/types`), then run `npx tsc --noEmit` again.

**Observed — `Property 'X' does not exist` for `@sanity/ui` props.** `@sanity/ui` v4 renamed some props. `Stack` uses `gap` (not `space`), and `Grid` uses `gridTemplateColumns` (not `columns`).

**Observed — `Type 'string | undefined' is not assignable …` in Writing.** A value from optional CMS or local data was used as a required string. Provide a fallback (`?? ""`) in the mapper, not in the component.

## ESLint

**Observed — `react-hooks/set-state-in-effect` error.** Calling `setState` directly inside an effect is reported. Prefer deriving the value during render, or using the state-reset pattern used in `components/layout/Header.tsx` (state tied to the current pathname).

**Observed — `@typescript-eslint/no-explicit-any` in CMS code.** `sanity/lib/cms.ts` has a file-level disable comment. GROQ results are untyped, and every row is mapped to a typed model in the same function. Do not add more `any` elsewhere.

**Observed — `no-unused-vars` for destructured fields.** Prefix the variable with `_` (for example `const { id: _id, ...rest } = x`). The rule allows `_`-prefixed names.

## Production build

**Observed — build fails on the Studio route with "Route segment config 'dynamic' is not compatible with `cacheComponents`."** Remove `export const dynamic` from route files when `cacheComponents` is enabled.

**Observed — "Route … metadata is blocked … uncached or runtime data in `generateMetadata()`."** Cause: `generateMetadata` read request-time data while the route prerenders. Fix: move the data read into a `"use cache"` function that returns plain values, or keep the function free of request data.

**Observed — `Icon … doesn't exist in target module` for `@sanity/icons`.** Version 5 of `@sanity/icons` no longer exports icons from the package root. Import each icon from its own path, for example `import { HomeIcon } from "@sanity/icons/Home"`.

**General — build fails with missing environment variables.** The site falls back to local content when Sanity variables are absent, so most builds succeed without them. Failures usually come from a code change. Check the first error in the build log.

## Sanity connection

**Observed — Studio shows "Connect this Studio to your project" or "missing-project-id".** `NEXT_PUBLIC_SANITY_PROJECT_ID` is empty or was not loaded. Set it in `.env.local` and restart `npm run dev`. Confirm with `npm run cms:doctor`.

**Observed — `cms:doctor`: "Dataset … not found".** The dataset name in `NEXT_PUBLIC_SANITY_DATASET` does not exist in that project. Check the dataset name in the Sanity dashboard.

**Observed — `cms:doctor`: "Dataset is PRIVATE".** Anonymous reads are rejected. Public site content needs a dataset that allows public reads. Change the dataset visibility in the Sanity dashboard, or ask whether a read token should be used instead.

**Observed — the site shows local content even after seeding.** The site uses Sanity only when it can find a `profile` document in the configured project and dataset. Check `NEXT_PUBLIC_SANITY_DATASET`, and run `npm run cms:doctor` to confirm the dataset is seeded.

**Code — console message "[content] Sanity unavailable, using local data".** This is written by `pick()` in `lib/content.ts` when a Sanity request throws. A Sanity request failed, so the page used `data/`. Check the network connection, the project ID, and the dataset name. The page still renders.

## CORS and Studio sign-in

**Observed — "Access to fetch … has been blocked by CORS policy" in the Studio.** The origin is missing from Sanity's CORS list. Add `http://localhost:3000` (or your production domain) in the Sanity dashboard under API → CORS origins.

**Observed — the Studio is still blocked after adding the origin.** The origin is listed, but **Allow credentials** is off. Edit the origin and tick **Allow credentials**. `npm run cms:doctor` reports this specific condition.

**General — CORS works in one browser but not another.** Clear the site's cookies and reload. Make sure the address uses the same scheme and port as the CORS entry (`http://localhost:3000` is not the same as `http://127.0.0.1:3000`).

## CMS publishing

**Observed — `cms:seed` fails with "Document … references non-existent document …".** This happened when documents were created in an order that put references before their targets. The seeding code now sends documents in dependency order, so this should not occur. If it does, run `npm run cms:seed -- --dry-run` to see the plan, then re-run `npm run cms:test`.

**Observed — `cms:seed` says "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN".** The script reads `.env.local`. Add the missing variable (the write token is needed only for seeding). Do not add the write token to Vercel.

**Observed — re-running `cms:seed` does not change existing documents.** This is intended. The default mode creates only missing documents. Only `--force` overwrites, and that destroys CMS edits. Do not use `--force` without explicit approval.

**General — published changes do not show on the live site.** Check that the document is published (not a draft), wait about five minutes, check the webhook's delivery log in the Sanity dashboard, then redeploy if needed.

## Preview and draft mode

**Observed — `/preview` says "Preview is only available from the Studio".** Draft mode is off. Open Preview from inside the Studio so that Sanity can start draft mode with its preview secret. Opening `/preview` directly does not enable it.

**Code — the Preview tab opens but shows published content.** Preview reads drafts only with `SANITY_API_READ_TOKEN`, a Viewer token. Without it, drafts cannot be read. Add the token to `.env.local` and restart. The public site does not need it.

**Code — preview links leave preview.** Internal links must use `hrefTo()` from `lib/paths.ts`. A link written as a plain string will go to the public page.

## Environment variables

**Code — a secret appears to be exposed to the browser.** `npm run cms:doctor` flags any `NEXT_PUBLIC_` variable whose name contains TOKEN, SECRET, PASSWORD or PRIVATE. Rename the variable without the prefix, and rotate the value if it was ever shown publicly.

**Observed — canonical or sitemap links point at `localhost`.** `NEXT_PUBLIC_SITE_URL` is not set in that environment. Set it to the public domain. Note that `NEXT_PUBLIC_` values are inlined at build time, so rebuild after changing them.

**General — a variable change has no effect.** `.env.local` is read when the dev server starts. Restart it. On Vercel, redeploy after changing variables.

## Vercel deployment

**General — the deployment builds but the site shows localhost links.** Set `NEXT_PUBLIC_SITE_URL` in the Vercel project and redeploy. Without it, the site uses Vercel's own URL.

**General — the deployment fails on Node version.** Use Node.js 20.9 or newer in Vercel's project settings, or rely on the `engines` field.

**General — the Studio shows CORS errors on the live site.** Add the production domain to Sanity's CORS list with **Allow credentials** ticked.

## GitHub and pushing

**General — `git push` asks for a password or fails with a permission error.** GitHub no longer accepts account passwords for Git. Use a personal access token or an SSH key, and check that the remote URL is correct with `git remote -v`.

**Observed (earlier in this project) — the portfolio sat inside a larger repository.** When a folder is inside another repository, `git status` shows the parent's changes. Check that `git rev-parse --show-toplevel` prints the project folder before you stage or push anything. The current repository's top level is this project folder.

**General — a secret was committed.** Remove it from the repository history and rotate the secret at the provider. Removing it from the latest commit alone is not enough, because the old commit remains in history.
