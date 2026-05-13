"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-store";
import { createLead } from "@/services/leads";
import { LoginModal } from "@/components/LoginModal/LoginModal";
import { FavoriteButton } from "@/components/FavoriteButton/FavoriteButton";

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

export const ListingCard = ({ data }: { data: ListingData }) => {
  const { isAuthenticated, user } = useAuth();
  const [showingPhone, setShowingPhone] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShowPhone = async () => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }

    setLoading(true);
    try {
      await createLead({
        name: user!.fullName,
        phone: user!.phone || "",
        propertyId: data.id,
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

  const handleLoginSuccess = async (name: string, phone: string) => {
    setShowLogin(false);
    setLoading(true);
    try {
      await createLead({
        name,
        phone: phone || "",
        propertyId: data.id,
        source: "property_detail",
        message: "",
      });
    } catch {
      // still show phone
    } finally {
      setShowingPhone(true);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border-t sm:border border-gray-100 sm:rounded-lg mb-4 hover:shadow-md transition-shadow relative group">
      <Link href={`/properties/${data.id}`} className="block relative">
        <div className="relative w-full h-[250px] sm:h-[300px] flex gap-1 overflow-hidden sm:rounded-t-lg bg-gray-200">
          <div className="relative flex-[2] h-full overflow-hidden">
            <Image
              src={data.images[0]}
              alt={data.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="relative flex-1 bg-gray-300">
              <Image
                src={data.images[1]}
                alt={`${data.title} 2`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="25vw"
              />
            </div>
            <div className="relative flex-1 bg-gray-300">
              <Image
                src={data.images[2]}
                alt={`${data.title} 3`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="25vw"
              />
              <div className="absolute inset-0 bg-black/20 flex items-end justify-end p-2 cursor-pointer">
                <span className="text-white text-xs bg-black/50 px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {data.images.length + 8}
                </span>
              </div>
            </div>
          </div>

          <div className="absolute top-2 left-2 bg-[#e03c31] text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">
            {data.vipTag}
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-base text-[#e03c31] font-bold uppercase hover:text-[#c42c23] transition-colors line-clamp-2 mb-2 leading-snug">
            {data.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-sm text-[#2c2c2c] mb-2 font-medium">
            <span className="text-[#e03c31] font-bold">{data.price}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>{data.area}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>{data.pricePerSqm}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> {data.beds}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16h16M4 16l4-8m-4 8l4 8m12-8l-4-8m4 8l-4 8" /></svg> {data.direction}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span className="text-gray-500 font-normal">{data.location}</span>
          </div>

          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">
            {data.description}
          </p>
        </div>
      </Link>

      <div className="px-4 pb-4 pt-3 border-t border-gray-100/50 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200">
              <Image src={data.authorAvatar} alt={data.authorName} fill className="object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#2c2c2c]">{data.authorName}</span>
              <span className="text-[10px] text-gray-400">{data.postedTime}</span>
            </div>
          </div>
          <FavoriteButton propertyId={data.id} />
        </div>
        <button
          onClick={handleShowPhone}
          disabled={loading}
          className="w-full flex items-center justify-center gap-1.5 bg-[#009ba1] hover:bg-[#008187] text-white text-xs font-bold py-2 rounded transition-colors disabled:opacity-70"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          {showingPhone ? data.phone : loading ? "Đang xử lý..." : "Hiện số"}
        </button>
      </div>

      {showLogin ? (
        <LoginModal onSuccess={handleLoginSuccess} onClose={() => setShowLogin(false)} />
      ) : null}
    </div>
  );
};
