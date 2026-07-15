import type { AdminListing, AdminListingStatus, AdminListingType } from "@/app/admin/_data/types";
import type { ListingData, PropertyData, PropertyDetailView } from "@/types";
import type { Property, PropertyOwner, PropertyStatus, PropertyType, VipBadge } from "@/services/properties";
import { formatCurrency, formatPricePerSqm } from "@/lib/formatters/currency";
import { formatArea } from "@/lib/formatters/area";
import { formatLocation, formatFullAddress } from "@/lib/formatters/location";
import { formatDate, formatPostedTime } from "@/lib/formatters/date";

const fallbackImages = [
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=2000",
];

const fallbackAvatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200";

export function ensureImages(images: string[] | undefined, min = 3): string[] {
  const validImages = images?.filter(Boolean) ?? [];
  const result = [...validImages];

  for (let index = 0; result.length < min; index += 1) {
    result.push(fallbackImages[index % fallbackImages.length]);
  }

  return result;
}

export function getOwner(property: Property): PropertyOwner | undefined {
  if (property.owner) return property.owner;
  if (property.user) return property.user;
  if (property.host && typeof property.host === "object") return property.host;
  return undefined;
}

export function getOwnerName(property: Property): string {
  if (property.contactName) return property.contactName;
  const owner = getOwner(property);
  return owner?.fullName ?? owner?.name ?? "Người đăng tin";
}

export function getOwnerPhone(property: Property): string {
  if (property.contactPhone) return property.contactPhone;
  const owner = getOwner(property);
  return owner?.phone ?? "0900 000 ***";
}

export function getOwnerAvatar(property: Property): string {
  const owner = getOwner(property);
  return owner?.avatar ?? fallbackAvatar;
}

function getVipBadge(property: Property): VipBadge {
  return property.display?.vipBadge ?? "none";
}

function getIsPushed(property: Property): boolean {
  return property.display?.isPushed ?? false;
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
    beds: property.bedrooms ?? 0,
    baths: property.bathrooms ?? 0,
    direction: property.direction ?? "Đang cập nhật",
    location: formatLocation(property),
    description: property.description,
    authorName: getOwnerName(property),
    authorAvatar: getOwnerAvatar(property),
    postedTime: formatPostedTime(property.createdAt),
    phone: getOwnerPhone(property),
    vipBadge: getVipBadge(property),
    isPushed: getIsPushed(property),
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
    vipBadge: getVipBadge(property),
    isPushed: getIsPushed(property),
  };
}

export function mapPropertyType(type: PropertyType): AdminListingType {
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
    direction: property.direction,
    legalInfo: property.legalInfo,
    coordinates: property.coordinates,
    images: property.images ?? [],
    postedAt: formatDate(property.createdAt),
    expiresAt: property.expiresAt ? formatDate(property.expiresAt) : "--",
    listingType: property.type === "rent" ? "Cho thuê" : "Tin bán",
    code: `BDS-${property.id.slice(0, 8).toUpperCase()}`,
    hostId: (typeof property.host === "string" ? property.host : property.host?.id) ?? getOwner(property)?.id ?? "",
    owner: {
      name: getOwnerName(property),
      avatar: getOwnerAvatar(property),
      phone: getOwnerPhone(property),
    },
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    interior: property.interior,
    balconyDirection: property.balconyDirection,
    ward: property.ward,
    district: property.district,
    province: property.province,
    street: property.street,
    contactName: property.contactName,
    contactPhone: property.contactPhone,
    contactEmail: property.contactEmail,
    amenities: property.amenities,
    rentDetails: property.rentDetails,
    vipBadge: getVipBadge(property),
    isPushed: getIsPushed(property),
  };
}
