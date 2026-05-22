import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "@/components/molecules/FavoriteButton";
import { Icon } from "@/components/atoms/Icon";
import { type PropertyData } from "@/types";

export type { PropertyData };

export const PropertyCard = ({ property }: { property: PropertyData }) => {
  return (
    <Link href={`/properties/${property.id}`} className="group flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
        <Image 
          src={property.imageUrl} 
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {/* Heart Icon for saving */}
        <div className="absolute top-3 right-3">
          <FavoriteButton propertyId={property.id} className="p-1.5 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors" iconClassName="h-5 w-5" activeClassName="text-white bg-[#e03c31]" />
        </div>
        {/* Image count icon */}
        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center gap-1 backdrop-blur-sm">
          <Icon name="Camera" size={12} />
          5
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-[#2c2c2c] font-medium text-sm leading-snug line-clamp-2 md:text-base group-hover:text-primary transition-colors">
          {property.title}
        </h3>
        
        <div className="flex items-center text-primary font-bold mt-2 gap-3 text-base">
          <span>{property.price}</span>
          <span className="text-gray-300 font-normal text-xs">•</span>
          <span>{property.area}</span>
        </div>
        
        <div className="flex items-start text-gray-500 text-xs mt-2 gap-1 line-clamp-1">
          <Icon name="MapPin" size={14} className="flex-shrink-0" />
          <span className="truncate">{property.location}</span>
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between text-xs text-gray-400">
          <span>{property.postedTime}</span>
        </div>
      </div>
    </Link>
  );
};

