import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { PropertyGallery } from "@/components/PropertyDetail/PropertyGallery";
import { PropertyInfo } from "@/components/PropertyDetail/PropertyInfo";
import { AuthorSidebar } from "@/components/PropertyDetail/AuthorSidebar";
import { PropertyGrid } from "@/components/PropertyGrid/PropertyGrid";
import type { PropertyData } from "@/components/PropertyCard/PropertyCard";
import { propertyToDetailView, propertyToPropertyData, type PropertyDetailView, unwrapArray } from "@/lib/api-adapters";
import { getPropertyById, searchProperties, type Property } from "@/services/properties";

const fallbackDetail: PropertyDetailView = {
  id: "45180684",
  title: "Bán đất tại Hồ Thị Bưng, 2,6 tỷ, 116,1m2 full thổ cư, giá ưu đãi Hot!",
  description: "Nhanh tay sở hữu đất nền đẹp tại Đường Hồ Thị Bưng, Xã Tân Thạnh Tây, Hồ Chí Minh. Diện tích 116,1m2, pháp lý đầy đủ.\nLiên hệ ngay để được tư vấn miễn phí.",
  price: "2,6 tỷ",
  pricePerSqm: "22,39 tr/m²",
  area: "116,1 m²",
  address: "Đường Hồ Thị Bưng, Xã Tân Thạnh Tây, Huyện Củ Chi, Hồ Chí Minh",
  location: "Củ Chi, Hồ Chí Minh",
  direction: "Tây - Bắc",
  legalInfo: "Sổ đỏ/ Sổ hồng",
  images: [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=2000",
  ],
  postedAt: "17/03/2026",
  expiresAt: "01/04/2026",
  listingType: "Tin thường",
  code: "45180684",
  hostId: "",
  owner: {
    name: "Trương Thanh Thanh",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    phone: "0937 147 ***",
  },
};

const relatedProperties: PropertyData[] = [
  {
    id: "101",
    title: "Bán nhanh đất 5x49m mặt tiền nhựa xã Tân Thạnh Tây",
    price: "1,7 Tỷ",
    area: "131 m²",
    location: "Tân Thạnh Tây, Củ Chi",
    imageUrl: "https://images.unsplash.com/photo-1542314831-c6a4d14faaf2?auto=format&fit=crop&q=80&w=2000",
    postedTime: "Đăng 1 tuần trước",
  },
  {
    id: "102",
    title: "Chính chủ bán lô đất nền thổ cư 100% SHR, công chứng ngay",
    price: "2,1 Tỷ",
    area: "150 m²",
    location: "Tân Phú Trung, Củ Chi",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=2000",
    postedTime: "Đăng 2 tuần trước",
  },
  {
    id: "103",
    title: "Bán đất vườn diện tích lớn, đường ô tô vào tận nơi",
    price: "3,5 Tỷ",
    area: "500 m²",
    location: "Thái Mỹ, Củ Chi",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000",
    postedTime: "Đăng 1 tháng trước",
  },
  {
    id: "104",
    title: "Cần bán gấp lô đất ngay sát mặt tiền Tỉnh Lộ 7",
    price: "1,2 Tỷ",
    area: "149 m²",
    location: "An Nhơn Tây, Củ Chi",
    imageUrl: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=2000",
    postedTime: "Đăng 2 tuần trước",
  }
];

async function getPropertyDetail(id: string): Promise<PropertyDetailView> {
  try {
    return propertyToDetailView(await getPropertyById(id));
  } catch {
    return fallbackDetail;
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
    return relatedProperties;
  }

  return relatedProperties;
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [property, related] = await Promise.all([getPropertyDetail(id), getRelatedProperties()]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f1f5f9]">
      <Header />
      
      <main className="flex-1 w-full max-w-[1140px] xl:max-w-[1240px] mx-auto px-4 lg:px-0 py-6">
        
        {/* Main Grid Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - 70% */}
            <div className="flex-[3] lg:w-[70%] bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                
                {/* Breadcrumb */}
                <div className="text-xs lg:text-sm text-gray-500 mb-4 flex items-center gap-1.5 flex-wrap">
                    <span className="hover:text-primary cursor-pointer transition-colors">Bán</span> 
                    <span className="text-gray-400">/</span>
                    <span className="hover:text-primary cursor-pointer transition-colors">{property.location}</span> 
                    <span className="text-gray-400">/</span>
                    <span className="hover:text-primary cursor-pointer transition-colors">{property.listingType}</span> 
                    <span className="text-gray-400">/</span>
                    <span className="text-[#2c2c2c] line-clamp-1">{property.title}</span>
                </div>

                <PropertyGallery images={property.images} />
                <PropertyInfo property={property} />
            </div>

            {/* Right Sidebar - 30% */}
            <div className="flex-1 lg:w-[30%] space-y-4">
                <AuthorSidebar owner={property.owner} propertyId={id} hostId={property.hostId} />
                
                {/* Related Links Block */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-[#2c2c2c] mb-3 text-sm">Mua bán nhà đất tại Củ Chi</h3>
                  <ul className="space-y-2.5 text-xs text-gray-600">
                    <li className="hover:text-primary cursor-pointer transition-colors flex justify-between">
                      <span>Xã Tân Phú Trung</span> <span className="text-gray-400">(113)</span>
                    </li>
                    <li className="hover:text-primary cursor-pointer transition-colors flex justify-between">
                      <span>Xã Tân Thông Hội</span> <span className="text-gray-400">(90)</span>
                    </li>
                    <li className="hover:text-primary cursor-pointer transition-colors flex justify-between">
                      <span>Xã Bình Mỹ</span> <span className="text-gray-400">(82)</span>
                    </li>
                    <li className="hover:text-primary cursor-pointer transition-colors flex justify-between">
                      <span>Xã Thái Mỹ</span> <span className="text-gray-400">(70)</span>
                    </li>
                    <li className="text-primary cursor-pointer font-medium mt-1">Xem thêm v</li>
                  </ul>
                </div>

                {/* Sticky Utility Box */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 sticky top-20">
                  <h3 className="font-bold text-[#2c2c2c] mb-3 text-sm">Hỗ trợ tiện ích</h3>
                  <ul className="space-y-2.5 text-xs text-gray-600">
                    <li className="hover:text-primary cursor-pointer transition-colors">Tư vấn phong thủy</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Dự tính chi phí làm nhà</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Tính lãi suất</li>
                    <li className="hover:text-primary cursor-pointer transition-colors">Quy trình xây nhà</li>
                  </ul>
                </div>
            </div>
        </div>

        {/* Bottom Section: Related Grids & Tags */}
        <div className="mt-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="-mx-4 lg:-mx-0">
                    <PropertyGrid title="Bất động sản dành cho bạn" properties={related} />
                </div>
                
                <div className="border-t border-gray-100 pt-8 mt-4 -mx-4 lg:-mx-0">
                    <PropertyGrid title="Tin đăng đã xem" properties={related.slice(0, 2)} />
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

                <div className="text-[11px] text-gray-400 leading-relaxed border-t border-gray-100 pt-6">
                    Quý vị đang xem nội dung tin rao &quot;{property.title}&quot; - Mã tin {property.code}. Mọi thông tin, nội dung liên quan tới tin rao này là do người đăng tin tự đăng tải và chịu trách nhiệm. Batdongsan.com.vn luôn cố gắng để các thông tin được hữu ích nhất cho quý vị...
                </div>
            </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
