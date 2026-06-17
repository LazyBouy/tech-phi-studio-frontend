/**
 * MSW browser worker (CH-04a) — intercepts client-side fetch in the running dev
 * app. Backed by public/mockServiceWorker.js. Started by MswInit. See ADR-0001.
 */
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);
