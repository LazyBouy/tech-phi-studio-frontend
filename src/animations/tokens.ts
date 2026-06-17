/**
 * MOTION TOKENS — Tech Phi Studio (CH-02)
 * ---------------------------------------------------------------------------
 * The shared *vocabulary* for all GSAP animations: durations, easings, stagger
 * steps, and reveal distances. Components/timelines reference these names so
 * motion stays consistent and is tuned in one place.
 *
 * Status: VOCABULARY ONLY. The exact per-effect values are finalised in CH-14
 * against the Figma "Animation" page (node 266:2172). Treat the numbers here as
 * sensible provisional defaults, not final motion spec.
 *
 * Easings use GSAP's string syntax (consumed by gsap.to/from/timeline). Values
 * are in SECONDS (GSAP's unit), not ms.
 */

/** Durations in seconds (GSAP unit). */
export const DURATION = {
  /** micro-interactions: hover, focus, small UI state changes */
  fast: 0.2,
  /** default element reveal / transition */
  base: 0.4,
  /** larger entrances, hero elements */
  slow: 0.6,
  /** page / section transitions */
  page: 0.8,
} as const;

/**
 * Easing curves (GSAP syntax). `out` = decelerate (entrances),
 * `inOut` = symmetric (transitions), `expoOut` = strong settle (hero/headlines).
 */
export const EASE = {
  out: "power2.out",
  inOut: "power2.inOut",
  expoOut: "expo.out",
  /** subtle overshoot for playful accents (use sparingly) */
  backOut: "back.out(1.4)",
} as const;

/** Stagger steps in seconds — spacing between items in a sequence. */
export const STAGGER = {
  tight: 0.04,
  base: 0.08,
  loose: 0.12,
} as const;

/**
 * Reveal travel distances in pixels (translate from→to). Only `transform`/
 * `opacity` are animated (CLAUDE.md performance rule). Negative = upward.
 */
export const DISTANCE = {
  sm: 16,
  base: 24,
  lg: 48,
} as const;

export type Duration = keyof typeof DURATION;
export type Ease = keyof typeof EASE;
export type Stagger = keyof typeof STAGGER;
export type Distance = keyof typeof DISTANCE;
