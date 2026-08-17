import type { ReactNode } from "react";

function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-${i}`} className="font-semibold text-[var(--foreground)]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>;
  });
}

export default function Markdown({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: ReactNode[] = [];
  let listBuffer: string[] = [];
  let listKey = 0;

  function flushList() {
    if (listBuffer.length === 0) return;
    blocks.push(
      <ul key={`ul-${listKey++}`} className="list-disc pl-5 space-y-1 my-2">
        {listBuffer.map((item, i) => (
          <li key={i} className="text-sm leading-relaxed text-[var(--foreground)]/90">
            {renderInline(item, `li-${listKey}-${i}`)}
          </li>
        ))}
      </ul>
    );
    listBuffer = [];
  }

  lines.forEach((raw, idx) => {
    const line = raw.trim();
    if (line === "") {
      flushList();
      return;
    }
    if (line.startsWith("## ") || line.startsWith("### ")) {
      flushList();
      const content = line.replace(/^#+\s*/, "");
      blocks.push(
        <h4 key={`h-${idx}`} className="font-semibold text-sm mt-3 mb-1 text-[var(--accent)]">
          {renderInline(content, `h-${idx}`)}
        </h4>
      );
      return;
    }
    if (/^[-*]\s+/.test(line)) {
      listBuffer.push(line.replace(/^[-*]\s+/, ""));
      return;
    }
    if (/^\d+\.\s+/.test(line)) {
      listBuffer.push(line.replace(/^\d+\.\s+/, ""));
      return;
    }
    flushList();
    blocks.push(
      <p key={`p-${idx}`} className="text-sm leading-relaxed text-[var(--foreground)]/90 my-1">
        {renderInline(line, `p-${idx}`)}
      </p>
    );
  });
  flushList();

  return <div>{blocks}</div>;
}
