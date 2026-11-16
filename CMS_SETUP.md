# CMS setup (Sanity)

This guide covers setting up and maintaining the Sanity project behind the site. Content editing day to day is in [CONTENT_GUIDE.md](CONTENT_GUIDE.md). Environment variable names are listed in [TECHNICAL_DOCUMENTATION.md §14](TECHNICAL_DOCUMENTATION.md#14-environment-variables). **Never paste tokens into documents, chat, issues or commits.**

The site works without Sanity. Until the dataset is seeded, pages use the local files in `data/`.

## 1. Create or identify the Sanity project
1. Sign in at https://www.sanity.io/manage.
2. Create a project (free plan) or open the existing one.
3. Note the **Project ID** and the **dataset name** (normally `production`).

Put them in `.env.local` (copy from `.env.example`):
```
NEXT_PUBLIC_SANITY_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_SANITY_DATASET=production
```
The project ID and dataset are public identifiers. They appear in the site's network requests, so they are not secrets. Tokens are different.

Check the setup any time:
```bash
npm run cms:doctor
```

## 2. Dataset visibility
Keep the dataset **public**. The site reads published content without any token, and the Studio controls who can write. Anonymous writes are rejected. A private dataset would need a read token for every public page, which this project does not support.

## 3. CORS origins (required for Studio sign-in)
In **manage.sanity.io → your project → API → CORS origins**, add each address the Studio will run from:

| Origin | Allow credentials |
| --- | --- |
| `http://localhost:3000` | **ticked** (required for local Studio sign-in) |
| your production domain, e.g. `https://your-domain.com` | **ticked** |
| a Vercel preview URL, if you use one | ticked, optional |

Origins must match exactly, including `https` and the port. `npm run cms:doctor` reports whether an origin is allowed and whether credentials are enabled. Without credentials, the Studio cannot sign in.

## 4. Members (who can edit)
Invite collaborators in **manage → Members**. Only members can sign in to the Studio and publish. Visitors can read published content but cannot change anything.

## 5. Tokens
Create tokens in **manage → API → Tokens → Add API token**. Each token is shown once. Copy it straight into `.env.local` and do not paste it anywhere else.

| Token | Role | Variable | Needed for | Where it goes |
| --- | --- | --- | --- | --- |
| Seed | **Editor** | `SANITY_API_WRITE_TOKEN` | the one-time seed and the write test in `cms:doctor` | `.env.local` on your computer only. Remove it from Sanity after seeding if you no longer need it. |
| Preview | **Viewer** | `SANITY_API_READ_TOKEN` | reading drafts for the Preview tab | `.env.local` and Vercel (Production) |

Verify roles with `npm run cms:doctor`. It warns if the preview token can write.

Also create a random webhook secret and store it as `SANITY_REVALIDATE_SECRET`. For example, generate one locally with `openssl rand -hex 32` and paste it into `.env.local` and Vercel. It is not a Sanity token, and it only matters after deployment.

## 6. Seeding the dataset (one-time)
Seeding copies the content in `data/` into Sanity as documents.

```bash
npm run cms:seed -- --dry-run   # shows the plan: document counts, references, commit order. Writes nothing.
npm run cms:seed                # creates the missing documents. Never overwrites existing documents.
npm run cms:doctor              # confirms the dataset is seeded
```

How the seed works (see `scripts/seed-plan.ts`):
- It checks every reference before writing anything.
- It sends documents in dependency order, so each document's references already exist.
- Documents that already exist are skipped, not overwritten.
- If a commit fails, the error names the document and the missing reference. The failed commit writes nothing, and re-running is safe.

**`--force` overwrites existing documents with the `data/` version and destroys CMS edits.** Do not use it unless you have decided to reset content. Re-running the default command after edits is safe.

## 7. Content types
Full field lists are in TECHNICAL_DOCUMENTATION.md §10. Summary:

| Studio screen | Document types | Notes |
| --- | --- | --- |
| Identity & site | `profile`, `siteSettings`, `resume`, `professionalLink` | `profile`, `siteSettings` and `resume` are singletons (one each) |
| Discipline pages | `disciplinePage` (three singletons), `capabilityTheme`, `skillGroup` | the discipline singletons have fixed IDs for Engineering, Applied AI and Data & ML |
| Projects | `project`, `projectCategory` | projects have a slug, category reference, rich-text body, screenshots and links |
| Research & publications | `publication` | type: journal, conference, dataset, book, patent or research |
| Experience | `experience` | drag to reorder; newest first |
| Education & credentials | `education`, `certificationGroup`, `achievement` | |
| Writing | `article` | hosted (rich text) or external (URL) |

Singletons cannot be created from the "new document" menu, and they cannot be deleted, unpublished or duplicated in the Studio. This prevents accidental loss of the home page content.

## 8. Creating, editing, publishing and deleting
- **Create:** choose the screen in the Content sidebar, then **Create** (or the Quick create section). The document starts as a **draft**.
- **Edit:** open the document, change fields, and wait for the status to show saved changes. Drafts are not visible to visitors.
- **Publish:** press **Publish**. The document becomes live on the site within about five minutes, or immediately after the webhook (section 11).
- **Reorder:** drag rows in lists that show drag handles (for example Experience, Projects, Research, Skills). The order is stored in each document's `orderRank`. *Requires confirmation in your Studio:* whether a reorder needs **Publish** before the site changes.
- **Delete:** open the document, use the **⋯** menu, and choose Delete. Deleting a published document removes it from the site after the cache updates. There is no undo in the Studio, so re-seeding (which only creates missing documents) or re-creating the document is the only way back.

Use a clearly named test document (for example "TEST — delete me") for trial runs, and delete it afterwards.

## 9. Images and files
- **Images** (profile photo, project screenshots, rich-text images) are uploaded in the Studio and stored by Sanity. Every image needs **alt text**; the Studio requires it.
- **Resume:** open **Identity & site → Resume (PDF upload)**, upload the PDF, and publish. The download buttons then use the uploaded file. Until a file is uploaded, the bundled file `public/documents/Naga_Sekhar_Madala_Resume.pdf` is used.
- Only upload files you have reviewed for publication.

## 10. Draft preview
The Preview tab in the Studio opens the site with draft content for review.

Requirements:
- `SANITY_API_READ_TOKEN` (Viewer) set in `.env.local` for local preview and in Vercel for production preview.
- Open preview from inside the Studio. Opening `/preview` directly shows "Preview is only available from the Studio".

Limitations: the header and footer in preview show published navigation and footer text. Preview is available only to Studio users.

## 11. Revalidation (publish → site update)
Without a webhook, published changes appear after the content cache expires (about five minutes). The webhook makes them appear at once.

After deployment, in **manage → API → Webhooks → Create**:
- URL: `https://<your-domain>/api/revalidate`
- Trigger on: create, update and delete
- HTTP method: POST
- Projection: `{_type}`
- Secret: the same value as `SANITY_REVALIDATE_SECRET`

The endpoint rejects unsigned requests (401) and returns 501 if the secret is not set. Check the webhook's delivery log in Sanity if updates do not appear.

Note: statically generated pages also keep the content they were built with. A redeploy refreshes them.

## 12. Safe CMS maintenance
- Run `npm run cms:doctor` after changing tokens, CORS settings or the dataset.
- Run `npm run cms:seed -- --dry-run` before any seed.
- Do not run `--force`, and do not delete documents by script, without a backup and a clear reason.
- Keep a copy of important text in `data/` or elsewhere; the CMS is the live source once seeded.
- Keep tokens out of the repository and out of Vercel's Preview environment unless needed.
- Rotate a token in the Sanity dashboard if it is ever exposed, then update `.env.local` and Vercel.

## 13. Troubleshooting
See [TROUBLESHOOTING.md](TROUBLESHOOTING.md#sanity-connection) for the Sanity connection, CORS, publishing and preview problems. Start with `npm run cms:doctor`.
