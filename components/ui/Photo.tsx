import Image from "next/image";
import type { ImageAsset } from "@/data/types";

/** Portrait frame. Shows the photo when set in the CMS (Home & profile), else a monogram. */
export function Photo({ photo, name }: { photo?: ImageAsset; name: string }) {
  const initials = name.split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("");
  return (
    <figure className="relative aspect-[4/5] w-full overflow-hidden rounded-sm border border-line bg-surface-2">
      {photo ? (
        <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} priority sizes="(min-width: 1024px) 22rem, 70vw" className="h-full w-full object-cover" />
      ) : (
        <div role="img" aria-label={`${name} — portrait placeholder`} className="flex h-full w-full flex-col items-center justify-center gap-3">
          <span className="display text-[7rem] italic text-subtle">{initials}</span>
        </div>
      )}
    </figure>
  );
}
