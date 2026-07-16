import type { VipBadge } from "@/services/properties";

export interface PropertyData {
  id: string;
  title: string;
  price: string;
  area: string;
  location: string;
  imageUrl: string;
  postedTime: string;
  vipBadge: VipBadge;
  isPushed: boolean;
}

export interface ListingData {
  id: string;
  vipTag: string;
  images: string[];
  title: string;
  price: string;
  area: string;
  pricePerSqm: string;
  beds: number;
  baths: number;
  location: string;
  description: string;
  authorName: string;
  authorAvatar: string;
  postedTime: string;
  phone: string;
  direction: string;
  vipBadge: VipBadge;
  isPushed: boolean;
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
  direction?: string | null;
  legalInfo?: string | null;
  certificateType?: string | null;
  negotiable?: boolean;
  frontageMeters?: number | null;
  alleyMeters?: number | null;
  totalFloors?: number | null;
  floor?: number | null;
  pricePerM2?: number | string | null;
  coordinates?: { lat: number; lng: number } | null;
  images: string[];
  postedAt: string;
  expiresAt: string;
  listingType: string;
  code: string;
  vipBadge: VipBadge;
  isPushed: boolean;
  hostId: string;
  owner: {
    name: string;
    avatar: string;
    phone: string;
  };
  bedrooms?: number;
  bathrooms?: number;
  interior?: string;
  balconyDirection?: string;
  ward?: string;
  district?: string;
  province?: string;
  street?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  amenities?: {
    camera: boolean;
    baove: boolean;
    pccc: boolean;
  } | null;
  rentDetails?: {
    moveInTime?: string;
    electricityPrice?: string;
    waterPrice?: string;
    internetPrice?: string;
  } | null;
}
