import { pageMetadata } from "@/lib/seo";
import { DisciplineView } from "@/components/pages/DisciplineView";

export function generateMetadata() {
  return pageMetadata({ path: "/data-ml", title: "Data Science & Machine Learning", description: "Data pipelines, statistics, machine learning and quantitative research." });
}

export default function Page() {
  return <DisciplineView area="data-ml" />;
}
