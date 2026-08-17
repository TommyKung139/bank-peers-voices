import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

function runRevalidate() {
  revalidateTag("store-data", "max");
  revalidateTag("ai-summary", "max");
  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}

// Manual refresh triggered from the dashboard UI.
export async function POST() {
  return runRevalidate();
}

// Used by Vercel Cron to pre-warm the cache on a schedule. If CRON_SECRET is
// set, Vercel Cron automatically sends it as `Authorization: Bearer <secret>`.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }
  return runRevalidate();
}
