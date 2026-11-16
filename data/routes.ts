/**
 * Public route map. Routes themselves live in code (app/(site)/…); this file only holds
 * their display labels/descriptions for the menu, footer and Studio links.
 */
export interface RouteInfo {
  href: string;
  label: string;
  description: string;
}

export const routes: RouteInfo[] = [
  { href: "/about", label: "About", description: "Professional identity and biography" },
  { href: "/engineering", label: "Engineering", description: "Distributed systems and software engineering" },
  { href: "/applied-ai", label: "Applied AI", description: "LLM applications, agents and AI engineering" },
  { href: "/data-ml", label: "Data & ML", description: "Data science and machine learning" },
  { href: "/projects", label: "Projects", description: "Case studies and project directory" },
  { href: "/research", label: "Research", description: "Publications, datasets and patents" },
  { href: "/experience", label: "Experience", description: "Career history" },
  { href: "/education", label: "Education", description: "Academic background and credentials" },
  { href: "/writing", label: "Writing", description: "Articles and insights" },
  { href: "/contact", label: "Contact", description: "Get in touch" },
];

export const routeLabel = (href: string) => routes.find((r) => r.href === href)?.label ?? href;
