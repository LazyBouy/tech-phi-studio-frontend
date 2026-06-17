"use client";

/**
 * Root route error boundary (CH-05). Next renders this for uncaught errors
 * during render/data-fetch in a route segment. Generic message + reset()
 * (re-runs the segment). Per error-handling/architecture.md 5xx/network → retry UI.
 */
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Dev: console only. Production logging service is TBD (error-handling spec).
    console.error("[route error]", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-h3 font-display text-ink">Something went wrong on our end.</h1>
      <p className="text-body text-ink-muted">Try again shortly.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 rounded-full bg-ink px-6 py-3 text-body-sm text-surface transition-opacity hover:opacity-90"
      >
        Try again
      </button>
    </main>
  );
}
