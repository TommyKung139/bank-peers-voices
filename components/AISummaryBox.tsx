import Markdown from "@/components/Markdown";
import Collapsible from "@/components/Collapsible";
import type { AISummary } from "@/lib/types";

export default function AISummaryBox({ summary }: { summary: AISummary }) {
  if (summary.error) {
    return (
      <p className="text-xs text-[var(--muted)] italic">
        AI 摘要暫時無法產生：{summary.error}
      </p>
    );
  }
  if (!summary.summary) {
    return <p className="text-xs text-[var(--muted)] italic">尚無足夠資料可產生摘要。</p>;
  }
  return (
    <div>
      <Collapsible collapsedLines={4}>
        <Markdown text={summary.summary} />
      </Collapsible>
      <p className="mt-2 text-[11px] text-[var(--muted)]">
        AI 摘要產生時間：{new Date(summary.generatedAt).toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}
      </p>
    </div>
  );
}
