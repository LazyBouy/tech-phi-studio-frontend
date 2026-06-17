/**
 * Shared site-chrome link data (CH-07) — consumed by Navigation + Footer so the
 * link set stays in one place. "Our Concept" → Home anchor /#concept (owner
 * decision 2026-06-17; tracked as D-012 for CH-10's home concept section).
 */

export interface NavLink {
  label: string;
  href: string;
}

export const PRIMARY_NAV: NavLink[] = [
  { label: "Our Concept", href: "/#concept" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Solutions", href: "/solutions" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

/** Footer splits the primary nav into two columns (3 + 3), matching Figma. */
export const FOOTER_NAV_COLUMNS: NavLink[][] = [
  PRIMARY_NAV.slice(0, 3),
  PRIMARY_NAV.slice(3),
];

export const LEGAL_LINKS: NavLink[] = [
  { label: "Privacy Policy", href: "/legal/privacy-policy" },
  { label: "Imprint", href: "/legal/imprint" },
];

/** Social links — placeholder hrefs pending real URLs from the owner. */
export const SOCIAL_LINKS: { label: string; href: string }[] = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
];

export const CONTACT_HREF = "/contact";
