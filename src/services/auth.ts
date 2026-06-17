/**
 * AUTH SERVICE — minimal (CH-04a)
 * ---------------------------------------------------------------------------
 * Only `refreshToken()` lives here for now — it is required by the baseFetch
 * 401→refresh mutex (client.ts). The full auth service surface (login, logout,
 * register, getUserProfile, password reset) lands in CH-11.
 *
 * Tokens are in httpOnly cookies, so the refresh call has an empty body and
 * relies on the browser sending the refresh cookie (credentials:'include').
 */

import type { TokenRefreshResponse } from "@/types/auth";
import { baseFetch } from "@/services/client";

/**
 * POST /api/v1/auth/token/refresh/ — rotates the access (+ refresh) cookie.
 * `skipAuthRefresh` prevents a refresh→401→refresh loop. Throws ApiError on
 * failure (refresh token expired/blacklisted) so the caller can sign the user out.
 */
export function refreshToken(): Promise<TokenRefreshResponse> {
  return baseFetch<TokenRefreshResponse>("/api/v1/auth/token/refresh/", {
    method: "POST",
    skipAuthRefresh: true,
  });
}
