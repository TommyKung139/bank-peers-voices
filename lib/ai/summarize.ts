import { unstable_cache } from "next/cache";
import { GoogleGenAI } from "@google/genai";
import type { AISummary, StoreAppInfo, StoreReview } from "@/lib/types";

const REVALIDATE_SECONDS = 6 * 60 * 60; // 6 hours
const MODEL = "gemini-2.5-flash";
const LENGTH_LIMIT = "請務必精簡，全文（含標題與條列符號）總長度不超過500字。";

function getClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

async function callGemini(prompt: string): Promise<AISummary> {
  const client = getClient();
  if (!client) {
    return {
      summary: "",
      generatedAt: new Date().toISOString(),
      error: "尚未設定 GEMINI_API_KEY，請於 Vercel 環境變數中新增後重新部署。",
    };
  }
  try {
    const response = await client.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: { maxOutputTokens: 700 },
    });
    const text = (response.text ?? "").trim();
    return { summary: text, generatedAt: new Date().toISOString() };
  } catch (err) {
    return {
      summary: "",
      generatedAt: new Date().toISOString(),
      error: err instanceof Error ? err.message : "AI 摘要產生失敗",
    };
  }
}

function formatReviews(store: string, reviews: StoreReview[]): string {
  if (reviews.length === 0) return `【${store}】無可用評論資料`;
  return `【${store}】\n` + reviews
    .slice(0, 20)
    .map((r) => `- (${r.rating}★ ${r.date}) ${r.title ? r.title + "：" : ""}${r.text}`.slice(0, 400))
    .join("\n");
}

async function doSummarizeBankReviews(
  bankName: string,
  googlePlayReviews: StoreReview[],
  appStoreReviews: StoreReview[]
): Promise<AISummary> {
  const prompt = `你是一位金融數位產品分析師。以下是「${bankName}」在 Google Play 與 App Store 上最近的用戶評論。請用繁體中文，以精簡條列方式整理成一份摘要，包含：
1. 整體evaluation情緒傾向（正面/負面/中立比例概述）
2. 用戶最常稱讚的重點（2-4點）
3. 用戶最常抱怨的痛點（2-4點）
4. 值得產品團隊關注的建議（1-3點）

${formatReviews("Google Play", googlePlayReviews)}

${formatReviews("App Store", appStoreReviews)}

請直接輸出摘要內容，不需要開場白，使用 Markdown 條列格式。${LENGTH_LIMIT}`;
  return callGemini(prompt);
}

function formatFeatureInfo(store: string, info: StoreAppInfo | null): string {
  if (!info) return `【${store}】無可用資料`;
  return `【${store}】目前版本：${info.version}，更新日期：${info.updated || "未知"}\n最新版說明：${(info.releaseNotes || "無").slice(0, 800)}\nApp 簡介：${(info.description || "").slice(0, 500)}`;
}

async function doSummarizeBankFeatures(
  bankName: string,
  googlePlayInfo: StoreAppInfo | null,
  appStoreInfo: StoreAppInfo | null
): Promise<AISummary> {
  const prompt = `你是一位金融科技競品分析師。以下是「${bankName}」App 在 Google Play 與 App Store 上的最新版本資訊與更新說明。請用繁體中文條列整理：
1. 近期新增或強化的主要功能（條列，盡量具體）
2. 產品策略方向觀察（例如著重於哪個領域：AI理財、支付、信用卡、投資、UX優化等）
3. 對我方產品可能的參考或啟示（1-3點）

${formatFeatureInfo("Google Play", googlePlayInfo)}

${formatFeatureInfo("App Store", appStoreInfo)}

請直接輸出摘要內容，不需要開場白，使用 Markdown 條列格式。${LENGTH_LIMIT}`;
  return callGemini(prompt);
}

type BankReviewData = { bankName: string; googlePlayReviews: StoreReview[]; appStoreReviews: StoreReview[] };

async function doSummarizeCrossBankReviews(data: BankReviewData[]): Promise<AISummary> {
  const body = data
    .map((d) => {
      const all = [...d.googlePlayReviews, ...d.appStoreReviews];
      const avg = all.length ? (all.reduce((s, r) => s + r.rating, 0) / all.length).toFixed(2) : "N/A";
      const sample = all.slice(0, 8).map((r) => `  - (${r.rating}★) ${r.text}`.slice(0, 200)).join("\n");
      return `## ${d.bankName}（近期平均評分約 ${avg}）\n${sample}`;
    })
    .join("\n\n");

  const prompt = `你是一位金融數位產品市場分析師。以下是六家台灣銀行 App 的近期用戶評論摘錄。請用繁體中文提供一份跨銀行比較總結，包含：
1. 整體市場用戶滿意度概況比較
2. 哪些銀行的用戶評價相對突出（正面或負面）及原因
3. 六家銀行用戶共同抱怨的產業共通痛點（若有）
4. 給我方數位平台經營團隊的整體觀察建議

${body}

請直接輸出摘要內容，使用 Markdown 條列格式，適度使用小標題。${LENGTH_LIMIT}`;
  return callGemini(prompt);
}

type BankFeatureData = { bankName: string; googlePlayInfo: StoreAppInfo | null; appStoreInfo: StoreAppInfo | null };

async function doSummarizeCrossBankFeatures(data: BankFeatureData[]): Promise<AISummary> {
  const body = data
    .map((d) => {
      const notes = d.googlePlayInfo?.releaseNotes || d.appStoreInfo?.releaseNotes || "無資料";
      return `## ${d.bankName}\n最新更新說明：${notes.slice(0, 500)}`;
    })
    .join("\n\n");

  const prompt = `你是一位金融科技競品分析師。以下是六家台灣銀行 App 的最新版本更新說明。請用繁體中文提供一份跨銀行競品趨勢總結，包含：
1. 目前業界共同的功能發展趨勢（例如：AI理財、無卡提款、跨行轉帳優惠、聯名信用卡整合等）
2. 哪些銀行走在功能創新前緣，做了什麼差異化的事
3. 我方可以參考或提前佈局的機會點

${body}

請直接輸出摘要內容，使用 Markdown 條列格式，適度使用小標題。${LENGTH_LIMIT}`;
  return callGemini(prompt);
}

export const summarizeBankReviews = unstable_cache(doSummarizeBankReviews, ["ai-bank-reviews"], {
  revalidate: REVALIDATE_SECONDS,
  tags: ["ai-summary"],
});

export const summarizeBankFeatures = unstable_cache(doSummarizeBankFeatures, ["ai-bank-features"], {
  revalidate: REVALIDATE_SECONDS,
  tags: ["ai-summary"],
});

export const summarizeCrossBankReviews = unstable_cache(doSummarizeCrossBankReviews, ["ai-cross-reviews"], {
  revalidate: REVALIDATE_SECONDS,
  tags: ["ai-summary"],
});

export const summarizeCrossBankFeatures = unstable_cache(doSummarizeCrossBankFeatures, ["ai-cross-features"], {
  revalidate: REVALIDATE_SECONDS,
  tags: ["ai-summary"],
});
