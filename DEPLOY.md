# Deployment guide (GitHub → Vercel)

This guide describes how the site is published. Follow it in order. Nothing in this document deploys anything by itself.

## 1. Repository
The project is a Git repository whose `origin` is a GitHub repository (see `git remote -v`). Before you push:

```bash
git rev-parse --show-toplevel     # must print the project folder itself
git status                        # review every change
git log --oneline -3              # confirm the history you expect
```

Rules:
- Stage files explicitly (`git add <path>`). Do not use `git add .` until `git status` has been reviewed.
- Never commit `.env.local`, `private/`, `.next/` or `node_modules/`. The `.gitignore` excludes them; confirm with `git check-ignore -v <path>`.
- Never commit tokens or secrets. If one is committed, treat it as exposed (see TROUBLESHOOTING.md → GitHub).

## 2. Local verification
Before every push:
```bash
npm install
npm run check
npm run build
npm start                         # optional: test the production build at http://localhost:3000
```
`npm run build` must finish with no warnings.

## 3. Vercel project
1. Sign in to vercel.com with your GitHub account (Hobby plan).
2. **Add New → Project** → import the GitHub repository.
3. Framework preset: **Next.js** (detected automatically).
4. Build and output settings: keep the defaults.
   - Install command: `npm install`
   - Build command: `npm run build`
   - Output: Next.js default
5. Node.js version: 20.9 or newer. `package.json` declares this in `engines`.
6. Do not deploy until the environment variables in section 4 are set (see section 4 for the order).

## 4. Environment variables
In the Vercel project: **Settings → Environment Variables**. Add each variable for **Production** (add **Preview** too if you want preview deployments to use Sanity).

| Name | Value | Secret? | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | your domain, for example `https://your-domain.com` | no | Needed for correct canonical links, sitemap and social URLs |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | your Sanity project ID | no | Public identifier |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | no | |
| `SANITY_API_READ_TOKEN` | Viewer token from Sanity | **yes** | Optional. Enables the Preview tab. |
| `SANITY_REVALIDATE_SECRET` | the random value you generated | **yes** | Needed for the publish webhook |

Do **not** add `SANITY_API_WRITE_TOKEN` to Vercel. It is used only for local seeding.

Changing a `NEXT_PUBLIC_` variable needs a new deployment, because those values are built into the site. Changing a server-only variable also needs a redeploy.

## 5. Domain
1. In Vercel: **Settings → Domains** → add your domain.
2. Follow Vercel's DNS instructions at your domain registrar.
3. Set `NEXT_PUBLIC_SITE_URL` to the same domain (with `https://`), then redeploy.
4. Choose one canonical host (with or without `www`) and redirect the other, in Vercel's domain settings.

## 6. Sanity production CORS
In manage.sanity.io → your project → **API → CORS origins**:
- Add `https://your-domain.com` with **Allow credentials** ticked.
- Keep `http://localhost:3000` with **Allow credentials** ticked for local Studio use.
- Add the Vercel preview URL only if you use preview deployments with the Studio.

See CMS_SETUP.md §3.

## 7. Deploy
Pushing to the production branch (usually `main`) triggers a Vercel production deployment. Watch the build log in Vercel.

If the build fails, the log shows the first error. TROUBLESHOOTING.md lists common causes.

## 8. Revalidation webhook
After the first successful deployment, create the webhook in Sanity (CMS_SETUP.md §11):
- URL: `https://your-domain.com/api/revalidate`
- Secret: the same value as `SANITY_REVALIDATE_SECRET`
- Trigger: create, update and delete; POST; projection `{_type}`

## 9. Post-deployment checks
Run through these on the production domain:
1. Open `/`, `/about`, `/projects`, `/research`, `/experience`, `/contact` and one project page.
2. View the page source: `<link rel="canonical">` and `og:url` must use your domain.
3. Open `/sitemap.xml` and `/robots.txt`.
4. Download the resume and confirm it opens.
5. Open `/studio` and sign in with an invited account.
6. Make a test change to a document (for example a test achievement titled "TEST — delete me"), publish, confirm it appears on the site, then delete the test document.
7. Confirm `/studio` and `/preview` are not indexed (they carry `noindex`).
8. Check `/api/revalidate` returns 401 or 405 to an unsigned GET request (it accepts POST only).

## 10. Rollback and troubleshooting
- **Roll back a bad deployment:** in Vercel, open **Deployments**, choose a previous good deployment, and use its menu to promote or restore it. Check the option is available on your plan.
- **Roll back content:** Sanity's Studio can show earlier versions of a document. *Requires confirmation on your plan:* that this history is available. If it is, restore the earlier version, publish, and check the public page. If it is not, re-enter the text from a copy you keep.
- **Build or runtime problems:** TROUBLESHOOTING.md → Vercel deployment and Sanity connection.
- **Environment changes not applied:** redeploy after changing variables.

## 11. Free-plan notes
Vercel Hobby and Sanity's free plan cover this site's expected use. Limits (bandwidth, build minutes, seats, API requests, webhook deliveries) change over time. Check each provider's usage page before relying on them.
