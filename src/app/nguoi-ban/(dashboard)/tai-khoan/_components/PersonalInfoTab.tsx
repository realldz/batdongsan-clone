import React, { RefObject } from "react";
import { Camera, Plus } from "lucide-react";

interface PhoneEntry {
  id: string;
  value: string;
}

interface PersonalInfoTabProps {
  initial: string;
  avatar: string | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: {
    fullName: string;
    personalTaxCode: string;
    phone: string;
    email: string;
    buyerName: string;
    invoiceEmail: string;
    companyName: string;
    taxCode: string;
    dvqhns: string;
    citizenId: string;
    passport: string;
    address: string;
  };
  handleInputChange: (field: keyof PersonalInfoTabProps["formData"], value: string) => void;
  phones: PhoneEntry[];
  phoneCount: number;
  addPhone: () => void;
  updatePhone: (id: string, value: string) => void;
  removePhone: (id: string) => void;
  isSaving: boolean;
  handleSave: () => Promise<void>;
}

export function PersonalInfoTab({
  initial,
  avatar,
  fileInputRef,
  handleAvatarChange,
  formData,
  handleInputChange,
  phones,
  phoneCount,
  addPhone,
  updatePhone,
  removePhone,
  isSaving,
  handleSave,
}: PersonalInfoTabProps) {
  return (
    <div className="space-y-8">
      {/* Personal Info */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-5">Thông tin cá nhân</h3>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {avatar ? (
              <img
                src={avatar}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
              />
            ) : (
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-md">
                {initial}
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <span className="text-sm font-medium text-gray-500">Tải ảnh</span>
        </div>

        {/* Họ và tên */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-1.5">
            Họ và tên
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#e03c31] transition-colors"
          />
        </div>

        {/* Mã số thuế cá nhân */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-1.5">
            Mã số thuế cá nhân
          </label>
          <input
            type="text"
            value={formData.personalTaxCode}
            onChange={(e) => handleInputChange("personalTaxCode", e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#e03c31] transition-colors"
          />
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-5">Thông tin liên hệ</h3>

        {/* Số điện thoại chính */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-1.5">
            Số điện thoại chính
          </label>
          <input
            type="text"
            value={formData.phone}
            disabled
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-400 bg-gray-50"
          />
        </div>

        {/* Additional phone numbers */}
        {phones.map((phone) => (
          <div key={phone.id} className="mb-3 flex items-center gap-2">
            <input
              type="text"
              value={phone.value}
              onChange={(e) => updatePhone(phone.id, e.target.value)}
              placeholder="Nhập số điện thoại"
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#e03c31] transition-colors"
            />
            <button
              type="button"
              onClick={() => removePhone(phone.id)}
              className="p-2.5 text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addPhone}
          disabled={phoneCount >= 5}
          className="flex items-center gap-1.5 text-primary font-bold text-sm hover:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed mt-1"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Thêm số điện thoại ({phoneCount}/5)
        </button>

        {/* Email */}
        <div className="mt-5">
          <label className="block text-sm font-bold text-gray-700 mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            disabled
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-400 bg-gray-50"
          />
        </div>
      </section>

      {/* Invoice Info */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-5">Thông tin xuất hoá đơn</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Họ tên người mua hàng
            </label>
            <input
              type="text"
              value={formData.buyerName}
              onChange={(e) => handleInputChange("buyerName", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#e03c31] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Email nhận hóa đơn
            </label>
            <input
              type="email"
              value={formData.invoiceEmail}
              onChange={(e) => handleInputChange("invoiceEmail", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#e03c31] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Tên đơn vị (Tên công ty)
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#e03c31] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Mã số thuế
            </label>
            <input
              type="text"
              value={formData.taxCode}
              onChange={(e) => handleInputChange("taxCode", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#e03c31] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Mã số ĐVQHNS
            </label>
            <input
              type="text"
              value={formData.dvqhns}
              onChange={(e) => handleInputChange("dvqhns", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#e03c31] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Căn cước công dân
            </label>
            <input
              type="text"
              value={formData.citizenId}
              onChange={(e) => handleInputChange("citizenId", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#e03c31] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Số hộ chiếu
            </label>
            <input
              type="text"
              value={formData.passport}
              onChange={(e) => handleInputChange("passport", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#e03c31] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Địa chỉ
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#e03c31] transition-colors"
            />
          </div>
        </div>

        {/* VAT Info */}
        <div className="mt-6 p-4 bg-[#f8fafc] rounded-lg border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-primary text-xs font-extrabold">VAT</span>
            </div>
            <div className="text-xs text-gray-500 leading-relaxed">
              <p className="mb-2">
                &bull; Batdongsan.com.vn sẽ xuất Hóa đơn điện tử tự động theo thông
                tin khách hàng cung cấp và gửi về Email nhận hóa đơn. Quý khách vui
                lòng nhập đầy đủ, chính xác và chịu trách nhiệm về những thông tin đã
                cung cấp.
              </p>
              <p className="mb-2">
                &bull; Hoá đơn GTGT sẽ được xuất trong ngày và cho tất cả các giao
                dịch nộp tiền.
              </p>
              <p className="mb-2">
                &bull; Nội dung dịch vụ được thể hiện trên hoá đơn là Phí dịch vụ
                quảng cáo trên website batdongsan.com.vn.
              </p>
              <p>
                &bull; Mọi vấn đề cần hỗ trợ về hoá đơn của giao dịch nộp tiền trong
                ngày, vui lòng liên hệ hotline 1900 1881 trước 18h.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary hover:bg-[#c42c23] text-white px-8 py-3 rounded-lg font-bold text-sm transition-colors shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </div>
  );
}
