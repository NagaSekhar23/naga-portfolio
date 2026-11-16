"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/data/types";
import { ProjectCard } from "./ProjectCard";

type Sort = "curated" | "az";

/** Searchable, filterable, sortable project directory. `base` keeps links inside /preview when previewing. */
export function ProjectsExplorer({ projects, categories, base }: { projects: Project[]; categories: string[]; base: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<Sort>("curated");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = projects.filter((p) => (category === "All" || p.category === category) && (!q || `${p.title} ${p.summary} ${p.tech.join(" ")} ${p.category}`.toLowerCase().includes(q)));
    if (sort === "az") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [projects, query, category, sort]);

  const countIn = (c: string) => (c === "All" ? projects.length : projects.filter((p) => p.category === c).length);
  const field = "rounded-md border border-line-strong bg-surface px-3.5 py-2 text-sm outline-none transition-colors focus:border-accent";

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-wrap gap-2" role="group" aria-label="Filter by category">
          {["All", ...categories].map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
              className={`rounded-md border px-3 py-1.5 text-[13px] transition-colors ${category === c ? "border-foreground bg-foreground text-background" : "border-line-strong text-muted hover:border-foreground hover:text-foreground"}`}
            >
              {c} <span className="opacity-60">{countIn(c)}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="sr-only" htmlFor="project-search">Search projects</label>
          <input id="project-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects…" className={`${field} w-full sm:w-56`} />
          <label className="sr-only" htmlFor="project-sort">Sort projects</label>
          <select id="project-sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={field}>
            <option value="curated">Curated order</option>
            <option value="az">Title A–Z</option>
          </select>
        </div>
      </div>

      <p className="py-5 font-mono text-xs text-subtle" role="status" aria-live="polite">
        {results.length} {results.length === 1 ? "project" : "projects"}
        {query && ` matching “${query}”`}
      </p>

      {results.length === 0 ? (
        <p className="border border-dashed border-line-strong p-10 text-center text-muted">No projects match. Try a different search or category.</p>
      ) : (
        <ul className="hairline-grid md:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => (
            <li key={p.id}>
              <ProjectCard project={p} href={`${base}/projects/${p.id}`} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
