import { Suspense } from "react";
import { BANKS } from "@/lib/banks";
import { getGooglePlayReviews } from "@/lib/scrapers/googlePlay";
import { getAppStoreReviews } from "@/lib/scrapers/appStore";
import { summarizeCrossBankReviews } from "@/lib/ai/summarize";
import BankReviewCard from "@/components/BankReviewCard";
import AISummaryBox from "@/components/AISummaryBox";
import { CardSkeleton, SummarySkeleton } from "@/components/Skeletons";

async function CrossBankOverview() {
  const data = await Promise.all(
    BANKS.map(async (bank) => {
      const [gplay, appstore] = await Promise.all([
        getGooglePlayReviews(bank.googlePlayId),
        getAppStoreReviews(bank.appStoreId),
      ]);
      return { bankName: bank.name, googlePlayReviews: gplay.reviews, appStoreReviews: appstore.reviews };
    })
  );
  const summary = await summarizeCrossBankReviews(data);
  return <AISummaryBox summary={summary} />;
}

export default function ReviewsTab() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-[var(--accent-soft)] bg-[var(--accent-soft)]/40 p-5">
        <p className="text-xs font-semibold text-[var(--accent)] mb-2">🤖 六家銀行整體評論總覽（AI 分析）</p>
        <Suspense fallback={<SummarySkeleton />}>
          <CrossBankOverview />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {BANKS.map((bank) => (
          <Suspense key={bank.id} fallback={<CardSkeleton />}>
            <BankReviewCard bank={bank} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}
