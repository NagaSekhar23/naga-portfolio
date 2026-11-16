# Deployment guide (GitHub + Vercel, free tier)

Nothing here has been deployed. Follow these steps once you approve the final result.

## 0. Blocker to resolve first: the repository
This folder is currently inside a larger git repository (`/Users/madalanagasekhar`) whose remote is
`NagaSekhar23/order-management-service`. Pushing from here would publish to the wrong project.

Recommended: give the portfolio its own repository.
1. Create an empty GitHub repository, e.g. `naga-portfolio` (free).
2. In this folder run `git init -b main`, then check `git status` before staging anything.
3. Stage only the project files; `.gitignore` already excludes `.env*`, `private/`, `node_modules/` and `.next/`.
4. Commit, add the GitHub remote and push. Do this only after you approve.

## 1. Environment variables (Vercel → Project → Settings → Environment Variables)
| Name | Value | Environments | Secret? |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | your custom domain, e.g. `https://your-domain.com` | Production, Preview | no |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `4665zgnk` | all | no |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | all | no |
| `SANITY_API_READ_TOKEN` | Viewer token (optional, enables draft Preview) | Production | **yes** |
| `SANITY_REVALIDATE_SECRET` | the random value in `.env.local` | Production | **yes** |

Do **not** add `SANITY_API_WRITE_TOKEN` to Vercel. It is only for the one-off seed on your computer.
Without `NEXT_PUBLIC_SITE_URL`, canonical and social URLs fall back to Vercel's own address.

## 2. Build settings
Vercel detects Next.js automatically. Defaults are correct:
- Install command: `npm install`
- Build command: `npm run build`
- Output: Next.js default (no custom output)
- Node.js: 20.9 or newer (set in `package.json` → `engines`)
No `vercel.json` is required.

## 3. Sanity CORS (manage.sanity.io → project 4665zgnk → API → CORS origins)
- `http://localhost:3000` → **Allow credentials ✔** (needed for local Studio sign-in; currently off)
- `https://your-domain.com` → **Allow credentials ✔**
- `https://<your-project>.vercel.app` → **Allow credentials ✔** (Vercel preview URL, optional)

## 4. Revalidation webhook (after the first deploy)
manage.sanity.io → API → Webhooks → Create:
- URL: `https://your-domain.com/api/revalidate`
- Trigger: create, update, delete · Method: POST · Projection: `{_type}`
- Secret: the same value as `SANITY_REVALIDATE_SECRET`
Without it, published changes appear within about 5 minutes.

## 5. Post-deploy checks
1. Open `/`, `/research`, `/projects/managerlens`, `/studio`.
2. View the page source: canonical and `og:url` must use your domain.
3. Open `/sitemap.xml` and `/robots.txt`.
4. Download the resume PDF.
5. Sign in to `/studio`, edit a test item, publish, confirm it appears on the site, then delete the test item.

## 6. Free-plan notes
Vercel Hobby and Sanity's free tier cover this site. Confirm current limits on each provider's usage page.
