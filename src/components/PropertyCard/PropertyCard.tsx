import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "@/components/FavoriteButton/FavoriteButton";

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
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
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
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{property.location}</span>
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between text-xs text-gray-400">
          <span>{property.postedTime}</span>
        </div>
      </div>
    </Link>
  );
};
