/**
 * MSW HANDLERS — shared registry (CH-04a)
 * ---------------------------------------------------------------------------
 * The single source of mock request handlers consumed by BOTH the browser
 * worker (dev app) and the node server (SSR + Vitest) — see ADR-0001. Domain
 * handlers (cms in CH-04b; technologies/quiz/contact/auth in feature chunks)
 * are appended here so all runtimes behave identically.
 *
 * Handler URLs are absolute (NEXT_PUBLIC_API_URL prefix) to match what
 * baseFetch requests.
 */

import { http, HttpResponse } from "msw";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export const handlers = [
  // Sentinel handler — proves the mock layer is live (used by smoke checks).
  http.get(`${API_BASE}/health`, () =>
    HttpResponse.json({ status: "ok", mocked: true }),
  ),
];
