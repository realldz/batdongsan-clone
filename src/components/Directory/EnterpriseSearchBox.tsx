import React from "react";

export const EnterpriseSearchBox = () => {
  return (
    <div className="bg-gray-50 border-b border-gray-200 py-6">
      <div className="max-w-[1140px] xl:max-w-[1240px] mx-auto px-4 lg:px-0">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          
          {/* Top Row: Label and Search Input */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <span className="text-[#e03c31] font-bold text-sm tracking-wide uppercase whitespace-nowrap">
              Tìm kiếm doanh nghiệp
            </span>
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="Nhập từ khóa tìm kiếm (Tên doanh nghiệp)" 
                className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
               />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Bottom Row: Dropdowns and Button */}
          <div className="flex flex-wrap lg:flex-nowrap gap-3">
            <select className="flex-1 min-w-[200px] border border-gray-300 text-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary appearance-none bg-white">
              <option>Tất cả lĩnh vực hoạt động</option>
              <option>Chủ đầu tư</option>
              <option>Thi công xây dựng</option>
              <option>Tư vấn thiết kế</option>
              <option>Sàn giao dịch bất động sản</option>
            </select>
            <select className="flex-[0.5] min-w-[140px] border border-gray-300 text-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary appearance-none bg-white">
              <option>Tỉnh/Thành phố</option>
            </select>
            <select className="flex-[0.5] min-w-[140px] border border-gray-300 text-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary appearance-none bg-white">
              <option>Quận/Huyện</option>
            </select>
            <button className="bg-[#e03c31] hover:bg-[#c42c23] text-white text-sm font-bold px-10 py-2 rounded transition-colors whitespace-nowrap">
              Tìm kiếm
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
