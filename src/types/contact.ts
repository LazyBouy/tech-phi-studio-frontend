/**
 * CONTACT CONTRACT (CH-03c) — consumed by <ContactSection> (CH-12).
 * Source: backend/contact/{overview,architecture,pseudocode}.md.
 */

/**
 * POST /api/v1/contact/ body. `website` is a honeypot: always send "" — a
 * non-empty value triggers a silent 200 (spam) on the backend. It is a
 * write-only serializer field, never persisted (CH-03 investigation, Contact §1).
 */
export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
  /** No format validation server-side; treat as free string. */
  phone?: string;
  /** Honeypot — keep "". */
  website?: string;
}

/** 201 success — minimal by design (no echo of stored data). */
export interface ContactSuccessResponse {
  message: string;
}
