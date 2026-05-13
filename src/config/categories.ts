import type { PropertySearchParams } from "@/services/properties";

export interface CategoryConfig {
  slug: string;
  text: string;
  type: "sale" | "rent";
  label: string;
  group: string;
  defaultFilters?: Partial<PropertySearchParams>;
}

export const CATEGORIES: CategoryConfig[] = [
  { slug: "ban-can-ho-chung-cu", text: "Bán căn hộ chung cư", type: "sale", label: "Căn hộ chung cư", group: "Nhà đất bán", defaultFilters: { title: "chung cư" } },
  { slug: "ban-nha-rieng", text: "Bán nhà riêng", type: "sale", label: "Nhà riêng", group: "Nhà đất bán" },
  { slug: "ban-biet-thu-lien-ke", text: "Bán nhà biệt thự, liền kề", type: "sale", label: "Biệt thự, liền kề", group: "Nhà đất bán" },
  { slug: "ban-nha-mat-pho", text: "Bán nhà mặt phố", type: "sale", label: "Nhà mặt phố", group: "Nhà đất bán" },
  { slug: "ban-shophouse", text: "Bán shophouse, nhà phố thương mại", type: "sale", label: "Shophouse, nhà phố thương mại", group: "Nhà đất bán" },
  { slug: "ban-dat-nen-du-an", text: "Bán đất nền dự án", type: "sale", label: "Đất nền dự án", group: "Nhà đất bán" },
  { slug: "ban-dat", text: "Bán đất", type: "sale", label: "Đất", group: "Nhà đất bán" },
  { slug: "ban-trang-trai", text: "Bán trang trại, khu nghỉ dưỡng", type: "sale", label: "Trang trại, khu nghỉ dưỡng", group: "Nhà đất bán" },
  { slug: "ban-kho-nha-xuong", text: "Bán kho, nhà xưởng", type: "sale", label: "Kho, nhà xưởng", group: "Nhà đất bán" },
  { slug: "ban-bat-dong-san-khac", text: "Bán loại bất động sản khác", type: "sale", label: "Loại bất động sản khác", group: "Nhà đất bán" },
  { slug: "thue-can-ho-chung-cu", text: "Cho thuê căn hộ chung cư", type: "rent", label: "Căn hộ chung cư", group: "Nhà đất cho thuê", defaultFilters: { title: "căn hộ" } },
  { slug: "thue-nha-rieng", text: "Cho thuê nhà riêng", type: "rent", label: "Nhà riêng", group: "Nhà đất cho thuê", defaultFilters: { title: "nhà riêng" } },
  { slug: "thue-nha-mat-pho", text: "Cho thuê nhà mặt phố", type: "rent", label: "Nhà mặt phố", group: "Nhà đất cho thuê", defaultFilters: { title: "nhà phố" } },
  { slug: "thue-nha-tro", text: "Cho thuê nhà trọ, phòng trọ", type: "rent", label: "Nhà trọ, phòng trọ", group: "Nhà đất cho thuê", defaultFilters: { title: "nhà trọ" } },
  { slug: "thue-van-phong", text: "Cho thuê văn phòng", type: "rent", label: "Văn phòng", group: "Nhà đất cho thuê", defaultFilters: { title: "văn phòng" } },
  { slug: "thue-cua-hang", text: "Cho thuê cửa hàng, mặt bằng", type: "rent", label: "Cửa hàng, mặt bằng", group: "Nhà đất cho thuê", defaultFilters: { title: "cửa hàng" } },
  { slug: "thue-kho-nha-xuong", text: "Cho thuê kho, nhà xưởng, đất", type: "rent", label: "Kho, nhà xưởng, đất", group: "Nhà đất cho thuê" },
  { slug: "thue-bat-dong-san-khac", text: "Cho thuê loại bất động sản khác", type: "rent", label: "Loại bất động sản khác", group: "Nhà đất cho thuê" },
];

export const CATEGORIES_BY_SLUG = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c])) as Record<string, CategoryConfig>;

export const CATEGORY_GROUPS = CATEGORIES.reduce(
  (acc, cat) => {
    if (!acc[cat.group]) acc[cat.group] = [];
    acc[cat.group].push(cat);
    return acc;
  },
  {} as Record<string, CategoryConfig[]>,
);
