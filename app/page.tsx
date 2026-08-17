import ReviewsTab from "@/components/ReviewsTab";
import FeaturesTab from "@/components/FeaturesTab";

export default async function Home({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const tabParam = Array.isArray(params.tab) ? params.tab[0] : params.tab;
  const activeTab = tabParam === "features" ? "features" : "reviews";

  return activeTab === "reviews" ? <ReviewsTab /> : <FeaturesTab />;
}
