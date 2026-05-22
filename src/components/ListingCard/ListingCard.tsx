"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-store";
import { createLead } from "@/services/leads";
import { LoginModal } from "@/components/LoginModal/LoginModal";
import { Avatar, Button, Icon } from "@/components/atoms";
import { FavoriteButton } from "@/components/molecules";
import { type ListingData } from "@/types";

export type { ListingData };

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
                  <Icon name="Camera" size={14} />
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
            <span className="flex items-center gap-1"><Icon name="Home" size={14} /> {data.beds}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span className="flex items-center gap-1"><Icon name="Compass" size={14} /> {data.direction}</span>
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
            <Avatar src={data.authorAvatar} name={data.authorName} size="sm" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#2c2c2c]">{data.authorName}</span>
              <span className="text-[10px] text-gray-400">{data.postedTime}</span>
            </div>
          </div>
          <FavoriteButton propertyId={data.id} />
        </div>
        <Button
          onClick={handleShowPhone}
          isLoading={loading}
          variant="secondary"
          size="sm"
          fullWidth
          leftIcon={<Icon name="Phone" size={14} />}
          className="font-bold text-xs rounded"
        >
          {showingPhone ? data.phone : "Hiện số"}
        </Button>
      </div>

      {showLogin ? (
        <LoginModal onSuccess={handleLoginSuccess} onClose={() => setShowLogin(false)} />
      ) : null}
    </div>
  );
};
