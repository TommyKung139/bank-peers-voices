"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");

  async function handleClick() {
    setStatus("idle");
    try {
      const res = await fetch("/api/revalidate", { method: "POST" });
      if (!res.ok) throw new Error("revalidate failed");
      setStatus("done");
      startTransition(() => {
        router.refresh();
      });
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleClick}
        disabled={isPending}
        className="flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 text-xs sm:text-sm font-medium text-[var(--foreground)] shadow-sm transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-60"
      >
        <span className={isPending ? "animate-spin" : ""}>⟳</span>
        {isPending ? "重新整理中…" : "重新抓取資料"}
      </button>
      {status === "done" && !isPending && (
        <span className="text-xs text-[var(--positive)]">已更新</span>
      )}
      {status === "error" && (
        <span className="text-xs text-[var(--negative)]">更新失敗，請稍後再試</span>
      )}
    </div>
  );
}
