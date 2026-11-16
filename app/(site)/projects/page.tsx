import { pageMetadata } from "@/lib/seo";
import { ProjectsView } from "@/components/pages/ProjectsView";

export function generateMetadata() {
  return pageMetadata({ path: "/projects", title: "Projects", description: "Case studies and a directory of production systems, AI agents, research tools and quantitative models." });
}

export default function Page() {
  return <ProjectsView />;
}
