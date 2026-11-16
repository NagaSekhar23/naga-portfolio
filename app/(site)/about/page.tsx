import { pageMetadata } from "@/lib/seo";
import { AboutView } from "@/components/pages/AboutView";

export function generateMetadata() {
  return pageMetadata({ path: "/about", title: "About", description: "Professional identity and biography of Naga Sekhar Madala." });
}

export default function Page() {
  return <AboutView />;
}
