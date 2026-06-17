"use client";

/**
 * AnimationProvider / SmoothScroller (CH-06).
 * ---------------------------------------------------------------------------
 * Mounted ONCE at the root layout. Wraps page content in the markup ScrollSmoother
 * requires (#smooth-wrapper > #smooth-content) and creates the smoother inside
 * useGSAP (auto-teardown via gsap context). ScrollTrigger reads ScrollSmoother
 * natively — no raf loop, no scrollerProxy (animation/architecture.md §Init Flow).
 *
 * The reveal/text/parallax hooks and page-transition timelines are NOT here —
 * they land in CH-14. This is infrastructure only.
 */

import { useRef } from "react";
import { usePathname } from "next/navigation";
import {
  gsap,
  useGSAP,
  ScrollSmoother,
  ScrollTrigger,
} from "@/animations/gsap-configs";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const pathname = usePathname();

  // ANIMATION: Global page smooth-scroll (app-wide)
  // LIBRARY: ScrollSmoother
  // FIGMA REF: n/a — infrastructure; `smooth` feel value tuned with owner in CH-14
  // TIMING: smooth=1.2s catch-up · smoothTouch=false (native scroll on touch) · effects=true (data-speed/data-lag)
  useGSAP(
    () => {
      // Reduced motion → no smoothing; the browser uses native scroll.
      if (reduced) return;
      const smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.2,
        effects: true,
        smoothTouch: false,
      });
      return () => {
        smoother.kill();
      };
    },
    { dependencies: [reduced], scope: wrapperRef },
  );

  // On client-side route change: reset scroll to top and recalc triggers
  // (content height changed). Old per-page ScrollTriggers are cleaned by their
  // own components' useGSAP teardown (CH-14).
  useGSAP(
    () => {
      ScrollSmoother.get()?.scrollTo(0, false);
      ScrollTrigger.refresh();
    },
    { dependencies: [pathname] },
  );

  // Reference gsap so the registration side-effect import is retained by bundlers.
  void gsap;

  return (
    <div id="smooth-wrapper" ref={wrapperRef}>
      <div id="smooth-content">{children}</div>
    </div>
  );
}
