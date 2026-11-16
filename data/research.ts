import type { Publication } from "./types";
import { ieeePapers } from "./publications.ieee";

/**
 * All research output. `doi` entries get a doi.org link automatically.
 * Items marked "Unverified" in `note` come from the master resume only and could not be
 * confirmed against a public source — see REVIEW_FLAGS.md.
 */
export const publications: Publication[] = [
  {
    id: "csbj-2025",
    type: "journal",
    title: "Pathway-guided architectures for interpretable AI in biological research",
    authors: ["Qi Zhou", "Naga Sekhar Madala", "Chen Huang"],
    venue: "Computational and Structural Biotechnology Journal",
    publisher: "Elsevier",
    year: "2025",
    doi: "10.1016/j.csbj.2025.10.063",
    links: [{ label: "PubMed Central", href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12636387/" }],
  },
  ...ieeePapers,
  {
    id: "pharmalchemy",
    type: "dataset",
    title: "Metadata & Ontology Standardization for Enhanced Data Interoperability in PharmAlchemy",
    authors: ["Naga Sekhar Madala"],
    venue: "Zenodo",
    year: "2025",
    date: "May 2025",
    doi: "10.5281/zenodo.15328433",
    note: "Open dataset, CC BY 4.0.",
  },
  {
    id: "book-intelligent-defenders",
    type: "book",
    title: "Intelligent Defenders: Artificial Intelligence in Modern Cybersecurity",
    authors: ["Naga Sekhar Madala"],
    venue: "Zenodo",
    year: "2025",
    date: "Dec 2025",
    doi: "10.5281/zenodo.18531112",
    note: "Open access, CC BY 4.0.",
  },
  {
    id: "book-next-gen-cybersecurity",
    type: "book",
    title: "Next-Generation Cybersecurity: AI, Machine Learning, and Zero-Trust Network Defense",
    authors: ["Naga Sekhar Madala"],
    note: "Listed on resume. No public record found yet — add a link when available.",
  },
  {
    id: "patent-supply-chain",
    type: "patent",
    title: "AI-Based Software Supply Chain Risk Detection and Automated Dependency Security Management System",
    venue: "Indian Patent Office",
    note: "Application · individual",
  },
  { id: "patent-repeater", type: "patent", title: "AI-Based Secure Network Repeater", note: "Application" },
  {
    id: "patent-infra",
    type: "patent",
    title: "AI-Powered Cybersecurity Architecture for Critical Infrastructure Resilience",
    note: "Application",
  },
  { id: "patent-monitor", type: "patent", title: "AI-Based Cybersecurity Monitoring Device", note: "Application" },
  {
    id: "patent-blockchain",
    type: "patent",
    title: "Blockchain-Enabled Device for Improved Computer Network Security",
    note: "Application",
  },
];
