/**
 * AUTH CONTRACT (CH-03d) — consumed by auth UI + authStore (CH-11) and the
 * baseFetch 401→refresh flow (CH-04 client.ts).
 * Source: frontend/auth/*, backend/auth/*, frontend/error-handling/*.
 *
 * JWT lives in httpOnly cookies — tokens are NEVER in JSON bodies. All requests
 * use credentials:'include'.
 *
 * Frontend-led decisions:
 *  - D-008 (User shape): spec confirms only {id, email, name}. Extra fields are
 *    typed optional so the frontend tolerates whatever dj-rest-auth returns; the
 *    backend's UserProfileSerializer conforms to at least the required three.
 *  - D-009 (empty bodies): register/verify/logout/refresh/reset response bodies
 *    are unspecified → typed as AuthAck ({detail?} or empty), driven by status code.
 */

/** Authenticated user profile (login / GET /api/v1/users/me/). */
export interface User {
  id: number;
  email: string;
  name: string;
  /** Optional — present only if the backend separates / includes them (D-008). */
  first_name?: string;
  last_name?: string;
  avatar?: string | null;
  date_joined?: string;
  is_active?: boolean;
  is_staff?: boolean;
}

/** Generic acknowledgement for endpoints whose body is unspecified (D-009). */
export interface AuthAck {
  detail?: string;
}

/* ---- Request payloads ---------------------------------------------------- */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password1: string;
  password2: string;
}

export interface VerifyEmailRequest {
  key: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  uid: string;
  token: string;
  new_password1: string;
  new_password2: string;
}

/* ---- Response shapes ----------------------------------------------------- */

/** POST /api/v1/auth/login/ → user profile (tokens set as httpOnly cookies). */
export type LoginResponse = User;

/** GET /api/v1/users/me/ → user profile, or 401 if unauthenticated. */
export type CurrentUserResponse = User;

/** register / verify-email / logout / token-refresh / password-reset(+confirm). */
export type RegisterResponse = AuthAck;
export type VerifyEmailResponse = AuthAck;
export type LogoutResponse = AuthAck;
export type TokenRefreshResponse = AuthAck;
export type PasswordResetResponse = AuthAck;
export type PasswordResetConfirmResponse = AuthAck;
