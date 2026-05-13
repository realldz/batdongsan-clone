"use client";

import { formatArea, formatCurrency, formatLocation, unwrapArray } from "@/lib/api-adapters";
import { compareProperties, type Property } from "@/services/properties";
import { BarChart3, X } from "lucide-react";
import { useState } from "react";

interface PropertyCompareProps {
  properties: { id: string; title: string }[];
}

export function PropertyCompare({ properties }: PropertyCompareProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [compared, setCompared] = useState<Property[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const toggleSelected = (id: string) => {
    setMessage("");
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 3) return current;
      return [...current, id];
    });
  };

  const handleCompare = async () => {
    if (selectedIds.length < 2) {
      setMessage("Chọn ít nhất 2 tin để so sánh.");
      return;
    }

    try {
      const response = await compareProperties(selectedIds);
      const items = unwrapArray<Property>(response);
      setCompared(items);
      setIsOpen(true);
    } catch {
      setMessage("Chưa thể tải dữ liệu so sánh.");
    }
  };

  if (properties.length < 2) return null;

  return (
    <>
      <section className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 font-bold text-[#2c2c2c]"><BarChart3 className="h-4 w-4 text-[#e03c31]" /> So sánh tin</div>
            <p className="mt-1 text-xs font-medium text-gray-500">Chọn 2-3 tin từ danh sách hiện tại</p>
          </div>
          <button onClick={handleCompare} className="rounded-full bg-gray-900 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-black">
            So sánh ({selectedIds.length})
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {properties.slice(0, 6).map((property) => {
            const isSelected = selectedIds.includes(property.id);
            return (
              <button key={property.id} onClick={() => toggleSelected(property.id)} className={`max-w-full rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${isSelected ? "border-[#e03c31] bg-red-50 text-[#e03c31]" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                {property.title.slice(0, 42)}{property.title.length > 42 ? "..." : ""}
              </button>
            );
          })}
        </div>
        {message && <div className="mt-3 text-xs font-bold text-[#e03c31]">{message}</div>}
      </section>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">So sánh bất động sản</h2>
                {/* <p className="mt-1 text-xs font-medium text-gray-500">{compared.length} tin từ API compare</p> */}
              </div>
              <button onClick={() => setIsOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="overflow-x-auto p-5">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Tiêu đề</th>
                    <th className="px-4 py-3">Giá</th>
                    <th className="px-4 py-3">Diện tích</th>
                    <th className="px-4 py-3">Khu vực</th>
                    <th className="px-4 py-3">Hướng</th>
                    <th className="px-4 py-3">Pháp lý</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {compared.map((property) => (
                    <tr key={property.id}>
                      <td className="px-4 py-3 font-bold text-gray-900">{property.title}</td>
                      <td className="px-4 py-3 font-bold text-[#e03c31]">{formatCurrency(property.price, property.type)}</td>
                      <td className="px-4 py-3">{formatArea(property.area)}</td>
                      <td className="px-4 py-3">{formatLocation(property)}</td>
                      <td className="px-4 py-3">{property.direction ?? "--"}</td>
                      <td className="px-4 py-3">{property.legalInfo ?? "--"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
