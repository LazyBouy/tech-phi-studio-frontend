/**
 * CMS CONTRACT — Wagtail pages, StreamField blocks, snippets (CH-03b)
 * ---------------------------------------------------------------------------
 * Consumed by the BlockRenderer (CH-09) and public pages (CH-10).
 * Source: backend/cms/{overview,architecture,pseudocode}.md,
 * frontend/components/architecture.md (BlockRenderer L116-132).
 *
 * Mock-driven: only ServiceDetailPage is fully specified in the backend spec;
 * other page field-sets are underspecified (CH-03 investigation §C). The
 * frontend leads with a pragmatic shape (detail pages = intro?/hero_image?/body;
 * index pages = body) and the backend conforms later. Uncertain fields are
 * optional + commented.
 */

import type {
  ImageRendition,
  StreamFieldBlock,
  WagtailPageBase,
} from "./api";

/* ===========================================================================
 * StreamField blocks — discriminated union on `type`
 * The 6 confirmed block types (backend/cms/architecture.md L83-96). Spec notes
 * "additional blocks as needed" — extend this union as new blocks appear (CH-09).
 * ======================================================================== */

/** `rich_text` — Wagtail RichTextBlock; value is an HTML string (sanitize before render). */
export type RichTextBlock = StreamFieldBlock<"rich_text", string>;

/** `image` — image + optional caption. */
export type ImageBlock = StreamFieldBlock<
  "image",
  { image: ImageRendition; caption?: string }
>;

/** `cta` — call-to-action. */
export type CtaBlock = StreamFieldBlock<
  "cta",
  { heading: string; text: string; button_label: string; button_url: string }
>;

/** `quote` — pull quote + attribution. */
export type QuoteBlock = StreamFieldBlock<
  "quote",
  { quote: string; attribution: string }
>;

/**
 * `video_embed` — YouTube/Vimeo by URL. Wagtail EmbedBlock serialization is
 * unconfirmed (CH-03 investigation §J): may be a bare URL string or an oEmbed
 * object. Typed as the superset; tighten in CH-09 once confirmed.
 */
export type VideoEmbedBlock = StreamFieldBlock<
  "video_embed",
  | string
  | {
      url: string;
      html?: string;
      title?: string;
      provider_name?: string;
      width?: number;
      height?: number;
    }
>;

/** `two_column` — two nested block lists; renders recursively (arbitrary depth). */
export type TwoColumnBlock = StreamFieldBlock<
  "two_column",
  { left_column: CmsBlock[]; right_column: CmsBlock[] }
>;

/** The closed set of blocks the BlockRenderer switches on. */
export type CmsBlock =
  | RichTextBlock
  | ImageBlock
  | CtaBlock
  | QuoteBlock
  | VideoEmbedBlock
  | TwoColumnBlock;

/** A page body as a list of known blocks (unknown `type`s render nothing + warn). */
export type CmsStreamField = CmsBlock[];

/* ===========================================================================
 * Snippets (inline-serialized inside page responses)
 * Fields beyond these are TBD during model implementation (investigation §F).
 * ======================================================================== */

export interface TestimonialSnippet {
  id: number;
  quote: string;
  attribution: string;
}

export interface TeamMemberSnippet {
  id: number;
  name: string;
  title: string;
  bio?: string;
  photo?: ImageRendition | null;
}

/** Editorial logo for CMS pages — distinct from the interactive technologies API. */
export interface TechnologyLogoSnippet {
  id: number;
  name: string;
  logo_image: ImageRendition;
}

/* ===========================================================================
 * Page types
 * ======================================================================== */

/** Index/listing pages: own body + (separately fetched) child pages via ?child_of=. */
export interface CmsIndexPage extends WagtailPageBase {
  body: CmsStreamField;
}

/**
 * Detail/content pages (Service/Project/Insight). Only ServiceDetailPage's
 * fields are spec-confirmed (intro, hero_image, body); applied to the others
 * pending confirmation. `card_image` appears once in the spec for child listings
 * (investigation §P) — typed optional.
 */
export interface CmsDetailPage extends WagtailPageBase {
  intro?: string;
  hero_image?: ImageRendition | null;
  card_image?: ImageRendition | null;
  body: CmsStreamField;
}

export type HomePage = CmsIndexPage;
export type LegalPage = CmsIndexPage;
export type ContactPage = CmsIndexPage;
export type ServicesIndexPage = CmsIndexPage;
export type SolutionsIndexPage = CmsIndexPage;
export type InsightsIndexPage = CmsIndexPage;

export interface AboutPage extends CmsIndexPage {
  /** Team likely surfaced via TeamMember snippets (investigation §E/F) — optional until confirmed. */
  team?: TeamMemberSnippet[];
}

export type ServiceDetailPage = CmsDetailPage;
export type ProjectDetailPage = CmsDetailPage;
export type InsightDetailPage = CmsDetailPage;

/** Any CMS page the frontend may fetch by slug. */
export type CmsPage =
  | HomePage
  | AboutPage
  | ServicesIndexPage
  | ServiceDetailPage
  | SolutionsIndexPage
  | ProjectDetailPage
  | InsightsIndexPage
  | InsightDetailPage
  | ContactPage
  | LegalPage;
