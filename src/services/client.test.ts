/**
 * baseFetch + ApiError tests (CH-04a). Exercises the full data path through MSW
 * (no module mocking) per shared/testing spec: happy, 404, 400+fieldErrors,
 * timeout, 401→refresh→retry, refresh-fail, and the single-flight refresh mutex.
 */
import { http, HttpResponse, delay } from "msw";
import { afterEach, describe, expect, it, vi } from "vitest";
import { server } from "@/mocks/server";
import { ApiError, baseFetch } from "@/services/client";

const API = "http://localhost:8000";

describe("baseFetch", () => {
  afterEach(() => vi.useRealTimers());

  it("returns parsed JSON on 2xx", async () => {
    server.use(
      http.get(`${API}/api/v1/ping`, () => HttpResponse.json({ pong: true })),
    );
    await expect(baseFetch("/api/v1/ping")).resolves.toEqual({ pong: true });
  });

  it("throws ApiError with status on 404", async () => {
    server.use(
      http.get(`${API}/api/v1/missing`, () =>
        HttpResponse.json({ detail: "Not found." }, { status: 404 }),
      ),
    );
    await expect(baseFetch("/api/v1/missing")).rejects.toMatchObject({
      status: 404,
      message: "Not found.",
    });
  });

  it("surfaces DRF fieldErrors on 400", async () => {
    server.use(
      http.post(`${API}/api/v1/contact/`, () =>
        HttpResponse.json(
          { email: ["Enter a valid email address."], subject: ["Required."] },
          { status: 400 },
        ),
      ),
    );
    try {
      await baseFetch("/api/v1/contact/", { method: "POST", body: "{}" });
      throw new Error("expected ApiError");
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      const e = err as ApiError;
      expect(e.status).toBe(400);
      expect(e.fieldErrors?.email?.[0]).toBe("Enter a valid email address.");
      expect(e.fieldErrors?.subject?.[0]).toBe("Required.");
    }
  });

  it("times out after 10s", async () => {
    server.use(
      http.get(`${API}/api/v1/slow`, async () => {
        await delay("infinite");
        return HttpResponse.json({});
      }),
    );
    vi.useFakeTimers();
    const promise = baseFetch("/api/v1/slow");
    const assertion = expect(promise).rejects.toThrow(/timed out/i);
    await vi.advanceTimersByTimeAsync(10_000);
    await assertion;
  });

  it("refreshes once on 401 then retries the original request", async () => {
    let attempts = 0;
    let refreshes = 0;
    server.use(
      http.get(`${API}/api/v1/quiz/results/42/`, () => {
        attempts += 1;
        return attempts === 1
          ? new HttpResponse(null, { status: 401 })
          : HttpResponse.json({ recommended_service: "web" });
      }),
      http.post(`${API}/api/v1/auth/token/refresh/`, () => {
        refreshes += 1;
        return HttpResponse.json({});
      }),
    );
    await expect(baseFetch("/api/v1/quiz/results/42/")).resolves.toEqual({
      recommended_service: "web",
    });
    expect(attempts).toBe(2);
    expect(refreshes).toBe(1);
  });

  it("throws ApiError(401) when the refresh itself fails", async () => {
    server.use(
      http.get(
        `${API}/api/v1/quiz/results/42/`,
        () => new HttpResponse(null, { status: 401 }),
      ),
      http.post(
        `${API}/api/v1/auth/token/refresh/`,
        () => new HttpResponse(null, { status: 401 }),
      ),
    );
    await expect(baseFetch("/api/v1/quiz/results/42/")).rejects.toMatchObject({
      status: 401,
    });
  });

  it("shares a single in-flight refresh across concurrent 401s (mutex)", async () => {
    const attempts: Record<string, number> = { a: 0, b: 0 };
    let refreshes = 0;
    server.use(
      http.get(`${API}/api/v1/a`, () => {
        attempts.a += 1;
        return attempts.a === 1
          ? new HttpResponse(null, { status: 401 })
          : HttpResponse.json({ ok: "a" });
      }),
      http.get(`${API}/api/v1/b`, () => {
        attempts.b += 1;
        return attempts.b === 1
          ? new HttpResponse(null, { status: 401 })
          : HttpResponse.json({ ok: "b" });
      }),
      http.post(`${API}/api/v1/auth/token/refresh/`, async () => {
        refreshes += 1;
        await delay(5);
        return HttpResponse.json({});
      }),
    );
    const [a, b] = await Promise.all([
      baseFetch<{ ok: string }>("/api/v1/a"),
      baseFetch<{ ok: string }>("/api/v1/b"),
    ]);
    expect(a.ok).toBe("a");
    expect(b.ok).toBe("b");
    expect(refreshes).toBe(1);
  });
});
