"use client";

/**
 * Footer (CH-07) — site footer. Figma: Footer instance 659:18185, sitting on a
 * blue gradient. Translucent card (rounded-lg, bg-white-20) over a CSS gradient
 * (the decorative blob 659:18168 is deferred). Logo + tagline, two link columns,
 * socials, language switcher (EN active / DE inert per ADR-0002 + D-013),
 * copyright, legal links, and a back-to-top button.
 *
 * 'use client' for the back-to-top handler (uses ScrollSmoother when present).
 */

import Link from "next/link";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/layout/Logo";
import { ScrollSmoother } from "@/animations/gsap-configs";
import { SocialLinks, LanguageSwitcher } from "@/components/layout/SocialLinks";
import { FOOTER_NAV_COLUMNS, LEGAL_LINKS } from "@/components/layout/site-nav";

const CIRCLE =
  "flex size-[60px] items-center justify-center rounded-lg border border-white-20 bg-white-20 text-ink transition-opacity hover:opacity-80";

function scrollToTop() {
  const smoother = ScrollSmoother.get();
  if (smoother) smoother.scrollTo(0, true);
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-blue-300 to-bg px-3 pb-3 pt-20">
      <div className="mx-auto max-w-[1440px] rounded-lg border border-white-20 bg-white-20 p-8 md:p-[52px]">
        {/* Top: brand + link columns */}
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="flex flex-col gap-4">
            <Logo className="h-10" />
            <p className="max-w-[207px] text-body tracking-snug text-ink-muted">
              Proudly Based in Germany, Serving Worldwide
            </p>
          </div>
          <div className="flex gap-8 md:gap-12">
            {FOOTER_NAV_COLUMNS.map((column, i) => (
              <ul key={i} className="flex flex-col">
                {column.map((link) => (
                  <li key={link.href} className="border-b border-ink/20 py-2.5 first:pt-0">
                    <Link
                      href={link.href}
                      className="text-body tracking-snug text-ink transition-opacity hover:opacity-70"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        {/* Bottom: socials + lang · copyright · legal + back-to-top */}
        <div className="mt-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <SocialLinks />
            <LanguageSwitcher className="ml-2" />
          </div>

          <p className="text-body tracking-snug text-ink">
            All rights reserved © Tech Philosophy 2026
          </p>

          <div className="flex items-center gap-6">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-body tracking-snug text-ink transition-opacity hover:opacity-70"
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className={cn(CIRCLE, "shrink-0")}
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
                <path d="M12 19V5M12 5l-6 6M12 5l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
