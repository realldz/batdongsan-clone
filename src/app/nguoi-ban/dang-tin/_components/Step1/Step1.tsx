import React from "react";
import { toast } from "sonner";
import { useCreateListing } from "../CreateListingContext";
import { DemandSection } from "./DemandSection";
import { AddressSection } from "./AddressSection";
import { MainInfoSection } from "./MainInfoSection";
import { OtherInfoSection } from "./OtherInfoSection";
import { ContactSection } from "./ContactSection";
import { ContentSection } from "./ContentSection";
import { AddressModal } from "./AddressModal";

export function Step1() {
  const {
    demand,
    isAddressConfirmed,
    area,
    price,
    priceUnit,
    contactName,
    contactPhone,
    title,
    description,
    setCurrentStep,
    setErrors,
    setExpanded,
  } = useCreateListing();

  const handleContinue = () => {
    const newErrors: Record<string, string> = {};

    if (!demand) {
      newErrors.demand = "Vui lòng chọn nhu cầu (Bán hoặc Cho thuê).";
    }

    if (!isAddressConfirmed) {
      newErrors.address = "Vui lòng xác nhận địa chỉ bất động sản.";
    } else {
      const parsedArea = Number(area.replace(/[^\d.]/g, ""));
      if (!area || isNaN(parsedArea) || parsedArea <= 0) {
        newErrors.area = "Diện tích phải là số lớn hơn 0.";
      }

      if (priceUnit !== "Thỏa thuận") {
        const parsedPrice = Number(price.replace(/[^\d.]/g, ""));
        if (!price || isNaN(parsedPrice) || parsedPrice <= 0) {
          newErrors.price = "Mức giá phải là số lớn hơn 0.";
        }
      }

      if (!contactName.trim()) {
        newErrors.contactName = "Vui lòng nhập tên liên hệ.";
      }

      const cleanPhone = contactPhone.replace(/[^\d]/g, "");
      if (!contactPhone || cleanPhone.length < 10 || cleanPhone.length > 11) {
        newErrors.contactPhone = "Số điện thoại không hợp lệ (yêu cầu từ 10-11 số).";
      }

      const cleanTitle = title.trim();
      if (cleanTitle.length < 30) {
        newErrors.title = `Tiêu đề tối thiểu 30 ký tự (Hiện tại: ${cleanTitle.length} ký tự).`;
      } else if (cleanTitle.length > 99) {
        newErrors.title = `Tiêu đề tối đa 99 ký tự (Hiện tại: ${cleanTitle.length} ký tự).`;
      }

      const cleanDesc = description.trim();
      if (cleanDesc.length < 30) {
        newErrors.description = `Mô tả tối thiểu 30 ký tự (Hiện tại: ${cleanDesc.length} ký tự).`;
      } else if (cleanDesc.length > 3000) {
        newErrors.description = `Mô tả tối đa 3000 ký tự (Hiện tại: ${cleanDesc.length} ký tự).`;
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setExpanded((prev) => {
        const nextExpanded = { ...prev };
        if (newErrors.demand) nextExpanded.demand = true;
        if (newErrors.address) nextExpanded.address = true;
        if (newErrors.area || newErrors.price) nextExpanded.main = true;
        if (newErrors.contactName || newErrors.contactPhone) nextExpanded.contact = true;
        if (newErrors.title || newErrors.description) nextExpanded.content = true;
        return nextExpanded;
      });

      toast.error("Vui lòng kiểm tra và sửa các lỗi thông tin đăng tin.");
      return;
    }

    setCurrentStep(2);
  };

  return (
    <main className="flex-1 w-[700px] max-w-full mx-auto px-4 py-8 pb-32">
      <DemandSection />
      <AddressSection />

      {isAddressConfirmed && (
        <>
          <MainInfoSection />
          <OtherInfoSection />
          <ContactSection />
          <ContentSection />
        </>
      )}

      <AddressModal />

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10 flex justify-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="w-[700px] max-w-full flex justify-end">
          <button
            type="button"
            onClick={handleContinue}
            className="bg-primary hover:bg-[#c42c23] text-white px-8 py-2.5 rounded-full font-bold text-[14px] transition-colors shadow-sm"
          >
            Tiếp tục
          </button>
        </div>
      </footer>
    </main>
  );
}
export default Step1;
