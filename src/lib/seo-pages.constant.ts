export interface SeoPageOption {
  key: string;
  label: string;
}

// Danh sách CỐ ĐỊNH — mỗi key map 1-1 với generateMetadata() của 1 route.
// Thêm key mới luôn cần sửa code route tương ứng (không phải việc admin qua UI).
export const SEO_PAGES: SeoPageOption[] = [
  { key: "home", label: "Trang chủ" },
  { key: "agents", label: "Nhà môi giới" },
  { key: "enterprises", label: "Doanh nghiệp" },
  { key: "news", label: "Tin tức" },
  { key: "listing", label: "Danh sách BĐS theo category" },
];
