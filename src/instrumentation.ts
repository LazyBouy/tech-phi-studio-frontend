/**
 * Next.js instrumentation (CH-04a) — runs once on server startup. Starts the MSW
 * node server for SSR/RSC fetch interception when mocks are enabled. Guarded to
 * the Node runtime (msw/node is unavailable on the edge runtime). See ADR-0001.
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initMocks } = await import("@/mocks/init");
    await initMocks();
  }
}
