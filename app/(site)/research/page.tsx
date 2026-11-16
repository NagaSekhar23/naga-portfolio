import { pageMetadata } from "@/lib/seo";
import { ResearchView } from "@/components/pages/ResearchView";

export function generateMetadata() {
  return pageMetadata({ path: "/research", title: "Research", description: "Publications, datasets, patents and research profiles." });
}

export default function Page() {
  return <ResearchView />;
}
