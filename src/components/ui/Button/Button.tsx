import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Button (global atom) — the Figma design-system button family.
 * Three variants, all Work Sans 16 Medium, tracking -2% (🖥️ Body/B2-Medium):
 *
 *  • primary          — Figma "Primary Button" 659:29482. Orange RADIAL gradient
 *                       (#ff8d03 → #ff6600), white text, cornerRadius 12. Used for the
 *                       main hero CTA ("Get Your Tech Fit").
 *  • secondary        — Figma "Secondary Button" 659:29507. Translucent white #ffffff33
 *                       fill + 1px #ffffff33 inside border, ink text, cornerRadius 14,
 *                       padding 15/50. Hero secondary CTA ("See Our Services").
 *  • secondary-small  — Figma "Button Secondary Small" 659:29502. Same translucent style,
 *                       cornerRadius 14, tighter padding 12/26. Nav "Get in Touch".
 *
 * Padding per variant matches Figma; pass `className` to override size (e.g. the hero
 * pins both CTAs to a fixed 200×52). Static layout only — wiring to routes/quiz is a
 * later (data) pass per the frontend Figma→React sequence.
 */

export type ButtonVariant = "primary" | "secondary" | "secondary-small";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const BASE =
  "relative inline-flex items-center justify-center font-sans font-medium text-body tracking-snug transition-opacity hover:opacity-90 disabled:opacity-50";

const VARIANTS: Record<ButtonVariant, string> = {
  // Figma "Button Hero" Desktop default 659:29483 — exact Dev-Mode CSS (getCSSAsync):
  //   background: radial-gradient(83.25% 35.25% at 64.75% 50%, #FF8D03 0%, #FF6600 100%)
  //   border: 1px transparent · radius 12. The signature detail is the "Light" flare (below).
  //   overflow-hidden clips the flare to the rounded shape.
  primary:
    "overflow-hidden rounded-[12px] px-[35px] py-[15px] text-white bg-[radial-gradient(83.25%_35.25%_at_64.75%_50%,#ff8d03_0%,#ff6600_100%)]",
  secondary:
    "rounded-[14px] px-[50px] py-[15px] text-ink border border-white-20 bg-white-20",
  "secondary-small":
    "rounded-[14px] px-[26px] py-3 text-ink border border-white-20 bg-white-20",
};

export function Button({ variant = "primary", className, children, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={cn(BASE, VARIANTS[variant], className)} {...rest}>
      {/* "Light" flare — Figma 659:29484, exact CSS: white→transparent radial, blur(2.1px),
          mix-blend plus-lighter; a 181×20 streak centred on the BOTTOM EDGE (≈90% wide, thin).
          Reads as a crisp warm bottom reflection. Only on primary. */}
      {variant === "primary" && (
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 h-[38%] w-[90%] -translate-x-1/2 translate-y-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,#ffffff_0%,rgba(255,255,255,0)_70%)] blur-[2.1px] mix-blend-plus-lighter"
        />
      )}
      <span className="relative z-[1]">{children}</span>
    </button>
  );
}
