/**
 * Vitest global setup (CH-04a). Boots the MSW node server for the whole test run
 * and resets handlers between tests so per-test `server.use(...)` overrides don't
 * leak. `onUnhandledRequest: 'error'` surfaces any request without a handler.
 */
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "@/mocks/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
