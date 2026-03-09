import type { ReactNode } from "react";
import type { Unit } from "@/lib/types";

interface TypeLabelProps {
  token: string;
  size: number;
  unit?: Unit;
  children: ReactNode;
  className?: string;
}

function formatSize(px: number, unit?: Unit): string {
  if (!unit || unit === "px") return `${Math.round(px * 100) / 100}px`;
  if (unit === "rem") return `${Math.round((px / 16) * 1000) / 1000}rem`;
  return `${Math.round(px * 0.75 * 100) / 100}pt`;
}

export default function TypeLabel({ token, size, unit, children, className = "" }: TypeLabelProps) {
  return (
    <div className={`group/label relative ${className}`}>
      <div className="pointer-events-none absolute -top-5 left-0 z-10 opacity-0 transition-opacity duration-200 group-hover/label:opacity-100">
        <span className="inline-flex items-center gap-1 rounded bg-foreground/90 px-1.5 py-0.5 text-[9px] font-mono font-medium text-background shadow-sm">
          {token.toUpperCase()} · {formatSize(size, unit)}
        </span>
      </div>
      {children}
    </div>
  );
}
