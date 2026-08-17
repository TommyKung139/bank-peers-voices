"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RefreshButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleClick() {
    setIsLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/revalidate", { method: "POST" });
      if (!res.ok) throw new Error("revalidate failed");
      router.refresh();
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 text-xs sm:text-sm font-medium text-[var(--foreground)] shadow-sm transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-60"
      >
        <span className={isLoading ? "animate-spin" : ""}>⟳</span>
        {isLoading ? "重新整理中…" : "重新抓取資料"}
      </button>
      {error && (
        <span className="text-xs text-[var(--negative)]">更新失敗，請稍後再試</span>
      )}
    </div>
  );
}
