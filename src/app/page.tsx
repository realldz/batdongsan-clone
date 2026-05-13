import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { HeroSearch } from "@/components/HeroSearch/HeroSearch";
import { PropertyGrid } from "@/components/PropertyGrid/PropertyGrid";
import { LocationGrid } from "@/components/LocationGrid/LocationGrid";
import { NewsSection } from "@/components/NewsSection/NewsSection";
import { PropertyData } from "@/components/PropertyCard/PropertyCard";
import { searchArticles, type Article } from "@/services/articles";
import { searchProperties, type Property } from "@/services/properties";
import { apiArticleToPublicCard, propertyToPropertyData, unwrapArray, unwrapPaginated, type PublicArticleCard } from "@/lib/api-adapters";

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
    <div className="min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-1 w-full bg-[#f1f5f9] pb-12">
        <HeroSearch />

        <div className="mt-8 space-y-4">
          <PropertyGrid
            title="Bất động sản dành cho bạn"
            properties={featuredProperties}
          />

          <LocationGrid />

          <PropertyGrid
            title="Dự án bất động sản nổi bật"
            properties={hotProjectsData}
          />

          <NewsSection articles={newsArticles} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
