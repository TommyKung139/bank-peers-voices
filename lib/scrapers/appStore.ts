import { unstable_cache } from "next/cache";
import type { StoreAppInfo, StoreReview, StoreInfoResult, StoreReviewsResult } from "@/lib/types";

const REVALIDATE_SECONDS = 6 * 60 * 60; // 6 hours
const COUNTRY = "tw";

type ITunesLookupResult = {
  version?: string;
  releaseNotes?: string;
  averageUserRating?: number;
  userRatingCount?: number;
  currentVersionReleaseDate?: string;
  description?: string;
  trackName?: string;
  artworkUrl512?: string;
  trackViewUrl?: string;
};

async function fetchAppStoreInfo(appStoreId: string): Promise<StoreInfoResult> {
  try {
    const res = await fetch(
      `https://itunes.apple.com/lookup?id=${appStoreId}&country=${COUNTRY}`,
      { next: { revalidate: REVALIDATE_SECONDS, tags: ["store-data"] } }
    );
    if (!res.ok) throw new Error(`iTunes lookup failed: ${res.status}`);
    const json = (await res.json()) as { results: ITunesLookupResult[] };
    const app = json.results?.[0];
    if (!app) throw new Error("App not found on App Store lookup");

    const info: StoreAppInfo = {
      store: "appStore",
      appId: appStoreId,
      title: app.trackName ?? "",
      version: app.version ?? "N/A",
      score: app.averageUserRating ?? 0,
      ratingsCount: app.userRatingCount ?? 0,
      updated: app.currentVersionReleaseDate ?? "",
      releaseNotes: app.releaseNotes ?? "",
      description: app.description ?? "",
      icon: app.artworkUrl512,
      url: app.trackViewUrl ?? `https://apps.apple.com/${COUNTRY}/app/id${appStoreId}`,
    };
    return { info };
  } catch (err) {
    return { info: null, error: err instanceof Error ? err.message : "unknown error" };
  }
}

type RSSEntry = {
  id?: { label?: string };
  author?: { name?: { label?: string } };
  title?: { label?: string };
  content?: { label?: string };
  "im:rating"?: { label?: string };
  "im:version"?: { label?: string };
  updated?: { label?: string };
};

async function fetchAppStoreReviews(appStoreId: string): Promise<StoreReviewsResult> {
  try {
    const reviews: StoreReview[] = [];
    for (const page of [1, 2]) {
      const res = await fetch(
        `https://itunes.apple.com/${COUNTRY}/rss/customerreviews/page=${page}/id=${appStoreId}/sortby=mostrecent/json`,
        { next: { revalidate: REVALIDATE_SECONDS, tags: ["store-data"] } }
      );
      if (!res.ok) continue;
      const json = (await res.json()) as { feed?: { entry?: RSSEntry[] } };
      const entries = json.feed?.entry;
      if (!Array.isArray(entries)) continue;
      // first entry on page 1 is the app itself, not a review
      for (const entry of entries) {
        const rating = entry["im:rating"]?.label;
        if (rating === undefined) continue;
        reviews.push({
          id: entry.id?.label ?? crypto.randomUUID(),
          author: entry.author?.name?.label ?? "匿名",
          rating: Number(rating),
          date: entry.updated?.label ?? "",
          title: entry.title?.label,
          text: entry.content?.label ?? "",
          version: entry["im:version"]?.label,
        });
      }
    }
    return { store: "appStore", reviews: reviews.slice(0, 25) };
  } catch (err) {
    return { store: "appStore", reviews: [], error: err instanceof Error ? err.message : "unknown error" };
  }
}

export const getAppStoreInfo = unstable_cache(fetchAppStoreInfo, ["appstore-info"], {
  revalidate: REVALIDATE_SECONDS,
  tags: ["store-data"],
});

export const getAppStoreReviews = unstable_cache(fetchAppStoreReviews, ["appstore-reviews"], {
  revalidate: REVALIDATE_SECONDS,
  tags: ["store-data"],
});
