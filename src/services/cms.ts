/**
 * CMS SERVICE (CH-04b) — Wagtail API v2 access.
 * ---------------------------------------------------------------------------
 * Source: data-fetching/{architecture,pseudocode}.md §1. Wagtail's pages
 * endpoint always returns a LIST envelope ({meta, items}), even when querying by
 * slug — so fetchPageBySlug unwraps items[0] and treats an empty result as 404
 * (the page component then calls Next's notFound()).
 *
 * Generic over the concrete page type so callers get a typed page, e.g.
 *   const page = await fetchPageBySlug<HomePage>("home", "cms.HomePage");
 */

import type { CmsPage } from "@/types/cms";
import type { WagtailListResponse } from "@/types/api";
import { ApiError, baseFetch } from "@/services/client";

const PAGES_ENDPOINT = "/api/v2/pages/";

/**
 * Fetch a single published page by slug + Wagtail model type. `?fields=*` returns
 * all fields incl. nested objects (fine for full page renders; listing views
 * should pass a narrower field set via fetchChildPages). Throws ApiError(404)
 * when no page matches.
 */
export async function fetchPageBySlug<T extends CmsPage = CmsPage>(
  slug: string,
  type: string,
): Promise<T> {
  const params = new URLSearchParams({ slug, type, fields: "*" });
  const res = await baseFetch<WagtailListResponse<T>>(
    `${PAGES_ENDPOINT}?${params.toString()}`,
  );
  const page = res.items[0];
  if (!page) {
    throw new ApiError(404, `No ${type} page found for slug "${slug}".`);
  }
  return page;
}

/**
 * Fetch the children of a parent page (e.g. service detail pages under the
 * services index). `fields` is an optional comma-separated subset to keep
 * listing payloads small (data-fetching/pseudocode §1, step 4). Returns the full
 * list envelope so callers can read meta.total_count for pagination.
 */
export async function fetchChildPages<T extends CmsPage = CmsPage>(
  parentId: number,
  type: string,
  fields = "title,slug,intro,card_image",
): Promise<WagtailListResponse<T>> {
  const params = new URLSearchParams({
    child_of: String(parentId),
    type,
    fields,
  });
  return baseFetch<WagtailListResponse<T>>(
    `${PAGES_ENDPOINT}?${params.toString()}`,
  );
}
