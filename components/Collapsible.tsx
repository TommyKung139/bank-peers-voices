"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function Collapsible({
  children,
  collapsedLines = 4,
  lineHeightRem = 1.6,
}: {
  children: ReactNode;
  collapsedLines?: number;
  lineHeightRem?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const collapsedHeight = `${collapsedLines * lineHeightRem}rem`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setOverflowing(el.scrollHeight > el.clientHeight + 2);
  }, [children]);

  return (
    <div>
      <div
        ref={ref}
        style={expanded ? undefined : { maxHeight: collapsedHeight }}
        className="overflow-hidden"
      >
        {children}
      </div>
      {overflowing && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1.5 text-xs font-medium text-[var(--accent)] hover:underline"
        >
          {expanded ? "收合 ▲" : "顯示更多 ▼"}
        </button>
      )}
    </div>
  );
}
