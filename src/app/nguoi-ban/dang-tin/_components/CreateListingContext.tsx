"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-store";
import { useRefreshWallet } from "@/lib/use-wallet-balance";
import { api } from "@/lib/api";
import { getPropertyById, createProperty, updateProperty, type Property } from "@/services/properties";
import { uploadPropertyImage } from "@/services/upload";
import { useGeographyState } from "./useGeographyState";
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
  // Step 3 states
  const [postTier, setPostTier] = useState<number>(0);
  const [postDuration, setPostDuration] = useState<number>(15);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [couponCode, setCouponCode] = useState<string>("");
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  const [errors, setErrors] = useState<Record<string, string>>({});

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
          if (Number(property.price) === 0) {
            setPrice("");
            setPriceUnit("Thỏa thuận");
          } else {
            setPrice(String(property.price));
            setPriceUnit("VND");
          }
          setHouseDirection(property.direction ?? "Không xác định");
          if (property.images) setImageUrls(property.images);
          const hasAddress = property.address || property.province || property.district || property.street || property.coordinates;
          if (hasAddress) {
            setIsAddressConfirmed(true);
            setSelectedAddress({
              label: property.address || [property.street, property.district, property.province].filter(Boolean).join(", "),
              province: property.province || "",
              district: property.district || "",
              ward: property.ward || "",
              street: property.street || "",
              detail: "",
              project: "",
              lat: property.coordinates?.lat || 21.028511,
              lng: property.coordinates?.lng || 105.804817,
            });
          }

          
          if (property.contactName) setContactName(property.contactName);
          if (property.contactPhone) setContactPhone(property.contactPhone);
          if (property.contactEmail) setContactEmail(property.contactEmail);
          
          if (property.bedrooms) setBedrooms(property.bedrooms);
          if (property.bathrooms) setBathrooms(property.bathrooms);
          if (property.interior) setInterior(property.interior);
          if (property.balconyDirection) setBalconyDirection(property.balconyDirection);
          if (property.amenities) setAmenities(property.amenities);
          if (property.tier !== undefined) setPostTier(property.tier);
          if (property.boostedAt) setStartDate(new Date(property.boostedAt));
          
          if (property.rentDetails) {
            if (property.rentDetails.moveInTime) setMoveInTime(property.rentDetails.moveInTime);
            if (property.rentDetails.electricityPrice) setElectricityPrice(property.rentDetails.electricityPrice);
            if (property.rentDetails.waterPrice) setWaterPrice(property.rentDetails.waterPrice);
            if (property.rentDetails.internetPrice) setInternetPrice(property.rentDetails.internetPrice);
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
    if (isAddressConfirmed) {
      setErrors((prev) => ({ ...prev, address: "" }));
    }
  }, [isAddressConfirmed]);


  useEffect(() => {
    if (user) {
      setContactName(user.fullName ?? "");
      setContactEmail(user.email ?? "");
      setContactPhone(user.phone ?? "");
    }
  }, [user]);

  const handleSubmitListing = async () => {
    const parsedArea = Number(area.replace(/[^\d.]/g, ""));
    const parsedPrice = priceUnit === "Thỏa thuận" ? 0 : Number(price.replace(/[^\d]/g, ""));

    if (
      !demand ||
      !parsedArea ||
      (priceUnit !== "Thỏa thuận" && !parsedPrice) ||
      title.trim().length < 30 ||
      description.trim().length < 30
    ) {
      setSubmitMessage("Vui lòng kiểm tra lại thông tin tin đăng. Tiêu đề và Mô tả cần tối thiểu 30 ký tự.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const propertyPayload: any = {
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

      if (isEditMode && editProperty?.status === "pending") {
        propertyPayload.startDate = startDate?.toISOString() || new Date().toISOString();
      }

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

      if (!isEditMode || (editProperty && ["expired", "rejected", "draft"].includes(editProperty.status || ""))) {
        // Thanh toán và publish tin nếu tạo mới hoặc tin đã hết hạn/bị từ chối/nháp
        await api.post(`/properties/${property.id}/publish`, {
          tier: postTier,
          durationDays: postDuration,
          startDate: startDate?.toISOString() || new Date().toISOString(),
          couponCode: couponCode || undefined,
        });
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
        postTier,
        setPostTier,
        postDuration,
        setPostDuration,
        startDate,
        setStartDate,
        couponCode,
        setCouponCode,
        couponDiscount,
        setCouponDiscount,
        isSubmitting,
        submitMessage,
        setSubmitMessage,
        priceSummary,
        displayAddress,
        handleSubmitListing,
        errors,
        setErrors,
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
