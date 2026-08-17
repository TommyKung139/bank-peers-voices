import TabNav from "@/components/TabNav";
import RefreshButton from "@/components/RefreshButton";
import ReviewsTab from "@/components/ReviewsTab";
import FeaturesTab from "@/components/FeaturesTab";

export default async function Home({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const tabParam = Array.isArray(params.tab) ? params.tab[0] : params.tab;
  const activeTab = tabParam === "features" ? "features" : "reviews";

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold">競品訪查、資訊整理及用戶評分彙整 Dashboard</h1>
            <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
              監控國泰・玉山・中信・富邦・台新・LineBank 六家銀行 App 於 Google Play 與 App Store 的用戶評論與功能更新
            </p>
          </div>
          <RefreshButton />
        </div>
        <div className="max-w-7xl mx-auto">
          <TabNav active={activeTab} />
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
        {activeTab === "reviews" ? <ReviewsTab /> : <FeaturesTab />}
      </main>

      <footer className="border-t border-[var(--border)] px-4 sm:px-8 py-4 text-center text-[11px] text-[var(--muted)]">
        資料每 6 小時自動更新一次，或點擊「重新抓取資料」立即更新。資料來源：Google Play、App Store 公開頁面。
      </footer>
    </div>
  );
}
