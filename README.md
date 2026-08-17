# 競品訪查、資訊整理及用戶評分彙整 Dashboard

監控 **國泰世華、玉山、中信、富邦、台新（Richart）、LINE Bank** 六家銀行 App，自動從 **Google Play** 與 **App Store** 抓取：

- **用戶評論** Tab：雙平台最新用戶評論、星等、評分數，並用 AI 產生「用戶心聲摘要」（好評重點／痛點／建議）與六家銀行整體比較總覽。
- **競品內容** Tab：雙平台目前版本、最新更新說明（新功能），並用 AI 產生「功能更新摘要」與六家銀行競品趨勢總覽。

資料每 6 小時自動快取更新，也可在畫面右上角按「重新抓取資料」立即刷新。

## 技術架構

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Google Play 資料：`google-play-scraper`（非官方，抓取公開頁面）
- App Store 資料：Apple 官方公開 JSON 端點（`itunes.apple.com/lookup`、`.../rss/customerreviews`）
- AI 摘要：Google Gemini API（`gemini-2.5-flash`）
- 快取：Next.js `unstable_cache`，6 小時 revalidate，可用 `/api/revalidate` 手動或排程清除

## 本機開發

```bash
npm install
cp .env.example .env.local   # 填入 GEMINI_API_KEY 才能看到 AI 摘要
npm run dev
```

開啟 http://localhost:3000

## 部署到 Vercel

1. 將此資料夾推到你的 GitHub repo（或直接用 Vercel CLI 部署）：
   ```bash
   vercel --cwd bank-dashboard
   ```
   或在 Vercel Dashboard 選擇 **Import Project**，Root Directory 設為 `bank-dashboard`。

2. 在 Vercel 專案的 **Settings → Environment Variables** 新增：
   | 變數 | 說明 | 必填 |
   |---|---|---|
   | `GEMINI_API_KEY` | 你的 Google Gemini API Key（[AI Studio 取得](https://aistudio.google.com/apikey)），用於產生 AI 摘要 | ✅ 是（沒設定的話畫面會顯示「尚未設定」提示，其餘資料仍正常顯示） |
   | `CRON_SECRET` | 保護 `/api/revalidate` 排程端點，設定後 Vercel Cron 會自動帶入 `Authorization: Bearer <值>` | 選填 |

3. 部署完成即可使用。`vercel.json` 已內建每日凌晨 1 點（UTC）自動預熱快取的 Cron Job（Hobby 方案每個 cron 最多一天一次；升級 Pro 方案可改成更頻繁，例如每 6 小時 `0 */6 * * *`）。

## 銀行與 App 對照表

| 銀行 | Google Play ID | App Store ID |
|---|---|---|
| 國泰世華 | `com.cathaybk.mymobibank.android` | `373500505` |
| 玉山銀行 | `com.esunbank` | `405033836` |
| 中國信託 | `com.chinatrust.mobilebank` | `417698185` |
| 台北富邦（Fubon+） | `com.fubon.aibank` | `6479990131` |
| 台新 Richart | `tw.com.taishinbank.richart` | `1079733142` |
| LINE Bank | `com.linebank.tw` | `1527512597` |

如需增減銀行或改用其他 App（例如台新的傳統行動銀行 App、富邦舊版行動銀行），修改 [`lib/banks.ts`](lib/banks.ts) 即可。

## 注意事項

- Google Play 的資料抓取方式屬於非官方公開頁面解析，Google 若調整頁面結構可能導致抓取失敗；App 卡片會顯示「資料抓取失敗」但不影響其他銀行運作。
- App Store 使用 Apple 官方公開 JSON 端點，較穩定。
- 本專案僅彙整公開頁面上的評論與版本說明文字，未使用任何需要登入或授權的私有 API。
