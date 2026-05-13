import React from "react";
import Link from "next/link";
import Image from "next/image";

const propertyTypes = [
  { name: "Bán đất nền dự án", count: 2160 },
  { name: "Bán nhà riêng", count: 1572 },
  { name: "Bán trang trại, khu nghỉ dưỡng", count: 88 },
  { name: "Bán kho, nhà xưởng", count: 76 },
  { name: "Bán loại bất động sản khác", count: 105 },
  { name: "Bán nhà mặt phố", count: 1346 },
  { name: "Bán đất", count: 1939 },
  { name: "Bán căn hộ chung cư", count: 2907 },
  { name: "Bán nhà biệt thự, liền kề", count: 1101 },
  { name: "Bán condotel", count: 10 },
  { name: "Bán shophouse, nhà phố thương mại", count: 57 }
];

const rentTypes = [
  { name: "Cho thuê căn hộ chung cư", count: 528 },
  { name: "Cho thuê văn phòng", count: 189 },
  { name: "Cho thuê nhà mặt phố", count: 216 },
  { name: "Cho thuê nhà riêng", count: 217 },
  { name: "Cho thuê kho, nhà xưởng, đất", count: 83 }
];

export const DirectorySidebar = () => {
  return (
    <div className="w-full flex gap-4 flex-col">
      
      {/* Newsletter Signup */}
      <div className="bg-white border border-[#c42c23] rounded p-4 relative shadow-sm">
         <div className="flex items-center gap-2 mb-3 text-sm font-medium text-[#c42c23]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            Nhận bản tin từ Batdongsan.com.vn
         </div>
         <div className="flex gap-2">
            <input type="email" placeholder="Nhập email" className="w-full border border-gray-300 rounded px-2 text-sm focus:outline-none focus:border-[#c42c23]" />
            <button className="bg-[#c42c23] hover:bg-[#a6241c] text-white text-sm font-bold px-3 py-1.5 rounded transition-colors whitespace-nowrap">Đăng ký</button>
         </div>
      </div>

      {/* Accordion Categories */}
      <div className="border border-gray-200 rounded overflow-hidden shadow-sm bg-white">
          <div className="bg-[#4a4a4a] text-white font-bold text-sm uppercase px-4 py-2.5 tracking-wide">
             Theo loại BĐS
          </div>

          <div className="p-4 bg-gray-50/50">
             <h4 className="font-bold text-[#1c1f22] text-sm mb-3">Nhà đất bán (6081)</h4>
             <ul className="space-y-2.5 mb-6">
                {propertyTypes.map((type, idx) => (
                   <li key={idx} className="flex items-start gap-1.5 text-xs text-[#2c2c2c] hover:text-primary transition-colors cursor-pointer leading-relaxed">
                      <span className="w-1 h-1 rounded-full bg-[#c42c23] flex-shrink-0 mt-1.5"></span>
                      <span>{type.name} ({type.count})</span>
                   </li>
                ))}
             </ul>

             <h4 className="font-bold text-[#1c1f22] text-sm mb-3 pt-4 border-t border-gray-200">Nhà đất cho thuê (1030)</h4>
             <ul className="space-y-2.5">
                {rentTypes.map((type, idx) => (
                   <li key={idx} className="flex items-start gap-1.5 text-xs text-[#2c2c2c] hover:text-primary transition-colors cursor-pointer leading-relaxed">
                      <span className="w-1 h-1 rounded-full bg-[#c42c23] flex-shrink-0 mt-1.5"></span>
                      <span>{type.name} ({type.count})</span>
                   </li>
                ))}
             </ul>
          </div>
      </div>

      {/* Premium Agents Widget */}
      <div className="border border-gray-200 rounded overflow-hidden shadow-sm bg-white mt-2">
          <div className="bg-[#4a4a4a] text-white font-bold text-sm uppercase px-4 py-2.5 tracking-wide">
             Nhà môi giới tiêu biểu
          </div>
          <div className="p-4 flex flex-col gap-4">
             <Link href="#" className="flex gap-3 items-center group">
                 <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center p-1 border border-gray-200 overflow-hidden relative">
                    <Image src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200" alt="Agent" fill className="object-cover" />
                 </div>
                 <span className="text-xs font-bold text-[#1c1f22] leading-snug group-hover:text-primary transition-colors">
                     CÔNG TY CỔ PHẦN BẤT ĐỘNG SẢN GIGAREAL
                 </span>
             </Link>
             <Link href="#" className="flex gap-3 items-center group pt-3 border-t border-gray-100">
                 <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center p-1 border border-gray-200 overflow-hidden relative">
                    <Image src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" alt="Agent" fill className="object-cover" />
                 </div>
                 <span className="text-xs font-bold text-[#1c1f22] leading-snug group-hover:text-primary transition-colors">
                     KHANG ĐIỀN NAM REAL ESTATE
                 </span>
             </Link>
          </div>
      </div>

    </div>
  );
};
