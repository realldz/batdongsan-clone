import React from "react";
import Image from "next/image";
import Link from "next/link";

const locations = [
  { id: 1, name: "TP. Hồ Chí Minh", province: "TP.HCM", count: "482.352", image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=2070" },
  { id: 2, name: "Hà Nội", province: "Hà Nội", count: "365.120", image: "https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?auto=format&fit=crop&q=80&w=2070" },
  { id: 3, name: "Đà Nẵng", province: "Đà Nẵng", count: "128.940", image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=2128" },
  { id: 4, name: "Bình Dương", province: "Bình Dương", count: "98.430", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=2070" },
  { id: 5, name: "Đồng Nai", province: "Đồng Nai", count: "85.200", image: "https://images.unsplash.com/photo-1580835239846-5bb9ce03c8c3?auto=format&fit=crop&q=80&w=2036" },
];

export const LocationGrid = () => {
  return (
    <section className="max-w-[1240px] mx-auto px-4 lg:px-0 py-8">
      <h2 className="text-2xl font-bold text-[#2c2c2c] mb-6">Khám phá bất động sản theo địa điểm</h2>
      
      <div className="flex flex-nowrap md:flex-wrap gap-4 overflow-x-auto pb-4 hide-scrollbar">
        {locations.map((loc, index) => (
          <Link
            href={`/nha-dat?province=${encodeURIComponent(loc.province)}&page=1`}
            key={loc.id}
            className={`group relative rounded-xl overflow-hidden flex-shrink-0 md:flex-shrink ${
              index < 2 ? 'w-[280px] md:w-[calc(50%-8px)] h-[240px]' : 'w-[220px] md:w-[calc(33.333%-11px)] h-[200px]'
            }`}
          >
            <Image 
              src={loc.image}
              alt={loc.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
            
            {/* Text Content */}
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="font-bold text-lg">{loc.name}</h3>
              <p className="text-sm font-medium opacity-90">{loc.count} tin đăng</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
