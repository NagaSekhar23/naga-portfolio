import Link from "next/link";
import type { Project } from "@/data/types";
import { TagList } from "@/components/ui/Tag";

/** Project preview used on Home, discipline pages and the directory. */
export function ProjectCard({ project, href, size = "md" }: { project: Project; href: string; size?: "md" | "lg" }) {
  return (
    <Link href={href} className="group flex h-full flex-col p-6 transition-colors hover:bg-surface sm:p-8">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="label">{project.category}</span>
        {project.status && <span className="font-mono text-[10px] uppercase tracking-wider text-accent">● {project.status}</span>}
      </div>
      <h3 className={`mt-4 font-semibold leading-snug tracking-tight transition-colors group-hover:text-accent ${size === "lg" ? "text-2xl" : "text-xl"}`}>
        {project.title}
      </h3>
      {project.badge && <p className="mt-1.5 text-sm font-medium text-accent">{project.badge}</p>}
      <p className="mt-3 text-[15px] leading-relaxed text-muted">{project.summary}</p>
      {project.highlights[0] && size === "lg" && (
        <p className="mt-4 border-l border-line-strong pl-4 text-sm leading-relaxed text-foreground/80">{project.highlights[0]}</p>
      )}
      <div className="mt-auto flex items-end justify-between gap-4 pt-6">
        <TagList items={project.tech} limit={4} label={`Technologies in ${project.title}`} />
        <span aria-hidden="true" className="text-lg text-subtle transition-transform duration-200 group-hover:translate-x-1 group-hover:text-accent">→</span>
      </div>
    </Link>
  );
}
