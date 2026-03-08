import type { ReactNode } from "react";

interface TypeLabelProps {
  token: string;
  size: number;
  children: ReactNode;
  className?: string;
}

export default function TypeLabel({ token, size, children, className = "" }: TypeLabelProps) {
  return (
    <div className={`group/label relative ${className}`}>
      <div className="pointer-events-none absolute -top-5 left-0 z-10 opacity-0 transition-opacity duration-200 group-hover/label:opacity-100">
        <span className="inline-flex items-center gap-1 rounded bg-foreground/90 px-1.5 py-0.5 text-[9px] font-mono font-medium text-background shadow-sm">
          {token.toUpperCase()} · {size}px
        </span>
      </div>
      {children}
    </div>
  );
}
