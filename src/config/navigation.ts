import { CATEGORY_GROUPS } from "./categories";

export interface NavSubItem {
  text: string;
  href: string;
}

export interface NavLink {
  text: string;
  href: string;
  subItems?: NavSubItem[];
}

export const getNavLinks = (): NavLink[] => [
  ...Object.entries(CATEGORY_GROUPS).map(([group, categories]) => ({
    text: group,
    href: "#",
    subItems: categories.map((c) => ({ text: c.text, href: `/${c.slug}` })),
  })),
  {
    text: "Dự án",
    href: "#",
    subItems: [
      { text: "Căn hộ chung cư", href: "#" },
      { text: "Cao ốc văn phòng", href: "#" },
      { text: "Trung tâm thương mại", href: "#" },
      { text: "Khu đô thị mới", href: "#" },
      { text: "Khu phức hợp", href: "#" },
      { text: "Nhà ở xã hội", href: "#" },
      { text: "Khu nghỉ dưỡng, Sinh thái", href: "#" },
      { text: "Biệt thự, liền kề", href: "#" },
    ]
  },
  {
    text: "Tin tức",
    href: "/tin-tuc",
  },
  { text: "Wiki BĐS", href: "#" },
  { text: "Phân tích đánh giá", href: "#" },
  {
    text: "Danh bạ",
    href: "/nha-moi-gioi",
    subItems: [
      { text: "Nhà môi giới", href: "/nha-moi-gioi" },
      { text: "Doanh nghiệp", href: "/doanh-nghiep" }
    ]
  },
];
