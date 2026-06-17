/**
 * QUIZ CONTRACT (CH-03c) — consumed by the quiz flow (CH-13).
 * Source: backend/quiz/{overview,architecture,pseudocode}.md.
 *
 * Frontend-led decision D-006: the submit payload is single-select, keyed by
 * question id → selected answer id (`Record<string, number>`). The spec left
 * the value type + single/multi ambiguous; the frontend defines it here and the
 * backend conforms. Revisit if multi-select questions appear in Figma (CH-13).
 */

import type { ISODateString } from "./api";

/** One selectable answer; `weight` maps a service-slug to its score contribution. */
export interface QuizAnswer {
  id: number;
  /** Parent question id (FK). */
  question: number;
  text: string;
  display_order: number;
  weight: Record<string, number>;
  created_at: ISODateString;
  updated_at: ISODateString;
}

/** A quiz question with its answers (prefetched; active-only, ordered by display_order). */
export interface QuizQuestion {
  id: number;
  text: string;
  display_order: number;
  is_active: boolean;
  created_at: ISODateString;
  updated_at: ISODateString;
  answers: QuizAnswer[];
}

/** GET /api/v1/quiz/questions/ → QuizQuestion[] (no pagination per spec). */
export type QuizQuestionList = QuizQuestion[];

/**
 * POST /api/v1/quiz/submit/ body. D-006: single-select, questionId→answerId.
 * Keys are stringified question ids; values are the chosen answer id.
 */
export type QuizSubmissionPayload = Record<string, number>;

/** 201 response from submit. */
export interface QuizSubmissionResponse {
  result_id: number;
  /** Slug of the recommended Wagtail Service/Project page (fetched separately). */
  recommended_service: string;
  /** Normalized confidence 0..1. */
  match_score: number;
  result_summary: string;
}

/** GET /api/v1/quiz/results/{id}/ (JWT) → full result. */
export interface QuizResultDetail {
  recommended_service: string;
  match_score: number;
  result_summary: string;
  submitted_at: ISODateString;
  submission: {
    /** null for anonymous submissions. */
    user: number | null;
    answers: QuizSubmissionPayload;
    ip_address?: string | null;
    submitted_at: ISODateString;
  };
}
