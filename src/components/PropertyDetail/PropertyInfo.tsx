import React from "react";
import Image from "next/image";
import { FavoriteButton } from "@/components/FavoriteButton/FavoriteButton";
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
          <div className="flex justify-between items-center py-2 border-b border-gray-100/50">
            <span className="text-gray-500 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              Hướng nhà
            </span>
            <span className="font-medium">{property.direction}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100/50">
            <span className="text-gray-500 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              Mặt tiền
            </span>
            <span className="font-medium">5 m</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100/50">
            <span className="text-gray-500 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
              Đường vào
            </span>
            <span className="font-medium">6 m</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100/50">
            <span className="text-gray-500 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
              Pháp lý
            </span>
            <span className="font-medium">{property.legalInfo}</span>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="mb-8 border-t border-gray-100 pt-8 mt-8">
         <h2 className="text-lg font-bold mb-4">Xem trên bản đồ</h2>
         <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center relative shadow-inner">
             <Image 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000"
                alt="Bản đồ vị trí"
                fill
                className="object-cover opacity-70"
             />
             <div className="absolute inset-0 bg-blue-100/40 backdrop-blur-[2px]"></div>
             <div className="z-10 bg-white p-3 rounded-full shadow-lg text-primary pointer-events-none">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                 </svg>
             </div>
         </div>
         <div className="flex justify-between text-xs text-gray-500 mt-4 px-2 tracking-wide border-b border-gray-100 pb-8">
             <div className="flex flex-col"><span className="text-gray-400 mb-1">Ngày đăng</span><span className="font-medium text-[#2c2c2c]">{property.postedAt}</span></div>
             <div className="flex flex-col"><span className="text-gray-400 mb-1">Ngày hết hạn</span><span className="font-medium text-[#2c2c2c]">{property.expiresAt}</span></div>
             <div className="flex flex-col"><span className="text-gray-400 mb-1">Loại tin</span><span className="font-medium text-[#2c2c2c]">{property.listingType}</span></div>
             <div className="flex flex-col"><span className="text-gray-400 mb-1">Mã tin</span><span className="font-medium text-[#2c2c2c]">{property.code}</span></div>
         </div>
      </div>
    </div>
  );
};
