import { pageMetadata } from "@/lib/seo";
import { WritingView } from "@/components/pages/WritingView";

export function generateMetadata() {
  return pageMetadata({ path: "/writing", title: "Writing", description: "Articles and insights on engineering and applied AI." });
}

export default function Page() {
  return <WritingView />;
}
