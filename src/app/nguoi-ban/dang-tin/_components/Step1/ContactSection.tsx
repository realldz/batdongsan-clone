import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useCreateListing } from "../CreateListingContext";

export function ContactSection() {
  const {
    contactName,
    setContactName,
    contactEmail,
    setContactEmail,
    contactPhone,
    setContactPhone,
    expanded,
    toggleSection,
    errors,
    setErrors,
  } = useCreateListing();

  const hasContactErrors = Boolean(errors.contactName || errors.contactPhone);

  return (
    <div className={`bg-white rounded-lg border mb-6 shadow-sm overflow-hidden font-sans ${hasContactErrors ? "border-red-500" : "border-gray-200"}`}>
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => toggleSection("contact")}
      >
        <h2 className="font-bold text-[14px] flex items-center gap-1.5">
          Thông tin liên hệ <span className="text-primary">*</span>
          {hasContactErrors && <span className="text-red-500 text-xs font-normal">(Có lỗi nhập liệu)</span>}
        </h2>
        {expanded.contact ? (
          <ChevronUp size={20} className="text-[#2c2c2c]" />
        ) : (
          <ChevronDown size={20} className="text-[#2c2c2c]" />
        )}
      </div>

      {expanded.contact ? (
        <div className="px-4 pb-6 pt-0 space-y-4">
          <div>
            <label className="block text-[13px] font-bold mb-2">
              Tên liên hệ <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={contactName}
              onChange={(event) => {
                setContactName(event.target.value);
                setErrors((prev) => ({ ...prev, contactName: "" }));
              }}
              className={`w-full border rounded-md px-3 py-2.5 outline-none focus:border-[#2c2c2c] text-[14px] font-medium ${errors.contactName ? "border-red-500 focus:border-red-500" : "border-gray-300"}`}
            />
            {errors.contactName && (
              <p className="text-red-500 text-[12px] mt-1.5 font-medium">{errors.contactName}</p>
            )}
          </div>
          <div>
            <label className="block text-[13px] font-bold mb-2">Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(event) => setContactEmail(event.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 outline-none focus:border-[#2c2c2c] text-[14px] font-medium"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold mb-2">
              Số điện thoại <span className="text-primary">*</span>
            </label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(event) => {
                setContactPhone(event.target.value);
                setErrors((prev) => ({ ...prev, contactPhone: "" }));
              }}
              className={`w-full border rounded-md px-3 py-2.5 outline-none focus:border-[#2c2c2c] text-[14px] font-medium ${errors.contactPhone ? "border-red-500 focus:border-red-500" : "border-gray-300"}`}
            />
            {errors.contactPhone && (
              <p className="text-red-500 text-[12px] mt-1.5 font-medium">{errors.contactPhone}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="px-4 pb-4 pt-0 text-[14px] text-[#2c2c2c] font-medium">
          {contactName} • {contactEmail} • {contactPhone}
        </div>
      )}
    </div>
  );
}
