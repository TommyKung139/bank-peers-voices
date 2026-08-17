export default function StarRating({ score }: { score: number }) {
  const rounded = Math.round(score * 2) / 2;
  return (
    <span className="inline-flex items-center gap-1 text-amber-500 text-sm">
      <span aria-hidden>{"★".repeat(Math.round(rounded))}{"☆".repeat(5 - Math.round(rounded))}</span>
      <span className="text-[var(--muted)] font-normal">{score ? score.toFixed(1) : "N/A"}</span>
    </span>
  );
}
