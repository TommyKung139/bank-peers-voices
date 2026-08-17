import { Suspense } from "react";
import { BANKS } from "@/lib/banks";
import { getGooglePlayInfo } from "@/lib/scrapers/googlePlay";
import { getAppStoreInfo } from "@/lib/scrapers/appStore";
import { summarizeCrossBankFeatures } from "@/lib/ai/summarize";
import BankFeatureCard from "@/components/BankFeatureCard";
import AISummaryBox from "@/components/AISummaryBox";
import { CardSkeleton, SummarySkeleton } from "@/components/Skeletons";

async function CrossBankOverview() {
  const data = await Promise.all(
    BANKS.map(async (bank) => {
      const [gplay, appstore] = await Promise.all([
        getGooglePlayInfo(bank.googlePlayId),
        getAppStoreInfo(bank.appStoreId),
      ]);
      return { bankName: bank.name, googlePlayInfo: gplay.info, appStoreInfo: appstore.info };
    })
  );
  const summary = await summarizeCrossBankFeatures(data);
  return <AISummaryBox summary={summary} />;
}

export default function FeaturesTab() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-[var(--accent-soft)] bg-[var(--accent-soft)]/40 p-5">
        <p className="text-xs font-semibold text-[var(--accent)] mb-2">🤖 六家銀行競品功能趨勢總覽（AI 分析）</p>
        <Suspense fallback={<SummarySkeleton />}>
          <CrossBankOverview />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {BANKS.map((bank) => (
          <Suspense key={bank.id} fallback={<CardSkeleton />}>
            <BankFeatureCard bank={bank} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}
