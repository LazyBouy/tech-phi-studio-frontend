/**
 * PageStub (CH-05) — placeholder for route skeleton pages. Each real page
 * replaces its stub in the chunk noted by `chunk`. Server-component safe.
 */
export function PageStub({ title, chunk }: { title: string; chunk: string }) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center gap-3 px-6 py-24">
      <p className="text-body-sm uppercase tracking-snug text-ink-subtle">Tech Phi Studio</p>
      <h1 className="text-h2 font-display text-ink">{title}</h1>
      <p className="text-body text-ink-muted">
        Placeholder route — real content arrives in <span className="text-accent">{chunk}</span>.
      </p>
    </main>
  );
}
