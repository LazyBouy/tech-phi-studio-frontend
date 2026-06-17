/**
 * Mock init gate (CH-04a). Single entry that starts the right MSW instance for
 * the current runtime, only when NEXT_PUBLIC_USE_MOCKS === 'true' (ADR-0001).
 * Dynamic imports keep msw/node out of the browser bundle and vice-versa.
 */

export const mocksEnabled = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

let started = false;

export async function initMocks(): Promise<void> {
  if (!mocksEnabled || started) return;
  started = true;

  if (typeof window === "undefined") {
    const { server } = await import("./server");
    server.listen({ onUnhandledRequest: "bypass" });
  } else {
    const { worker } = await import("./browser");
    await worker.start({ onUnhandledRequest: "bypass" });
  }
}
