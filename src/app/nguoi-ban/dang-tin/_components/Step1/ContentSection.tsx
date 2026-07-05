import React from "react";
import { ChevronUp, ChevronDown, Sparkles } from "lucide-react";
import { useCreateListing } from "../CreateListingContext";

export function ContentSection() {
  const {
    title,
    setTitle,
    description,
    setDescription,
    expanded,
    toggleSection,
    errors,
    setErrors,
  } = useCreateListing();

  const hasContentErrors = Boolean(errors.title || errors.description);

  return (
    <div className={`bg-white rounded-lg border mb-6 shadow-sm overflow-hidden font-sans ${hasContentErrors ? "border-red-500" : "border-gray-200"}`}>
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => toggleSection("content")}
      >
        <h2 className="font-bold text-[14px] flex items-center gap-1.5">
          Nội dung tiêu đề & mô tả <span className="text-primary">*</span>
          {hasContentErrors && <span className="text-red-500 text-xs font-normal">(Có lỗi nhập liệu)</span>}
        </h2>
        {expanded.content ? (
          <ChevronUp size={20} className="text-[#2c2c2c]" />
        ) : (
          <ChevronDown size={20} className="text-[#2c2c2c]" />
        )}
      </div>

      {expanded.content ? (
        <div className="px-4 pb-6 pt-0 space-y-5">
          {/* <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
            <div>
              <div className="font-bold text-[13px] mb-1">Tạo nhanh với AI</div>
              <div className="text-[12px] text-gray-500 font-medium">
                Bạn còn <span className="font-bold text-[#2c2c2c]">99</span> lượt sử
                dụng đến ngày 18/04/2026
              </div>
            </div>
            <button
              type="button"
              className="flex items-center justify-center gap-2 border border-gray-300 rounded-full px-5 py-2 hover:bg-gray-50 transition-colors text-[13px] font-bold shrink-0 bg-white"
            >
              <Sparkles size={16} className="text-[#7e22ce]" fill="#7e22ce" />
              Tạo với AI
            </button>
          </div> */}

          <div>
            <label className="block text-[13px] font-bold mb-2">
              Tiêu đề <span className="text-primary">*</span>
            </label>
            <textarea
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setErrors((prev) => ({ ...prev, title: "" }));
              }}
              placeholder="Mô tả ngắn gọn về loại hình bất động sản, diện tích, địa chỉ (VD: Bán nhà riêng 50m2 chính chủ tại Cầu Giấy)"
              className={`w-full border rounded-md px-3 py-2.5 outline-none focus:border-[#2c2c2c] text-[14px] font-medium min-h-[80px] resize-y placeholder:text-gray-400 ${errors.title ? "border-red-500 focus:border-red-500" : "border-gray-300"}`}
            />
            {errors.title && (
              <p className="text-red-500 text-[12px] mt-1.5 font-medium">{errors.title}</p>
            )}
            <div className="text-[12px] text-gray-500 mt-1.5 font-medium">
              Tối thiểu 30 ký tự, tối đa 99 ký tự
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold mb-2">
              Mô tả <span className="text-primary">*</span>
            </label>
            <textarea
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                setErrors((prev) => ({ ...prev, description: "" }));
              }}
              placeholder={`Mô tả chi tiết về:\n• Loại hình bất động sản\n• Vị trí\n• Diện tích, tiện ích\n• Tình trạng nội thất\n...\n(VD: Khu nhà có vị trí thuận lợi, gần công viên, trường học...)`}
              className={`w-full border rounded-md px-3 py-2.5 outline-none focus:border-[#2c2c2c] text-[14px] font-medium min-h-[160px] resize-y placeholder:text-gray-400 leading-relaxed ${errors.description ? "border-red-500 focus:border-red-500" : "border-gray-300"}`}
            />
            {errors.description && (
              <p className="text-red-500 text-[12px] mt-1.5 font-medium">{errors.description}</p>
            )}
            <div className="text-[12px] text-gray-500 mt-1.5 font-medium">
              Tối thiểu 30 ký tự, tối đa 3000 ký tự
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 pb-4 pt-0 text-[14px] text-[#2c2c2c] font-medium">
          <div className="text-gray-500 text-[12px] mb-1 font-medium">Tiêu đề</div>
          <div className="mb-4 font-bold">{title}</div>
          <div className="text-gray-500 text-[12px] mb-1 font-medium">Mô tả</div>
          <div className="line-clamp-2 leading-relaxed">{description}</div>
        </div>
      )}
    </div>
  );
}
