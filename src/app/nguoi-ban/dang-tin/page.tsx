"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Eye, Tag, Key, ChevronUp, Search, X, MapPin, Check, ChevronDown, Flag, Cloud, Sparkles, Plus, Minus, Edit2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createProperty, getPropertyById, updateProperty, type Property } from "@/services/properties";
import { uploadPropertyImage } from "@/services/upload";
import { payWallet } from "@/services/wallet";
import { useAuth } from "@/lib/auth-store";
import { useRefreshWallet } from "@/lib/use-wallet-balance";
import { toast } from "sonner";
import { Step2 } from "./_components/Step2";
import { Step3, PACKAGE_PRICES, type PackageId, type DurationDays } from "./_components/Step3";

const propertyTypeOptions = ["Căn hộ chung cư", "Nhà riêng", "Nhà mặt phố", "Biệt thự", "Nhà trọ, phòng trọ", "Văn phòng", "Cửa hàng, ki-ốt", "Đất nền", "Kho, nhà xưởng"];
const priceUnitOptions = ["VND", "Triệu/tháng", "Tỷ", "Triệu/m²", "Thỏa thuận"];
const interiorOptions = ["Đầy đủ", "Cơ bản", "Nội thất cao cấp", "Không nội thất", "Bàn giao thô"];
const directionOptions = ["Đông", "Tây", "Nam", "Bắc", "Đông Nam", "Đông Bắc", "Tây Nam", "Tây Bắc", "Không xác định"];
const moveInOptions = ["Thoả thuận", "Ở ngay", "Sau 1 tuần", "Sau 15 ngày", "Sau 1 tháng"];
const utilityPriceOptions = ["Theo nhà cung cấp", "Theo giá dân", "Theo giá kinh doanh", "Miễn phí", "Thoả thuận"];
const internetPriceOptions = ["Thoả thuận", "Miễn phí", "200.000 đ/tháng", "300.000 đ/tháng", "Theo nhà cung cấp"];
const phoneOptions = ["0967981332", "0901234567", "0912345678", "0987654321"];
const projectOptions = ["HH2 Linh Đàm", "HH3 Linh Đàm", "HH4 Linh Đàm", "Xuân Mai Sparks Tower", "Central Residence", "Icon4 Tower"];
const streetOptions = ["Đường Linh Đường", "Đường Nguyễn Hữu Thọ", "Đường Giải Phóng", "Đường Trần Thủ Độ", "Đường Tam Trinh", "Chọn đường/phố"];
const mockAddressOptions = [
  { label: "HH2 Linh Đàm, Phường Hoàng Liệt, Quận Hoàng Mai, Hà Nội", province: "Hà Nội", district: "Quận Hoàng Mai", ward: "Phường Hoàng Liệt", street: "Đường Linh Đường", project: "HH2 Linh Đàm", detail: "HH2 Linh Đàm", lat: 20.9634, lng: 105.8285 },
  { label: "HH3 Linh Đàm, Phường Hoàng Liệt, Quận Hoàng Mai, Hà Nội", province: "Hà Nội", district: "Quận Hoàng Mai", ward: "Phường Hoàng Liệt", street: "Đường Nguyễn Hữu Thọ", project: "HH3 Linh Đàm", detail: "HH3 Linh Đàm", lat: 20.9641, lng: 105.8279 },
  { label: "Xuân Mai Sparks Tower, Phường La Khê, Quận Hà Đông, Hà Nội", province: "Hà Nội", district: "Quận Hà Đông", ward: "Phường La Khê", street: "Đường Tố Hữu", project: "Xuân Mai Sparks Tower", detail: "Xuân Mai Sparks Tower", lat: 20.9824, lng: 105.7776 },
  { label: "Central Residence, Phường Định Công, Quận Hoàng Mai, Hà Nội", province: "Hà Nội", district: "Quận Hoàng Mai", ward: "Phường Định Công", street: "Đường Định Công", project: "Central Residence", detail: "Central Residence", lat: 20.9845, lng: 105.8331 },
];

function formatPriceSummary(price: string, unit: string, demand: "sale" | "rent" | null) {
  const value = Number(price.replace(/[^\d]/g, ""));
  if (!value || unit === "Thỏa thuận") return "Thỏa thuận";
  if (unit === "Tỷ") return `${value.toLocaleString("vi-VN")} tỷ`;
  if (unit === "Triệu/tháng") return `${value.toLocaleString("vi-VN")} triệu/tháng`;
  if (unit === "Triệu/m²") return `${value.toLocaleString("vi-VN")} triệu/m²`;
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toLocaleString("vi-VN")} tỷ${demand === "rent" ? "/tháng" : ""}`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toLocaleString("vi-VN")} triệu${demand === "rent" ? "/tháng" : ""}`;
  return `${value.toLocaleString("vi-VN")} đ`;
}

function getUploadUrl(response: Record<string, unknown>): string | null {
  const candidates = [response.url, response.location, response.path, response.secureUrl, response.publicUrl];
  const data = response.data;

  if (data && typeof data === "object" && !Array.isArray(data)) {
    const dataRecord = data as Record<string, unknown>;
    candidates.push(dataRecord.url, dataRecord.location, dataRecord.path, dataRecord.secureUrl, dataRecord.publicUrl);
  }

  const found = candidates.find((value) => typeof value === "string" && value.length > 0);
  return typeof found === "string" ? found : null;
}

export default function CreateListingPage() {
  return (
    <Suspense>
      <CreateListingPageInner />
    </Suspense>
  );
}

function CreateListingPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = Boolean(editId);
  const { user } = useAuth();
  const refreshWallet = useRefreshWallet();
  const [editProperty, setEditProperty] = useState<Property | null>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [demand, setDemand] = useState<"sale" | "rent" | null>("rent");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(mockAddressOptions[0]);
  const [propertyType, setPropertyType] = useState("Căn hộ chung cư");
  const [area, setArea] = useState("75");
  const [price, setPrice] = useState("9000000");
  const [priceUnit, setPriceUnit] = useState("VND");
  const [interior, setInterior] = useState("Đầy đủ");
  const [houseDirection, setHouseDirection] = useState("Tây");
  const [balconyDirection, setBalconyDirection] = useState("Đông");
  const [moveInTime, setMoveInTime] = useState("Thoả thuận");
  const [electricityPrice, setElectricityPrice] = useState("Theo nhà cung cấp");
  const [waterPrice, setWaterPrice] = useState("Theo nhà cung cấp");
  const [internetPrice, setInternetPrice] = useState("Thoả thuận");
  const [contactName, setContactName] = useState(user?.fullName ?? "");
  const [contactEmail, setContactEmail] = useState(user?.email ?? "");
  const [contactPhone, setContactPhone] = useState(user?.phone ?? "");
  const [title, setTitle] = useState(isEditMode ? "" : "Cho thuê căn hộ HH2 Linh Đàm, 9 triệu VND, 75 m2, đầy đủ nội thất");
  const [description, setDescription] = useState(isEditMode ? "" : "Căn hộ chung cư tại HH2 Linh Đàm, Phường Hoàng Liệt, Hà Nội với diện tích 75 m2, được thiết kế hiện đại và đầy đủ tiện nghi.");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    if (isEditMode && editId) {
      getPropertyById(editId).then((property) => {
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
      }).catch(() => {
        toast.error("Không thể tải thông tin tin đăng");
        router.replace("/nguoi-ban/tin-dang");
      });
    }
  }, [isEditMode, editId, router]);

  // Section Expansion States
  const [expanded, setExpanded] = useState({
    demand: true,
    address: true,
    main: true,
    other: true,
    contact: true,
    content: true,
  });

  const toggleSection = (section: keyof typeof expanded) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Form Field States for summaries
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [amenities, setAmenities] = useState({ camera: false, baove: true, pccc: true });
  const priceSummary = formatPriceSummary(price, priceUnit, demand);
  const displayAddress = [selectedAddress.detail, selectedAddress.street, selectedAddress.ward, selectedAddress.district, selectedAddress.province].filter(Boolean).join(", ");

  const handleConfirmAddress = () => {
    setIsConfirmModalOpen(false);
    setIsAddressConfirmed(true);
    // Collapse demand, keep others open according to the UI flow usually
    setExpanded({
      demand: false,
      address: true,
      main: true,
      other: true,
      contact: true,
      content: true,
    });
  };

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

    if (!demand || !parsedArea || !parsedPrice || title.trim().length < 10 || description.trim().length < 10) {
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
        coordinates: { lat: selectedAddress.lat, lng: selectedAddress.lng },
        direction: houseDirection,
        legalInfo: "Đang cập nhật",
      };

      const property = isEditMode && editProperty
        ? await updateProperty(editProperty.id, propertyPayload)
        : await createProperty(propertyPayload);

      const uploadedUrls = imageFiles.length > 0
        ? (await Promise.all(imageFiles.map((file) => uploadPropertyImage(property.id, file))))
          .map((response) => getUploadUrl(response))
          .filter((url): url is string => Boolean(url))
        : [];

      const finalImages = [...imageUrls, ...uploadedUrls];

      if (finalImages.length > 0) {
        await updateProperty(property.id, { images: finalImages });
      }

      refreshWallet();
      toast.success(isEditMode ? "Cập nhật tin đăng thành công!" : "Đăng tin thành công!");
      router.push("/nguoi-ban/tin-dang");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Lỗi không xác định";
      setSubmitMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex flex-col font-sans text-[14px] text-[#2c2c2c]">
      {/* Header */}
      <header className="bg-white sticky top-0 z-20">
        <div className="px-6 py-4 flex items-center justify-between max-w-[1400px] w-full mx-auto">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <h1 className="text-xl font-bold text-[#2c2c2c]">{isEditMode ? "Chỉnh sửa tin đăng" : "Tạo tin đăng"}</h1>
              {isAddressConfirmed && (
                <div className="flex items-center gap-1.5 text-gray-500 text-[13px] ml-2">
                  <Cloud size={16} /> Đã lưu nháp
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-1.5 border border-gray-200 rounded-full text-gray-400 cursor-not-allowed bg-white">
              <Eye size={16} />
              <span className="font-medium text-[13px]">Xem trước</span>
            </button>
            <Link href="/nguoi-ban/tin-dang" className="px-4 py-1.5 border border-gray-300 rounded-full text-[#2c2c2c] font-medium text-[13px] hover:bg-gray-50 transition-colors bg-white">
              Thoát
            </Link>
          </div>
        </div>
        {/* Progress bar area */}
        <div className="w-full flex bg-white">
          <div className={`${currentStep === 1 ? 'w-[30%]' : currentStep === 2 ? 'w-[65%]' : 'w-full'} border-b-[3px] border-[#e03c31] relative transition-all duration-300`}>
            <div className="absolute bottom-[8px] left-6 text-[13px] font-medium text-[#2c2c2c] whitespace-nowrap">
              {currentStep === 1 ? 'Bước 1. Thông tin BĐS' : currentStep === 2 ? 'Bước 2. Hình ảnh & video' : 'Bước 3. Cấu hình & thanh toán'}
            </div>
          </div>
          <div className={`${currentStep === 1 ? 'w-[70%]' : currentStep === 2 ? 'w-[35%]' : 'w-0'} border-b-[3px] border-gray-100 transition-all duration-300`} />
        </div>
      </header>

      {/* Main Content */}
      <div className={currentStep === 1 ? "block" : "hidden"}>
        <main className="flex-1 w-[700px] max-w-full mx-auto px-4 py-8 pb-32">
          {/* Nhu cầu Card */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => toggleSection("demand")}>
              <h2 className="font-bold text-[14px]">Nhu cầu <span className="text-[#e03c31]">*</span></h2>
              {expanded.demand ? <ChevronUp size={20} className="text-[#2c2c2c]" /> : <ChevronDown size={20} className="text-[#2c2c2c]" />}
            </div>
            {expanded.demand ? (
              <div className="px-4 pb-6 pt-0 grid grid-cols-2 gap-4 border-t border-transparent">
                <div
                  onClick={(e) => { e.stopPropagation(); setDemand("sale"); }}
                  className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${demand === "sale" ? "border-[#2c2c2c] border-2 bg-white" : "border-gray-200 border hover:border-gray-400 bg-white"
                    }`}
                >
                  <Tag size={20} className={demand === "sale" ? "text-[#2c2c2c]" : "text-gray-500"} />
                  <span className={`font-bold ${demand === "sale" ? "text-[#2c2c2c]" : "text-[#2c2c2c]"}`}>Bán</span>
                </div>
                <div
                  onClick={(e) => { e.stopPropagation(); setDemand("rent"); }}
                  className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${demand === "rent" ? "border-[#2c2c2c] border-2 bg-white" : "border-gray-200 border hover:border-gray-400 bg-white"
                    }`}
                >
                  <Key size={20} className={demand === "rent" ? "text-[#2c2c2c]" : "text-gray-500"} />
                  <span className={`font-bold ${demand === "rent" ? "text-[#2c2c2c]" : "text-[#2c2c2c]"}`}>Cho thuê</span>
                </div>
              </div>
            ) : (
              <div className="px-4 pb-4 pt-0 text-[14px] text-[#2c2c2c]">
                {demand === "sale" ? "Bán" : demand === "rent" ? "Cho thuê" : "Chưa chọn"}
              </div>
            )}
          </div>

          {/* Địa chỉ Card */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => toggleSection("address")}>
              <h2 className="font-bold text-[14px]">Địa chỉ <span className="text-[#e03c31]">*</span></h2>
              {expanded.address ? <ChevronUp size={20} className="text-[#2c2c2c]" /> : <ChevronDown size={20} className="text-[#2c2c2c]" />}
            </div>

            {expanded.address ? (
              <div className="px-4 pb-6 pt-0">
                {!isAddressConfirmed ? (
                  <div
                    onClick={() => setIsAddressModalOpen(true)}
                    className="flex items-center gap-2 w-full border border-gray-300 rounded-full px-4 py-2.5 cursor-text bg-white hover:border-gray-400 transition-colors"
                  >
                    <Search size={18} className="text-[#2c2c2c]" />
                    <span className="text-gray-500 text-[14px]">Nhập địa chỉ</span>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <MapPin size={16} className="text-[#2c2c2c]" />
                        <span className="font-bold text-[13px]">Địa chỉ</span>
                      </div>
                      <div className="pl-6 text-[14px] text-[#2c2c2c]">{displayAddress}</div>
                    </div>
                    {/* <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <MapPin size={16} className="text-[#e03c31]" fill="#e03c31" stroke="white" strokeWidth={1} />
                        <span className="font-bold text-[13px] text-[#e03c31]">Địa chỉ mới</span>
                      </div>
                      <div className="pl-6 text-[14px] text-[#2c2c2c]">{selectedAddress.project}, <span className="font-bold">{selectedAddress.ward}</span>, {selectedAddress.province}</div>
                    </div> */}

                    <button onClick={() => setIsAddressModalOpen(true)} className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50 bg-white">
                      <Edit2 size={14} className="text-gray-600" />
                    </button>

                    <div className="w-full h-[180px] bg-[#e5e3df] rounded-md relative overflow-hidden border border-gray-300 flex items-center justify-center mt-4">
                      <div className="absolute inset-0 opacity-60 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=20.9634,105.8285&zoom=14&size=640x300&maptype=roadmap&key=mock')] bg-cover bg-center mix-blend-multiply"></div>
                      {/* Decorative map lines */}
                      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 50 Q 150 20, 300 100 T 640 80" fill="none" stroke="#2c2c2c" strokeWidth="3" />
                        <path d="M200 0 L 250 180" fill="none" stroke="#ffffff" strokeWidth="6" />
                      </svg>
                      <div className="relative z-10 flex flex-col items-center drop-shadow-md pb-4 animate-bounce">
                        <MapPin size={36} className="text-[#e03c31]" fill="#e03c31" stroke="white" strokeWidth={1} />
                        <div className="w-2.5 h-1.5 bg-black/30 rounded-[50%] absolute bottom-2 blur-[1px]"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              isAddressConfirmed && (
                <div className="px-4 pb-4 pt-0 relative">
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin size={16} className="text-[#2c2c2c]" />
                      <span className="font-bold text-[13px]">Địa chỉ</span>
                    </div>
                    <div className="pl-6 text-[14px] text-[#2c2c2c]">{displayAddress}</div>
                  </div>
                  {/* <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={16} className="text-[#e03c31]" fill="#e03c31" stroke="white" strokeWidth={1} />
                    <span className="font-bold text-[13px] text-[#e03c31]">Địa chỉ mới</span>
                  </div>
                  <div className="pl-6 text-[14px] text-[#2c2c2c]">{selectedAddress.project}, <span className="font-bold">{selectedAddress.ward}</span>, {selectedAddress.province}</div>
                </div> */}
                  <button onClick={(e) => { e.stopPropagation(); setIsAddressModalOpen(true); }} className="absolute top-0 right-4 w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50 bg-white">
                    <Edit2 size={14} className="text-gray-600" />
                  </button>
                </div>
              )
            )}
          </div>

          {/* Following Sections Only Show When Address Is Confirmed */}
          {isAddressConfirmed && (
            <>
              {/* Thông tin chính Card */}
              <div className="bg-white rounded-lg border border-gray-200 mb-6 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => toggleSection("main")}>
                  <h2 className="font-bold text-[14px]">Thông tin chính <span className="text-[#e03c31]">*</span></h2>
                  {expanded.main ? <ChevronUp size={20} className="text-[#2c2c2c]" /> : <ChevronDown size={20} className="text-[#2c2c2c]" />}
                </div>

                {expanded.main ? (
                  <div className="px-4 pb-6 pt-0 space-y-4">
                    <div>
                      <label className="block text-[13px] font-bold mb-2">Loại bất động sản <span className="text-[#e03c31]">*</span></label>
                      <div className="relative">
                        <select value={propertyType} onChange={(event) => setPropertyType(event.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2.5 appearance-none outline-none focus:border-[#2c2c2c] text-[14px] bg-white">
                          {propertyTypeOptions.map((option) => <option key={option}>{option}</option>)}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold mb-2">Diện tích <span className="text-[#e03c31]">*</span></label>
                      <div className="relative">
                        <input type="text" value={area} onChange={(event) => setArea(event.target.value)} className="w-full border border-gray-300 rounded-md pl-3 pr-10 py-2.5 outline-none focus:border-[#2c2c2c] text-[14px]" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">m²</span>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-[2]">
                        <label className="block text-[13px] font-bold mb-2">Mức giá <span className="text-[#e03c31]">*</span></label>
                        <input type="text" value={price} onChange={(event) => setPrice(event.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none focus:border-[#2c2c2c] text-[14px]" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[13px] font-bold mb-2">Đơn vị</label>
                        <div className="relative">
                          <select value={priceUnit} onChange={(event) => setPriceUnit(event.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2.5 appearance-none outline-none focus:border-[#2c2c2c] text-[14px] bg-white">
                            {priceUnitOptions.map((option) => <option key={option}>{option}</option>)}
                          </select>
                          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="text-[13px] text-gray-500 mt-1">
                      Tổng trị giá <span className="font-bold text-[#2c2c2c]">{priceSummary}</span>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 pb-4 pt-0 text-[14px] text-[#2c2c2c]">
                    {propertyType} • {priceSummary} • {area} m²
                  </div>
                )}
              </div>

              {/* Thông tin khác Card */}
              <div className="bg-white rounded-lg border border-gray-200 mb-6 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => toggleSection("other")}>
                  <h2 className="font-bold text-[14px]">Thông tin khác</h2>
                  {expanded.other ? <ChevronUp size={20} className="text-[#2c2c2c]" /> : <ChevronDown size={20} className="text-[#2c2c2c]" />}
                </div>

                {expanded.other ? (
                  <div className="px-4 pb-6 pt-0 space-y-4">
                    <div>
                      <label className="block text-[13px] font-bold mb-2">Nội thất</label>
                      <div className="relative">
                        <select value={interior} onChange={(event) => setInterior(event.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2.5 appearance-none outline-none focus:border-[#2c2c2c] text-[14px] bg-white">
                          {interiorOptions.map((option) => <option key={option}>{option}</option>)}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-[13px] font-bold">Số phòng ngủ</span>
                      <div className="flex items-center gap-4">
                        <button onClick={() => setBedrooms(Math.max(0, bedrooms - 1))} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 bg-gray-50 text-gray-400">
                          <Minus size={14} />
                        </button>
                        <span className="w-4 text-center font-medium">{bedrooms}</span>
                        <button onClick={() => setBedrooms(bedrooms + 1)} className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:bg-gray-50 bg-white">
                          <Plus size={14} className="text-[#2c2c2c]" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-[13px] font-bold">Số phòng tắm, vệ sinh</span>
                      <div className="flex items-center gap-4">
                        <button onClick={() => setBathrooms(Math.max(0, bathrooms - 1))} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 bg-gray-50 text-gray-400">
                          <Minus size={14} />
                        </button>
                        <span className="w-4 text-center font-medium">{bathrooms}</span>
                        <button onClick={() => setBathrooms(bathrooms + 1)} className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:bg-gray-50 bg-white">
                          <Plus size={14} className="text-[#2c2c2c]" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold mb-2">Hướng nhà</label>
                      <div className="relative">
                        <select value={houseDirection} onChange={(event) => setHouseDirection(event.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2.5 appearance-none outline-none focus:border-[#2c2c2c] text-[14px] bg-white">
                          {directionOptions.map((option) => <option key={option}>{option}</option>)}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold mb-2">Hướng ban công</label>
                      <div className="relative">
                        <select value={balconyDirection} onChange={(event) => setBalconyDirection(event.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2.5 appearance-none outline-none focus:border-[#2c2c2c] text-[14px] bg-white">
                          {directionOptions.map((option) => <option key={option}>{option}</option>)}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                      </div>
                    </div>

                    {[
                      { label: "Thời gian vào ở", value: moveInTime, setValue: setMoveInTime, options: moveInOptions },
                      { label: "Mức giá điện", value: electricityPrice, setValue: setElectricityPrice, options: utilityPriceOptions },
                      { label: "Mức giá nước", value: waterPrice, setValue: setWaterPrice, options: utilityPriceOptions },
                      { label: "Mức giá internet", value: internetPrice, setValue: setInternetPrice, options: internetPriceOptions },
                    ].map((field) => (
                      <div key={field.label}>
                        <label className="block text-[13px] font-bold mb-2">{field.label}</label>
                        <div className="relative">
                          <select value={field.value} onChange={(event) => field.setValue(event.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2.5 appearance-none outline-none focus:border-[#2c2c2c] text-[14px] bg-white">
                            {field.options.map((option) => <option key={option}>{option}</option>)}
                          </select>
                          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                        </div>
                      </div>
                    ))}

                    <div className="pt-2">
                      <label className="block text-[13px] font-bold mb-3">Tiện ích</label>
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => setAmenities({ ...amenities, camera: !amenities.camera })}
                          className={`px-4 py-2 rounded-full border text-[13px] font-bold flex items-center gap-2 transition-colors ${amenities.camera ? "bg-[#2c2c2c] text-white border-[#2c2c2c]" : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"}`}
                        >
                          <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[9px]">C</div>
                          Camera
                        </button>
                        <button
                          onClick={() => setAmenities({ ...amenities, baove: !amenities.baove })}
                          className={`px-4 py-2 rounded-full border text-[13px] font-bold flex items-center gap-2 transition-colors ${amenities.baove ? "bg-[#2c2c2c] text-white border-[#2c2c2c]" : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"}`}
                        >
                          <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[9px]">B</div>
                          Bảo vệ
                        </button>
                        <button
                          onClick={() => setAmenities({ ...amenities, pccc: !amenities.pccc })}
                          className={`px-4 py-2 rounded-full border text-[13px] font-bold flex items-center gap-2 transition-colors ${amenities.pccc ? "bg-[#2c2c2c] text-white border-[#2c2c2c]" : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"}`}
                        >
                          <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[9px]">P</div>
                          PCCC
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 pb-4 pt-0 text-[14px] text-[#2c2c2c]">
                    <div className="flex justify-between py-1.5 border-b border-gray-100 last:border-0"><span className="text-gray-500">Nội thất</span><span>{interior}</span></div>
                    <div className="flex justify-between py-1.5 border-b border-gray-100 last:border-0"><span className="text-gray-500">Hướng nhà</span><span>{houseDirection}</span></div>
                    <div className="flex justify-between py-1.5 border-b border-gray-100 last:border-0"><span className="text-gray-500">Hướng ban công</span><span>{balconyDirection}</span></div>
                    <div className="mt-3 text-blue-600 font-medium hover:underline cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleSection("other"); }}>+6 thông tin khác</div>
                  </div>
                )}
              </div>

              {/* Thông tin liên hệ Card */}
              <div className="bg-white rounded-lg border border-gray-200 mb-6 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => toggleSection("contact")}>
                  <h2 className="font-bold text-[14px]">Thông tin liên hệ <span className="text-[#e03c31]">*</span></h2>
                  {expanded.contact ? <ChevronUp size={20} className="text-[#2c2c2c]" /> : <ChevronDown size={20} className="text-[#2c2c2c]" />}
                </div>

                {expanded.contact ? (
                  <div className="px-4 pb-6 pt-0 space-y-4">
                    <div>
                      <label className="block text-[13px] font-bold mb-2">Tên liên hệ <span className="text-[#e03c31]">*</span></label>
                      <input type="text" value={contactName} onChange={(event) => setContactName(event.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none focus:border-[#2c2c2c] text-[14px]" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold mb-2">Email</label>
                      <input type="email" value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none focus:border-[#2c2c2c] text-[14px]" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold mb-2">Số điện thoại <span className="text-[#e03c31]">*</span></label>
                      <div className="relative">
                        <select value={contactPhone} onChange={(event) => setContactPhone(event.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2.5 appearance-none outline-none focus:border-[#2c2c2c] text-[14px] bg-white">
                          {phoneOptions.map((option) => <option key={option}>{option}</option>)}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 pb-4 pt-0 text-[14px] text-[#2c2c2c]">
                    {contactName} • {contactEmail} • {contactPhone}
                  </div>
                )}
              </div>

              {/* Nội dung tiêu đề & mô tả Card */}
              <div className="bg-white rounded-lg border border-gray-200 mb-6 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => toggleSection("content")}>
                  <h2 className="font-bold text-[14px]">Nội dung tiêu đề & mô tả <span className="text-[#e03c31]">*</span></h2>
                  {expanded.content ? <ChevronUp size={20} className="text-[#2c2c2c]" /> : <ChevronDown size={20} className="text-[#2c2c2c]" />}
                </div>

                {expanded.content ? (
                  <div className="px-4 pb-6 pt-0 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
                      <div>
                        <div className="font-bold text-[13px] mb-1">Tạo nhanh với AI</div>
                        <div className="text-[12px] text-gray-500">Bạn còn <span className="font-bold text-[#2c2c2c]">99</span> lượt sử dụng đến ngày 18/04/2026</div>
                      </div>
                      <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-full px-5 py-2 hover:bg-gray-50 transition-colors text-[13px] font-bold shrink-0">
                        <Sparkles size={16} className="text-[#7e22ce]" fill="#7e22ce" />
                        Tạo với AI
                      </button>
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold mb-2">Tiêu đề <span className="text-[#e03c31]">*</span></label>
                      <textarea
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Mô tả ngắn gọn về loại hình bất động sản, diện tích, địa chỉ (VD: Bán nhà riêng 50m2 chính chủ tại Cầu Giấy)"
                        className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none focus:border-[#2c2c2c] text-[14px] min-h-[80px] resize-y placeholder:text-gray-400"
                      />
                      <div className="text-[12px] text-gray-500 mt-1.5">Tối thiểu 30 ký tự, tối đa 99 ký tự</div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold mb-2">Mô tả <span className="text-[#e03c31]">*</span></label>
                      <textarea
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder={`Mô tả chi tiết về:\n• Loại hình bất động sản\n• Vị trí\n• Diện tích, tiện ích\n• Tình trạng nội thất\n...\n(VD: Khu nhà có vị trí thuận lợi, gần công viên, trường học...)`}
                        className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none focus:border-[#2c2c2c] text-[14px] min-h-[160px] resize-y placeholder:text-gray-400 leading-relaxed"
                      />
                      <div className="text-[12px] text-gray-500 mt-1.5">Tối thiểu 30 ký tự, tối đa 3000 ký tự</div>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 pb-4 pt-0 text-[14px] text-[#2c2c2c]">
                    <div className="text-gray-500 text-[12px] mb-1 font-medium">Tiêu đề</div>
                    <div className="mb-4 font-bold">{title}</div>
                    <div className="text-gray-500 text-[12px] mb-1 font-medium">Mô tả</div>
                    <div className="line-clamp-2 leading-relaxed">{description}</div>
                  </div>
                )}
              </div>
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10 flex justify-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="w-[700px] max-w-full flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              className="bg-[#e03c31] hover:bg-[#c9362c] text-white px-8 py-2.5 rounded-full font-bold text-[14px] transition-colors"
            >
              Tiếp tục
            </button>
          </div>
        </footer>

        {/* Address Modal */}
        {isAddressModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-[640px] rounded-lg overflow-hidden flex flex-col max-h-[85vh] shadow-2xl">
              <div className="bg-[#2c2c2c] px-4 py-3 flex items-center justify-between text-white">
                <h3 className="font-bold text-[16px]">Nhập địa chỉ</h3>
                <button onClick={() => setIsAddressModalOpen(false)} className="text-gray-300 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-5 flex flex-col flex-1 overflow-y-auto">
                <div className="relative mb-5">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2c2c2c]" />
                  <input
                    type="text"
                    placeholder="Nhập địa chỉ"
                    className="w-full border border-gray-300 rounded-full pl-10 pr-10 py-2.5 outline-none focus:border-[#2c2c2c] text-[14px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                      <X size={16} />
                    </button>
                  )}
                </div>

                {searchQuery ? (
                  <div className="flex flex-col">
                    {mockAddressOptions.map((address) => (
                      <div
                        key={address.label}
                        className="py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 text-[14px]"
                        onClick={() => {
                          setSelectedAddress(address);
                          setIsAddressModalOpen(false);
                          setIsConfirmModalOpen(true);
                        }}
                      >
                        {address.label}
                      </div>
                    ))}
                    <div className="mt-4 pb-2">
                      <button
                        className="border border-[#2c2c2c] text-[#2c2c2c] font-bold px-5 py-2 rounded-full text-[13px] hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setIsAddressModalOpen(false);
                          setIsConfirmModalOpen(true);
                        }}
                      >
                        Chọn địa chỉ
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <p className="text-gray-600 text-[13px]">
                      Tìm kiếm bằng cách nhập tên quận huyện, phường xã, đường phố hoặc tên dự án, hoặc:
                    </p>
                    <button
                      className="border border-[#2c2c2c] text-[#2c2c2c] font-bold px-5 py-2 rounded-full text-[13px] w-max hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        setIsAddressModalOpen(false);
                        setIsConfirmModalOpen(true);
                      }}
                    >
                      Chọn địa chỉ
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Confirm Address Modal */}
        {isConfirmModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-[640px] rounded-lg overflow-hidden flex flex-col max-h-[85vh] shadow-2xl">
              <div className="bg-[#2c2c2c] px-4 py-3 flex items-center justify-between text-white shrink-0">
                <h3 className="font-bold text-[16px]">Xác nhận địa chỉ</h3>
                <button onClick={() => setIsConfirmModalOpen(false)} className="text-gray-300 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                {/* Form fields */}
                <div className="space-y-5 mb-8">
                  <div>
                    <label className="block text-[13px] font-bold mb-2">Tỉnh/Thành <span className="text-[#e03c31]">*</span></label>
                    <div className="relative">
                      <select value={selectedAddress.province} onChange={(event) => setSelectedAddress({ ...selectedAddress, province: event.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2.5 appearance-none outline-none focus:border-[#2c2c2c] text-[14px] bg-white">
                        {["Hà Nội", "TP.HCM", "Đà Nẵng", "Bình Dương", "Đồng Nai"].map((option) => <option key={option}>{option}</option>)}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold mb-2">Quận/Huyện <span className="text-[#e03c31]">*</span></label>
                    <div className="relative">
                      <select value={selectedAddress.district} onChange={(event) => setSelectedAddress({ ...selectedAddress, district: event.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2.5 appearance-none outline-none focus:border-[#2c2c2c] text-[14px] bg-white">
                        {["Quận Hoàng Mai", "Quận Hà Đông", "Quận Cầu Giấy", "Quận Nam Từ Liêm", "Quận Thanh Xuân", "Huyện Gia Lâm"].map((option) => <option key={option}>{option}</option>)}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold mb-2">Phường/Xã <span className="text-[#e03c31]">*</span></label>
                    <div className="relative">
                      <select value={selectedAddress.ward} onChange={(event) => setSelectedAddress({ ...selectedAddress, ward: event.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2.5 appearance-none outline-none focus:border-[#2c2c2c] text-[14px] bg-white">
                        {["Phường Hoàng Liệt", "Phường Yên Sở", "Phường Định Công", "Phường La Khê", "Phường Mễ Trì", "Phường Dịch Vọng"].map((option) => <option key={option}>{option}</option>)}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold mb-2">Đường/Phố</label>
                    <div className="relative">
                      <select value={selectedAddress.street} onChange={(event) => setSelectedAddress({ ...selectedAddress, street: event.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2.5 appearance-none outline-none focus:border-[#2c2c2c] text-[14px] bg-white">
                        {streetOptions.map((option) => <option key={option}>{option}</option>)}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold mb-2">Địa chỉ chi tiết</label>
                    <input
                      type="text"
                      value={selectedAddress.detail}
                      onChange={(event) => setSelectedAddress({ ...selectedAddress, detail: event.target.value })}
                      placeholder="Nhập số nhà, khu phố, ngõ hẻm..."
                      className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none focus:border-[#2c2c2c] text-[14px] placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold mb-2">Dự án</label>
                    <div className="relative">
                      <select value={selectedAddress.project} onChange={(event) => setSelectedAddress({ ...selectedAddress, project: event.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2.5 appearance-none outline-none focus:border-[#2c2c2c] text-[14px] bg-white">
                        {projectOptions.map((option) => <option key={option}>{option}</option>)}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Display Address Section */}
                <div className="mb-8">
                  <label className="block text-[13px] font-bold mb-3">Địa chỉ hiển thị trên tin đăng <span className="text-[#e03c31]">*</span></label>

                  <div className="bg-[#eef8f2] rounded-md p-3.5 mb-5 flex items-start gap-2.5 border border-[#d3ecd9]">
                    <Check size={18} className="text-[#00a850] mt-0.5 shrink-0" strokeWidth={2.5} />
                    <div>
                      <div className="font-bold text-[#00a850] text-[13px] mb-1">Thêm hiển thị cho địa chỉ mới</div>
                      <div className="text-[13px] text-[#00a850] leading-relaxed">Tin hiển thị ở 2 trang kết quả tìm kiếm (địa chỉ mới và cũ), giúp tiếp cận nhiều người tìm nhà hơn</div>
                    </div>
                  </div>

                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={18} className="text-[#2c2c2c]" />
                      <span className="font-bold text-[13px]">Địa chỉ</span>
                    </div>
                    <div className="pl-6.5 text-[14px] text-[#2c2c2c] flex items-start gap-2">
                      <span className="text-gray-400 mt-0.5">↳</span>
                      <span>{selectedAddress.ward}, {selectedAddress.district}, {selectedAddress.province}</span>
                    </div>
                  </div>

                  {/* <div className="mb-5">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin size={18} className="text-[#e03c31]" fill="#e03c31" stroke="white" strokeWidth={1} />
                      <span className="font-bold text-[13px] text-[#e03c31]">Địa chỉ mới</span>
                    </div>
                    <div className="pl-6.5">
                      <div className="bg-white border border-gray-300 rounded-md p-4 shadow-sm">
                        <div className="text-[13px] text-gray-500 mb-3 italic">Địa chỉ do hệ thống gợi ý</div>
                        <div className="space-y-3.5">
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="radio" name="new_address" className="w-[18px] h-[18px] accent-[#e03c31]" defaultChecked />
                            <span className="text-[14px] font-medium group-hover:text-[#e03c31] transition-colors">{selectedAddress.ward}, {selectedAddress.province}</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="radio" name="new_address" className="w-[18px] h-[18px] accent-[#e03c31]" />
                            <span className="text-[14px] font-medium group-hover:text-[#e03c31] transition-colors">Phường Yên Sở, {selectedAddress.province}</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div> */}

                  {/* <div className="flex items-center gap-2 text-gray-500 cursor-pointer hover:underline mt-4">
                    <Flag size={14} className="text-gray-400" />
                    <span className="text-[13px] underline decoration-gray-300 underline-offset-2">Không tìm thấy địa chỉ phù hợp? Cho chúng tôi biết địa chỉ của bạn</span>
                  </div> */}
                </div>

                {/* Map Section */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[13px]">Chọn vị trí trên bản đồ</span>
                    <button className="text-[13px] text-gray-500 hover:text-[#2c2c2c] font-medium">Đặt lại</button>
                  </div>
                  <div className="text-[13px] text-gray-500 mb-3">Kéo bản đồ để đổi vị trí ghim</div>
                  <div className="w-full h-[180px] bg-[#e5e3df] rounded-md relative overflow-hidden border border-gray-300 flex items-center justify-center">
                    <div className="absolute inset-0 opacity-40 bg-[url(https://maps.googleapis.com/maps/api/staticmap?center=20.9634,105.8285&zoom=14&size=640x300&maptype=roadmap&key=mock)] bg-cover bg-center mix-blend-multiply"></div>

                    {/* Decorative map lines to look more realistic */}
                    <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 50 Q 150 20, 300 100 T 640 80" fill="none" stroke="#2c2c2c" strokeWidth="3" />
                      <path d="M200 0 L 250 180" fill="none" stroke="#ffffff" strokeWidth="6" />
                      <path d="M0 120 L 640 150" fill="none" stroke="#ffffff" strokeWidth="4" />
                    </svg>

                    {/* Map Pin */}
                    <div className="relative z-10 flex flex-col items-center drop-shadow-md pb-4 animate-bounce">
                      <MapPin size={36} className="text-[#e03c31]" fill="#e03c31" stroke="white" strokeWidth={1} />
                      <div className="w-2.5 h-1.5 bg-black/30 rounded-[50%] absolute bottom-2 blur-[1px]"></div>
                    </div>

                    {/* Map Controls Mock */}
                    <div className="absolute right-2 bottom-2 bg-white rounded-md shadow-sm border border-gray-200 flex flex-col">
                      <div className="w-8 h-8 flex items-center justify-center border-b border-gray-200 font-bold text-gray-600">+</div>
                      <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-600">-</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 flex items-center justify-between shrink-0 bg-white">
                <button
                  className="font-bold text-[14px] text-[#2c2c2c] px-4 py-2 hover:bg-gray-50 rounded-full transition-colors"
                  onClick={() => {
                    setIsConfirmModalOpen(false);
                    setIsAddressModalOpen(true);
                  }}
                >
                  Quay lại
                </button>
                <button
                  className="bg-[#e03c31] hover:bg-[#c9362c] text-white px-8 py-2.5 rounded-full font-bold text-[14px] transition-colors"
                  onClick={handleConfirmAddress}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={currentStep === 2 ? "block" : "hidden"}>
        <Step2 onBack={() => setCurrentStep(1)} onNext={() => setCurrentStep(3)} onFilesChange={setImageFiles} onImageUrlsChange={setImageUrls} />
      </div>

      <div className={currentStep === 3 ? "block" : "hidden"}>
        <Step3 onBack={() => setCurrentStep(2)} onSubmit={handleSubmitListing} isSubmitting={isSubmitting} submitMessage={submitMessage} />
      </div>

      {/* Floating Action Button (Chat) */}
      <div className="fixed bottom-6 right-6 z-20">
        <button className="w-[52px] h-[52px] bg-[#e03c31] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#c9362c] transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4C2.9 2 2.01 2.9 2.01 4L2 22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM13 14H11V12H13V14ZM13 10H11V6H13V10Z" fill="currentColor" />
          </svg>
        </button>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
}