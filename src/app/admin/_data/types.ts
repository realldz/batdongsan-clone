export type AdminListingStatus = "Đang hiển thị" | "Chờ duyệt" | "Đã duyệt" | "Từ chối" | "Đã ẩn" | "Hết hạn";
export type AdminListingType = "Bán" | "Cho thuê";
export type AdminUserStatus = "Đang hoạt động" | "Tạm khóa" | "Chờ xác minh";
export type AdminUserRole = "Admin" | "Biên tập viên" | "Môi giới" | "Doanh nghiệp" | "Người bán";
export type AdminArticleStatus = "Đã xuất bản" | "Bản nháp" | "Đã lưu trữ";

export type AdminListing = {
  id: string;
  code: string;
  title: string;
  owner: string;
  ownerType: "Cá nhân" | "Môi giới" | "Doanh nghiệp";
  type: AdminListingType;
  category: string;
  location: string;
  price: string;
  area: string;
  packageName: "Tin thường" | "Tin VIP" | "Tin nổi bật";
  status: AdminListingStatus;
  submittedAt: string;
  expiresAt: string;
  views: number;
  reports: number;
};

export type AdminUser = {
  id: string;
  role: AdminUserRole;
  roleNumber: number;
  status: string;
  isBlocked: boolean;
  name: string;
  phone: string;
  email: string;
  listings: number;
  revenue: string;
  joinedAt: string;
  note: string;

  // Extended from API
  fullName?: string;
  avatar?: string | null;
  adminScopes?: string[];
  blockedAt?: string | null;
  blockedReason?: string | null;
  boostQuotaUsed?: number;
  boostQuotaResetAt?: string | null;
  listingFavoriteCount?: number;
  vipTier?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
};

export type AdminAgent = {
  id: string;
  name: string;
  area: string;
  company: string;
  phone: string;
  verified: boolean;
  listings: number;
  rating: number;
  status: AdminUserStatus;
};

export type AdminEnterprise = {
  id: string;
  name: string;
  taxCode: string;
  location: string;
  plan: "Cơ bản" | "Chuyên nghiệp" | "Doanh nghiệp";
  listings: number;
  status: AdminUserStatus;
  joinedAt: string;
};

export type AdminArticle = {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: string;
  author: string;
  status: AdminArticleStatus;
  views: number;
  publishedAt: string;
  summary?: string;
  thumbnail?: string;
  isFeatured: boolean;
};

export type AdminSetting = {
  id: string;
  group: string;
  name: string;
  value: string;
  updatedAt: string;
  status: "Đang áp dụng" | "Cần kiểm tra";
};

export type AdminActivity = {
  id: string;
  action: string;
  actor: string;
  target: string;
  time: string;
};
