export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 animate-pulse">
      <div className="h-5 w-32 rounded bg-[var(--surface-muted)] mb-4" />
      <div className="h-4 w-full rounded bg-[var(--surface-muted)] mb-2" />
      <div className="h-4 w-5/6 rounded bg-[var(--surface-muted)] mb-2" />
      <div className="h-4 w-2/3 rounded bg-[var(--surface-muted)]" />
    </div>
  );
}

export function SummarySkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      <div className="h-3.5 w-11/12 rounded bg-[var(--surface-muted)]" />
      <div className="h-3.5 w-4/5 rounded bg-[var(--surface-muted)]" />
      <div className="h-3.5 w-2/3 rounded bg-[var(--surface-muted)]" />
    </div>
  );
}
