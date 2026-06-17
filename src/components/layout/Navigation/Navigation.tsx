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

      {/* Mobile overlay menu — Figma frame 659:28273 */}
      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-[image:var(--gradient-hero)] px-4 md:hidden">
          {/* header: logo + Get in Touch + X close */}
          <div className="flex h-[72px] items-center justify-between">
            <Logo className="h-8" />
            <div className="flex items-center gap-3">
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

          {/* Centered card = Figma "Vector 707" (659:28290): a rounded-rect MOTION PATH
              (320×430, radius 20) that the two orange balls ride. In the static frame the
              balls are snapshots ON the path — top ball at 49px from the left on the top
              edge, bottom ball at 250px on the bottom edge. The path-follow animation
              (balls travelling the rounded-rect) is forward-scoped to CH-14 (D-014). */}
          <div className="flex flex-1 items-center justify-center">
            <ul className="relative mx-auto flex h-[430px] w-[320px] flex-col items-center justify-center gap-4 rounded-[20px] border-[1.5px] border-white-50">
              {/* Ball positions on the path (centres sit on the stroke; see CH-14). */}
              <span className="absolute left-[15.3%] top-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" aria-hidden />
              <span className="absolute left-[78.1%] bottom-0 size-3 -translate-x-1/2 translate-y-1/2 rounded-full bg-accent" aria-hidden />
              {PRIMARY_NAV.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-serif text-h2 italic text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* bottom: socials + language switcher */}
          <div className="mb-8 flex items-center justify-between">
            <SocialLinks />
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
