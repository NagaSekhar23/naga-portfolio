import { pageMetadata } from "@/lib/seo";
import { DisciplineView } from "@/components/pages/DisciplineView";

export function generateMetadata() {
  return pageMetadata({ path: "/applied-ai", title: "Applied AI", description: "LLM applications, agents and AI engineering, built, measured and shipped." });
}

export default function Page() {
  return <DisciplineView area="applied-ai" />;
}
