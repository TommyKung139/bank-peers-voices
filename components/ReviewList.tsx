"use client";

import { useState } from "react";
import type { StoreReview } from "@/lib/types";

function formatDate(d: string) {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export default function ReviewList({ reviews }: { reviews: StoreReview[] }) {
  const [expanded, setExpanded] = useState(false);
  if (reviews.length === 0) {
    return <p className="text-xs text-[var(--muted)]">目前沒有可顯示的評論。</p>;
  }
  const visible = expanded ? reviews : reviews.slice(0, 3);

  return (
    <div className="space-y-2">
      {visible.map((r) => (
        <div key={r.id} className="rounded-lg bg-[var(--surface-muted)] px-3 py-2">
          <div className="flex items-center justify-between text-[11px] text-[var(--muted)] mb-1">
            <span className="font-medium text-[var(--foreground)]">{r.author}</span>
            <span>
              {"★".repeat(Math.round(r.rating))}
              {"☆".repeat(5 - Math.round(r.rating))} · {formatDate(r.date)}
            </span>
          </div>
          {r.title && <p className="text-xs font-medium mb-0.5">{r.title}</p>}
          <p className="text-xs leading-relaxed text-[var(--foreground)]/85 line-clamp-4">{r.text}</p>
        </div>
      ))}
      {reviews.length > 3 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-[var(--accent)] font-medium hover:underline"
        >
          {expanded ? "收合" : `顯示更多（共 ${reviews.length} 則）`}
        </button>
      )}
    </div>
  );
}
