"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { MembershipBanner } from "./_components/organisms/MembershipBanner";
import { MembershipTabs } from "./_components/molecules/MembershipTabs";
import { MembershipCard } from "./_components/organisms/MembershipCard";
import { PurchaseModal } from "./_components/organisms/PurchaseModal";
import { FAQSection } from "./_components/organisms/FAQSection";

interface PricingData {
  boostBasePrice: number;
  vipSilverMonthlyPrice: number;
  vipGoldMonthlyPrice: number;
  vipDiamondMonthlyPrice: number;
  boostVipPrice: number;
  enabled: boolean;
}

export default function MembershipPage() {
  const [loading, setLoading] = useState(true);
  const [pricing, setPricing] = useState<PricingData | null>(null);
  const [activeTab, setActiveTab] = useState("hoi-vien");
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<{
    name: string;
    price: number;
    originalPrice: number;
  } | null>(null);

  useEffect(() => {
    let ignore = false;
    async function fetchPricing() {
      try {
        const data = await api.get<PricingData>("/pricing");
        if (!ignore) {
          setPricing(data);
        }
      } catch (error) {
        if (!ignore) {
          console.error("Failed to load pricing", error);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchPricing();
    return () => {
      ignore = true;
    };
  }, []);

  const handleBuy = (name: string, price: number, originalPrice: number) => {
    setSelectedPackage({ name, price, originalPrice });
    setModalOpen(true);
  };

  const handleConfirmPurchase = (duration: number, total: number) => {
    toast.error("Tính năng thanh toán mua gói Hội viên đang được phát triển (Cần API Backend).");
    setModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  // Fallback prices in case API fails
  const silverPrice = pricing?.vipSilverMonthlyPrice || 467000;
  const goldPrice = pricing?.vipGoldMonthlyPrice || 1267000;
  const diamondPrice = pricing?.vipDiamondMonthlyPrice || 2200000;

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 pb-12">
      <div className="bg-white pt-6 px-6 lg:px-8 border-b border-gray-200">
        <MembershipBanner />
        
        <div className="mt-8">
          <MembershipTabs 
            tabs={[
              { id: "hoi-vien", label: "Gói Hội viên" },
              { id: "voucher-vip", label: "Gói voucher Tin VIP", badge: "Mới" },
              { id: "voucher-day-tin", label: "Gói voucher Đẩy tin" },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>
      </div>
        
      <div className="max-w-[1200px] mx-auto px-6 mt-8">
        {activeTab === "hoi-vien" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <MembershipCard
              name="Hội viên Cơ bản"
              description="Phù hợp với môi giới mới hoặc giỏ hàng nhỏ"
              pricePerMonth={silverPrice}
              originalPricePerMonth={Math.round(silverPrice / 0.69)} // ~31% off
              savingsPerMonth={Math.round(silverPrice / 0.69) - silverPrice}
              icon="⛺"
              vouchers={[
                "<b>15</b> voucher giảm <b>35.000 đ</b> mỗi lần đăng Tin Thường",
                "<b>15</b> voucher giảm <b>10.000 đ</b> mỗi lần đẩy Tin Thường"
              ]}
              features={["Bản quyền ảnh"]}
              onBuy={() => handleBuy("Hội viên Cơ bản", silverPrice, Math.round(silverPrice / 0.69))}
            />
            
            <MembershipCard
              name="Hội viên Tiêu chuẩn"
              description="Phù hợp với môi giới chuyên nghiệp có giỏ hàng từ 10 BĐS"
              pricePerMonth={goldPrice}
              originalPricePerMonth={Math.round(goldPrice / 0.67)} // ~33% off
              savingsPerMonth={Math.round(goldPrice / 0.67) - goldPrice}
              isPopular={true}
              icon="🏠"
              vouchers={[
                "<b>30</b> voucher giảm <b>35.000 đ</b> mỗi lần đăng Tin Thường",
                "<b>30</b> voucher giảm <b>10.000 đ</b> mỗi lần đẩy Tin Thường",
                "<b>1</b> voucher giảm <b>400.000 đ</b> mỗi lần đăng Tin VIP"
              ]}
              features={["Bản quyền ảnh", "Hẹn giờ đăng tin", "Báo cáo hiệu suất"]}
              onBuy={() => handleBuy("Hội viên Tiêu chuẩn", goldPrice, Math.round(goldPrice / 0.67))}
            />
            
            <MembershipCard
              name="Hội viên Cao cấp"
              description="Phù hợp với môi giới có giỏ hàng và ngân sách quảng cáo lớn"
              pricePerMonth={diamondPrice}
              originalPricePerMonth={Math.round(diamondPrice / 0.61)} // ~39% off
              savingsPerMonth={Math.round(diamondPrice / 0.61) - diamondPrice}
              icon="🏢"
              vouchers={[
                "<b>50</b> voucher giảm <b>35.000 đ</b> mỗi lần đăng Tin Thường",
                "<b>50</b> voucher giảm <b>10.000 đ</b> mỗi lần đẩy Tin Thường",
                "<b>3</b> voucher giảm <b>400.000 đ</b> mỗi lần đăng Tin VIP"
              ]}
              features={["Bản quyền ảnh", "Hẹn giờ đăng tin", "Báo cáo hiệu suất", "Báo cáo thị trường"]}
              onBuy={() => handleBuy("Hội viên Cao cấp", diamondPrice, Math.round(diamondPrice / 0.61))}
            />
          </div>
        )}
        
        {activeTab !== "hoi-vien" && (
          <div className="bg-white p-12 rounded-xl border border-gray-200 text-center text-gray-500 shadow-sm mt-6">
            Nội dung đang được cập nhật...
          </div>
        )}
        
        <div className="mt-8 flex gap-6">
          <div className="flex-1">
            <FAQSection />
          </div>
          <div className="hidden xl:block w-[320px] shrink-0">
            <div className="bg-[#fff0f0] rounded-xl p-8 text-center border border-red-100 h-full flex flex-col items-center">
              <p className="text-[#e03c31] font-bold text-[13px] mb-4">Hotline 1900 1881</p>
              <h3 className="text-xl font-extrabold text-gray-900 mb-6 leading-snug">Bạn cần thêm thông tin<br/>về các gói?</h3>
              <button className="bg-white text-[#e03c31] font-bold border border-[#e03c31] rounded-lg px-6 py-2.5 text-[13px] hover:bg-red-50 transition-colors shadow-sm">
                Tìm hiểu thêm
              </button>
              <div className="mt-auto pt-8 text-8xl flex">
                <span className="translate-x-4">👩‍💼</span>
                <span className="-translate-x-4">👨‍💼</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {selectedPackage && (
        <PurchaseModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          packageName={selectedPackage.name}
          pricePerMonth={selectedPackage.price}
          originalPricePerMonth={selectedPackage.originalPrice}
          onConfirm={handleConfirmPurchase}
        />
      )}
    </div>
  );
}
