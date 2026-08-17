"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const TABS = [
  { key: "reviews", label: "用戶評論", icon: "💬" },
  { key: "features", label: "競品內容", icon: "🧩" },
] as const;

export default function TabNav() {
  const searchParams = useSearchParams();
  const active = searchParams.get("tab") === "features" ? "features" : "reviews";

  return (
    <nav className="flex gap-2 border-b border-[var(--border)] px-4 sm:px-8">
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Link
            key={tab.key}
            href={`/?tab=${tab.key}`}
            className={`relative flex items-center gap-2 px-4 py-3 text-sm sm:text-base font-medium transition-colors ${
              isActive
                ? "text-[var(--accent)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {isActive && (
              <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-[var(--accent)] rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
