import Image from "next/image";
import Link from "next/link";
import React from "react";

export interface EnterpriseData {
  id: string;
  name: string;
  logo: string;
}

export const EnterpriseCard = ({ data }: { data: EnterpriseData }) => {
  return (
    <Link href="#" className="bg-white border text-center border-gray-100 rounded shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col items-center justify-center gap-4 group">
      
      {/* Logo */}
      <div className="w-[120px] h-[120px] rounded-full border border-gray-100 flex items-center justify-center overflow-hidden bg-white p-2 shadow-sm">
        <div className="relative w-full h-full">
            <Image src={data.logo} alt={data.name} fill className="object-cover rounded-full" />
        </div>
      </div>

      {/* Name */}
      <h3 className="text-sm font-bold text-[#1c1f22] group-hover:text-primary transition-colors leading-snug line-clamp-2">
        {data.name}
      </h3>

    </Link>
  );
};
