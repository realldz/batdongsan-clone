import React from "react";
import { ChevronUp, ChevronDown, Tag, Key } from "lucide-react";
import { useCreateListing } from "../CreateListingContext";

export function DemandSection() {
  const { demand, setDemand, expanded, toggleSection, errors, setErrors } = useCreateListing();

  return (
    <div className={`bg-white rounded-lg border mb-6 shadow-sm overflow-hidden ${errors.demand ? "border-red-500" : "border-gray-200"}`}>
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
        <div className="px-4 pb-6 pt-0 border-t border-transparent">
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={(e) => {
                e.stopPropagation();
                setDemand("sale");
                setErrors((prev) => ({ ...prev, demand: "" }));
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
                setErrors((prev) => ({ ...prev, demand: "" }));
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
          {errors.demand && (
            <p className="text-red-500 text-[12px] mt-2 font-medium">{errors.demand}</p>
          )}
        </div>
      ) : (
        <div className="px-4 pb-4 pt-0 text-[14px] text-[#2c2c2c] font-medium flex justify-between items-center">
          <span>{demand === "sale" ? "Bán" : demand === "rent" ? "Cho thuê" : "Chưa chọn"}</span>
          {errors.demand && (
            <span className="text-red-500 text-[12px] font-medium">{errors.demand}</span>
          )}
        </div>
      )}
    </div>
  );
}
