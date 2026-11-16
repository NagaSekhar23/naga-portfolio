import { PageHeader } from "@/components/ui/PageHeader";
import { Wrap } from "@/components/ui/Wrap";
import { ProjectsExplorer } from "@/components/blocks/ProjectsExplorer";
import { CtaBand } from "@/components/blocks/CtaBand";
import { getProjectCategories, getProjects } from "@/lib/content";
import { hrefTo } from "@/lib/paths";

export async function ProjectsView() {
  const [projects, categories] = await Promise.all([getProjects(), getProjectCategories()]);
  // Keep only categories that have projects, in CMS order; add any stray categories.
  const used = new Set(projects.map((p) => p.category));
  const cats = [...categories.filter((c) => used.has(c)), ...[...used].filter((c) => !categories.includes(c))];
  return (
    <>
      <PageHeader eyebrow="Projects" title="Project directory" lede="Production systems, AI agents, research tools and quantitative models. Open any project for its case study." />
      <section className="border-b border-line">
        <Wrap className="py-12 md:py-16">
          <ProjectsExplorer projects={projects} categories={cats} base={hrefTo("/").replace(/\/$/, "")} />
        </Wrap>
      </section>
      <CtaBand />
    </>
  );
}
