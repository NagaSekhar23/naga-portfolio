"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./Header";

type Props = Omit<Parameters<typeof SiteHeader>[0], "path">;

/**
 * Reads the URL (pathname) and renders the header with the current page marked.
 * Must sit inside a <Suspense> boundary (see app/(site)/layout.tsx): usePathname is URL data.
 */
export function CurrentHeader(props: Props) {
  const pathname = usePathname() ?? "/";
  return <SiteHeader {...props} path={pathname} />;
}
