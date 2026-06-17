/**
 * TECHNOLOGIES CONTRACT (CH-03c) — consumed by <TechStack> (CH-12).
 * Source: backend/technologies/{overview,architecture,pseudocode}.md.
 *
 * Frontend-led decision D-007: the response is a bare `TechnologyCategory[]`
 * (matches the pseudocode). The architecture mentions a DRF paginator; if the
 * backend ships one, adapt at the service boundary (CH-04) rather than leaking
 * a wrapper into UI types.
 */

/** A single technology. `icon` is raw SVG markup — MUST be DOMPurify-sanitized before render. */
export interface Technology {
  id: number;
  name: string;
  /** Raw "<svg>…</svg>" string (currentColor-friendly). Sanitize before dangerouslySetInnerHTML. */
  icon: string;
  /** Optional secondary grouping label, e.g. "Backend"/"Frontend"; may be "". */
  subcategory: string;
}

/** A category with its active technologies (ordered by display_order). */
export interface TechnologyCategory {
  id: number;
  name: string;
  technologies: Technology[];
}

/** GET /api/v1/technologies/ (optional ?category=<id>) → bare array (D-007). */
export type TechnologiesResponse = TechnologyCategory[];
