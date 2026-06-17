"use client";

/**
 * useReducedMotion (CH-06) — tracks the OS "reduce motion" setting via
 * matchMedia('(prefers-reduced-motion: reduce)'). Implemented with
 * useSyncExternalStore: SSR-safe (server snapshot = false) and subscription-based
 * (no setState-in-effect). Every animation hook (CH-14) calls this first and
 * early-returns when true, so elements render at their final state.
 */

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshot(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
