import Image from "next/image";
import Link from "next/link";
import React from "react";

import { type AgentData } from "@/types";

export type { AgentData };

export const AgentCard = ({ data }: { data: AgentData }) => {
  return (
    <div className="bg-white border border-gray-100 rounded shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col md:flex-row gap-6 mb-4">
      
      {/* Logo */}
      <div className="flex-shrink-0 w-[140px] h-[140px] flex items-center justify-center border border-gray-100 rounded-full mx-auto md:mx-0 overflow-hidden relative">
        <Image src={data.logo} alt={data.name} fill className="object-cover p-2" />
      </div>

      {/* Info Middle */}
      <div className="flex-1 flex flex-col pt-1">
        <Link href="#" className="text-base font-bold text-[#1c1f22] hover:text-primary transition-colors uppercase leading-snug mb-3 line-clamp-2">
          {data.name}
        </Link>

        <div className="text-sm text-gray-600 flex items-start gap-1.5 mb-2">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
           <span className="line-clamp-2 leading-relaxed">{data.address}</span>
        </div>

        <div className="text-sm text-gray-600 flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                {data.phone}
            </div>
            {data.phone2 && (
               <div className="flex items-center gap-1.5 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  {data.phone2}
               </div>
            )}
        </div>

        <div className="mt-auto">
            <button className="border border-gray-300 text-sm text-[#1c1f22] font-medium px-4 py-1.5 rounded bg-gray-50 hover:bg-gray-100 transition-colors">
                Gửi Email
            </button>
        </div>
      </div>

      {/* Areas Right Column */}
      <div className="flex-1 md:border-l border-gray-100 md:pl-6 pt-4 md:pt-1">
         <h4 className="text-sm font-bold text-[#1c1f22] uppercase mb-3">Khu vực công ty môi giới</h4>
         <ul className="space-y-2">
            {data.areas.map((area, idx) => (
               <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed cursor-pointer hover:text-primary transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e03c31] flex-shrink-0 mt-1.5"></span>
                  {area}
               </li>
            ))}
         </ul>
      </div>

    </div>
  );
};
