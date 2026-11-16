# CMS setup (Sanity) — one-time, ~15 minutes

The site is already wired for Sanity. Until you finish these steps it keeps serving the content in `/data`, so nothing is broken in the meantime. Steps 1–4 need your Sanity account, which only you can create.

## Status for project `4665zgnk` (dataset `production`)
Verified with `npm run cms:doctor`:
- ✅ Project ID and dataset are correct, reachable, and currently empty.
- ✅ `.env.local` exists, is git-ignored, and has the two public IDs. Empty slots for the secrets were added; a webhook secret was generated locally.
- ✅ Dataset is **public** (anyone can read *published* content; nobody can write without a token). Right for a portfolio and the free-plan default. Keep it public.
- ✅ CORS already allows `http://localhost:3000`.
- ⏳ **Remaining: create the Editor token** (needed to seed). Optionally a Viewer token (draft preview).

## 1. Open your project's API settings
<https://www.sanity.io/manage/project/4665zgnk/api> → sign in with the account that owns the project.

## 2. CORS (check only)
**API → CORS origins** should list `http://localhost:3000` with **Allow credentials** ✔ (the Studio needs credentials to sign you in). If you run the dev server on another port, add that origin too. Add your production URL when you deploy.

## 3. Create the tokens (**API → Tokens → Add API token**)
| # | Name it | Role | Needed for | Required now? | `.env.local` variable |
| --- | --- | --- | --- | --- | --- |
| 1 | `portfolio-seed` | **Editor** | `npm run cms:seed` writes your 131 starter documents. Used once, on your computer only. | **Yes** | `SANITY_API_WRITE_TOKEN` |
| 2 | `portfolio-preview` | **Viewer** | Lets the *server* read unpublished drafts for the Preview tab. | Optional (the public site works without it) | `SANITY_API_READ_TOKEN` |

Why only these? The public site reads published content with **no token** (dataset is public), so visitors never need credentials. Tokens are shown **once** — copy each straight into `.env.local` (open the file in your editor; don't paste tokens into chat, email or commits). Delete the Editor token in Sanity after seeding if you want to keep it tidy; you can always create another.

`SANITY_REVALIDATE_SECRET` is not a Sanity token: it's a random string (already generated in `.env.local`) used to sign the publish webhook. It only matters after you deploy (webhooks need a public URL), so ignore it for now.

**Never** give any of these a `NEXT_PUBLIC_` prefix, never put the Editor token in Vercel, and never commit `.env.local`.

## 4. Verify, then seed
```bash
npm run cms:doctor              # checks project, CORS, token roles (dry-run, writes nothing)
npm run cms:seed -- --dry-run   # shows what would be created
npm run cms:seed                # only after cms:doctor says "Ready to seed"
npm run cms:doctor              # confirm: dataset now seeded
```
`cms:doctor` tests each token's real permissions and warns if the Viewer token can write.

## Free-plan notes
Everything here uses the free tier: one project, one public `production` dataset, Studio hosted inside your own site (no Sanity-hosted Studio needed), Editor/Viewer tokens, CORS origins, and one webhook. Sanity's limits and plan features change, so confirm current quotas on your project's **Usage/Plan** page; this setup stays small (≈130 documents, a few images/PDF). Private datasets are generally not part of the free plan — which is another reason to keep the dataset public.

## 5. (Reference) What the seed does
```bash
npm run cms:seed -- --dry-run   # shows what will be created (no network)
npm run cms:seed                # creates all content; never overwrites existing edits
```
This copies every job, project, skill, publication, link, etc. from `/data` (131 documents, 125 internal references).

- Documents are sent in dependency order (referenced documents first), so references always resolve.
- Re-running is safe: documents that already exist are skipped, never overwritten.
- If a step fails, the error names the document and the missing reference. Nothing from the failed transaction is written.
- `npm run cms:test` runs offline migration tests (no Sanity account needed).
- Use `-- --force` only to reset documents back to the `/data` version. It destroys CMS edits.

## 6. Edit your site
```bash
npm run dev
```
Open <http://localhost:3000/studio>, sign in, and you land on the **Overview** screen. Use the **Content** tab to edit. Publish with the **Publish** button; the site updates on the next visit (see step 7 for instant updates).

## 7. Instant updates after publishing (webhook)
manage → **API → Webhooks → Create**:
- URL: `https://your-domain.com/api/revalidate`
- Trigger on: **Create, Update, Delete**
- Projection: `{_type}`
- HTTP method: `POST`
- Secret: the same value as `SANITY_REVALIDATE_SECRET`

Without the webhook, published changes still appear automatically within about 5 minutes.

## 8. Deploy (when you're ready)
In Vercel → Project → Settings → Environment Variables add: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`, `SANITY_REVALIDATE_SECRET`. **Do not** add `SANITY_API_WRITE_TOKEN`.
The Studio is then at `https://your-domain.com/studio`.

## Who can edit?
Only people you invite (manage → **Members**) can sign in to the Studio. Visitors can read published content only. Drafts are never public: they require the Viewer token on the server and a Studio-issued preview secret. The revalidation webhook rejects any request not signed with your secret.

## Preview before publishing
In the Studio, open the **Preview** tab. It loads your site's pages with unpublished drafts, and picks the right page for whatever document you're editing (e.g. editing a project opens its case study). Click **Publish** when happy. Note: the header menu and footer in the preview show published content.

## Uploading a new resume
Studio → **Resume (PDF upload)** → upload the PDF → Publish. The "Download resume" buttons use it automatically. Until a file is uploaded, the site keeps serving the bundled file in `public/documents/` (see REVIEW_FLAGS.md about what that file contains).

## Troubleshooting
- **Studio says "missing project id"** → step 2, then restart `npm run dev`.
- **Studio can't load / CORS error** → step 3 (origin must match exactly, credentials on).
- **Site still shows old content** → set up the webhook (step 7) or wait ~5 minutes.
- **Preview won't open** → check `SANITY_API_READ_TOKEN` is set (Viewer role).
- **`cms:seed` fails with 401/403** → the Editor token is missing or has the wrong role.
