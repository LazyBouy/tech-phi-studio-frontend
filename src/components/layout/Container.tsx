import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Container — the shared content grid (global chrome primitive).
 *
 * Figma "Full page" lays every page on a **1320px content column centered in the 1440
 * frame with 60px side gutters**. Capping at 1440 and centering keeps the nav, hero, and
 * every section locked to the SAME left/right grid lines at any viewport ≥1440 — without
 * this, a full-width nav and a centered hero drift apart on wide screens (logo ≠ headline,
 * sphere ≠ CTA). Mobile gutter is 16px until the @MP anchor refines it.
 *
 * (Desktop-wide >1440: fluid-to-~1600-then-cap is layered on at the DW version; the 1440
 * cap here is already correct for the DT anchor and aligns everything meanwhile.)
 */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("mx-auto w-full max-w-[1440px] px-4 md:px-[60px]", className)}>
      {children}
    </div>
  );
}
