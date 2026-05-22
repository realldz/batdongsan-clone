export interface PropertyData {
  id: string;
  title: string;
  price: string;
  area: string;
  location: string;
  imageUrl: string;
  postedTime: string;
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
