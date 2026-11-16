import type { PortableTextComponents } from "next-sanity";
import Image from "next/image";

/** Renders CMS rich text in the site's style. */
export const portableComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-5 text-[17px] leading-[1.75] text-foreground/90">{children}</p>,
    h2: ({ children }) => <h2 className="display mb-4 mt-12 text-3xl">{children}</h2>,
    h3: ({ children }) => <h3 className="mb-3 mt-9 text-xl font-semibold tracking-tight">{children}</h3>,
    blockquote: ({ children }) => <blockquote className="my-8 border-l-2 border-accent pl-6 text-xl italic leading-relaxed text-muted">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul className="mb-6 list-disc space-y-2 pl-6 text-[17px] leading-[1.7] marker:text-subtle">{children}</ul>,
    number: ({ children }) => <ol className="mb-6 list-decimal space-y-2 pl-6 text-[17px] leading-[1.7] marker:text-subtle">{children}</ol>,
  },
  marks: {
    code: ({ children }) => <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.88em]">{children}</code>,
    link: ({ value, children }) => {
      const href = String(value?.href ?? "#");
      const external = /^https?:\/\//.test(href);
      return (
        <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="underline decoration-line-strong underline-offset-4 hover:text-accent hover:decoration-accent">
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const url = value?.asset?.url as string | undefined;
      const dim = value?.asset?.metadata?.dimensions as { width: number; height: number } | undefined;
      if (!url || !dim) return null;
      return (
        <figure className="my-9">
          <Image src={url} alt={value.alt ?? ""} width={dim.width} height={dim.height} className="h-auto w-full rounded-sm border border-line" />
          {value.caption && <figcaption className="mt-2 text-sm text-subtle">{value.caption}</figcaption>}
        </figure>
      );
    },
  },
};
