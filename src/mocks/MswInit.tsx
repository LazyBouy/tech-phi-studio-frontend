"use client";

/**
 * MswInit (CH-04a) — side-effect-only client component that starts the MSW
 * browser worker on mount (when NEXT_PUBLIC_USE_MOCKS === 'true'). Renders
 * nothing, so it never affects markup/hydration. Mounted in the root layout.
 *
 * NOTE: there is no CSR data fetching yet (arrives CH-08+). When it does, revisit
 * whether to gate first paint on worker readiness to avoid an early-request race.
 */

import { useEffect } from "react";
import { initMocks } from "./init";

export function MswInit() {
  useEffect(() => {
    void initMocks();
  }, []);
  return null;
}
