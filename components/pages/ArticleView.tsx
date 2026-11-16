import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { portableComponents } from "@/components/ui/PortableTextComponents";
import { Wrap } from "@/components/ui/Wrap";
import { CtaBand } from "@/components/blocks/CtaBand";
import { getArticles } from "@/lib/content";

export async function ArticleView({ slug }: { slug: string }) {
  const article = (await getArticles()).find((a) => a.slug === slug);
  if (!article || !article.body) notFound();
  return (
    <>
      <article>
        <header className="border-b border-line">
          <Wrap className="max-w-3xl pb-12 pt-32 md:pt-40">
            <ArrowLink href="/writing" className="[&>span]:order-first [&>span]:rotate-180">All writing</ArrowLink>
            <p className="label mt-10"><time dateTime={article.date}>{article.date}</time> · {article.publication}</p>
            <h1 className="display display-page mt-4">{article.title}</h1>
            <p className="lede mt-6">{article.summary}</p>
          </Wrap>
        </header>
        <Wrap className="max-w-3xl py-14 md:py-20">
          <PortableText value={article.body} components={portableComponents} />
        </Wrap>
      </article>
      <CtaBand />
    </>
  );
}
