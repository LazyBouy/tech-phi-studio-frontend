import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Vitest config (CH-04a). Node environment — service/client tests don't need a
 * DOM (RTL + jsdom arrive with the first components, CH-08). MSW intercepts fetch
 * at the network layer via the setup file. `@/` is aliased to ./src to match the
 * tsconfig path mapping (avoids an extra tsconfig-paths plugin dependency).
 */
export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    // Set before any module loads so client.ts + handlers share one base URL.
    env: {
      NEXT_PUBLIC_API_URL: "http://localhost:8000",
      NEXT_PUBLIC_USE_MOCKS: "true",
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
