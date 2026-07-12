import type { Metadata } from "next";
import { PropertyGallery } from "@/components/PropertyDetail/PropertyGallery";
import { PropertyInfo } from "@/components/PropertyDetail/PropertyInfo";
import { AuthorSidebar } from "@/components/PropertyDetail/AuthorSidebar";
import { RecommendationSection } from "@/components/RecommendationSection/RecommendationSection";
import type { PropertyData } from "@/components/PropertyCard/PropertyCard";
import { propertyToDetailView, propertyToPropertyData, type PropertyDetailView, unwrapArray } from "@/lib/api-adapters";
import { getPropertyById, searchProperties, type Property, type PropertyType } from "@/services/properties";
import { notFound } from "next/navigation";
import { PublicPageLayout, TwoColumnLayout } from "@/components/templates";
import { truncateForDescription } from "@/lib/seo-metadata";

async function getPropertyDetail(id: string): Promise<PropertyDetailView> {
  try {
    return propertyToDetailView(await getPropertyById(id));
  } catch {
    notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const view = propertyToDetailView(await getPropertyById(id));
    return {
      title: `${view.title} - ${view.address}`,
      description: truncateForDescription(view.description ?? ""),
      openGraph: view.images?.[0] ? { images: [view.images[0]] } : undefined,
    };
  } catch {
    return { title: "Chi tiết bất động sản - Batdongsan.com.vn" };
  }
}

async function getRelatedProperties(): Promise<PropertyData[]> {
  try {
    const response = await searchProperties({ page: 1, perPage: 4, status: "active" });
    const properties = unwrapArray<Property>(response);

    if (properties.length > 0) {
      return properties.map(propertyToPropertyData);
    }
  } catch {
    return [];
  }

  return [];
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [property, related] = await Promise.all([getPropertyDetail(id), getRelatedProperties()]);

  return (
    <PublicPageLayout className="bg-[#f1f5f9] py-6">
      <div className="max-w-[1240px] mx-auto px-4 lg:px-0">

        <TwoColumnLayout
          main={
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
              {/* Breadcrumb */}
              <div className="text-xs lg:text-sm text-gray-500 mb-4 flex items-center gap-1.5 flex-wrap">
                <span className="hover:text-primary cursor-pointer transition-colors">{property.location}</span>
                <span className="text-gray-400">/</span>
                <span className="hover:text-primary cursor-pointer transition-colors">{property.listingType}</span>
                <span className="text-gray-400">/</span>
                <span className="text-[#2c2c2c] line-clamp-1">{property.title}</span>
              </div>

              <PropertyGallery images={property.images} />
              <PropertyInfo property={property} />
            </div>
          }
          sidebar={
            <div className="space-y-4">
              <AuthorSidebar owner={property.owner} propertyId={id} hostId={property.hostId} />

              {/* Related Links Block */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-[#2c2c2c] mb-3 text-sm">Mua bán nhà đất tại {property.district || property.province || property.location}</h3>
                <ul className="space-y-2.5 text-xs text-gray-600">
                  <li className="hover:text-primary cursor-pointer transition-colors flex justify-between">
                    <span>Xem các bất động sản cùng khu vực</span>
                  </li>
                </ul>
              </div>
            </div>
          }
        />

        {/* Bottom Section: Related Grids & Tags */}
        <div className="mt-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="-mx-4 lg:-mx-0">
              <RecommendationSection
                title="Bất động sản dành cho bạn"
                type={property.type as PropertyType}
                fallback={related}
              />
            </div>

            {/* Keyword Tags */}
            <div className="mt-10 mb-6">
              <h3 className="font-bold text-[#2c2c2c] mb-4">Tìm kiếm theo từ khóa</h3>
              <div className="flex flex-wrap gap-3 text-xs">
                {["Đất Tân Thạnh Tây Củ Chi", "Đất Hồ Thị Bưng Củ Chi", "Đất Củ Chi Hồ Chí Minh", "Đất Hồ Chí Minh", "Bán đất nền Hồ Chí Minh"].map((tag, idx) => (
                  <div key={idx} className="bg-gray-100 hover:bg-gray-200 cursor-pointer text-gray-600 px-4 py-2 rounded-full transition-colors">
                    {tag}
                  </div>
                ))}
              </div>
            </div>

            {/* <div className="text-[11px] text-gray-400 leading-relaxed border-t border-gray-100 pt-6">
              Quý vị đang xem nội dung tin rao &quot;{property.title}&quot; - Mã tin {property.code}. Mọi thông tin, nội dung liên quan tới tin rao này là do người đăng tin tự đăng tải và chịu trách nhiệm. Batdongsan.com.vn luôn cố gắng để các thông tin được hữu ích nhất cho quý vị...
            </div> */}
          </div>
        </div>

      </div>
    </PublicPageLayout>
  );
}
