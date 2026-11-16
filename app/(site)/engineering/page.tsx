import { pageMetadata } from "@/lib/seo";
import { DisciplineView } from "@/components/pages/DisciplineView";

export function generateMetadata() {
  return pageMetadata({ path: "/engineering", title: "Software Engineering", description: "Distributed systems, APIs and platforms built to run in production." });
}

export default function Page() {
  return <DisciplineView area="engineering" />;
}
