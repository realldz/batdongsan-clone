import React from "react";
import { type Property } from "@/services/properties";
import { type GeographyDivision } from "@/services/geography";
import { type PackageId, type DurationDays } from "./Step3";

export interface AddressInfo {
  label: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  project: string;
  detail: string;
  lat: number;
  lng: number;
}

export const EMPTY_ADDRESS: AddressInfo = {
  label: "",
  province: "",
  district: "",
  ward: "",
  street: "",
  project: "",
  detail: "",
  lat: 20.9634,
  lng: 105.8285,
};

export interface CreateListingContextType {
  // Navigation / Mode
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  isEditMode: boolean;
  editId: string | null;
  editProperty: Property | null;

  // Step 1 - Form fields
  demand: "sale" | "rent" | null;
  setDemand: React.Dispatch<React.SetStateAction<"sale" | "rent" | null>>;
  selectedAddress: AddressInfo;
  setSelectedAddress: React.Dispatch<React.SetStateAction<AddressInfo>>;
  propertyType: string;
  setPropertyType: React.Dispatch<React.SetStateAction<string>>;
  area: string;
  setArea: React.Dispatch<React.SetStateAction<string>>;
  price: string;
  setPrice: React.Dispatch<React.SetStateAction<string>>;
  priceUnit: string;
  setPriceUnit: React.Dispatch<React.SetStateAction<string>>;
  interior: string;
  setInterior: React.Dispatch<React.SetStateAction<string>>;
  houseDirection: string;
  setHouseDirection: React.Dispatch<React.SetStateAction<string>>;
  balconyDirection: string;
  setBalconyDirection: React.Dispatch<React.SetStateAction<string>>;
  moveInTime: string;
  setMoveInTime: React.Dispatch<React.SetStateAction<string>>;
  electricityPrice: string;
  setElectricityPrice: React.Dispatch<React.SetStateAction<string>>;
  waterPrice: string;
  setWaterPrice: React.Dispatch<React.SetStateAction<string>>;
  internetPrice: string;
  setInternetPrice: React.Dispatch<React.SetStateAction<string>>;
  contactName: string;
  setContactName: React.Dispatch<React.SetStateAction<string>>;
  contactEmail: string;
  setContactEmail: React.Dispatch<React.SetStateAction<string>>;
  contactPhone: string;
  setContactPhone: React.Dispatch<React.SetStateAction<string>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;

  // Step 1 - Modal states
  isAddressModalOpen: boolean;
  setIsAddressModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isConfirmModalOpen: boolean;
  setIsConfirmModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAddressConfirmed: boolean;
  setIsAddressConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  searchResults: GeographyDivision[];
  setSearchResults: React.Dispatch<React.SetStateAction<GeographyDivision[]>>;
  searching: boolean;

  // Step 1 - Section visibility
  expanded: Record<string, boolean>;
  toggleSection: (section: string) => void;
  setExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;

  // Step 1 - Geography API
  apiProvinces: GeographyDivision[];
  apiDistricts: GeographyDivision[];
  apiWards: GeographyDivision[];
  apiStreets: GeographyDivision[];
  provinceId: string;
  districtId: string;
  wardId: string;
  handleProvinceChange: (provId: string) => Promise<void>;
  handleDistrictChange: (distId: string) => Promise<void>;
  handleWardChange: (wrdId: string) => Promise<void>;
  handleStreetChange: (streetName: string) => void;
  handleSelectSearchResult: (res: GeographyDivision) => Promise<void>;
  handleConfirmAddress: () => void;

  // Step 1 - Additional fields
  bedrooms: number;
  setBedrooms: React.Dispatch<React.SetStateAction<number>>;
  bathrooms: number;
  setBathrooms: React.Dispatch<React.SetStateAction<number>>;
  amenities: { camera: boolean; baove: boolean; pccc: boolean };
  setAmenities: React.Dispatch<
    React.SetStateAction<{ camera: boolean; baove: boolean; pccc: boolean }>
  >;

  // Step 2 & 3 - Media and Submit
  imageFiles: File[];
  setImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
  imageUrls: string[];
  setImageUrls: React.Dispatch<React.SetStateAction<string[]>>;
  isSubmitting: boolean;
  submitMessage: string;
  setSubmitMessage: React.Dispatch<React.SetStateAction<string>>;
  priceSummary: string;
  displayAddress: string;
  handleSubmitListing: (packageId: PackageId, durationDays: DurationDays) => Promise<void>;

  // Validation
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export function formatPriceSummary(price: string, unit: string, demand: "sale" | "rent" | null) {
  const value = Number(price.replace(/[^\d]/g, ""));
  if (!value || unit === "Thỏa thuận") return "Thỏa thuận";
  if (unit === "Tỷ") return `${value.toLocaleString("vi-VN")} tỷ`;
  if (unit === "Triệu/tháng") return `${value.toLocaleString("vi-VN")} triệu/tháng`;
  if (unit === "Triệu/m²") return `${value.toLocaleString("vi-VN")} triệu/m²`;
  if (value >= 1_000_000_000)
    return `${(value / 1_000_000_000).toLocaleString("vi-VN")} tỷ${
      demand === "rent" ? "/tháng" : ""
    }`;
  if (value >= 1_000_000)
    return `${(value / 1_000_000).toLocaleString("vi-VN")} triệu${
      demand === "rent" ? "/tháng" : ""
    }`;
  return `${value.toLocaleString("vi-VN")} đ`;
}

export function getUploadUrl(response: Record<string, unknown>): string | null {
  const candidates = [
    response.url,
    response.location,
    response.path,
    response.secureUrl,
    response.publicUrl,
  ];
  const data = response.data;

  if (data && typeof data === "object" && !Array.isArray(data)) {
    const dataRecord = data as Record<string, unknown>;
    candidates.push(
      dataRecord.url,
      dataRecord.location,
      dataRecord.path,
      dataRecord.secureUrl,
      dataRecord.publicUrl
    );
  }

  const found = candidates.find(
    (value) => typeof value === "string" && value.length > 0
  );
  return typeof found === "string" ? found : null;
}
