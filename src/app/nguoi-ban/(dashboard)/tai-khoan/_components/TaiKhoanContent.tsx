"use client";

import { useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-store";
import { updateUser as updateUserApi } from "@/services/admin";
import {
  Camera,
  Plus,
  Info,
} from "lucide-react";

type Tab = "info" | "account" | "pro";

interface PhoneEntry {
  id: string;
  value: string;
}

export function TaiKhoanContent() {
  const { user, updateUser } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<Tab>(
    tabParam === "mat-khau" ? "account" : "info"
  );
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState(() => ({
    fullName: user?.fullName ?? "",
    personalTaxCode: "",
    phone: user?.phone ?? "",
    email: user?.email ?? "",
    buyerName: user?.fullName ?? "",
    invoiceEmail: "",
    companyName: "",
    taxCode: "",
    dvqhns: "",
    citizenId: "",
    passport: "",
    address: "Việt Nam",
  }));

  const [phones, setPhones] = useState<PhoneEntry[]>([]);
  const [phoneCount, setPhoneCount] = useState(1);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addPhone = () => {
    if (phoneCount >= 5) return;
    const newPhone: PhoneEntry = { id: Date.now().toString(), value: "" };
    setPhones((prev) => [...prev, newPhone]);
    setPhoneCount((prev) => prev + 1);
  };

  const updatePhone = (id: string, value: string) => {
    setPhones((prev) =>
      prev.map((p) => (p.id === id ? { ...p, value } : p))
    );
  };

  const removePhone = (id: string) => {
    setPhones((prev) => prev.filter((p) => p.id !== id));
    setPhoneCount((prev) => prev - 1);
  };

  const handleSave = async () => {
    if (!user?.id) {
      setMessage("Bạn cần đăng nhập để cập nhật thông tin.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const nextUser = await updateUserApi(user.id, {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        avatar: avatar ?? undefined,
      });
      updateUser({
        ...user,
        fullName: nextUser.fullName ?? nextUser.name ?? formData.fullName,
        email: nextUser.email ?? formData.email,
        phone: nextUser.phone ?? formData.phone,
        role: typeof nextUser.role === "string" ? nextUser.role : user.role,
      });
      setMessage("Đã lưu thông tin tài khoản.");
      router.refresh();
    } catch {
      setMessage("Chưa thể lưu thông tin, vui lòng thử lại sau.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!user?.id) {
      setMessage("Bạn cần đăng nhập để đổi mật khẩu.");
      return;
    }

    if (passwordForm.newPassword.length < 8 || passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage("Mật khẩu mới cần tối thiểu 8 ký tự và khớp xác nhận.");
      return;
    }

    setIsChangingPassword(true);
    setMessage("");

    try {
      await updateUserApi(user.id, { password: passwordForm.newPassword });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage("Đã đổi mật khẩu.");
    } catch {
      setMessage("Chưa thể đổi mật khẩu, vui lòng thử lại sau.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const initial = user?.fullName?.charAt(0)?.toUpperCase() ?? "U";

  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-8 xl:p-10 pb-20">
      <div className="max-w-[720px] mx-auto">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-gray-200 pb-3">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors ${activeTab === "info"
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
          >
            Chỉnh sửa thông tin
          </button>
          <button
            onClick={() => setActiveTab("account")}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors ${activeTab === "account"
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
          >
            Cài đặt tài khoản
          </button>
          <button
            onClick={() => setActiveTab("pro")}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors flex items-center gap-1.5 ${activeTab === "pro"
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
          >
            Tham gia Môi giới chuyên nghiệp
            <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded">Mới</span>
          </button>
        </div>

        {message && (
          <div className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-primary">
            {message}
          </div>
        )}

        {/* Tab Content: Thông tin cá nhân */}
        {activeTab === "info" && (
          <div className="space-y-8">
            {/* Personal Info */}
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-5">Thông tin cá nhân</h3>

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
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
                    onClick={() => removePhone(phone.id)}
                    className="p-2.5 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ))}

              <button
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
                      &bull; Batdongsan.com.vn sẽ xuất Hóa đơn điện tử tự động theo thông tin khách hàng cung cấp và gửi về Email nhận hóa đơn. Quý khách vui lòng nhập đầy đủ, chính xác và chịu trách nhiệm về những thông tin đã cung cấp.
                    </p>
                    <p className="mb-2">
                      &bull; Hoá đơn GTGT sẽ được xuất trong ngày và cho tất cả các giao dịch nộp tiền.
                    </p>
                    <p className="mb-2">
                      &bull; Nội dung dịch vụ được thể hiện trên hoá đơn là Phí dịch vụ quảng cáo trên website batdongsan.com.vn.
                    </p>
                    <p>
                      &bull; Mọi vấn đề cần hỗ trợ về hoá đơn của giao dịch nộp tiền trong ngày, vui lòng liên hệ hotline 1900 1881 trước 18h.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-lg font-bold text-sm transition-colors shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        )}

        {/* Tab Content: Cài đặt tài khoản */}
        {activeTab === "account" && (
          <div className="space-y-8">
            {/* Đổi mật khẩu */}
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-5">Đổi mật khẩu</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#e03c31] transition-colors"
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#e03c31] transition-colors"
                    placeholder="Nhập mật khẩu mới"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-[#e03c31] transition-colors"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handlePasswordChange}
                  disabled={isChangingPassword}
                  className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-lg font-bold text-sm transition-colors shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isChangingPassword ? "Đang đổi..." : "Đổi mật khẩu"}
                </button>
              </div>
            </section>
          </div>
        )}

        {/* Tab Content: Tham gia Môi giới chuyên nghiệp */}
        {activeTab === "pro" && (
          <div className="space-y-8">
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#fff6f6] flex items-center justify-center shrink-0">
                  <Info className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Tham gia Môi giới chuyên nghiệp
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Trở thành Môi giới chuyên nghiệp trên Batdongsan.com.vn để nhận được nhiều lợi ích:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600 mb-5">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold mt-0.5">&bull;</span>
                      Tăng độ tin cậy với khách hàng
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold mt-0.5">&bull;</span>
                      Hiển thị huy hiệu chuyên nghiệp trên tin đăng
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold mt-0.5">&bull;</span>
                      Tiếp cận nhiều khách hàng tiềm năng hơn
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold mt-0.5">&bull;</span>
                      Ưu tiên hiển thị trong danh sách môi giới
                    </li>
                  </ul>
                  <button className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-lg font-bold text-sm transition-colors shadow-sm">
                    Đăng ký ngay
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
