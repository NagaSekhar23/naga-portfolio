import { pageMetadata } from "@/lib/seo";
import { ContactView } from "@/components/pages/ContactView";

export function generateMetadata() {
  return pageMetadata({ path: "/contact", title: "Contact", description: "Get in touch about roles, research collaboration and projects." });
}

export default function Page() {
  return <ContactView />;
}
