import type { ReactNode } from "react";
import { AboutView } from "./AboutView";
import { ArticleView } from "./ArticleView";
import { ContactView } from "./ContactView";
import { DisciplineView } from "./DisciplineView";
import { EducationView } from "./EducationView";
import { ExperienceView } from "./ExperienceView";
import { HomeView } from "./HomeView";
import { ProjectView } from "./ProjectView";
import { ProjectsView } from "./ProjectsView";
import { ResearchView } from "./ResearchView";
import { WritingView } from "./WritingView";

/** Maps a path (without leading slash) to its page view. Used by the draft-preview route. */
export function resolvePage(path: string[]): ReactNode | null {
  const [a, b] = path;
  if (path.length === 0) return <HomeView />;
  if (path.length === 1) {
    switch (a) {
      case "about": return <AboutView />;
      case "engineering": return <DisciplineView area="engineering" />;
      case "applied-ai": return <DisciplineView area="applied-ai" />;
      case "data-ml": return <DisciplineView area="data-ml" />;
      case "projects": return <ProjectsView />;
      case "research": return <ResearchView />;
      case "experience": return <ExperienceView />;
      case "education": return <EducationView />;
      case "writing": return <WritingView />;
      case "contact": return <ContactView />;
    }
  }
  if (path.length === 2 && a === "projects") return <ProjectView slug={b} />;
  if (path.length === 2 && a === "writing") return <ArticleView slug={b} />;
  return null;
}
