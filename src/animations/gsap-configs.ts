/**
 * GSAP plugin registration (CH-06).
 * ---------------------------------------------------------------------------
 * Single place that registers the confirmed GSAP plugins (ADR-0003). Imported by
 * the client-side AnimationProvider so registration runs in the browser bundle.
 * registerPlugin itself is SSR-safe (plugins touch window/document only at use,
 * e.g. ScrollSmoother.create / SplitText), so importing this during SSR is fine.
 *
 * Stack: GSAP core + ScrollTrigger + ScrollSmoother + SplitText + @gsap/react.
 * Do NOT add other animation libraries (stack is closed — animation/overview.md).
 */

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText);

export { gsap, useGSAP, ScrollTrigger, ScrollSmoother, SplitText };
