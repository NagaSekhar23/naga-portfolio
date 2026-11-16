import { pageMetadata } from "@/lib/seo";
import { EducationView } from "@/components/pages/EducationView";

export function generateMetadata() {
  return pageMetadata({ path: "/education", title: "Education & Credentials", description: "Degrees, certifications and awards." });
}

export default function Page() {
  return <EducationView />;
}
