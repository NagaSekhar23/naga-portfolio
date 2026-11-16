import type { Metadata } from "next";
import { ArticleView } from "@/components/pages/ArticleView";
import { getArticles } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const slugs = (await getArticles()).flatMap((a) => (a.slug ? [{ slug: a.slug }] : []));
  // Cache Components needs at least one param to validate the route; the placeholder resolves to not-found.
  return slugs.length ? slugs : [{ slug: "_" }];
}

export async function generateMetadata({ params }: PageProps<"/writing/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = (await getArticles()).find((x) => x.slug === slug);
  return a ? pageMetadata({ path: `/writing/${slug}`, title: a.title, description: a.summary }) : {};
}

export default async function Page({ params }: PageProps<"/writing/[slug]">) {
  const { slug } = await params;
  return <ArticleView slug={slug} />;
}
