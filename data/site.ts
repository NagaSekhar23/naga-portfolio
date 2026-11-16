import { siteUrl } from "@/lib/site-url";
import type { SiteConfig } from "./types";

export const site: SiteConfig = {
  name: "Naga Sekhar Madala",
  title: "Naga Sekhar Madala — Software & AI Engineer, Researcher",
  description:
    "Professional profile of Naga Sekhar Madala: software and AI engineer, peer-reviewed researcher and author. Experience, projects, publications and research profiles in one place.",
  // Set NEXT_PUBLIC_SITE_URL in Vercel to your custom domain (see DEPLOY.md).
  url: siteUrl(),
  resumeHref: "/documents/Naga_Sekhar_Madala_Resume.pdf",
  resumeLabel: "Download resume (PDF)",
  keywords: [
    "Software Engineer",
    "AI Engineer",
    "ML Engineer",
    "Data Engineer",
    "Distributed Systems",
    "LLM Applications",
    "Research Publications",
    "Quantitative Research",
  ],
};

export interface NavItem {
  href: string;
  label: string;
}

/** Primary header navigation (order = menu order). Contact is a separate call-to-action. */
export const navItems: NavItem[] = [
  { href: "/about", label: "About" },
  { href: "/engineering", label: "Engineering" },
  { href: "/applied-ai", label: "Applied AI" },
  { href: "/data-ml", label: "Data & ML" },
  { href: "/projects", label: "Projects" },
  { href: "/research", label: "Research" },
  { href: "/experience", label: "Experience" },
  { href: "/writing", label: "Writing" },
];
