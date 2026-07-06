"use client";

import { useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-store";
import { updateUser as updateUserApi } from "@/services/admin";
import { PersonalInfoTab } from "./PersonalInfoTab";
import { AccountSettingsTab } from "./AccountSettingsTab";
import { ProBrokerTab } from "./ProBrokerTab";

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
        role: nextUser.role !== undefined ? Number(nextUser.role) : user.role,
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
        <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-gray-200 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("info")}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors ${activeTab === "info"
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
          >
            Chỉnh sửa thông tin
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("account")}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors ${activeTab === "account"
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
          >
            Cài đặt tài khoản
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pro")}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors flex items-center gap-1.5 ${activeTab === "pro"
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
          >
            Tham gia Môi giới chuyên nghiệp
            <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">Mới</span>
          </button>
        </div>

        {message && (
          <div className="mb-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-primary animate-in fade-in">
            {message}
          </div>
        )}

        {/* Tab Content: Thông tin cá nhân */}
        {activeTab === "info" && (
          <PersonalInfoTab
            initial={initial}
            avatar={avatar}
            fileInputRef={fileInputRef}
            handleAvatarChange={handleAvatarChange}
            formData={formData}
            handleInputChange={handleInputChange}
            phones={phones}
            phoneCount={phoneCount}
            addPhone={addPhone}
            updatePhone={updatePhone}
            removePhone={removePhone}
            isSaving={isSaving}
            handleSave={handleSave}
          />
        )}

        {/* Tab Content: Cài đặt tài khoản */}
        {activeTab === "account" && (
          <AccountSettingsTab
            passwordForm={passwordForm}
            setPasswordForm={setPasswordForm}
            isChangingPassword={isChangingPassword}
            handlePasswordChange={handlePasswordChange}
          />
        )}

        {/* Tab Content: Tham gia Môi giới chuyên nghiệp */}
        {activeTab === "pro" && <ProBrokerTab />}
      </div>
    </main>
  );
}
