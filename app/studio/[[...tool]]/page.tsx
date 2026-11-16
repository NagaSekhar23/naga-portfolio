import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export { metadata, viewport } from "next-sanity/studio";

// Studio generateStaticParams: one static shell; the Studio router handles sub-paths client-side.
export function generateStaticParams() {
  return [{ tool: [] as string[] }];
}

export default function StudioPage() {
  return <NextStudio config={config} />;
}
