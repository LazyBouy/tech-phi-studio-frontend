/**
 * BASE API CLIENT (CH-04a)
 * ---------------------------------------------------------------------------
 * The single fetch entry point for the whole app. Every service function calls
 * `baseFetch`. Responsibilities (data-fetching/architecture.md L65-81, pseudocode §4):
 *   - prepend NEXT_PUBLIC_API_URL; JSON headers; credentials:'include' (httpOnly cookies)
 *   - 10s timeout via AbortController
 *   - non-2xx → throw typed ApiError (with fieldErrors on 400 for inline form display)
 *   - network/timeout failure → generic Error
 *   - 401 → single-flight token refresh, then retry the original request once
 *
 * Mock vs real backend is transparent here: MSW intercepts these requests when
 * NEXT_PUBLIC_USE_MOCKS=true (ADR-0001); otherwise they hit the real API URL.
 */

import type { ApiErrorShape, DrfErrorBody, DrfFieldErrors } from "@/types/api";
import { refreshToken } from "@/services/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const REQUEST_TIMEOUT_MS = 10_000;
/** Endpoint suffix of the refresh call — never trigger a refresh-on-401 loop for it. */
const REFRESH_ENDPOINT = "/api/v1/auth/token/refresh/";

/** Typed error thrown on any non-2xx response. Matches ApiErrorShape (CH-03a). */
export class ApiError extends Error implements ApiErrorShape {
  readonly status: number;
  readonly fieldErrors?: DrfFieldErrors;

  constructor(status: number, message: string, fieldErrors?: DrfFieldErrors) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export interface BaseFetchOptions extends RequestInit {
  /** Skip the 401→refresh→retry path (used by the refresh call itself). */
  skipAuthRefresh?: boolean;
}

/* ---- single-flight token refresh ---------------------------------------- */
/**
 * Module-level mutex: concurrent 401s share ONE in-flight refresh promise so we
 * never fire parallel refresh calls (data-fetching/pseudocode §4; auth/architecture).
 */
let refreshPromise: Promise<void> | null = null;

function ensureFreshToken(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = refreshToken()
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

/* ---- error normalization ------------------------------------------------- */
function toFieldErrors(body: DrfErrorBody): DrfFieldErrors | undefined {
  const entries = Object.entries(body).filter(
    ([key, val]) =>
      key !== "detail" && key !== "non_field_errors" && Array.isArray(val),
  ) as Array<[string, string[]]>;
  return entries.length ? Object.fromEntries(entries) : undefined;
}

async function buildApiError(res: Response): Promise<ApiError> {
  let body: DrfErrorBody = {};
  try {
    body = (await res.json()) as DrfErrorBody;
  } catch {
    // non-JSON error body — fall back to status text
  }
  const fieldErrors = toFieldErrors(body);
  const message =
    body.detail ??
    body.non_field_errors?.[0] ??
    (fieldErrors ? Object.values(fieldErrors)[0]?.[0] : undefined) ??
    res.statusText ??
    `Request failed with status ${res.status}`;
  return new ApiError(res.status, message, fieldErrors);
}

/* ---- the client ---------------------------------------------------------- */
async function performFetch(
  endpoint: string,
  options: BaseFetchOptions,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      signal: options.signal ?? controller.signal,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error(`Request timed out after ${REQUEST_TIMEOUT_MS / 1000}s`);
    }
    // Network failure (DNS, offline, CORS) — generic, user-facing message.
    throw new Error("Network request failed. Please check your connection.");
  } finally {
    clearTimeout(timeout);
  }
}

async function parseBody<T>(res: Response): Promise<T> {
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return undefined as T;
  }
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

/**
 * Fetch + parse JSON, or throw ApiError. On 401 (expired access token), refresh
 * once (single-flight) and retry; if the retry still 401s, throw ApiError(401)
 * for the auth layer to handle (redirect to /login).
 */
export async function baseFetch<T>(
  endpoint: string,
  options: BaseFetchOptions = {},
): Promise<T> {
  let res = await performFetch(endpoint, options);

  const canRefresh =
    res.status === 401 &&
    !options.skipAuthRefresh &&
    endpoint !== REFRESH_ENDPOINT;

  if (canRefresh) {
    try {
      await ensureFreshToken();
    } catch {
      throw new ApiError(401, "Session expired. Please sign in again.");
    }
    res = await performFetch(endpoint, { ...options, skipAuthRefresh: true });
  }

  if (!res.ok) {
    throw await buildApiError(res);
  }
  return parseBody<T>(res);
}
