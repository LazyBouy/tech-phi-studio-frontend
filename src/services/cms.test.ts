/**
 * cms service tests (CH-04b). Runs against the real CMS MSW handlers (no
 * per-test overrides) to prove the service ↔ mock contract end to end.
 */
import { describe, expect, it } from "vitest";
import type { CtaBlock, HomePage, ServiceDetailPage } from "@/types/cms";
import { ApiError } from "@/services/client";
import { fetchChildPages, fetchPageBySlug } from "@/services/cms";

describe("fetchPageBySlug", () => {
  it("returns a typed page for a known slug", async () => {
    const page = await fetchPageBySlug<HomePage>("home", "cms.HomePage");
    expect(page.slug).toBe("home");
    expect(page.meta.type).toBe("cms.HomePage");
    expect(page.body.length).toBeGreaterThan(0);
    // discriminated-union block is usable without casting
    const cta = page.body.find((b): b is CtaBlock => b.type === "cta");
    expect(cta?.value.button_url).toBe("/quiz");
  });

  it("throws ApiError(404) for an unknown slug", async () => {
    await expect(
      fetchPageBySlug("does-not-exist", "cms.HomePage"),
    ).rejects.toMatchObject({ status: 404 });
    await expect(
      fetchPageBySlug("does-not-exist", "cms.HomePage"),
    ).rejects.toBeInstanceOf(ApiError);
  });
});

describe("fetchChildPages", () => {
  it("returns the list envelope of children for a parent id", async () => {
    const res = await fetchChildPages<ServiceDetailPage>(10, "cms.ServiceDetailPage");
    expect(res.meta.total_count).toBe(res.items.length);
    expect(res.items.length).toBeGreaterThanOrEqual(2);
    expect(res.items.every((p) => p.meta.type === "cms.ServiceDetailPage")).toBe(true);
  });
});
