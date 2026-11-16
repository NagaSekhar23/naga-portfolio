import type { Metadata } from "next";
import { ProjectView } from "@/components/pages/ProjectView";
import { getProject, getProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProject(slug);
  return p ? pageMetadata({ path: `/projects/${p.id}`, title: p.title, description: p.summary }) : {};
}

export default async function Page({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  return <ProjectView slug={slug} />;
}
