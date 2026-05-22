import { AgentSearchBox } from "@/components/Directory/AgentSearchBox";
import { AgentCard, AgentData } from "@/components/Directory/AgentCard";
import { DirectorySidebar } from "@/components/Directory/DirectorySidebar";
import React from "react";
import { Pagination } from "@/components/molecules";
import { PublicPageLayout, TwoColumnLayout } from "@/components/templates";

const mockAgents: AgentData[] = [
  {
    id: "1",
    name: "CÔNG TY CỔ PHẦN BẤT ĐỘNG SẢN SEHOUSE",
    logo: "https://images.unsplash.com/photo-1560179707-11c0f496199a?auto=format&fit=crop&q=80&w=200",
    address: "Tòa Báo CAND, Số 23 Nghiêm Xuân Yêm, Đại Kim, Hoàng Mai, Hà Nội, Việt Nam",
    phone: "0585689689",
    phone2: "0585689689",
    areas: [
      "Bán căn hộ chung cư ở Thanh Xuân, Hà Nội",
      "Bán căn hộ chung cư ở Hoàng Mai, Hà Nội",
      "Bán căn hộ chung cư ở Thanh Trì, Hà Nội",
      "Bán căn hộ chung cư ở Hà Đông, Hà Nội"
    ]
  },
  {
    id: "2",
    name: "CÔNG TY CỔ PHẦN ĐẦU TƯ VÀ PHÁT TRIỂN BẤT ĐỘNG SẢN VICTORY REAL",
    logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=200",
    address: "Tòa nhà Mekong Tower, số 235-241 Cộng Hòa, 13, Tân Bình, Hồ Chí Minh, Việt Nam",
    phone: "0989199898",
    areas: [
      "Bán nhà mặt phố ở Đà Lạt, Lâm Đồng",
      "Bán nhà mặt phố ở Quận 10, Hồ Chí Minh",
      "Bán nhà mặt phố ở Tân Phú, Hồ Chí Minh",
      "Bán đất ở Đà Lạt, Lâm Đồng",
      "Bán đất ở Phú Nhuận, Hồ Chí Minh"
    ]
  },
  {
    id: "3",
    name: "CÔNG TY TNHH TƯ VẤN BDS KHANG ĐIỀN NAM",
    logo: "https://images.unsplash.com/photo-1550136513-548af4445338?auto=format&fit=crop&q=80&w=200",
    address: "56 đường Số 12, KDC Cityland, 10, Gò Vấp, Hồ Chí Minh, Việt Nam",
    phone: "0901777703",
    areas: [
      "Bán nhà riêng ở Quận 1, Hồ Chí Minh",
      "Bán nhà riêng ở Quận 2, Hồ Chí Minh",
      "Bán nhà riêng ở Quận 3, Hồ Chí Minh",
      "Bán nhà riêng ở Quận 4, Hồ Chí Minh"
    ]
  }
];

export default function AgentDirectoryPage() {
  return (
    <PublicPageLayout className="bg-[#f1f5f9]">
      <AgentSearchBox />

      <div className="max-w-[1240px] mx-auto px-4 lg:px-0 py-6">
        {/* Title */}
        <h1 className="text-xl md:text-2xl font-bold text-[#1c1f22] mb-6 tracking-tight">
          Danh bạ nhà môi giới
        </h1>

        {/* Tabs */}
        <div className="flex items-center gap-0 mb-6 border-b border-[#c42c23]">
          <button className="px-6 py-2.5 bg-white border-t border-l border-r border-[#c42c23] border-b-0 text-[#1c1f22] font-bold text-sm rounded-t translate-y-[1px] cursor-pointer">
            Công ty môi giới
          </button>
          <button className="px-6 py-2.5 bg-transparent text-gray-600 hover:text-primary transition-colors text-sm rounded-t font-medium cursor-pointer">
            Cá nhân môi giới
          </button>
        </div>

        <TwoColumnLayout
          main={
            <>
              {mockAgents.map((agent) => (
                <AgentCard key={agent.id} data={agent} />
              ))}

              {/* Pagination */}
              <Pagination page={1} totalPages={3} />
            </>
          }
          sidebar={
            <DirectorySidebar />
          }
        />
      </div>
    </PublicPageLayout>
  );
}
