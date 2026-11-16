import Link from "next/link";
import type { CapabilityTheme, ExperienceItem, Project } from "@/data/types";
import { hrefTo } from "@/lib/paths";

interface Props {
  themes: CapabilityTheme[];
  projects: Project[];
  experience: ExperienceItem[];
}

/** Capability themes: left = title + summary, right = sourced work with links to case studies. */
export function ThemeList({ themes, projects, experience }: Props) {
  const projectById = new Map(projects.map((p) => [p.id, p]));
  const roleById = new Map(experience.map((e) => [e.id, e]));
  return (
    <div className="divide-y divide-line border-y border-line">
      {themes.map((t) => (
        <article key={t.id} id={t.id} aria-labelledby={`${t.id}-title`} className="reveal grid gap-6 py-10 md:grid-cols-[minmax(0,17rem)_1fr] md:gap-14">
          <header className="md:sticky md:top-24 md:self-start">
            <h3 id={`${t.id}-title`} className="text-lg font-semibold leading-snug tracking-tight">{t.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{t.summary}</p>
          </header>
          <ul className="space-y-7">
            {t.items.map((item) => {
              const projs = (item.projectIds ?? []).map((id) => projectById.get(id)).filter((p): p is Project => Boolean(p));
              const role = item.experienceId ? roleById.get(item.experienceId) : undefined;
              return (
                <li key={item.text}>
                  <p className="text-[16px] leading-[1.7]">{item.text}</p>
                  {(projs.length > 0 || role) && (
                    <p className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-muted">
                      {role && (
                        <Link href={hrefTo("/experience")} className="hover:text-accent">
                          <span className="label mr-1.5">Role</span>
                          {role.role}, {role.company}
                        </Link>
                      )}
                      {projs.map((p) => (
                        <Link key={p.id} href={hrefTo(`/projects/${p.id}`)} className="underline decoration-line-strong underline-offset-4 hover:text-accent hover:decoration-accent">
                          <span className="label mr-1.5 no-underline">Project</span>
                          {p.title} →
                        </Link>
                      ))}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </article>
      ))}
    </div>
  );
}
