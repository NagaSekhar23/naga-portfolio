# Content guide

This guide explains where each piece of content lives and how to change it. It separates two storage locations:

- **Sanity (the CMS)** — the live source once the dataset has been seeded. Edit in the Studio at `/studio`. No code changes, no deployment needed (the site updates within about five minutes, or immediately with the webhook).
- **Local files in `data/`** — the typed fallback and the seed source. They are used when Sanity is not configured or the dataset has not been seeded. **After seeding, editing `data/` does not change the live site.**

The rule the code applies: if the dataset contains a `profile` document, the site reads from Sanity. Otherwise it reads `data/`. Run `npm run cms:doctor` to see which is in use.

## Where each kind of content lives

| Content | Edit in | Local file (fallback / seed) |
| --- | --- | --- |
| Name, headline, introduction, biography, focus areas, domains, stats, location, availability, email, photo, coursework | Studio → Identity & site → Home & profile | `data/profile.ts`, `data/education.ts` (coursework) |
| Site title, description, keywords, header navigation, footer text and footer links | Studio → Identity & site → Site settings | `data/site.ts`, `data/site.ts` (`navItems`) |
| Resume download | Studio → Identity & site → Resume (PDF upload) | `public/documents/Naga_Sekhar_Madala_Resume.pdf` |
| Professional links (profiles, code, demos, publications) | Studio → Identity & site → Professional links | `data/links.ts` |
| Engineering, Applied AI, Data & ML page text and selected projects | Studio → Discipline pages → (page) | `data/disciplines.ts` |
| Capability themes (evidence on discipline pages) | Studio → Discipline pages → Capability themes | `data/capabilities.ts` |
| Skills and toolbox | Studio → Discipline pages → Skills | `data/skills.ts` |
| Projects and case studies | Studio → Projects | `data/projects.ts` |
| Project categories | Studio → Projects → By category / Categories | `data/projects.ts` (`projectCategories`) |
| Work experience | Studio → Experience | `data/experience.ts` |
| Publications, datasets, books, patents | Studio → Research & publications | `data/research.ts`, `data/publications.ieee.ts` |
| Education, certifications, achievements | Studio → Education & credentials | `data/education.ts`, `data/certifications.ts`, `data/achievements.ts` |
| Articles | Studio → Writing | `data/articles.ts` (currently empty) |
| Public route labels for the menu and footer | **code only** | `data/routes.ts` |
| Link group titles on the About and Research pages | **code only** | `data/links.ts` (`linkGroups`) |

Content maintained only in code: `data/routes.ts` and the group titles in `data/links.ts`. Changing them is a code change (see CLAUDE.md for the workflow).

Content that is not stored on the site: the contact form does not save messages. It opens the visitor's email app with a pre-filled message.

## Sanity editing: the common tasks

### Add a job (Experience)
1. Studio → **Experience** → **Create**.
2. Fill in role, company, location, start and end (for example `Jan 2026` and `Present`), an optional note, a short context sentence, highlights and technologies.
3. Put the newest job first (drag to reorder).
4. Publish.

Highlights: the first three show by default. The rest expand behind "Show more". Write outcomes you can support with evidence. Do not invent figures.

### Add a project
1. Studio → **Projects** → **Create** (or Quick create → New project).
2. Fill in:
   - **Title** and **slug** (click *Generate*). The slug becomes the page address `/projects/<slug>`. Changing a slug changes the URL.
   - **Category** — pick an existing project category.
   - **Summary** — one sentence shown in lists.
   - **Highlights** and **Technologies**.
   - **Featured** — ticked projects appear in the Home page and the Featured filter.
   - **Status** (Live or In Progress) and an optional **badge** line.
3. On the **Write-up** tab, add a detailed description using rich text (headings, lists, links, images).
4. On the **Images & links** tab, upload screenshots (alt text required) and add links such as GitHub or a live demo.
5. Publish.

Only link repositories and demos you own or are allowed to publish. Confirm each URL opens before publishing.

### Edit the home page and biography
Studio → **Home & profile**. The first biography paragraph is shown larger. The four **Areas of focus** on the home page each link to a discipline page through their `href`.

### Change the header menu or footer
Studio → **Site settings**:
- **Header navigation:** each item has a page and a label. Order is the menu order. Pages available: About, Engineering, Applied AI, Data & ML, Projects, Research, Experience, Writing.
- **Footer links:** pick professional links to show in the footer.
- **SEO title and description:** used by search engines and social previews.

### Add a publication
1. Studio → **Research & publications** → **Create**.
2. Choose the type (journal, conference, dataset, book, patent or research).
3. Enter the **exact title** as published, the authors as printed (your name is highlighted automatically), venue, year, and the **DOI** (for example `10.xxxx/xxxxx`, without `https://doi.org/`). The DOI link is built for you.
4. Add other links (for example a PDF or a repository) if you have verified them.
5. Publish.

Enter only details you have verified against the publisher's record or your own copy. To check metadata for a DOI, open `https://api.crossref.org/works/<doi>`.

### Add a certification
Studio → **Education & credentials → Certifications**. Add a group (for example "Cloud") and add items with the name and issuer. Create a new group for a new category.

### Add an achievement or award
Studio → **Education & credentials → Achievements**. Give it a title, optional detail and a year or date label.

### Add or update skills
Studio → **Discipline pages → Skills**. Each skill category has a title and a list of skills. The categories appear in the toolbox on the discipline pages that reference them.

### Write an article
1. Studio → **Writing** → **Create**.
2. Enter title, slug, summary, publish date and where it appears (for example "This site").
3. Either write the article body (rich text) for a hosted article at `/writing/<slug>`, or paste an **External URL** to link to an article hosted elsewhere. Do not fill both.
4. Publish.

Hosted articles appear on the Writing page and at their own address. External articles link out in a new tab.

### Replace the resume
Studio → **Resume (PDF upload)** → upload the file → Publish. Check the download from `/about` or `/contact` after publishing.

### Preview before publishing
Studio → **Preview**. It shows the site with your drafts. Requires the Viewer token (see CMS_SETUP.md §5 and §10).

## Local `data/` files (developer reference)

Use these only when you are editing the fallback or seed content, or when the site is not connected to Sanity. Every file exports typed arrays; the types are in `data/types.ts`.

Examples of the shapes (abbreviated):

```ts
// data/experience.ts — newest first
{
  id: "acme",                      // unique, lowercase, no spaces
  role: "Senior Software Engineer",
  company: "Acme Corp",
  location: "Atlanta, GA",
  start: "Mar 2027",
  end: "Present",
  context: "One sentence about the team or company.",
  highlights: ["Outcome-first bullet", "Another bullet"],
  tech: ["Python", "Kafka"],
}
```

```ts
// data/projects.ts
{
  id: "my-project",                 // becomes /projects/my-project
  title: "My Project",
  category: "AI Agents & LLMs",     // must be one of projectCategories in the same file
  featured: true,
  status: "Live",                   // optional: "Live" | "In Progress"
  summary: "One-sentence summary.",
  highlights: ["Metric-backed bullet"],
  tech: ["Python", "FastAPI"],
  description: ["Optional longer paragraph."],
  images: [{ src: "/images/projects/my-project-1.png", alt: "What the image shows", width: 1600, height: 900 }],
  links: [{ label: "GitHub", href: "https://github.com/<owner>/my-project" }],
}
```

```ts
// data/research.ts
{
  id: "my-paper",
  type: "journal",                  // journal | conference | dataset | book | patent | research
  title: "Exact title",
  authors: ["Author One", "Naga Sekhar Madala"],
  venue: "Journal name",
  year: "2027",
  doi: "10.xxxx/xxxxx",             // bare DOI
}
```

```ts
// data/links.ts — group: research | publications | code | demos | writing
{ id: "github", group: "code", label: "GitHub", mark: "GH", href: "https://github.com/<owner>", description: "Source code." }
```

```ts
// data/profile.ts — discipline entry points use these hrefs
disciplines: [{ title: "Software Engineering", description: "…", href: "/engineering" }, /* … */]
```

Other files:
- `data/skills.ts` — `skillGroups`: `{ id, title, skills: [] }`.
- `data/certifications.ts` — `certificationGroups`: `{ id, title, items: [{ name, issuer? }] }`.
- `data/achievements.ts` — `achievements`: `{ id, title, detail?, year? }`.
- `data/articles.ts` — `articles`: `{ id, title, summary, date (YYYY-MM-DD), publication, href? or slug + body? }`.
- `data/education.ts` — `education` and `coursework`.
- `data/capabilities.ts` and `data/disciplines.ts` — discipline evidence and page copy.
- `data/routes.ts` — public routes for the menu and footer (code-only content).

After editing `data/`, run `npm run check`. The `cms:verify` step compares the CMS mapping with `data/`; if you have seeded, the comparison still runs against the seed documents built from `data/`.

## Rules that apply to all content
- Do not enter or publish details you cannot verify (titles, dates, metrics, publications, awards, URLs).
- Do not add references to external profile networks that the owner has chosen not to link.
- Do not include private contact details beyond what the owner has approved for publication.
- Use the same spelling of your name everywhere.
- Images need alt text that describes the image's content.
