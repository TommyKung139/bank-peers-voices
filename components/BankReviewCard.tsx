import { Suspense } from "react";
import type { Bank } from "@/lib/banks";
import { getGooglePlayInfo, getGooglePlayReviews } from "@/lib/scrapers/googlePlay";
import { getAppStoreInfo, getAppStoreReviews } from "@/lib/scrapers/appStore";
import { summarizeBankReviews } from "@/lib/ai/summarize";
import StarRating from "@/components/StarRating";
import ReviewList from "@/components/ReviewList";
import AISummaryBox from "@/components/AISummaryBox";
import { SummarySkeleton } from "@/components/Skeletons";

async function AISection({ bank }: { bank: Bank }) {
  const [gplayReviews, appstoreReviews] = await Promise.all([
    getGooglePlayReviews(bank.googlePlayId),
    getAppStoreReviews(bank.appStoreId),
  ]);
  const summary = await summarizeBankReviews(bank.name, gplayReviews.reviews, appstoreReviews.reviews);
  return <AISummaryBox summary={summary} />;
}

export default async function BankReviewCard({ bank }: { bank: Bank }) {
  const [gplayInfo, gplayReviews, appstoreInfo, appstoreReviews] = await Promise.all([
    getGooglePlayInfo(bank.googlePlayId),
    getGooglePlayReviews(bank.googlePlayId),
    getAppStoreInfo(bank.appStoreId),
    getAppStoreReviews(bank.appStoreId),
  ]);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white text-xs font-bold"
            style={{ backgroundColor: bank.color }}
          >
            {bank.shortName.slice(0, 2)}
          </span>
          <div>
            <h3 className="font-semibold leading-tight">{bank.name}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-[var(--surface-muted)] p-3">
          <p className="text-[11px] text-[var(--muted)] mb-1">Google Play</p>
          {gplayInfo.info ? (
            <>
              <StarRating score={gplayInfo.info.score} />
              <p className="text-[11px] text-[var(--muted)] mt-0.5">
                {gplayInfo.info.ratingsCount.toLocaleString("zh-TW")} 則評分
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
              <StarRating score={appstoreInfo.info.score} />
              <p className="text-[11px] text-[var(--muted)] mt-0.5">
                {appstoreInfo.info.ratingsCount.toLocaleString("zh-TW")} 則評分
              </p>
            </>
          ) : (
            <p className="text-xs text-[var(--negative)]">資料抓取失敗</p>
          )}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-[var(--muted)] mb-2">Google Play 最新評論</p>
        <ReviewList reviews={gplayReviews.reviews} />
      </div>
      <div>
        <p className="text-xs font-semibold text-[var(--muted)] mb-2">App Store 最新評論</p>
        <ReviewList reviews={appstoreReviews.reviews} />
      </div>

      <div className="border-t border-[var(--border)] pt-3">
        <p className="text-xs font-semibold text-[var(--accent)] mb-2">🤖 AI 用戶心聲摘要</p>
        <Suspense fallback={<SummarySkeleton />}>
          <AISection bank={bank} />
        </Suspense>
      </div>
    </div>
  );
}
