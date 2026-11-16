import type { ReactNode } from "react";
import { Wrap } from "./Wrap";

interface Props {
  eyebrow: string;
  title: string;
  lede?: string;
  children?: ReactNode;
}

/** Top of every inner page: label, large display title, lede, optional actions. */
export function PageHeader({ eyebrow, title, lede, children }: Props) {
  return (
    <header className="border-b border-line">
      <Wrap className="pb-14 pt-32 md:pb-20 md:pt-44">
        <p className="label enter" style={{ "--i": 0 } as React.CSSProperties}>{eyebrow}</p>
        <h1 className="display display-page enter mt-5 max-w-4xl" style={{ "--i": 1 } as React.CSSProperties}>{title}</h1>
        {lede && (
          <p className="lede enter mt-6 max-w-2xl" style={{ "--i": 2 } as React.CSSProperties}>{lede}</p>
        )}
        {children && <div className="enter mt-9" style={{ "--i": 3 } as React.CSSProperties}>{children}</div>}
      </Wrap>
    </header>
  );
}
