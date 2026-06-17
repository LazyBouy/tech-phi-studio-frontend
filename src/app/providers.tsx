"use client";

/**
 * App providers (CH-05). Wraps the tree in TanStack Query's client.
 * Source: data-fetching/architecture.md §Request Timeout and Retry.
 *
 * The QueryClient is created lazily in useState so it is NOT shared across
 * server requests (one client per browser session) — the SSR-safe pattern.
 * Devtools render in development only (tree-shaken from production builds).
 */

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 3, // exp backoff 1s, 2s, 4s (capped)
            retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 4000),
            staleTime: 60_000,
            refetchOnWindowFocus: false,
          },
          // User-initiated actions must not auto-resubmit.
          mutations: { retry: false },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
