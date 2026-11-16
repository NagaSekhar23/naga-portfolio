# Changelog

All notable changes to this project are recorded here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) — sections for Added, Changed, Deprecated, Removed, Fixed and Security. Newest entries first. Add changes under **Unreleased** as they happen, then move them under a version heading when you release.

## [Unreleased]

### Changed
- Documentation rewritten for AI coding assistants and maintainers: README, CLAUDE.md, AGENTS.md, TECHNICAL_DOCUMENTATION.md, TROUBLESHOOTING.md, CHANGELOG.md, and updates to CONTENT_GUIDE.md, CMS_SETUP.md, DEPLOY.md and ARCHITECTURE.md.

## [1.0.0] — Initial portfolio release — 2026-11-15

Commit `8217988` ("Initial portfolio release"). Recorded from the repository's commit date; no earlier history exists in this repository.

### Added
- Public website with 12 routes: home, about, three discipline pages (Software Engineering, Applied AI, Data & ML), projects directory and case studies, research, experience, education, writing and articles, contact.
- Sanity CMS integration with an embedded Studio at `/studio`: an Overview screen, a sidebar grouped by site section, draft preview, signed revalidation webhook and 16 document types.
- Content access layer that uses Sanity when configured and seeded, and typed local content otherwise.
- Seeding tools with dependency-ordered, idempotent writes, and verification and test scripts.
- SEO: per-page canonical URLs and Open Graph URLs, generated social image, sitemap, robots file and structured data.
- Public resume PDF; the master document is kept outside the public folder.
- Security headers, `noindex` for the Studio and preview, and server-only handling for tokens.
