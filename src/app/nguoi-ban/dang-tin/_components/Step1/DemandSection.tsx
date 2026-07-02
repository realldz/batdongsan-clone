import React from "react";
import { ChevronUp, ChevronDown, Tag, Key } from "lucide-react";
import { useCreateListing } from "../CreateListingContext";

export function DemandSection() {
  const { demand, setDemand, expanded, toggleSection } = useCreateListing();

  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-6 shadow-sm overflow-hidden">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => toggleSection("demand")}
      >
        <h2 className="font-bold text-[14px]">
          Nhu cầu <span className="text-primary">*</span>
        </h2>
        {expanded.demand ? (
          <ChevronUp size={20} className="text-[#2c2c2c]" />
        ) : (
          <ChevronDown size={20} className="text-[#2c2c2c]" />
        )}
      </div>
      {expanded.demand ? (
        <div className="px-4 pb-6 pt-0 grid grid-cols-2 gap-4 border-t border-transparent">
          <div
            onClick={(e) => {
              e.stopPropagation();
              setDemand("sale");
            }}
            className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${
              demand === "sale"
                ? "border-[#2c2c2c] border-2 bg-white"
                : "border-gray-200 border hover:border-gray-400 bg-white"
            }`}
          >
            <Tag
              size={20}
              className={demand === "sale" ? "text-[#2c2c2c]" : "text-gray-500"}
            />
            <span className="font-bold text-[#2c2c2c]">Bán</span>
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setDemand("rent");
            }}
            className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${
              demand === "rent"
                ? "border-[#2c2c2c] border-2 bg-white"
                : "border-gray-200 border hover:border-gray-400 bg-white"
            }`}
          >
            <Key
              size={20}
              className={demand === "rent" ? "text-[#2c2c2c]" : "text-gray-500"}
            />
            <span className="font-bold text-[#2c2c2c]">Cho thuê</span>
          </div>
        </div>
      ) : (
        <div className="px-4 pb-4 pt-0 text-[14px] text-[#2c2c2c] font-medium">
          {demand === "sale" ? "Bán" : demand === "rent" ? "Cho thuê" : "Chưa chọn"}
        </div>
      )}
    </div>
  );
}
