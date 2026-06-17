"use client";

/**
 * Navigation (CH-07) — sticky/fixed top site nav, rendered OUTSIDE ScrollSmoother
 * (a layout sibling) so the smoother's transform doesn't fight `position: fixed`.
 * Figma: Header bar desktop 659:18739, mobile 659:22567. Transparent background
 * (overlays page/hero); translucent CTA. Mobile: logo + CTA + 2×2-dot burger →
 * full-screen overlay menu (stateful). Active route via usePathname.
 *
 * Hover/active are CSS transitions only (no GSAP) per animation/overview.md.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/layout/Logo";
import { SocialLinks, LanguageSwitcher } from "@/components/layout/SocialLinks";
import { CONTACT_HREF, PRIMARY_NAV } from "@/components/layout/site-nav";

// Figma "Button Secondary" — cornerRadius 10 (not 14), translucent #ffffff33.
const CTA_CLASSES =
  "inline-flex items-center justify-center rounded-[10px] border border-white-20 bg-white-20 font-medium text-ink transition-opacity hover:opacity-80";

function isActive(pathname: string, href: string): boolean {
  const path = href.split("#")[0];
  if (!path || path === "/") return false; // anchor / home handled by logo
  return pathname === path || pathname.startsWith(`${path}/`);
}

/** 2×2 dot grid burger — 3 ink dots + 1 orange (Figma 659:22567). */
function BurgerIcon() {
  return (
    <span className="grid grid-cols-2 gap-1">
      <span className="size-1 rounded-full bg-ink" />
      <span className="size-1 rounded-full bg-ink" />
      <span className="size-1 rounded-full bg-ink" />
      <span className="size-1 rounded-full bg-accent" />
    </span>
  );
}

/** Close (X) icon for the open menu (Figma 659:28273 — mingcute:close-line). */
function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
      <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Lock background scroll while the mobile overlay is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="mx-auto flex h-[72px] items-center justify-between px-4 md:h-[90px] md:px-[60px]">
        {/* Left: logo + desktop links */}
        <div className="flex items-center gap-6 md:gap-[51px]">
          <Link href="/" aria-label="Tech Philosophy — home">
            <Logo className="h-8 md:h-10" />
          </Link>
          <ul className="hidden items-center gap-5 md:flex">
            {PRIMARY_NAV.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-body tracking-snug text-ink-muted transition-colors hover:text-ink",
                    isActive(pathname, link.href) && "text-ink",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: CTA (both) + burger (mobile) */}
        <div className="flex items-center gap-3">
          <Link
            href={CONTACT_HREF}
            className={cn(CTA_CLASSES, "px-5 py-2.5 text-body-sm md:px-[26px] md:py-3 md:text-body")}
          >
            Get in Touch
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="flex size-10 items-center justify-center rounded-[10px] border border-white-20 bg-white-20 md:hidden"
          >
            <BurgerIcon />
          </button>
        </div>
      </nav>

      {/* Mobile overlay menu — Figma frame 659:28273 (375×800).
          RESPONSIVENESS CONTRACT (owner, premium portrait fidelity):
          • Layout responds to WIDTH only — never to height. The card is anchored a fixed
            43px below the 72px header (Figma y115); the bottom row is anchored to the
            bottom; a flex-1 spacer absorbs all height variation. So neither the card nor
            the path moves as the viewport height changes (only the empty gap does).
          • The card/path width is fluid: 100vw − 56px (Figma's 28px side gutters), capped
            at 420px for wide portrait phones (~360–481px range). At 375px it is exactly
            319px ≈ Figma's 320px. The path therefore widens with the viewport, matching
            how the Figma design scales.
          • Menu-link type is FIXED at 40px (📱Header/H2-Italic) — NOT the fluid text-h2
            token, which grew past 40px above 375px and read "too big". */}
      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-[image:var(--gradient-hero)] md:hidden">
          {/* Header bar (72px) — logo 16px from left, CTA + close 16px from right, 8px apart. */}
          <div className="flex h-[72px] shrink-0 items-center justify-between px-4">
            <Logo className="h-[34px]" />
            <div className="flex items-center gap-2">
              <Link
                href={CONTACT_HREF}
                onClick={() => setOpen(false)}
                className={cn(CTA_CLASSES, "px-5 py-2.5 text-body-sm")}
              >
                Get in Touch
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex size-10 items-center justify-center rounded-[10px] border border-white-20 bg-white-20 text-ink"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* Card = Figma "Vector 707" (659:28290): a rounded-rect MOTION PATH (radius 20)
              that the two orange balls ride. Static balls here are snapshots ON the path —
              top ball at 15.3% across the top edge, bottom ball at 78.1% across the bottom
              edge (Figma 49px / 250px ÷ 320). The path-follow animation is CH-14 (D-014).
              Fixed 43px below the header; height fixed (content-driven), width fluid. */}
          <div className="mt-[43px] flex shrink-0 justify-center px-7">
            {/* Outer box = the path's bounding box. The track is an absolute OVERLAY so the
                balls/links position against the OUTER edge. (Putting the 12px border on this
                box would move the positioning origin to the padding box — inside the border —
                and push the balls ~6px off the track, onto the content side.) */}
            <div className="relative h-[430px] w-full max-w-[420px]">
              {/* TRACK — Figma "Vector 707" (659:28290), exact values read live via the
                  extended figma-mcp (CH-T1): a 14px stroke filled with a white→blue linear
                  gradient at 30% opacity, LUMINOSITY blend, plus an inner shadow. Rendered as
                  a gradient-border ring: the gradient paints the border-box and is masked out
                  of the padding-box (mask-composite exclude). Inline style — this layered
                  mask/blend/inset-shadow combo has no clean Tailwind-utility form. Outer radius
                  27 keeps the stroke centreline at Figma's radius 20 (20 + half of 14). */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[27px]"
                style={{
                  border: "14px solid transparent",
                  background: "linear-gradient(174deg, #ffffff, #007bff) border-box",
                  WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  // Soft, frosted 3-D glow (matches the Figma render): feather the band's
                  // edges with a blur, raise opacity so the white→blue reads, and keep the
                  // inner shadow for the recessed/embossed depth. (Strict LUMINOSITY blend
                  // flattened it against the gradient backdrop, so we render the look directly.)
                  opacity: 0.55,
                  filter: "blur(1.5px)",
                  boxShadow: "inset 2px 3px 7px #4b89b8",
                }}
              />
              {/* Balls centred on the 14px band (7px = half the stroke). CH-14 animates along it. */}
              <span className="absolute left-[15.3%] top-[7px] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" aria-hidden />
              <span className="absolute bottom-[7px] left-[78.1%] size-3 -translate-x-1/2 translate-y-1/2 rounded-full bg-accent" aria-hidden />
              <ul className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                {PRIMARY_NAV.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="font-serif text-[40px] italic leading-[1.16] tracking-tight text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Spacer absorbs all height variation so the card above stays put. */}
          <div className="flex-1" />

          {/* Bottom row — socials 16px from left, EN/DE near the right, 20px from bottom. */}
          <div className="mb-5 flex shrink-0 items-center justify-between px-4">
            <SocialLinks />
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
