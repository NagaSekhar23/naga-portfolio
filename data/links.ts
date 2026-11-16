import type { ProfessionalLink } from "./types";

/**
 * Every professional/external destination, in one place.
 * Add a link by appending an object. `group` controls which block it appears in.
 * Verification notes live in REVIEW_FLAGS.md.
 */
export const professionalLinks: ProfessionalLink[] = [
  // Research profiles
  {
    id: "ieee-xplore",
    group: "research",
    label: "IEEE Xplore",
    mark: "IEEE",
    href: "https://ieeexplore.ieee.org/author/303496562583820",
    description: "Author profile with my IEEE conference papers.",
  },
  {
    id: "google-scholar",
    group: "research",
    label: "Google Scholar",
    mark: "GS",
    href: "https://scholar.google.com/scholar?q=author:%22Naga+Sekhar+Madala%22",
    description: "Search results for publications by Naga Sekhar Madala.",
  },
  {
    id: "zenodo-pharmalchemy",
    group: "research",
    label: "Zenodo — PharmAlchemy dataset",
    mark: "Zn",
    href: "https://zenodo.org/records/15328433",
    description: "Open biomedical data-interoperability dataset (CC BY 4.0).",
  },
  {
    id: "zenodo-book",
    group: "research",
    label: "Zenodo — Intelligent Defenders",
    mark: "Zn",
    href: "https://zenodo.org/records/18531112",
    description: "Open-access book on AI in modern cybersecurity (CC BY 4.0).",
  },
  // Publications
  {
    id: "doi-csbj",
    group: "publications",
    label: "Computational and Structural Biotechnology Journal",
    mark: "DOI",
    href: "https://doi.org/10.1016/j.csbj.2025.10.063",
    description: "Pathway-guided architectures for interpretable AI in biological research.",
  },
  {
    id: "pmc-csbj",
    group: "publications",
    label: "PubMed Central — journal article",
    mark: "PMC",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12636387/",
    description: "Open-access full text of the CSBJ paper.",
  },
  // Code
  {
    id: "github",
    group: "code",
    label: "GitHub",
    mark: "GH",
    href: "https://github.com/NagaSekhar23",
    description: "Source code for projects, experiments and this website.",
  },
  // Live demos
  {
    id: "demo-managerlens",
    group: "demos",
    label: "ManagerLens (live)",
    mark: "↗",
    href: "https://managerlens-eta.vercel.app/",
    description: "Evidence-grounded AI manager agent.",
  },
  {
    id: "demo-otmos",
    group: "demos",
    label: "otmOS (live)",
    mark: "↗",
    href: "https://otmos-web.vercel.app",
    description: "Operations toolbox for Oracle Transportation Management.",
  },
];

export const linkGroups: { id: ProfessionalLink["group"]; title: string; blurb: string }[] = [
  { id: "research", title: "Research profiles", blurb: "Where my academic work is indexed and archived." },
  { id: "publications", title: "Publications", blurb: "Direct, DOI-resolved links." },
  { id: "code", title: "Code", blurb: "Open source and project repositories." },
  { id: "demos", title: "Live demonstrations", blurb: "Running applications." },
  { id: "writing", title: "Writing", blurb: "Articles and technical writing." },
];
