import { CardSkeleton, SummarySkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-[var(--accent-soft)] bg-[var(--accent-soft)]/40 p-5">
        <SummarySkeleton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
