/**
 * Global 404 (CH-05). Rendered by Next when a route is unmatched or a page
 * component calls notFound() (e.g. fetchPageBySlug → ApiError(404)).
 */
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-display font-serif italic text-accent">404</p>
      <h1 className="text-h3 font-display text-ink">This page wandered off.</h1>
      <p className="text-body text-ink-muted">
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-ink px-6 py-3 text-body-sm text-surface transition-opacity hover:opacity-90"
      >
        Back home
      </Link>
    </main>
  );
}
