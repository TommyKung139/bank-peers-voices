import { Suspense } from "react";
import type { Bank } from "@/lib/banks";
import { getGooglePlayInfo } from "@/lib/scrapers/googlePlay";
import { getAppStoreInfo } from "@/lib/scrapers/appStore";
import { summarizeBankFeatures } from "@/lib/ai/summarize";
import AISummaryBox from "@/components/AISummaryBox";
import { SummarySkeleton } from "@/components/Skeletons";

function formatDate(d: string) {
  if (!d) return "未知";
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit" });
}

async function AISection({ bank }: { bank: Bank }) {
  const [gplayInfo, appstoreInfo] = await Promise.all([
    getGooglePlayInfo(bank.googlePlayId),
    getAppStoreInfo(bank.appStoreId),
  ]);
  const summary = await summarizeBankFeatures(bank.name, gplayInfo.info, appstoreInfo.info);
  return <AISummaryBox summary={summary} />;
}

export default async function BankFeatureCard({ bank }: { bank: Bank }) {
  const [gplayInfo, appstoreInfo] = await Promise.all([
    getGooglePlayInfo(bank.googlePlayId),
    getAppStoreInfo(bank.appStoreId),
  ]);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white text-xs font-bold"
          style={{ backgroundColor: bank.color }}
        >
          {bank.shortName.slice(0, 2)}
        </span>
        <h3 className="font-semibold leading-tight">{bank.name}</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl bg-[var(--surface-muted)] p-3">
          <p className="text-[11px] text-[var(--muted)] mb-1">Google Play</p>
          {gplayInfo.info ? (
            <>
              <p className="text-xs">版本 {gplayInfo.info.version}</p>
              <p className="text-[11px] text-[var(--muted)] mb-2">更新日：{formatDate(gplayInfo.info.updated)}</p>
              <p className="text-xs leading-relaxed whitespace-pre-line line-clamp-6 text-[var(--foreground)]/85">
                {gplayInfo.info.releaseNotes || "本次更新未提供說明"}
              </p>
            </>
          ) : (
            <p className="text-xs text-[var(--negative)]">資料抓取失敗</p>
          )}
        </div>
        <div className="rounded-xl bg-[var(--surface-muted)] p-3">
          <p className="text-[11px] text-[var(--muted)] mb-1">App Store</p>
          {appstoreInfo.info ? (
            <>
              <p className="text-xs">版本 {appstoreInfo.info.version}</p>
              <p className="text-[11px] text-[var(--muted)] mb-2">更新日：{formatDate(appstoreInfo.info.updated)}</p>
              <p className="text-xs leading-relaxed whitespace-pre-line line-clamp-6 text-[var(--foreground)]/85">
                {appstoreInfo.info.releaseNotes || "本次更新未提供說明"}
              </p>
            </>
          ) : (
            <p className="text-xs text-[var(--negative)]">資料抓取失敗</p>
          )}
        </div>
      </div>

      <div className="border-t border-[var(--border)] pt-3">
        <p className="text-xs font-semibold text-[var(--accent)] mb-2">🤖 AI 功能更新摘要</p>
        <Suspense fallback={<SummarySkeleton />}>
          <AISection bank={bank} />
        </Suspense>
      </div>
    </div>
  );
}
