/**
 * CORE API CONTRACT — shared primitives (CH-03a)
 * ---------------------------------------------------------------------------
 * Cross-cutting types every domain contract (cms/quiz/technologies/contact/
 * auth) and the mock layer (CH-04) build on. Two backends are consumed:
 *   1. Wagtail API v2  → /api/v2/...  (CMS pages, images, documents)
 *   2. Custom DRF API  → /api/v1/...  (quiz, technologies, contact, auth)
 *
 * Source specs: frontend/data-fetching/{overview,architecture,pseudocode}.md,
 * frontend/error-handling/{overview,architecture}.md, backend/cms/architecture.md.
 * Mock-driven build: where a backend spec is silent, the frontend defines the
 * contract here and the backend conforms later.
 */

/** ISO-8601 timestamp string, e.g. "2026-06-17T13:12:20Z". Alias for intent/readability. */
export type ISODateString = string;

/* ===========================================================================
 * Wagtail API v2 envelopes
 * ======================================================================== */

/**
 * Wagtail v2 list endpoint envelope (e.g. GET /api/v2/pages/?type=...).
 * Pagination via ?limit=&offset= (WAGTAIL_API_LIMIT_MAX=100). The exact meta
 * key-set beyond total_count is not fully pinned in the spec (CH-03 investigation
 * §O) — `next`/`previous` are typed optional + nullable to tolerate either form.
 * Source: backend/cms/pseudocode.md Step 4; backend/cms/architecture.md L119-139.
 */
export interface WagtailListResponse<T> {
  meta: {
    total_count: number;
    next?: string | null;
    previous?: string | null;
  };
  items: T[];
}

/**
 * The `meta` object on every Wagtail v2 page detail/list item.
 * Source: backend/cms/architecture.md L74-78; frontend/data-fetching/architecture.md L90-97.
 */
export interface WagtailPageMeta {
  /** Wagtail model path, e.g. "cms.ServiceDetailPage". */
  type: string;
  /** Absolute API URL to this page. */
  detail_url: string;
  /** Frontend canonical URL, if exposed. */
  html_url?: string | null;
  slug: string;
  first_published_at: ISODateString | null;
}

/**
 * SEO fields added to all public pages by Wagtail's PromoteMixin. All nullable.
 * Source: backend/cms/architecture.md L49-51.
 */
export interface SeoFields {
  seo_title: string | null;
  search_description: string | null;
  og_image: ImageRendition | null;
}

/**
 * Common base every Wagtail page response extends. Concrete page types
 * (HomePage, ServiceDetailPage, ...) add their own fields in CH-03b (cms.ts).
 */
export interface WagtailPageBase extends SeoFields {
  id: number;
  title: string;
  slug: string;
  meta: WagtailPageMeta;
}

/* ===========================================================================
 * Images & StreamField
 * ======================================================================== */

/**
 * A rendered Wagtail image (one rendition). The pixel sizes are chosen per
 * usage from Figma (deferred — not part of this type).
 * Source: backend/cms/architecture.md L100-113.
 */
export interface ImageRendition {
  url: string;
  width: number;
  height: number;
  alt: string;
}

/**
 * One StreamField block as serialized by Wagtail v2. `type` discriminates the
 * `value` shape; CH-03b (cms.ts) defines the concrete discriminated union the
 * BlockRenderer switches on. `unknown` (not `any`) keeps this strict until then.
 * Source: frontend/data-fetching/architecture.md L99-103; components/architecture.md L116-132.
 */
export interface StreamFieldBlock<
  TType extends string = string,
  TValue = unknown,
> {
  id: string;
  type: TType;
  value: TValue;
}

/** A page body is an ordered list of heterogeneous StreamField blocks. */
export type StreamField = StreamFieldBlock[];

/* ===========================================================================
 * Errors (DRF wire format → normalized client shape)
 * ======================================================================== */

/** DRF serializer field errors: { fieldName: ["message", ...] }. */
export type DrfFieldErrors = Record<string, string[]>;

/**
 * Raw DRF/dj-rest-auth error body. `detail` = single non-field message;
 * `non_field_errors` = array of form-level messages; any other key = a field's
 * error list. Source: frontend/error-handling/architecture.md L26-35; auth specs.
 */
export type DrfErrorBody = {
  detail?: string;
  non_field_errors?: string[];
} & Partial<DrfFieldErrors>;

/**
 * Normalized error the service layer surfaces to UI. The runtime `ApiError`
 * *class* (extends Error) is implemented in CH-04 `services/client.ts`; this
 * interface is the shared shape so types compile without the runtime.
 * Source: frontend/error-handling/architecture.md L26-35.
 */
export interface ApiErrorShape {
  status: number;
  message: string;
  /** Present on 400s: field → messages, for inline form display. */
  fieldErrors?: DrfFieldErrors;
}

/** HTTP statuses the frontend explicitly handles (error-handling/overview.md L13-20). */
export type HandledHttpStatus = 400 | 401 | 403 | 404 | 409 | 429 | 500 | 502 | 503;
