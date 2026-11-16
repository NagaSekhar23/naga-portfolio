import { pageMetadata } from "@/lib/seo";
import { ExperienceView } from "@/components/pages/ExperienceView";

export function generateMetadata() {
  return pageMetadata({ path: "/experience", title: "Experience", description: "Career history across software engineering, applied AI and research." });
}

export default function Page() {
  return <ExperienceView />;
}
