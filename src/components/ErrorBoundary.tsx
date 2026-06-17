"use client";

/**
 * ErrorBoundary (CH-05) — section-level React error boundary.
 * Placement (error-handling/architecture.md): wrap one per top-level SECTION
 * (HeroSection, ServicesList, …), NOT atomic UI, Navigation, or Footer. A crash
 * in one section then shows a fallback without taking down the rest of the page.
 *
 * Minimal inline fallback for now; swaps to <ErrorBanner> (with retry) in CH-08.
 */

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Optional custom fallback; defaults to the inline banner below. */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Dev: console only. Production logging service is TBD (error-handling spec).
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            role="alert"
            className="rounded-lg border border-black-10 bg-surface p-4 text-body-sm text-ink-muted"
          >
            Something went wrong loading this section.
          </div>
        )
      );
    }
    return this.props.children;
  }
}
