import React from "react";
import { PropertyCard, PropertyData } from "../PropertyCard/PropertyCard";

export const PropertyGrid = ({ title, properties }: { title: string, properties: PropertyData[] }) => {
  return (
    <section className="max-w-[1240px] mx-auto px-4 lg:px-0 py-8">
      <h2 className="text-2xl font-bold text-[#2c2c2c] mb-6">{title}</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {properties.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
};
