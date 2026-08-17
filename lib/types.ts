export type StoreReview = {
  id: string;
  author: string;
  rating: number;
  date: string;
  title?: string;
  text: string;
  version?: string;
};

export type StoreAppInfo = {
  store: "googlePlay" | "appStore";
  appId: string;
  title: string;
  version: string;
  score: number;
  ratingsCount: number;
  updated: string;
  releaseNotes: string;
  description: string;
  icon?: string;
  url: string;
};

export type StoreReviewsResult = {
  store: "googlePlay" | "appStore";
  reviews: StoreReview[];
  error?: string;
};

export type StoreInfoResult = {
  info: StoreAppInfo | null;
  error?: string;
};

export type AISummary = {
  summary: string;
  generatedAt: string;
  error?: string;
};
