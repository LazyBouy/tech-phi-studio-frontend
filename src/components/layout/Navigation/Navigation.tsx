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
import { CONTACT_HREF, PRIMARY_NAV } from "@/components/layout/site-nav";

const CTA_CLASSES =
  "inline-flex items-center justify-center rounded-lg border border-white-20 bg-white-20 font-medium text-ink transition-opacity hover:opacity-80";

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
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" aria-label="Tech Philosophy — home">
            <Logo className="h-8 md:h-10" />
          </Link>
          <ul className="hidden items-center gap-7 md:flex">
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
            className="flex size-10 items-center justify-center rounded-lg border border-white-20 bg-white-20 md:hidden"
          >
            <BurgerIcon />
          </button>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-bg px-4 md:hidden">
          <div className="flex h-[72px] items-center justify-between">
            <Logo className="h-8" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex size-10 items-center justify-center rounded-lg border border-black-10 text-ink"
            >
              <span aria-hidden className="text-h4 leading-none">×</span>
            </button>
          </div>
          <ul className="mt-8 flex flex-col gap-6">
            {PRIMARY_NAV.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-h3 text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={CONTACT_HREF}
            onClick={() => setOpen(false)}
            className={cn(CTA_CLASSES, "mt-auto mb-10 w-full px-6 py-4 text-body")}
          >
            Get in Touch
          </Link>
        </div>
      )}
    </header>
  );
}
