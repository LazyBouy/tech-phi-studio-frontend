/**
 * MSW node server (CH-04a) — intercepts server-side fetch (RSC/SSR) and is the
 * handler source for Vitest. Started by instrumentation.ts (dev) and the Vitest
 * setup file. See ADR-0001.
 */
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
