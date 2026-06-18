import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";

/**
 * Hero — Home, section 1.  PROVIDED anchor @DT (Figma "Home | 1440px" 659:18740,
 * "Hero content" 659:19144).  Pixel-matched to the 1440 frame:
 *   • content max-width 1320, 60px side gutters (centered in 1440)
 *   • Hero gradient = full-bleed 800px-tall vertical gradient behind nav (nav overlays
 *     its top 90px); exact 5-stop --gradient-hero (read from 659:18750)
 *   • copy column starts 250px from page top; headline → description (gap 30) → 140px
 *     gap → subheading (gap 18) → two CTAs (gap 14)
 *
 * STATUS / known gaps (see chunks/SC-home-hero/investigation.md):
 *   ⛔ Headline uses Ivar Text Italic (line 1) + Satoshi Medium (line 2) — both owner-
 *      blocked font files (hasMissingFont in Figma too). Renders in fallbacks (serif /
 *      Work Sans) until the faces are supplied; tokens/tracking are already correct so it
 *      becomes faithful the moment the fonts load. (D-015)
 *   🖼  Hero illustration (659:19115) exported via MCP → /public/home/hero-illustration.png
 *      (transparent PNG@3x; WebP optimization is a later perf follow-up).
 *   ✨ No animations yet — fidelity-first; GSAP reveal is a later motion pass.
 *   🌫 Atmospheric blur blobs + Main Vector belong to the background-system component
 *      (deferred); only the base hero gradient is here.
 */
export function Hero() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Hero gradient — full-bleed, 800px tall (659:18750). Nav (fixed) overlays the top. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[800px] bg-[image:var(--gradient-hero)]"
      />

      <Container className="relative min-h-[800px]">
        {/* Main Vector — Figma "Main Vector" 659:18769, the page-spanning connector. Its TOP
            segment is the sphere's 5th track (the other 4 live in the sphere asset). Placed at
            its frame coords (content-x 102 = frame 162, y 488) BEHIND the sphere so it reads as
            emerging from it; the section's overflow-hidden clips it to the hero for now. As the
            page's lower sections are built this is promoted to a full-page background layer. */}
        <Image
          src="/home/main-vector.svg"
          alt=""
          aria-hidden
          width={1014}
          height={7869}
          unoptimized
          className="pointer-events-none absolute left-[102px] top-[488px] z-0 hidden max-w-none lg:block"
        />

        {/* Illustration — Figma "Hero img" 659:19115 (636×726), exported via MCP. Anchored to
            the frame coords: left edge at content-x 769 (= frame x 829), top -31 (bleeds above /
            past 1440; the section's overflow-hidden clips it exactly as Figma does). Decorative. */}
        <Image
          src="/home/hero-illustration.png"
          alt=""
          aria-hidden
          width={636}
          height={726}
          priority
          className="pointer-events-none absolute left-[769px] top-[-31px] z-[1] hidden h-[726px] w-[636px] max-w-none lg:block"
        />

        {/* Copy column — 778 wide, starts 250px from page top. */}
        <div className="relative z-10 max-w-[778px] pt-[250px]">
          {/* Container A — headline + description (gap 30) */}
          <h1 className="flex flex-col gap-[2px]">
            <span className="font-serif text-h1 italic leading-none tracking-tighter text-ink">
              Tech Philosophy:
            </span>
            <span className="font-display text-h1 font-medium leading-none tracking-tight text-ink">
              Digital solutions studio
            </span>
          </h1>
          <p className="mt-[30px] max-w-[458px] text-body-lg text-ink-muted">
            Technology serves people, processes and measurable outcomes — our philosophy to
            every solution
          </p>

          {/* Container B — subheading + CTAs (140px below A) */}
          <div className="mt-[140px] max-w-[575px]">
            <p className="text-body-lg font-medium text-ink">
              Take Control with Secure Digital Systems &amp; AI
            </p>
            <div className="mt-[18px] flex gap-[14px]">
              <Button variant="primary" className="h-[52px] w-[200px] px-0 py-0">
                Get Your Tech Fit
              </Button>
              <Button variant="secondary" className="h-[52px] w-[200px] px-0 py-0">
                See Our Services
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
