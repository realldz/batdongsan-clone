import type { Metadata } from "next";
import { HeroSearch } from "@/components/HeroSearch/HeroSearch";
import { PropertyGrid } from "@/components/PropertyGrid/PropertyGrid";
import { RecommendationSection } from "@/components/RecommendationSection/RecommendationSection";
import { LocationGrid } from "@/components/LocationGrid/LocationGrid";
import { NewsSection } from "@/components/NewsSection/NewsSection";
import { PropertyData } from "@/components/PropertyCard/PropertyCard";
import { searchArticles, type Article } from "@/services/articles";
import { searchProperties, type Property } from "@/services/properties";
import { apiArticleToPublicCard, propertyToPropertyData, unwrapArray, unwrapPaginated, type PublicArticleCard } from "@/lib/api-adapters";
import { PublicPageLayout } from "@/components/templates";
import { getSeoConfig } from "@/services/seo";
import { seoConfigToMetadata } from "@/lib/seo-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const cfg = await getSeoConfig("home");
  return seoConfigToMetadata(cfg, {
    title: "Batdongsan.com.vn",
    description: "Kênh thông tin mua bán, cho thuê bất động sản.",
  });
}

export default async function Home() {
  let featuredProperties: PropertyData[] = [];
  let hotProjectsData: PropertyData[] = [];
  let newsArticles: PublicArticleCard[] = [];

  try {
    const [propsResponse, hotResponse, articlesResponse] = await Promise.all([
      searchProperties({ page: 1, perPage: 8, status: "active" }),
      searchProperties({ page: 1, perPage: 4, status: "active" }),
      searchArticles({ page: 1, perPage: 6, status: "published" }),
    ]);

    const properties = unwrapArray<Property>(propsResponse);
    featuredProperties = properties.map(propertyToPropertyData);

    const hot = unwrapArray<Property>(hotResponse);
    hotProjectsData = hot.map(propertyToPropertyData);

    const result = unwrapPaginated<Article>(articlesResponse, 6);
    newsArticles = result.data.map(apiArticleToPublicCard);
  } catch {
    // silent — sections show empty state
  }

  return (
    <PublicPageLayout className="bg-[#f1f5f9] pb-12">
      <HeroSearch />

      <div className="mt-8 space-y-4">
        <RecommendationSection
          title="Bất động sản dành cho bạn"
          fallback={featuredProperties}
        />

        <LocationGrid />

        <PropertyGrid
          title="Dự án bất động sản nổi bật"
          properties={hotProjectsData}
        />

        <NewsSection articles={newsArticles} />
      </div>
    </PublicPageLayout>
  );
}
