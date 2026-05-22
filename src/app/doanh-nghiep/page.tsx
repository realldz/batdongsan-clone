import { EnterpriseSearchBox } from "@/components/Directory/EnterpriseSearchBox";
import { EnterpriseCard, EnterpriseData } from "@/components/Directory/EnterpriseCard";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Pagination } from "@/components/molecules";
import { PublicPageLayout, TwoColumnLayout } from "@/components/templates";

const mockEnterprises: EnterpriseData[] = [
  { id: "1", name: "CÔNG TY CỔ PHẦN VINHOMES", logo: "https://images.unsplash.com/photo-1560179707-11c0f496199a?auto=format&fit=crop&q=80&w=200" },
  { id: "2", name: "TẬP ĐOÀN NOVALAND", logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=200" },
  { id: "3", name: "TẬP ĐOÀN HƯNG THỊNH", logo: "https://images.unsplash.com/photo-1550136513-548af4445338?auto=format&fit=crop&q=80&w=200" },
  { id: "4", name: "CÔNG TY CỔ PHẦN TẬP ĐOÀN ĐẤT XANH", logo: "https://images.unsplash.com/photo-1549517045-bc93de0ce73a?auto=format&fit=crop&q=80&w=200" },
  { id: "5", name: "CÔNG TY CỔ PHẦN ĐẦU TƯ NAM LONG", logo: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=200" },
  { id: "6", name: "MASTERISE HOMES", logo: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=200" },
  { id: "7", name: "CÔNG TY CỔ PHẦN TẬP ĐOÀN ECOPARK", logo: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=200" },
  { id: "8", name: "KEPPEL LAND VIETNAM", logo: "https://images.unsplash.com/photo-1600607687931-cecebd802404?auto=format&fit=crop&q=80&w=200" },
];

export default function EnterpriseDirectoryPage() {
  return (
    <PublicPageLayout className="bg-[#f1f5f9]">
      <EnterpriseSearchBox />

      <div className="max-w-[1240px] mx-auto px-4 lg:px-0 py-6">
        {/* Title */}
        <h1 className="text-xl md:text-2xl font-bold text-[#1c1f22] mb-6 tracking-tight">
          Danh bạ doanh nghiệp
        </h1>

        <TwoColumnLayout
          main={
            <div className="bg-white p-6 rounded shadow-sm border border-gray-100 mb-6">
              <h2 className="text-lg font-bold text-[#2c2c2c] mb-6 uppercase border-b border-gray-100 pb-3">Chủ đầu tư (3.245)</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {mockEnterprises.map((enterprise) => (
                  <EnterpriseCard key={enterprise.id} data={enterprise} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <Pagination page={1} totalPages={3} />
              </div>
            </div>
          }
          sidebar={
            <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm sticky top-20">
              <h3 className="text-base font-bold text-[#1c1f22] mb-5 uppercase tracking-tight border-b border-gray-100 pb-3">
                Dự án đang thi công
              </h3>
              <div className="flex flex-col gap-5">
                {[
                  { name: "Vinhomes Grand Park", update: "Cập nhật tiến độ tháng 10/2026", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400" },
                  { name: "The Global City", update: "Cập nhật tiến độ Quý 4/2026", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400" },
                  { name: "Akari City Giai đoạn 2", update: "Cập nhật tiến độ cất nóc", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400" },
                ].map((project, idx) => (
                  <Link key={idx} href="#" className="flex gap-3 group">
                    <div className="w-[90px] h-[64px] bg-gray-200 rounded overflow-hidden relative flex-shrink-0">
                      <Image src={project.img} alt={project.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="text-sm font-bold text-[#1c1f22] group-hover:text-primary transition-colors leading-snug line-clamp-2 mb-1">
                        {project.name}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {project.update}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          }
        />
      </div>
    </PublicPageLayout>
  );
}
