import type { AdminArticle, AdminListing, AdminListingStatus, AdminListingType, AdminUser, AdminUserRole, AdminUserStatus } from "@/app/admin/_data/mock";
import type { ListingData } from "@/components/ListingCard/ListingCard";
import type { PropertyData } from "@/components/PropertyCard/PropertyCard";
import type { ApiUser } from "@/services/admin";
import type { Article } from "@/services/articles";
import type { Lead, LeadSource, LeadStatus } from "@/services/leads";
import type { Property, PropertyOwner, PropertyStatus, PropertyType } from "@/services/properties";

export interface PublicArticleCard {
  id: string;
  slug: string;
  title: string;
  summary: string;
  thumbnail: string;
  category: string;
  author: string;
  publishedAt: string;
  viewCount: number;
  relativeTime: string;
  isFeatured: boolean;
}

export interface PaginationMeta {
  page: number;
  totalPages: number;
  total: number;
  perPage: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface PropertyDetailView {
  id: string;
  title: string;
  description: string;
  price: string;
  pricePerSqm: string;
  area: string;
  type: string;
  address: string;
  location: string;
  direction: string;
  legalInfo: string;
  images: string[];
  postedAt: string;
  expiresAt: string;
  listingType: string;
  code: string;
  hostId: string;
  owner: {
    name: string;
    avatar: string;
    phone: string;
  };
}

const fallbackImages = [
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=2000",
];

const fallbackAvatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200";

function toNumber(value: number | string | undefined): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function formatCompactNumber(value: number, maximumFractionDigits = 2): string {
  return new Intl.NumberFormat("vi-VN", { maximumFractionDigits }).format(value);
}

export function formatCurrency(value: number | string | undefined, type?: PropertyType): string {
  const amount = toNumber(value);

  if (amount <= 0) return "Thỏa thuận";
  if (amount >= 1_000_000_000) return `${formatCompactNumber(amount / 1_000_000_000)} tỷ${type === "rent" ? "/tháng" : ""}`;
  if (amount >= 1_000_000) return `${formatCompactNumber(amount / 1_000_000)} triệu${type === "rent" ? "/tháng" : ""}`;

  return `${formatCompactNumber(amount)} đ${type === "rent" ? "/tháng" : ""}`;
}

export function formatArea(value: number | string | undefined): string {
  const area = toNumber(value);
  return area > 0 ? `${formatCompactNumber(area)} m²` : "--";
}

function formatPricePerSqm(price: number | string | undefined, area: number | string | undefined): string {
  const priceValue = toNumber(price);
  const areaValue = toNumber(area);

  if (priceValue <= 0 || areaValue <= 0) return "--";

  const pricePerSqm = priceValue / areaValue;
  if (pricePerSqm >= 1_000_000) return `${formatCompactNumber(pricePerSqm / 1_000_000)} tr/m²`;

  return `${formatCompactNumber(pricePerSqm)} đ/m²`;
}

export function formatLocation(property: Pick<Property, "address" | "district" | "province">): string {
  return [property.district, property.province].filter(Boolean).join(", ") || property.address || "Đang cập nhật";
}

function formatFullAddress(property: Pick<Property, "address" | "district" | "province">): string {
  return [property.address, property.district, property.province].filter(Boolean).join(", ") || "Đang cập nhật";
}

function formatDate(value: string | undefined): string {
  if (!value) return "--";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("vi-VN").format(date);
}

function formatPostedTime(value: string | undefined): string {
  if (!value) return "Đăng gần đây";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Đăng gần đây";

  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / 86_400_000));

  if (diffDays === 0) return "Đăng hôm nay";
  if (diffDays === 1) return "Đăng hôm qua";
  if (diffDays < 7) return `Đăng ${diffDays} ngày trước`;
  if (diffDays < 30) return `Đăng ${Math.floor(diffDays / 7)} tuần trước`;

  return `Đăng ${Math.floor(diffDays / 30)} tháng trước`;
}

function ensureImages(images: string[] | undefined, min = 3): string[] {
  const validImages = images?.filter(Boolean) ?? [];
  const result = [...validImages];

  for (let index = 0; result.length < min; index += 1) {
    result.push(fallbackImages[index % fallbackImages.length]);
  }

  return result;
}

function getOwner(property: Property): PropertyOwner | undefined {
  return property.owner ?? property.user;
}

function getOwnerName(property: Property): string {
  const owner = getOwner(property);
  return owner?.fullName ?? owner?.name ?? "Người đăng tin";
}

function getOwnerPhone(property: Property): string {
  const owner = getOwner(property);
  return owner?.phone ?? "0900 000 ***";
}

function getOwnerAvatar(property: Property): string {
  const owner = getOwner(property);
  return owner?.avatar ?? fallbackAvatar;
}

export function propertyToListingData(property: Property): ListingData {
  return {
    id: property.id,
    vipTag: property.status === "active" ? "TIN ĐANG HIỂN THỊ" : "TIN MỚI",
    images: ensureImages(property.images),
    title: property.title,
    price: formatCurrency(property.price, property.type),
    area: formatArea(property.area),
    pricePerSqm: formatPricePerSqm(property.price, property.area),
    beds: 0,
    baths: 0,
    direction: property.direction ?? "Đang cập nhật",
    location: formatLocation(property),
    description: property.description,
    authorName: getOwnerName(property),
    authorAvatar: getOwnerAvatar(property),
    postedTime: formatPostedTime(property.createdAt),
    phone: getOwnerPhone(property),
  };
}

export function propertyToPropertyData(property: Property): PropertyData {
  return {
    id: property.id,
    title: property.title,
    price: formatCurrency(property.price, property.type),
    area: formatArea(property.area),
    location: formatLocation(property),
    imageUrl: ensureImages(property.images, 1)[0],
    postedTime: formatPostedTime(property.createdAt),
  };
}

function mapPropertyType(type: PropertyType): AdminListingType {
  return type === "rent" ? "Cho thuê" : "Bán";
}

export function mapPropertyStatus(status: PropertyStatus | undefined): AdminListingStatus {
  if (status === "active") return "Đang hiển thị";
  if (status === "sold" || status === "rented") return "Hết hạn";
  if (status === "hidden") return "Đã ẩn";
  if (status === "draft") return "Chờ duyệt";
  if (status === "rejected") return "Từ chối";
  return "Chờ duyệt";
}

export function mapAdminStatusToPropertyStatus(status: AdminListingStatus): PropertyStatus {
  if (status === "Đang hiển thị" || status === "Đã duyệt") return "active";
  if (status === "Đã ẩn") return "hidden";
  if (status === "Hết hạn") return "sold";
  if (status === "Từ chối") return "rejected";
  return "pending";
}

export function propertyToAdminListing(property: Property): AdminListing {
  const owner = getOwner(property);
  const role = owner?.role;
  const ownerType = role === "enterprise" || role === "Doanh nghiệp" ? "Doanh nghiệp" : role === "agent" || role === "Môi giới" ? "Môi giới" : "Cá nhân";

  return {
    id: property.id,
    code: `BDS-${property.id.slice(0, 8).toUpperCase()}`,
    title: property.title,
    owner: getOwnerName(property),
    ownerType,
    type: mapPropertyType(property.type),
    category: property.type === "rent" ? "Cho thuê bất động sản" : "Bất động sản bán",
    location: formatLocation(property),
    price: formatCurrency(property.price, property.type),
    area: formatArea(property.area),
    packageName: "Tin thường",
    status: mapPropertyStatus(property.status),
    submittedAt: formatDate(property.createdAt),
    expiresAt: "--",
    views: 0,
    reports: 0,
  };
}

export function propertyToDetailView(property: Property): PropertyDetailView {
  return {
    id: property.id,
    title: property.title,
    description: property.description,
    price: formatCurrency(property.price, property.type),
    pricePerSqm: formatPricePerSqm(property.price, property.area),
    area: formatArea(property.area),
    type: property.type,
    address: formatFullAddress(property),
    location: formatLocation(property),
    direction: property.direction ?? "Đang cập nhật",
    legalInfo: property.legalInfo ?? "Đang cập nhật",
    images: ensureImages(property.images, 4),
    postedAt: formatDate(property.createdAt),
    expiresAt: "--",
    listingType: property.type === "rent" ? "Cho thuê" : "Tin bán",
    code: `BDS-${property.id.slice(0, 8).toUpperCase()}`,
    hostId: property.host ?? (getOwner(property) as Record<string, unknown> | undefined)?.id as string ?? "",
    owner: {
      name: getOwnerName(property),
      avatar: getOwnerAvatar(property),
      phone: getOwnerPhone(property),
    },
  };
}

export function unwrapArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const candidates = [record.data, record.items, record.results, record.docs];
    const found = candidates.find(Array.isArray);
    if (found) return found as T[];
  }

  return [];
}

export function unwrapPaginated<T>(value: unknown, fallbackPerPage = 10): PaginatedResult<T> {
  if (Array.isArray(value)) {
    return { data: value as T[], pagination: { page: 1, totalPages: 1, total: (value as T[]).length, perPage: (value as T[]).length } };
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const getNum = (key: string, fallback: number) => {
      const v = record[key];
      return typeof v === "number" ? v : fallback;
    };

    const total = getNum("total", 0);
    const page = getNum("page", 1);
    const perPage = getNum("perPage", fallbackPerPage) || getNum("per_page", fallbackPerPage);
    const totalPages = perPage > 0 ? Math.ceil(total / perPage) : 1;

    const data = (Array.isArray(record.data) ? record.data : Array.isArray(record.items) ? record.items : Array.isArray(record.results) ? record.results : Array.isArray(record.docs) ? record.docs : []) as T[];

    if (record.meta && typeof record.meta === "object") {
      const meta = record.meta as Record<string, unknown>;
      const metaTotal = typeof meta.total === "number" ? meta.total : total;
      const metaPage = typeof meta.page === "number" ? meta.page : page;
      const metaPerPage = typeof meta.perPage === "number" ? meta.perPage : typeof meta.per_page === "number" ? meta.per_page : perPage;
      return { data, pagination: { page: metaPage, totalPages: metaPerPage > 0 ? Math.ceil(metaTotal / metaPerPage) : 1, total: metaTotal, perPage: metaPerPage } };
    }

    return { data, pagination: { page, totalPages, total, perPage } };
  }

  return { data: [], pagination: { page: 1, totalPages: 0, total: 0, perPage: fallbackPerPage } };
}

export function mapUserRole(role: number | string | undefined): AdminUserRole {
  if (role === 15 || role === "admin" || role === "Admin") return "Admin";
  if (role === 7 || role === "editor" || role === "Biên tập viên") return "Biên tập viên";
  if (role === 3 || role === "agent" || role === "merchant" || role === "Môi giới") return "Môi giới";
  if (role === "enterprise" || role === "Doanh nghiệp") return "Doanh nghiệp";
  return "Người bán";
}

export function mapAdminRoleToApiRole(role: AdminUserRole): number {
  if (role === "Admin") return 15;
  if (role === "Biên tập viên") return 7;
  if (role === "Môi giới" || role === "Doanh nghiệp") return 3;
  return 1;
}

function mapUserStatus(user: ApiUser): AdminUserStatus {
  if (user.deletedAt) return "Tạm khóa";
  if (user.isBlocked) return "Tạm khóa";
  if (user.status === "pending" || user.status === "Chờ xác minh") return "Chờ xác minh";
  if (user.status === "locked" || user.status === "Tạm khóa") return "Tạm khóa";
  return "Đang hoạt động";
}

const categoryLabelMap: Record<string, string> = {
  market: "Thị trường",
  legal: "Pháp lý",
  fengshui: "Phong thủy",
  project: "Dự án",
  general: "Tổng hợp",
};

export function mapArticleStatus(status: string): AdminArticle["status"] {
  if (status === "published") return "Đã xuất bản";
  if (status === "archived") return "Đã lưu trữ";
  return "Bản nháp";
}

export function mapArticleCategory(category: string): string {
  return categoryLabelMap[category] ?? category;
}

export function mapAdminStatusToArticleStatus(status: AdminArticle["status"]): "published" | "archived" | "draft" {
  if (status === "Đã xuất bản") return "published";
  if (status === "Đã lưu trữ") return "archived";
  return "draft";
}

function formatRelativeTime(value: string | undefined): string {
  if (!value) return "Gần đây";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Gần đây";

  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.max(0, Math.floor(diffMs / 60_000));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;

  return new Intl.DateTimeFormat("vi-VN").format(date);
}

const fallbackThumbnail = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=2000";

export function apiArticleToPublicCard(article: Article): PublicArticleCard {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    summary: article.summary ?? "",
    thumbnail: article.thumbnail || fallbackThumbnail,
    category: mapArticleCategory(article.category),
    author: article.author?.fullName ?? article.author?.name ?? "Batdongsan.com.vn",
    publishedAt: article.publishedAt ? formatDate(article.publishedAt) : formatDate(article.createdAt),
    viewCount: article.viewCount ?? 0,
    relativeTime: formatRelativeTime(article.publishedAt ?? article.createdAt),
    isFeatured: article.isFeatured ?? false,
  };
}

export function apiArticleToAdminArticle(article: Article): AdminArticle {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    content: article.content,
    category: mapArticleCategory(article.category),
    author: article.author?.fullName ?? article.author?.name ?? "Không rõ",
    status: mapArticleStatus(article.status),
    views: article.viewCount ?? 0,
    publishedAt: article.publishedAt ? formatDate(article.publishedAt) : "--",
    summary: article.summary,
    thumbnail: article.thumbnail,
    isFeatured: article.isFeatured,
  };
}

export function apiUserToAdminUser(user: ApiUser): AdminUser {
  const revenue = typeof user.revenue === "number" ? `${formatCompactNumber(user.revenue)} đ` : user.revenue ?? "0 đ";

  return {
    id: user.id,
    name: user.fullName ?? user.name ?? user.email ?? "Người dùng",
    phone: user.phone ?? "--",
    email: user.email ?? "--",
    role: mapUserRole(user.role),
    roleNumber: typeof user.role === "number" ? user.role : 1,
    status: mapUserStatus(user),
    isBlocked: !!user.isBlocked || !!user.deletedAt,
    listings: typeof user.listings === "number" ? user.listings : 0,
    revenue: String(revenue),
    joinedAt: formatDate(user.createdAt),
    note: "Dữ liệu từ API",
  };
}

export type { LeadSource, LeadStatus };

export interface LeadView {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  source: LeadSource;
  sourceLabel: string;
  status: LeadStatus;
  statusLabel: string;
  propertyId: string;
  propertyTitle: string;
  assignedToId: string;
  assignedToName: string;
  createdAt: string;
  createdDate: string;
  createdTime: string;
}

const leadSourceLabels: Record<LeadSource, string> = {
  property_detail: "Chi tiết BĐS",
  directory: "Danh bạ",
  search: "Tìm kiếm",
};

const leadStatusLabels: Record<LeadStatus, string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  qualified: "Tiềm năng",
  lost: "Mất",
};

export function apiLeadToView(lead: Lead): LeadView {
  return {
    id: lead.id,
    name: lead.name,
    phone: lead.phone,
    email: lead.email ?? "--",
    message: lead.message ?? "",
    source: lead.source,
    sourceLabel: leadSourceLabels[lead.source] ?? lead.source,
    status: lead.status,
    statusLabel: leadStatusLabels[lead.status] ?? lead.status,
    propertyId: lead.property?.id ?? "",
    propertyTitle: lead.property?.title ?? "--",
    assignedToId: lead.assignedTo?.id ?? "",
    assignedToName: lead.assignedTo?.fullName ?? "--",
    createdAt: lead.createdAt,
    createdDate: formatDate(lead.createdAt),
    createdTime: formatRelativeTime(lead.createdAt),
  };
}

export function unwrapLeads(value: unknown): Lead[] {
  if (Array.isArray(value)) return value as Lead[];

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const candidates = [record.data, record.items, record.results, record.docs];
    const found = candidates.find(Array.isArray);
    if (found) return found as Lead[];
  }

  return [];
}
