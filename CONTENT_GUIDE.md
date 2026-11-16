# Content Guide

**You now edit the site in the CMS — no code or JSON files.**
Open `/studio` (after the one-time setup in [CMS_SETUP.md](CMS_SETUP.md)), sign in, pick a section in the left menu, edit with forms, and press **Publish**.

## Studio → what it controls
Tabs across the top: **Overview** (landing screen), **Content** (sidebar of everything), **Preview** (drafts on the real site), **Vision** (advanced queries).

| Content → … | Website |
| --- | --- |
| Identity & site → Home & profile | Home hero (headline, introduction, four focus entry points, photo, stats), About, email, location, coursework |
| Identity & site → Site settings | SEO title/description/keywords, header navigation, footer text and links |
| Identity & site → Resume (PDF upload) | All "Download resume" buttons |
| Identity & site → Professional links | About, Contact, Research profiles, footer (IEEE, Scholar, GitHub, Zenodo…) |
| Discipline pages → Engineering / Applied AI / Data & ML page | Page title, tagline, introduction, selected projects, toolbox |
| Discipline pages → Capability themes | The evidence rows on those pages (choose which page each appears on; link projects and roles) |
| Discipline pages → Skills | Toolbox categories |
| Projects | Directory + case studies (views: ordered, browse & sort, featured, in progress, live, by category) |
| Research & publications | /research (views by type) |
| Experience | /experience and the "Currently" block on Home |
| Education & credentials | /education: degrees, certifications, achievements |
| Writing | /writing and /writing/<slug> |

## How-tos
- **Reorder:** in list screens (Experience, Projects, Skills…) drag rows up/down. Inside a document, drag array items (highlights, skills, links).
- **Add a project:** Projects → **+** → fill Title, Slug (click *Generate*), Category, Summary → add Highlights/Technologies → write-up → upload screenshots (add alt text) → add GitHub / live demo links → **Publish**. Tick *Featured* to show it under the Featured tab.
- **Add a publication:** Research & publications → **+** → choose Type, paste the exact title, authors, venue, year and **DOI** (bare DOI, e.g. `10.1016/j.csbj.2025.10.063`; the link is built for you).
- **Add a job:** Experience → **+**; it appears at the end — drag it to the top for newest-first.
- **Add an article:** Articles → **+** → title, slug, summary, date → write the text (headings, lists, links, images) — it appears at `/writing/<slug>`. Or fill *External URL* to link elsewhere.
- **Replace the resume:** Resume (PDF upload) → upload → Publish.
- **Change the biography / headline:** Profile & introduction.
- **Change navigation:** Site settings → Header navigation (pick the page and the label; order = menu order).
- **Delete anything:** open the document → **⋯** menu → Delete.
- **Preview first:** open the **Preview** tab to see unpublished changes on the real pages.
- Rule of thumb: **never enter a title, date, metric or URL you haven't confirmed.** To pull exact paper metadata: `https://api.crossref.org/works/<doi>`.

---

# Developer reference: the `/data` files

`/data` is still in the repo for two reasons: it is the **seed** for the CMS (`npm run cms:seed`) and the **automatic fallback** if the CMS is not configured or unreachable. After migration, edit content in the Studio, not here — edits to `/data` no longer change the live site once the dataset is seeded.

## Map: what to edit

| I want to…                         | Edit                          |
| ---------------------------------- | ----------------------------- |
| Change bio, headline, stats, email, availability, photo | `data/profile.ts` |
| Add / edit a job                   | `data/experience.ts`          |
| Add / edit a project               | `data/projects.ts`            |
| Update skills                      | `data/skills.ts`              |
| Add a publication, paper, book, patent | `data/research.ts`        |
| Add a certification                | `data/certifications.ts`      |
| Add an achievement / award         | `data/achievements.ts`        |
| Add a technical article            | `data/articles.ts`            |
| Add / change professional links    | `data/links.ts`               |
| Education and coursework           | `data/education.ts`           |
| Site title, SEO description, resume file, navigation order | `data/site.ts` |

## Add a job (`data/experience.ts`)
Add an object at the **top** of the array (newest first):
```ts
{
  id: "acme",                       // unique, lowercase, no spaces
  role: "Senior Software Engineer",
  company: "Acme Corp",
  location: "Atlanta, GA",
  start: "Mar 2027",
  end: "Present",                   // and change the previous job's end date
  context: "One sentence on what the company/team does.",
  highlights: ["Outcome-first bullet…", "…"],   // first 3 show; the rest expand
  tech: ["Python", "Kafka"],
}
```
To update responsibilities, edit the strings in `highlights`.

## Add a project (`data/projects.ts`)
```ts
{
  id: "my-project",                 // becomes the URL: /projects/my-project
  title: "My Project",
  category: "AI Agents & LLMs",     // must be one of projectCategories (top of file)
  featured: true,                   // optional: shows under the "Featured" tab
  status: "Live",                   // optional: "Live" | "In Progress"
  badge: "Winner · Hackathon 2027", // optional highlighted line
  summary: "One-sentence summary shown in the list.",
  highlights: ["Metric-backed bullet", "Another"],
  tech: ["Python", "FastAPI"],
  description: ["Optional longer paragraph.", "Another paragraph."],   // detail page
  images: [
    { src: "/images/projects/my-project-1.png", alt: "Dashboard showing …",
      width: 1600, height: 900, caption: "Optional caption" },
  ],
  links: [
    { label: "GitHub", href: "https://github.com/NagaSekhar23/my-project" },
    { label: "Live demo", href: "https://my-project.vercel.app" },
  ],
}
```
**Screenshots:** drop the file in `public/images/projects/`, then reference it as `/images/projects/<file>`. Use the file's real pixel `width`/`height` (any size; it scales). Always write meaningful `alt` text.
To add a **new category**, add its name to `projectCategories`, then use it in a project.

## Add a profile photo
Save as `public/images/profile/naga.jpg` (portrait, ~4:5), then in `data/profile.ts`:
```ts
photo: { src: "/images/profile/naga.jpg", alt: "Portrait of Naga Sekhar Madala", width: 1200, height: 1500 },
```
Remove the line to go back to the monogram placeholder.

## Add a publication (`data/research.ts`)
```ts
{
  id: "my-paper",
  type: "journal",                  // journal | conference | dataset | book | patent | research
  title: "Exact title",
  authors: ["Author One", "Naga Sekhar Madala"],   // your name is bolded automatically
  venue: "Journal or conference name",
  year: "2027",
  date: "Jan 2027",                 // optional
  doi: "10.xxxx/xxxxx",             // bare DOI; the doi.org link is built for you
  links: [{ label: "PDF", href: "https://…" }],
}
```
**Only enter titles, authors and dates you have confirmed from the publisher, DOI record or your own copy.** To pull exact metadata for a DOI: `https://api.crossref.org/works/<doi>`.

## Add a certification (`data/certifications.ts`)
Append `{ name: "…", issuer: "…" }` to a group's `items`, or add a new group object.

## Add an achievement (`data/achievements.ts`)
Append `{ id, title, detail?, year? }`.

## Update skills (`data/skills.ts`)
Add strings to a group's `skills`, or add a group `{ id, title, skills: [] }`.

## Add an article (`data/articles.ts`)
```ts
{ id: "my-article", title: "…", summary: "…", date: "2027-02-01",
  publication: "Medium", href: "https://…", tags: ["LLM"] }
```
The "in preparation" message disappears automatically once the list has entries.

## Professional links (`data/links.ts`)
Append `{ id, group, label, href, description, mark }`.
`group`: `research`, `publications`, `code`, `demos`, `writing`. `mark` is the short text badge (e.g. "GH", "IEEE").
Research-group links also appear in the **Research profiles** block. External links open in a new tab automatically.

## Update contact details
Email, location, availability: `data/profile.ts`. The contact form opens the visitor's email app pre-filled; nothing needs a server.

## Change section order or names
`navItems` in `data/site.ts` controls nav order and the section numbers. The visual order of sections on the page is set in `app/page.tsx` (keep them in the same order).

## Replace the resume
Put the file in `public/documents/` and set `resumeHref` / `resumeLabel` in `data/site.ts`. See `REVIEW_FLAGS.md` about what the current file contains.

## How the CMS plugs in
All reads go through **`lib/content.ts`**: Sanity (via `sanity/lib/cms.ts`) when configured and seeded, otherwise `/data`. Schemas live in `sanity/schemaTypes/`. `npm run cms:verify` proves the Sanity pipeline returns exactly what `/data` contains.

## Rules of thumb
- Never invent employers, dates, metrics, publications or URLs. If unsure, leave it out and add a note in `REVIEW_FLAGS.md`.
- Keep ids unique. Dates are plain display strings (except articles: ISO).
- `npm run check && npm run build` before deploying.
