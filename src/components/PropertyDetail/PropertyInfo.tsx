"use client";

import React from "react";
import Image from "next/image";
import { FavoriteButton } from "@/components/FavoriteButton/FavoriteButton";
import { DraggableMap } from "@/components/Map";
import type { PropertyDetailView } from "@/lib/api-adapters";

export const PropertyInfo = ({ property }: { property: PropertyDetailView }) => {
  return (
    <div className="w-full text-[#2c2c2c] mt-6">
      <h1 className="text-xl lg:text-3xl font-bold leading-tight mb-2 uppercase text-[#2c2c2c] tracking-tight">
        {property.title}
      </h1>

      <p className="text-sm text-gray-500 mb-6 flex items-start gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {property.address}
      </p>

      {/* Pricing and Area Strip */}
      <div className="flex flex-wrap items-center justify-between border-t border-b border-gray-100 py-4 mb-8">
        <div className="flex gap-10">
          <div>
            <div className="text-gray-500 text-xs mb-1">Mức giá</div>
            <div className="font-bold text-lg lg:text-xl">{property.price}</div>
            <div className="text-gray-400 text-xs text-center border-t border-dashed border-gray-300 mt-1 pt-1">~ {property.pricePerSqm}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs mb-1">Diện tích</div>
            <div className="font-bold text-lg lg:text-xl">{property.area}</div>
          </div>
          {/* Mock hidden elements for larger screens, maybe phòng ngủ */}
        </div>

        {/* Action Icons */}
        <div className="flex gap-4 text-gray-400 mt-4 md:mt-0">
          <button className="hover:text-[#2c2c2c] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg></button>
          <button className="hover:text-[#2c2c2c] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></button>
          <FavoriteButton propertyId={property.id} className="hover:text-primary transition-colors" iconClassName="h-6 w-6" activeClassName="text-[#e03c31]" stopPropagation={false} />
        </div>
      </div>

      {/* Description Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-3">Thông tin mô tả</h2>
        <div className="text-sm leading-relaxed text-[#2c2c2c] space-y-3">
          {property.description.split("\n").map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">Đặc điểm bất động sản</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm border-t border-gray-100 pt-4">
          <div className="flex justify-between items-center py-2 border-b border-gray-100/50">
            <span className="text-gray-500 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Mức giá
            </span>
            <span className="font-medium">{property.price}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100/50">
            <span className="text-gray-500 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Diện tích
            </span>
            <span className="font-medium">{property.area}</span>
          </div>
          {property.direction && (
            <div className="flex justify-between items-center py-2 border-b border-gray-100/50">
              <span className="text-gray-500 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                Hướng nhà
              </span>
              <span className="font-medium">{property.direction}</span>
            </div>
          )}
          {property.legalInfo && (
            <div className="flex justify-between items-center py-2 border-b border-gray-100/50">
              <span className="text-gray-500 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
                Pháp lý
              </span>
              <span className="font-medium">{property.legalInfo}</span>
            </div>
          )}
          {property.bedrooms !== undefined && property.bedrooms > 0 && (
            <div className="flex justify-between items-center py-2 border-b border-gray-100/50">
              <span className="text-gray-500 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                Số phòng ngủ
              </span>
              <span className="font-medium">{property.bedrooms} phòng</span>
            </div>
          )}
          {property.bathrooms !== undefined && property.bathrooms > 0 && (
            <div className="flex justify-between items-center py-2 border-b border-gray-100/50">
              <span className="text-gray-500 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                Số phòng tắm
              </span>
              <span className="font-medium">{property.bathrooms} phòng</span>
            </div>
          )}
          {property.interior && (
            <div className="flex justify-between items-center py-2 border-b border-gray-100/50">
              <span className="text-gray-500 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                Nội thất
              </span>
              <span className="font-medium">{property.interior}</span>
            </div>
          )}
          {property.balconyDirection && (
            <div className="flex justify-between items-center py-2 border-b border-gray-100/50">
              <span className="text-gray-500 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                Hướng ban công
              </span>
              <span className="font-medium">{property.balconyDirection}</span>
            </div>
          )}
          {property.rentDetails && (
            <>
              {property.rentDetails.moveInTime && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100/50">
                  <span className="text-gray-500 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Thời hạn bàn giao
                  </span>
                  <span className="font-medium">{property.rentDetails.moveInTime}</span>
                </div>
              )}
              {property.rentDetails.electricityPrice && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100/50">
                  <span className="text-gray-500 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Tiền điện
                  </span>
                  <span className="font-medium">{property.rentDetails.electricityPrice}</span>
                </div>
              )}
              {property.rentDetails.waterPrice && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100/50">
                  <span className="text-gray-500 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 15v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4m16-4V7a2 2 0 00-2-2H6a2 2 0 00-2 2v4m16 4H4" /></svg>
                    Tiền nước
                  </span>
                  <span className="font-medium">{property.rentDetails.waterPrice}</span>
                </div>
              )}
              {property.rentDetails.internetPrice && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100/50">
                  <span className="text-gray-500 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.05 9.879A3 3 0 119.88 5.05m0 0a8.001 8.001 0 11-9.88 9.879" /></svg>
                    Tiền Internet
                  </span>
                  <span className="font-medium">{property.rentDetails.internetPrice}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {property.amenities && (property.amenities.camera || property.amenities.baove || property.amenities.pccc) && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3">Tiện ích đi kèm</h2>
          <div className="flex flex-wrap gap-3">
            {property.amenities.camera && (
              <span className="bg-green-50 text-green-700 text-xs px-3 py-1.5 rounded-full font-medium border border-green-100 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                Camera an ninh
              </span>
            )}
            {property.amenities.baove && (
              <span className="bg-green-50 text-green-700 text-xs px-3 py-1.5 rounded-full font-medium border border-green-100 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                Bảo vệ 24/7
              </span>
            )}
            {property.amenities.pccc && (
              <span className="bg-green-50 text-green-700 text-xs px-3 py-1.5 rounded-full font-medium border border-green-100 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                Hệ thống PCCC
              </span>
            )}
          </div>
        </div>
      )}

      {/* Map Placeholder */}
      {property.coordinates && (
        <div className="mb-8 border-t border-gray-100 pt-8 mt-8">
          <h2 className="text-lg font-bold mb-4">Xem trên bản đồ</h2>
          <DraggableMap
            lat={property.coordinates.lat}
            lng={property.coordinates.lng}
            draggable={false}
            height="256px"
          />
        </div>
      )}

      <div className="flex justify-between text-xs text-gray-500 mt-4 px-2 tracking-wide border-b border-gray-100 pb-8 border-t border-gray-100 pt-8">
        <div className="flex flex-col"><span className="text-gray-400 mb-1">Ngày đăng</span><span className="font-medium text-[#2c2c2c]">{property.postedAt}</span></div>
        {property.expiresAt !== "--" && (
          <div className="flex flex-col"><span className="text-gray-400 mb-1">Ngày hết hạn</span><span className="font-medium text-[#2c2c2c]">{property.expiresAt}</span></div>
        )}
        <div className="flex flex-col"><span className="text-gray-400 mb-1">Loại tin</span><span className="font-medium text-[#2c2c2c]">{property.listingType}</span></div>
        <div className="flex flex-col"><span className="text-gray-400 mb-1">Mã tin</span><span className="font-medium text-[#2c2c2c]">{property.code}</span></div>
      </div>
    </div>
  );
};
