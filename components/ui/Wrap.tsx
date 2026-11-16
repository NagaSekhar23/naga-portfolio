import type { ReactNode } from "react";

/** Page-width container: 1200px max, fluid gutters. */
export function Wrap({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-10 ${className}`}>{children}</div>;
}
