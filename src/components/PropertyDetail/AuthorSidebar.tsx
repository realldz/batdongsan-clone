"use client";

import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/lib/auth-store";
import { createLead } from "@/services/leads";
import { useWalletBalance } from "@/lib/use-wallet-balance";
import { LoginModal } from "@/components/LoginModal/LoginModal";
import type { PropertyDetailView } from "@/lib/api-adapters";

function sanitizeZaloPhone(phone: string): string {
  return phone.replace(/[\s*]/g, "");
}

export const AuthorSidebar = ({
  owner,
  propertyId,
  hostId,
}: {
  owner: PropertyDetailView["owner"];
  propertyId: string;
  hostId?: string;
}) => {
  const { isAuthenticated, user } = useAuth();
  const [showingPhone, setShowingPhone] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const wallet = useWalletBalance();
  const isHost = isAuthenticated && hostId && user?.id === hostId;

  const getStoredUser = () => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) return JSON.parse(raw) as { phone?: string | null; email?: string | null };
    } catch { /* ignore parse errors */ }
    return null;
  };

  const submitLead = async (userName: string, userPhone: string) => {
    setLoading(true);
    try {
      const stored = getStoredUser();
      await createLead({
        name: userName,
        email: stored?.email ?? "",
        phone: stored?.phone ?? userPhone ?? "",
        propertyId,
        source: "property_detail",
        message: "",
      });
    } catch {
      // still show phone even if lead creation fails
    } finally {
      setShowingPhone(true);
      setLoading(false);
    }
  };

  const handleShowPhone = async () => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }
    await submitLead(user?.fullName ?? "", user?.phone ?? "");
  };

  const handleLoginSuccess = (name: string, phone: string) => {
    setShowLogin(false);
    submitLead(name, phone);
  };

  const zaloPhone = sanitizeZaloPhone(owner.phone);

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden p-4 mb-4">
      <div className="flex items-center gap-3 mb-5">
        <div className="relative w-14 h-14 rounded-full overflow-hidden border border-gray-200">
          <Image src={owner.avatar} alt={owner.name} fill className="object-cover" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#2c2c2c]">{owner.name}</h3>
          <p className="text-xs text-gray-500 cursor-pointer hover:underline mt-0.5">Xem thêm 2 tin khác</p>
        </div>
      </div>

      <div className="space-y-2">
        <a
          href={`https://zalo.me/${zaloPhone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 text-sm font-bold text-[#2c2c2c] hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" />
            <path d="M8 12.5V11H12.5C12.7761 11 13 10.7761 13 10.5V9.5C13 9.22386 12.7761 9 12.5 9H8V7.5L5.5 10L8 12.5Z" fill="white" />
            <path d="M16 11.5V13H11.5C11.2239 13 11 13.2239 11 13.5V14.5C11 14.7761 11.2239 15 11.5 15H16V16.5L18.5 14L16 11.5Z" fill="white" />
          </svg>
          Chat qua Zalo
        </a>
        <button
          onClick={handleShowPhone}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#009ba1] hover:bg-[#008187] disabled:opacity-70 rounded-lg py-2.5 text-sm font-bold text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          {showingPhone ? owner.phone : loading ? "Đang xử lý..." : "Hiện số"}
        </button>
      </div>

      {showLogin ? (
        <LoginModal onSuccess={handleLoginSuccess} onClose={() => setShowLogin(false)} />
      ) : null}

      {/* {isHost && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs font-medium text-gray-500 mb-1">Số dư của bạn</div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold text-[#e03c31]">{wallet.total}</span>
            <span className="text-xs text-gray-400">src: {wallet.source}</span>
          </div>
        </div>
      )} */}
    </div>
  );
};
