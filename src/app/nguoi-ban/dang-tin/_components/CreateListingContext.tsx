"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-store";
import { useRefreshWallet } from "@/lib/use-wallet-balance";
import { getPropertyById, createProperty, updateProperty, type Property } from "@/services/properties";
import { uploadPropertyImage } from "@/services/upload";
import { payWallet } from "@/services/wallet";
import { useGeographyState } from "./useGeographyState";
import { PACKAGE_PRICES, type PackageId, type DurationDays } from "./Step3";
import {
  type CreateListingContextType,
  formatPriceSummary,
  getUploadUrl,
} from "./CreateListingTypes";

const CreateListingContext = createContext<CreateListingContextType | undefined>(undefined);

export function CreateListingProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = Boolean(editId);
  const { user } = useAuth();
  const refreshWallet = useRefreshWallet();
  const [editProperty, setEditProperty] = useState<Property | null>(null);

  // States
  const [currentStep, setCurrentStep] = useState(1);
  const [demand, setDemand] = useState<"sale" | "rent" | null>(null);
  const [propertyType, setPropertyType] = useState("Căn hộ chung cư");
  const [area, setArea] = useState("");
  const [price, setPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState("VND");
  const [interior, setInterior] = useState("Đầy đủ");
  const [houseDirection, setHouseDirection] = useState("Đông");
  const [balconyDirection, setBalconyDirection] = useState("Đông");
  const [moveInTime, setMoveInTime] = useState("Thoả thuận");
  const [electricityPrice, setElectricityPrice] = useState("Theo nhà cung cấp");
  const [waterPrice, setWaterPrice] = useState("Theo nhà cung cấp");
  const [internetPrice, setInternetPrice] = useState("Thoả thuận");
  const [contactName, setContactName] = useState(user?.fullName ?? "");
  const [contactEmail, setContactEmail] = useState(user?.email ?? "");
  const [contactPhone, setContactPhone] = useState(user?.phone ?? "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // Additional Step 1 states
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [amenities, setAmenities] = useState({ camera: false, baove: false, pccc: false });

  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    demand: true,
    address: true,
    main: true,
    other: true,
    contact: true,
    content: true,
  });

  const toggleSection = (section: string) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const {
    isAddressModalOpen,
    setIsAddressModalOpen,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    searchQuery,
    setSearchQuery,
    isAddressConfirmed,
    setIsAddressConfirmed,
    selectedAddress,
    setSelectedAddress,
    apiProvinces,
    apiDistricts,
    apiWards,
    apiStreets,
    provinceId,
    districtId,
    wardId,
    searchResults,
    setSearchResults,
    searching,
    handleProvinceChange,
    handleDistrictChange,
    handleWardChange,
    handleStreetChange,
    handleSelectSearchResult,
    handleConfirmAddress,
  } = useGeographyState(setExpanded);

  useEffect(() => {
    if (isEditMode && editId) {
      getPropertyById(editId)
        .then((property) => {
          if (!property) return;
          setEditProperty(property);
          setDemand(property.type);
          setTitle(property.title);
          setDescription(property.description);
          setArea(String(property.area));
          setPrice(String(property.price));
          setHouseDirection(property.direction ?? "Không xác định");
          if (property.images) setImageUrls(property.images);
          if (property.address) {
            setIsAddressConfirmed(true);
          }
        })
        .catch(() => {
          toast.error("Không thể tải thông tin tin đăng");
          router.replace("/nguoi-ban/tin-dang");
        });
    }
  }, [isEditMode, editId, router, setIsAddressConfirmed]);

  const priceSummary = useMemo(
    () => formatPriceSummary(price, priceUnit, demand),
    [price, priceUnit, demand]
  );
  const displayAddress = useMemo(
    () =>
      [
        selectedAddress.detail,
        selectedAddress.street,
        selectedAddress.district,
        selectedAddress.province,
      ]
        .filter(Boolean)
        .join(", "),
    [selectedAddress]
  );


  useEffect(() => {
    if (user) {
      setContactName(user.fullName ?? "");
      setContactEmail(user.email ?? "");
      setContactPhone(user.phone ?? "");
    }
  }, [user]);

  const handleSubmitListing = async (packageId: PackageId, durationDays: DurationDays) => {
    const parsedArea = Number(area.replace(/[^\d.]/g, ""));
    const parsedPrice = Number(price.replace(/[^\d]/g, ""));

    if (
      !demand ||
      !parsedArea ||
      !parsedPrice ||
      title.trim().length < 10 ||
      description.trim().length < 10
    ) {
      setSubmitMessage("Vui lòng kiểm tra tiêu đề, mô tả, diện tích và mức giá.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const total = PACKAGE_PRICES[packageId] * durationDays;
      const label = demand === "rent" ? "Cho thuê" : "Bán";

      await payWallet({
        amount: total,
        description: `Đăng tin ${label} - ${title.trim().slice(0, 50)}`,
      });

      const propertyPayload = {
        title: title.trim(),
        description: description.trim(),
        type: demand,
        price: parsedPrice,
        area: parsedArea,
        address: displayAddress,
        district: selectedAddress.district,
        province: selectedAddress.province,
        ward: selectedAddress.ward || undefined,
        street: selectedAddress.street || undefined,
        coordinates: { lat: selectedAddress.lat, lng: selectedAddress.lng },
        direction: houseDirection,
        legalInfo: "Đang cập nhật",
        bedrooms: bedrooms || undefined,
        bathrooms: bathrooms || undefined,
        interior: interior || undefined,
        balconyDirection: balconyDirection || undefined,
        contactName: contactName || undefined,
        contactPhone: contactPhone || undefined,
        contactEmail: contactEmail || undefined,
        amenities: {
          camera: amenities.camera,
          baove: amenities.baove,
          pccc: amenities.pccc,
        },
        rentDetails: demand === "rent" ? {
          moveInTime: moveInTime || undefined,
          electricityPrice: electricityPrice || undefined,
          waterPrice: waterPrice || undefined,
          internetPrice: internetPrice || undefined,
        } : null,
      };

      const property =
        isEditMode && editProperty
          ? await updateProperty(editProperty.id, propertyPayload)
          : await createProperty(propertyPayload);

      const uploadedUrls =
        imageFiles.length > 0
          ? (
              await Promise.all(
                imageFiles.map((file) => uploadPropertyImage(property.id, file))
              )
            )
              .map((response) => getUploadUrl(response))
              .filter((url): url is string => Boolean(url))
          : [];

      const finalImages = [...imageUrls, ...uploadedUrls];

      if (finalImages.length > 0) {
        await updateProperty(property.id, { images: finalImages });
      }

      refreshWallet();
      toast.success(
        isEditMode ? "Cập nhật tin đăng thành công!" : "Đăng tin thành công!"
      );
      router.push("/nguoi-ban/tin-dang");
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Đăng tin thất bại, vui lòng thử lại sau.";
      setSubmitMessage(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CreateListingContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        isEditMode,
        editId,
        editProperty,
        demand,
        setDemand,
        selectedAddress,
        setSelectedAddress,
        propertyType,
        setPropertyType,
        area,
        setArea,
        price,
        setPrice,
        priceUnit,
        setPriceUnit,
        interior,
        setInterior,
        houseDirection,
        setHouseDirection,
        balconyDirection,
        setBalconyDirection,
        moveInTime,
        setMoveInTime,
        electricityPrice,
        setElectricityPrice,
        waterPrice,
        setWaterPrice,
        internetPrice,
        setInternetPrice,
        contactName,
        setContactName,
        contactEmail,
        setContactEmail,
        contactPhone,
        setContactPhone,
        title,
        setTitle,
        description,
        setDescription,
        isAddressModalOpen,
        setIsAddressModalOpen,
        isConfirmModalOpen,
        setIsConfirmModalOpen,
        isAddressConfirmed,
        setIsAddressConfirmed,
        searchQuery,
        setSearchQuery,
        searchResults,
        setSearchResults,
        searching,
        expanded,
        toggleSection,
        setExpanded,
        apiProvinces,
        apiDistricts,
        apiWards,
        apiStreets,
        provinceId,
        districtId,
        wardId,
        handleProvinceChange,
        handleDistrictChange,
        handleWardChange,
        handleStreetChange,
        handleSelectSearchResult,
        handleConfirmAddress,
        bedrooms,
        setBedrooms,
        bathrooms,
        setBathrooms,
        amenities,
        setAmenities,
        imageFiles,
        setImageFiles,
        imageUrls,
        setImageUrls,
        isSubmitting,
        submitMessage,
        setSubmitMessage,
        priceSummary,
        displayAddress,
        handleSubmitListing,
      }}
    >
      {children}
    </CreateListingContext.Provider>
  );
}

export function useCreateListing() {
  const context = useContext(CreateListingContext);
  if (context === undefined) {
    throw new Error("useCreateListing must be used within a CreateListingProvider");
  }
  return context;
}
