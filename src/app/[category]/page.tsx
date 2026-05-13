import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { SearchFilterBar } from "@/components/SearchFilterBar/SearchFilterBar";
import { ListingCard, type ListingData } from "@/components/ListingCard/ListingCard";
import { SidebarFilters } from "@/components/SidebarFilters/SidebarFilters";
import { PropertyCompare } from "@/components/PropertyCompare/PropertyCompare";
import { propertyToListingData, unwrapPaginated } from "@/lib/api-adapters";
import { searchProperties, type Property, type PropertySearchParams } from "@/services/properties";
import { CATEGORIES_BY_SLUG } from "@/config/categories";
import Link from "next/link";

function parseSearchParams(raw: Record<string, string | string[] | undefined>): PropertySearchParams {
  const params: PropertySearchParams = {};
  const getNum = (key: string) => {
    const v = raw[key];
    if (Array.isArray(v) || v === undefined) return undefined;
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  };
  const getStr = (key: string) => {
    const v = raw[key];
    if (Array.isArray(v) || v === undefined) return undefined;
    return v.trim() || undefined;
  };

  params.page = getNum("page") ?? 1;
  params.perPage = getNum("perPage") ?? 20;
  const title = getStr("title");
  if (title) params.title = title;
  const type = getStr("type");
  if (type === "sale" || type === "rent") params.type = type;
  params.minPrice = getNum("minPrice");
  params.maxPrice = getNum("maxPrice");
  params.minArea = getNum("minArea");
  params.maxArea = getNum("maxArea");
  const address = getStr("address");
  if (address) params.address = address;
  const district = getStr("district");
  if (district) params.district = district;
  const province = getStr("province");
  if (province) params.province = province;
  const direction = getStr("direction");
  if (direction) params.direction = direction;
  const status = getStr("status");
  if (status === "pending" || status === "active" || status === "sold" || status === "rented" || status === "hidden" || status === "draft") params.status = status;

  return params;
}

function buildQueryString(params: PropertySearchParams): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });
  return query.toString();
}

interface PageLink {
  label: string;
  page: number;
  current: boolean;
}

function generatePageLinks(current: number, total: number): PageLink[] {
  if (total <= 1) return [];
  const links: PageLink[] = [];
  const maxVisible = 7;
  if (total <= maxVisible + 2) {
    for (let i = 1; i <= total; i++) links.push({ label: String(i), page: i, current: i === current });
  } else {
    links.push({ label: String(1), page: 1, current: 1 === current });
    if (current > 3) links.push({ label: "...", page: 0, current: false });
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) links.push({ label: String(i), page: i, current: i === current });
    if (current < total - 2) links.push({ label: "...", page: 0, current: false });
    links.push({ label: String(total), page: total, current: total === current });
  }
  return links;
}

async function getListings(params: PropertySearchParams) {
  try {
    const response = await searchProperties(params);
    const result = unwrapPaginated<Property>(response);
    return {
      listings: result.data.map(propertyToListingData),
      total: result.pagination.total,
      totalPages: result.pagination.totalPages,
      page: result.pagination.page,
    };
  } catch {
    return { listings: [] as ListingData[], total: 0, totalPages: 1, page: 1 };
  }
}

function getTypeLabel(type: string | undefined): { breadcrumb: string; title: string } {
  if (type === "sale") return { breadcrumb: "Bán", title: "Mua bán" };
  if (type === "rent") return { breadcrumb: "Cho thuê", title: "Cho thuê" };
  return { breadcrumb: "Bán", title: "Mua bán" };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category } = await params;
  const rawParams = await searchParams;

  const config = CATEGORIES_BY_SLUG[category] as (typeof CATEGORIES_BY_SLUG)[string] | undefined;
  let defaultType: "sale" | "rent" = "sale";
  let categoryLabel: string;

  if (category === "nha-dat") {
    categoryLabel = "Nhà đất";
  } else {
    defaultType = config?.type ?? (category.startsWith("ban-") ? "sale" : category.startsWith("thue-") ? "rent" : "sale");
    categoryLabel = config?.label ?? category.replace(/^(ban|thue)-/, "").replace(/-/g, " ");
  }

  const filters = parseSearchParams(rawParams);
  if (!filters.type) {
    filters.type = defaultType;
  }

  if (config?.defaultFilters) {
    for (const [key, value] of Object.entries(config.defaultFilters)) {
      if (filters[key as keyof PropertySearchParams] === undefined && value !== undefined) {
        (filters as Record<string, unknown>)[key] = value;
      }
    }
  }

  const defaultTitle = config?.defaultFilters?.title ?? (category !== "nha-dat" ? categoryLabel : undefined);
  if (!filters.title && defaultTitle) {
    filters.title = defaultTitle;
  }

  const { listings, total, totalPages, page } = await getListings(filters);
  const compareProperties = listings.map((listing) => ({ id: listing.id, title: listing.title }));

  const pageLinks = generatePageLinks(page, totalPages);

  const { breadcrumb: typeBreadcrumb, title: pageTitle } = getTypeLabel(filters.type);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f1f5f9]">
      <Header />
      <SearchFilterBar />

      <main className="flex-1 w-full max-w-[1140px] xl:max-w-[1240px] mx-auto px-4 lg:px-0 py-6">
        <div className="mb-4">
          <div className="text-xs lg:text-sm text-gray-500 mb-2 flex items-center gap-1.5 flex-wrap">
            <span className="hover:text-primary cursor-pointer transition-colors">{typeBreadcrumb}</span>
            <span className="text-gray-400">/</span>
            <span className="text-[#2c2c2c]">{categoryLabel} trên toàn quốc</span>
          </div>
          <h1 className="text-2xl font-bold text-[#2c2c2c] mb-1">{pageTitle} {categoryLabel} trên toàn quốc</h1>
          <p className="text-sm text-gray-500">Hiện có {total.toLocaleString("vi-VN")} bất động sản.</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b border-gray-200 pb-4">
          <div className="relative w-full sm:w-48">
            <select className="w-full appearance-none bg-white border border-gray-300 text-[#2c2c2c] text-sm rounded py-2 pl-3 pr-8 focus:outline-none focus:border-primary">
              <option>Sắp xếp mặc định</option>
              <option>Sắp xếp theo ngày</option>
              <option>Sắp xếp giá tăng dần</option>
              <option>Sắp xếp giá giảm dần</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-[3] lg:w-[70%]">
            <PropertyCompare properties={compareProperties} />
            {listings.length > 0 ? (
              listings.map((listing) => (
                <ListingCard key={listing.id} data={listing} />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900">Không tìm thấy bất động sản phù hợp</h4>
                <p className="mt-2 text-sm leading-6 text-gray-500">Thử thay đổi từ khóa hoặc bộ lọc tìm kiếm.</p>
              </div>
            )}

            {totalPages > 1 ? (
              <div className="flex items-center justify-center gap-1 mt-6 mb-12">
                {page > 1 ? (
                  <Link
                    href={`/${category}?${buildQueryString({ ...filters, page: page - 1 })}`}
                    className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-200 font-medium rounded cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </Link>
                ) : null}
                {pageLinks.map((link, idx) =>
                  link.page === 0 ? (
                    <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-gray-500">...</span>
                  ) : (
                    <Link
                      key={link.page}
                      href={`/${category}?${buildQueryString({ ...filters, page: link.page })}`}
                      className={`w-8 h-8 flex items-center justify-center font-medium rounded cursor-pointer ${link.current ? "bg-[#2c2c2c] text-white" : "text-gray-700 hover:bg-gray-200"}`}
                    >
                      {link.label}
                    </Link>
                  )
                )}
                {page < totalPages ? (
                  <Link
                    href={`/${category}?${buildQueryString({ ...filters, page: page + 1 })}`}
                    className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-200 font-medium rounded cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                ) : null}
              </div>
            ) : null}

            <div className="text-xs text-gray-500 leading-relaxed mb-4">
              <p className="mb-2">Khi quỹ đất ngày càng khan hiếm và đắt đỏ, căn hộ chung cư được xem là giải pháp nhà ở hợp lý cho cư dân, đặc biệt là ở các thành phố lớn. Loại hình căn hộ chung cư khá đa dạng về diện tích, tiện ích và mức giá, vì vậy khách hàng có nhiều sự lựa chọn phù hợp với nhu cầu và điều kiện tài chính.</p>
              <p className="mb-2">Hiện nay, thị trường mua bán căn hộ với nguồn cung lớn đòi hỏi khách hàng khó phân biệt trong việc lựa chọn. Cùng Batdongsan.com.vn tìm hiểu kinh nghiệm mua bán căn hộ ưng ý.</p>
              <p className="font-bold text-[#2c2c2c] mb-1">Những lý do căn hộ chung cư được ưa chuộng:</p>
              <p className="mb-1">- Thanh toán linh hoạt, hỗ trợ vay vốn ngân hàng: Đối với người mua, đặc biệt là gia đình trẻ, việc chia nhỏ các giai đoạn làm giảm gánh nặng tài chính.</p>
              <p className="mb-1">- Tiện ích nội khu đa dạng: Các dự án hiện nay thường đi kèm hồ bơi, phòng gym, siêu thị nội khu...</p>
              <p className="mb-1">- Giao thông kết nối thuận tiện: Tọa lạc tại các vị trí đắc địa dễ di chuyển tới trung tâm.</p>
              <div className="text-center mt-3"><span className="text-primary hover:underline cursor-pointer font-medium text-sm">Xem thêm v</span></div>
            </div>
          </div>

          <div className="w-full lg:w-[30%]">
            <SidebarFilters />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
