# Naga Sekhar Madala — Professional identity site

Next.js (App Router) · TypeScript · Tailwind CSS v4 · React 19 · **Sanity CMS** (embedded Studio at `/studio`).

```bash
npm install
npm run dev          # site: http://localhost:3000   CMS: http://localhost:3000/studio
npm run check        # content guard + TypeScript + lint + CMS pipeline verification
npm run cms:doctor   # verify Sanity project, CORS and token permissions
npm run build && npm start
```

- **Architecture & design system:** [ARCHITECTURE.md](ARCHITECTURE.md)
- **First-time CMS setup:** [CMS_SETUP.md](CMS_SETUP.md)
- **Editing content (no code):** [CONTENT_GUIDE.md](CONTENT_GUIDE.md)
- **Open verification items:** [REVIEW_FLAGS.md](REVIEW_FLAGS.md)
- Secrets live only in `.env.local` / Vercel env vars (see `.env.example`). Never commit them.
