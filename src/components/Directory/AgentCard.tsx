import Image from "next/image";
import Link from "next/link";
import React from "react";
import { type AgentData } from "@/types";
import { Button, Icon } from "@/components/atoms";

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
          <Icon name="MapPin" size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2 leading-relaxed">{data.address}</span>
        </div>

        <div className="text-sm text-gray-600 flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5 font-medium">
            <Icon name="Phone" size={16} className="text-gray-400" />
            {data.phone}
          </div>
          {data.phone2 && (
            <div className="flex items-center gap-1.5 font-medium">
              <Icon name="Phone" size={16} className="text-gray-400" />
              {data.phone2}
            </div>
          )}
        </div>

        <div className="mt-auto">
          <Button variant="outline" size="sm" className="rounded bg-gray-50 hover:bg-gray-100 transition-colors">
            Gửi Email
          </Button>
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
