import { unstable_cache } from "next/cache";
import gplay from "google-play-scraper";
import type { StoreAppInfo, StoreReview, StoreInfoResult, StoreReviewsResult } from "@/lib/types";
import { sanitizeHtml } from "@/lib/sanitizeHtml";

const REVALIDATE_SECONDS = 6 * 60 * 60; // 6 hours

async function fetchGooglePlayInfo(googlePlayId: string): Promise<StoreInfoResult> {
  try {
    const app = await gplay.app({ appId: googlePlayId, lang: "zh_TW", country: "tw" });
    const info: StoreAppInfo = {
      store: "googlePlay",
      appId: googlePlayId,
      title: app.title,
      version: app.version ?? "N/A",
      score: app.score ?? 0,
      ratingsCount: app.ratings ?? 0,
      updated: app.updated ? new Date(app.updated).toISOString() : "",
      releaseNotes: sanitizeHtml(app.recentChanges ?? ""),
      description: sanitizeHtml(app.summary ?? app.description ?? ""),
      icon: app.icon,
      url: app.url,
    };
    return { info };
  } catch (err) {
    return { info: null, error: err instanceof Error ? err.message : "unknown error" };
  }
}

async function fetchGooglePlayReviews(googlePlayId: string): Promise<StoreReviewsResult> {
  try {
    const result = await gplay.reviews({
      appId: googlePlayId,
      lang: "zh_TW",
      country: "tw",
      sort: 2, // gplay.sort.NEWEST
      num: 25,
    });
    const reviews: StoreReview[] = result.data.map((r) => ({
      id: r.id,
      author: r.userName,
      rating: r.score,
      date: r.date,
      title: r.title,
      text: r.text,
      version: r.version,
    }));
    return { store: "googlePlay", reviews };
  } catch (err) {
    return { store: "googlePlay", reviews: [], error: err instanceof Error ? err.message : "unknown error" };
  }
}

export const getGooglePlayInfo = unstable_cache(fetchGooglePlayInfo, ["gplay-info"], {
  revalidate: REVALIDATE_SECONDS,
  tags: ["store-data"],
});

export const getGooglePlayReviews = unstable_cache(fetchGooglePlayReviews, ["gplay-reviews"], {
  revalidate: REVALIDATE_SECONDS,
  tags: ["store-data"],
});
