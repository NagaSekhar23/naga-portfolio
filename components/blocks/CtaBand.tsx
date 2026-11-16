import { Wrap } from "@/components/ui/Wrap";
import { getProfile, getSite } from "@/lib/content";
import { hrefTo } from "@/lib/paths";

/** Closing call-to-action reused at the bottom of inner pages. */
export async function CtaBand({ title = "Let’s build something dependable." }: { title?: string }) {
  const [profile, site] = await Promise.all([getProfile(), getSite()]);
  return (
    <section className="bg-foreground text-background">
      <Wrap className="grid gap-8 py-16 md:grid-cols-[1.4fr_1fr] md:items-end md:py-24">
        <div>
          <p className="label !text-background/60">Contact</p>
          <h2 className="display display-section mt-3 max-w-xl">{title}</h2>
          <p className="mt-4 max-w-md text-background/70">{profile.availability}.</p>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <a href={hrefTo("/contact")} className="inline-flex rounded-md bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-opacity hover:opacity-85">
            Get in touch
          </a>
          <a href={site.resumeHref} download className="inline-flex rounded-md border border-background/30 px-5 py-2.5 text-sm font-medium text-background transition-colors hover:border-background">
            Download resume
          </a>
        </div>
      </Wrap>
    </section>
  );
}
