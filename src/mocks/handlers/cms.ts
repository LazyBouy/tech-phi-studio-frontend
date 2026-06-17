/**
 * CMS MSW handlers (CH-04b) — Wagtail API v2 `GET /api/v2/pages/`.
 * Branches on the same query params the cms service sends (?slug / ?child_of),
 * returning a WagtailListResponse. Unknown slug → empty items (NOT an HTTP 404),
 * mirroring Wagtail — fetchPageBySlug turns the empty result into ApiError(404).
 */

import { http, HttpResponse } from "msw";
import { childrenByParentId, pagesBySlug } from "@/mocks/fixtures/cms";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export const cmsHandlers = [
  http.get(`${API_BASE}/api/v2/pages/`, ({ request }) => {
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");
    const childOf = url.searchParams.get("child_of");

    if (childOf) {
      const children = childrenByParentId[Number(childOf)] ?? [];
      return HttpResponse.json({
        meta: { total_count: children.length },
        items: children,
      });
    }

    if (slug) {
      const page = pagesBySlug[slug];
      const items = page ? [page] : [];
      return HttpResponse.json({ meta: { total_count: items.length }, items });
    }

    // Bare listing — return all known pages.
    const all = Object.values(pagesBySlug);
    return HttpResponse.json({ meta: { total_count: all.length }, items: all });
  }),
];
