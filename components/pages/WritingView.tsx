import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Wrap } from "@/components/ui/Wrap";
import { CtaBand } from "@/components/blocks/CtaBand";
import { getArticles } from "@/lib/content";
import { hrefTo } from "@/lib/paths";

export async function WritingView() {
  const articles = await getArticles();
  return (
    <>
      <PageHeader eyebrow="Writing" title="Articles and insights" lede="Long-form notes on engineering and applied AI." />
      <section className="border-b border-line">
        <Wrap className="py-12 md:py-16">
          {articles.length === 0 ? (
            <div className="border border-dashed border-line-strong p-10">
              <p className="display text-3xl">Articles are in preparation.</p>
              <p className="mt-3 max-w-md text-muted">In the meantime, my long-form technical work is in the papers and books listed under Research.</p>
              <Link href={hrefTo("/research")} className="mt-5 inline-block text-sm font-medium underline decoration-line-strong underline-offset-4 hover:text-accent">View research →</Link>
            </div>
          ) : (
            <ul className="divide-y divide-line border-y border-line">
              {articles.map((a) => (
                <li key={a.id} className="reveal grid gap-1 py-8 md:grid-cols-[10rem_1fr] md:gap-12">
                  <p className="font-mono text-xs text-muted md:pt-1.5"><time dateTime={a.date}>{a.date}</time></p>
                  <div>
                    <h2 className="text-2xl font-semibold leading-snug tracking-tight">
                      {a.slug ? (
                        <Link href={hrefTo(`/writing/${a.slug}`)} className="transition-colors hover:text-accent">{a.title}</Link>
                      ) : (
                        <ExternalLink href={a.href ?? "#"} plain className="no-underline">{a.title}</ExternalLink>
                      )}
                    </h2>
                    <p className="mt-1 text-sm italic text-muted">{a.publication}</p>
                    <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">{a.summary}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Wrap>
      </section>
      <CtaBand />
    </>
  );
}
