"use client";

import React, { useRef, useState } from "react";
import { Info, Upload, Image as ImageIcon, ChevronUp, ChevronDown, Check, X, Star, RotateCw, Trash2, Edit2, AlertTriangle, Plus } from "lucide-react";

type UploadedImage = {
  id: string;
  previewUrl: string;
  file?: File;
  url?: string;
};

export function Step2({ onBack, onNext, onFilesChange, onImageUrlsChange }: { onBack: () => void; onNext: () => void; onFilesChange: (files: File[]) => void; onImageUrlsChange: (urls: string[]) => void }) {
  const [expandedGuide, setExpandedGuide] = useState(true);
  const [expandedLink, setExpandedLink] = useState(true);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const libraryImages = [
    "https://file4.batdongsan.com.vn/crop/350x232/2023/10/24/20231024093844-30ba_wm.jpg",
    "https://file4.batdongsan.com.vn/crop/350x232/2023/10/24/20231024093844-42b7_wm.jpg",
    "https://file4.batdongsan.com.vn/crop/350x232/2023/10/24/20231024093844-f58c_wm.jpg",
    "https://file4.batdongsan.com.vn/crop/350x232/2023/10/24/20231024093844-1234_wm.jpg",
    "https://file4.batdongsan.com.vn/crop/350x232/2023/10/24/20231024093844-5678_wm.jpg",
    "https://file4.batdongsan.com.vn/crop/350x232/2023/10/24/20231024093844-abcd_wm.jpg",
  ];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedLibraryImages, setSelectedLibraryImages] = useState<number[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const syncImages = (images: UploadedImage[]) => {
    setUploadedImages(images);
    onFilesChange(images.flatMap((image) => (image.file ? [image.file] : [])));
    onImageUrlsChange(images.flatMap((image) => (image.url ? [image.url] : [])));
  };

  const toggleLibraryImage = (index: number) => {
    if (selectedLibraryImages.includes(index)) {
      setSelectedLibraryImages(selectedLibraryImages.filter(i => i !== index));
    } else {
      setSelectedLibraryImages([...selectedLibraryImages, index]);
    }
  };

  const handleAddLibraryImages = () => {
    const newImages = selectedLibraryImages.map((index) => ({
      id: `library-${index}-${libraryImages[index]}`,
      previewUrl: libraryImages[index],
      url: libraryImages[index],
    }));
    syncImages([...uploadedImages, ...newImages].slice(0, 24));
    setIsLibraryModalOpen(false);
    setSelectedLibraryImages([]);
  };

  const handleFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const newImages = files.map((file) => ({
      id: `file-${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      previewUrl: URL.createObjectURL(file),
      file,
    }));

    syncImages([...uploadedImages, ...newImages].slice(0, 24));
    event.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    syncImages(uploadedImages.filter((_, currentIndex) => currentIndex !== index));
  };

  const isInvalid = uploadedImages.length > 0 && uploadedImages.length < 3;

  return (
    <div className="flex-1 w-[700px] max-w-full mx-auto px-4 py-8 pb-32">
      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFilesSelected} />
      {/* Hình ảnh & video Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[16px] text-[#2c2c2c]">Hình ảnh & video</h2>
          {uploadedImages.length > 0 && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-full text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-colors bg-white shadow-sm"
            >
              <Edit2 size={14} /> Chỉnh sửa ({uploadedImages.length})
            </button>
          )}
        </div>

        {isInvalid && (
          <div className="flex items-center gap-2 mb-4 text-[#e03c31] bg-red-50 p-3 rounded-lg border border-red-100">
            <AlertTriangle size={16} />
            <span className="text-[13px] font-medium">Vui lòng đăng tối thiểu 3 ảnh</span>
          </div>
        )}

        {uploadedImages.length === 0 ? (
          <div className="bg-[#e4e9f2] rounded-lg p-3 flex items-center gap-2 text-gray-700 mb-6">
            <Info size={16} className="text-gray-500" />
            <span className="text-[13px]">Đăng tối thiểu 3 ảnh</span>
          </div>
        ) : null}

        {uploadedImages.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {uploadedImages.map((img, idx) => (
              <div key={img.id} className="relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm aspect-[4/3] group">
                <img src={img.previewUrl} alt="" className="w-full h-full object-cover" />
                {idx === 0 && (
                  <div className="absolute top-2 left-2 bg-[#e03c31] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
                    Ảnh đại diện
                  </div>
                )}
                {/* Overlay actions on hover */}
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-700 hover:text-[#e03c31] shadow-sm">
                    <Star size={16} />
                  </button>
                  <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-700 hover:text-blue-600 shadow-sm">
                    <RotateCw size={16} />
                  </button>
                  <button onClick={() => handleRemoveImage(idx)} className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-700 hover:text-[#e03c31] shadow-sm">
                    <Trash2 size={16} />
                  </button>
                </div>
                {/* Description input */}
                <div className="absolute bottom-0 left-0 right-0 bg-[#2c2c2c]/80 flex items-center">
                  <input
                    type="text"
                    placeholder="Thêm mô tả..."
                    className="w-full bg-transparent text-white text-[13px] px-3 py-2 outline-none placeholder-gray-300"
                  />
                  <Edit2 size={14} className="text-gray-300 mr-3" />
                </div>
              </div>
            ))}
            {uploadedImages.length < 24 && (
              <button onClick={() => fileInputRef.current?.click()} className="border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center aspect-[4/3] bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                <Upload size={24} className="text-gray-400 group-hover:text-gray-600 mb-2" />
                <span className="text-[13px] font-medium text-gray-500">Thêm ảnh/video</span>
              </button>
            )}
          </div>
        ) : (
          <div className="border border-dashed border-gray-400 rounded-lg p-8 flex flex-col items-center justify-center bg-white mb-6">
            <Upload size={32} className="text-[#2c2c2c] mb-3" />
            <div className="text-[14px] font-bold text-[#2c2c2c] mb-4">Kéo vào tối đa 24 ảnh và 1 video</div>
            <div className="flex items-center gap-3">
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-[13px] font-bold hover:bg-gray-50 transition-colors bg-white">
                <Plus size={16} /> Tải ảnh/video từ thiết bị
              </button>
              {/* <button
                onClick={() => setIsLibraryModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-[13px] font-bold hover:bg-gray-50 transition-colors bg-white"
              >
                <ImageIcon size={16} /> Chọn từ thư viện BĐS
              </button> */}
            </div>
          </div>
        )}
      </div>

      {/* Accordion 1: Hướng dẫn đăng ảnh/video */}
      <div className="border-t border-gray-200">
        <div
          className="flex items-center justify-between py-4 cursor-pointer hover:text-[#e03c31] transition-colors"
          onClick={() => setExpandedGuide(!expandedGuide)}
        >
          <div className="flex items-center gap-2 font-bold text-[14px] text-[#2c2c2c]">
            <ImageIcon size={18} /> Hướng dẫn đăng ảnh/video
          </div>
          {expandedGuide ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
        </div>

        {expandedGuide && (
          <div className="pb-6 text-[13px] text-gray-700 leading-relaxed">
            <p className="mb-2">Để đảm bảo tài liệu hình ảnh hợp lệ cho tin đăng, cần tuân thủ các quy định sau:</p>
            <p className="font-medium mb-1">Hình ảnh:</p>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li>Định dạng được hỗ trợ: <span className="font-bold">PNG, JPG, JPEG, GIF, HEIC</span>.</li>
              <li>Đăng <span className="font-bold">tối đa 24 ảnh</span> với tất cả các loại tin.</li>
              <li>Mỗi ảnh kích thước <span className="font-bold">tối thiểu 100x100 px</span>, dung lượng <span className="font-bold">tối đa 15 MB</span>.</li>
              <li>Mô tả ảnh tối đa 45 kí tự.</li>
              <li>Hãy dùng ảnh thật, không trùng, không chèn SĐT.</li>
            </ul>

            <p className="font-medium mb-1">Video:</p>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li>Định dạng được hỗ trợ: <span className="font-bold">MP4, MOV (H.264 hoặc HEVC)</span>.</li>
              <li>Đăng <span className="font-bold">tối đa 1 video</span> cho mỗi tin.</li>
              <li>Video dung lượng <span className="font-bold">tối đa 300 MB</span>, thời lượng <span className="font-bold">tối thiểu 5 giây, tối đa 3 phút</span>.</li>
            </ul>
            <p className="text-gray-500 italic">Lưu ý: Hãy dùng hình ảnh/video thật về bất động sản, không chèn SĐT.</p>
          </div>
        )}
      </div>

      {/* Accordion 2: Liên kết video */}
      <div className="border-t border-gray-200">
        <div
          className="flex items-center justify-between py-4 cursor-pointer hover:text-[#e03c31] transition-colors"
          onClick={() => setExpandedLink(!expandedLink)}
        >
          <div className="flex items-center gap-2 font-bold text-[14px] text-[#2c2c2c]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
            Liên kết video
          </div>
          {expandedLink ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
        </div>

        {expandedLink && (
          <div className="pb-6 pt-2">
            <input
              type="text"
              placeholder="Dán đường dẫn Youtube hoặc Tiktok"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#2c2c2c] text-[14px] transition-colors bg-white shadow-sm hover:border-gray-400"
            />
          </div>
        )}
      </div>

      {/* Footer sticky bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10 flex justify-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="w-[700px] max-w-full flex justify-between">
          <button
            onClick={onBack}
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-full font-bold text-[14px] transition-colors shadow-sm bg-white"
          >
            Quay lại
          </button>
          <button
            onClick={onNext}
            className="bg-[#e03c31] hover:bg-[#c9362c] text-white px-8 py-2.5 rounded-full font-bold text-[14px] transition-colors shadow-sm"
          >
            Tiếp tục
          </button>
        </div>
      </footer>

      {/* Library Modal */}
      {isLibraryModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[640px] rounded-lg overflow-hidden flex flex-col shadow-2xl">
            <div className="bg-[#2c2c2c] px-4 py-3 flex items-center justify-between text-white">
              <h3 className="font-bold text-[16px]">Hình ảnh từ thư viện BĐS</h3>
              <button onClick={() => setIsLibraryModalOpen(false)} className="text-gray-300 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <p className="text-[14px] text-gray-700 mb-1">Chọn hình có sẵn từ dự án HH2 Linh Đàm</p>
              <p className="text-[13px] font-bold mb-4"><span className="text-[#e03c31]">{selectedLibraryImages.length}</span>/{libraryImages.length} hình được chọn</p>

              <div className="grid grid-cols-3 gap-3 mb-6 max-h-[50vh] overflow-y-auto">
                {libraryImages.map((img, idx) => {
                  const isSelected = selectedLibraryImages.includes(idx);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleLibraryImage(idx)}
                      className={`relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${isSelected ? 'border-[#2c2c2c]' : 'border-transparent'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-black/40 flex items-start justify-end p-2">
                          <div className="w-5 h-5 bg-[#2c2c2c] text-white rounded flex items-center justify-center">
                            <Check size={14} strokeWidth={3} />
                          </div>
                        </div>
                      )}
                      {!isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-white border border-gray-300 rounded shadow-sm"></div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  onClick={handleAddLibraryImages}
                  disabled={selectedLibraryImages.length === 0}
                  className={`px-8 py-2.5 rounded-full font-bold text-[14px] transition-colors ${selectedLibraryImages.length > 0
                      ? 'bg-[#e03c31] hover:bg-[#c9362c] text-white shadow-sm'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Images Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[640px] rounded-lg overflow-hidden flex flex-col max-h-[85vh] shadow-2xl">
            <div className="bg-[#2c2c2c] px-4 py-3 flex items-center justify-between text-white">
              <h3 className="font-bold text-[16px]">Chỉnh sửa hình ảnh/video ({uploadedImages.length})</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-300 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 flex flex-col flex-1 overflow-y-auto">
              <p className="text-[14px] text-gray-700 mb-4">Kéo và thả hình ảnh để sắp xếp lại thứ tự</p>

              <div className="flex flex-col gap-4">
                {uploadedImages.map((img, idx) => (
                  <div key={img.id} className="flex items-center gap-3 bg-white border border-gray-200 p-2 rounded-lg shadow-sm">
                    {/* Drag Handle Mock */}
                    <div className="text-gray-300 cursor-grab px-1">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="19" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="19" r="1"></circle></svg>
                    </div>
                    <div className="relative w-40 aspect-[4/3] rounded overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={img.previewUrl} alt="" className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <div className="absolute top-1 left-1 bg-[#e03c31] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                          Ảnh đại diện
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between self-stretch">
                      <div className="flex gap-2 justify-end mb-2">
                        <button className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-[#e03c31] shadow-sm hover:border-red-200 transition-colors">
                          <Star size={14} />
                        </button>
                        <button className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-blue-600 shadow-sm transition-colors">
                          <RotateCw size={14} />
                        </button>
                        <button onClick={() => handleRemoveImage(idx)} className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-[#e03c31] shadow-sm transition-colors hover:border-red-200">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="relative mt-auto">
                        <input
                          type="text"
                          placeholder="Thêm mô tả..."
                          className="w-full bg-[#f2f2f2] text-gray-700 text-[13px] px-3 py-2 pr-8 rounded-lg outline-none focus:ring-1 focus:ring-gray-300"
                        />
                        <Edit2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-[#e03c31] hover:bg-[#c9362c] text-white px-8 py-2.5 rounded-full font-bold text-[14px] transition-colors shadow-sm"
              >
                Hoàn tất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
