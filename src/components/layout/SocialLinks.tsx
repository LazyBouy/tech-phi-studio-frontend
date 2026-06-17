/**
 * Shared chrome bits (CH-07) — SocialLinks + LanguageSwitcher, reused by Footer
 * and the mobile menu overlay so styling stays in one place. Social buttons are
 * 60×60 TRUE CIRCLES (Figma 659:18185 / 659:28273 — the layers are ELLIPSE nodes,
 * `rounded-full`, not squircles), translucent #ffffff33. The two circles sit 10px
 * apart (Figma). EN active / DE inert per ADR-0002 + D-013.
 */
import { cn } from "@/lib/cn";
import { SOCIAL_LINKS } from "@/components/layout/site-nav";

// Exported so Footer's back-to-top button reuses the exact same circle.
export const SOCIAL_CIRCLE =
  "flex size-[60px] items-center justify-center rounded-full border border-white-20 bg-white-20 text-ink transition-opacity hover:opacity-80";

function SocialIcon({ label }: { label: string }) {
  if (label === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-1 1.83-2.05 3.76-2.05C20.4 8.65 21 11 21 14v7h-4v-6.2c0-1.48-.03-3.38-2.06-3.38-2.06 0-2.38 1.6-2.38 3.27V21H9V9Z" />
    </svg>
  );
}

export function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-[10px]", className)}>
      {SOCIAL_LINKS.map((s) => (
        <a
          key={s.label}
          href={s.href}
          aria-label={s.label}
          target="_blank"
          rel="noopener noreferrer"
          className={SOCIAL_CIRCLE}
        >
          <SocialIcon label={s.label} />
        </a>
      ))}
    </div>
  );
}

export function LanguageSwitcher({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 text-body tracking-snug text-ink",
        className,
      )}
    >
      <span className="underline">EN</span>
      <span
        className="cursor-not-allowed text-ink/40"
        aria-disabled
        title="Deutsch — coming soon"
      >
        DE
      </span>
    </div>
  );
}
