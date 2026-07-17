"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-store";
import { ApiError } from "@/lib/api";
import { Avatar, Button, Input, Icon } from "@/components/atoms";
import { Dropdown, FormField, Modal } from "@/components/molecules";
import { Role, hasAnyPermission } from "@/lib/role.constant";

type AuthView = "login" | "register";

interface FormFields {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const initialFields: FormFields = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export function HeaderAuthActions() {
  const { isAuthenticated, isLoading, user, login, register, logout } = useAuth();
  const router = useRouter();
  const [activeView, setActiveView] = useState<AuthView>("login");
  const [isOpen, setIsOpen] = useState(false);
  const [fields, setFields] = useState<FormFields>(initialFields);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openDialog = (view: AuthView) => {
    setActiveView(view);
    setFields(initialFields);
    setError(null);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setError(null);
  };

  const updateField = (key: keyof FormFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (activeView === "register" && fields.password !== fields.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setIsSubmitting(true);

    try {
      if (activeView === "login") {
        await login({ email: fields.email, password: fields.password });
      } else {
        await register({
          fullName: fields.fullName,
          email: fields.email,
          phone: fields.phone,
          password: fields.password,
        });
      }
      closeDialog();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Có lỗi xảy ra, vui lòng thử lại sau");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="hidden lg:flex items-center gap-2 text-sm text-[#2c2c2c]">
          <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200" />
        </div>
      ) : isAuthenticated ? (
        <div className="hidden lg:flex items-center gap-2 text-sm text-[#2c2c2c]">
          <Dropdown
            trigger={
              <button
                type="button"
                className="flex items-center gap-2 rounded-full bg-[#f5f5f5] px-3 py-1.5 transition-colors hover:bg-[#eaeaea]"
              >
                <Avatar name={user?.fullName || "User"} src={undefined} size="sm" className="h-7 w-7 text-xs" />
                <span className="font-medium text-gray-800">{user?.fullName?.split(" ").pop()}</span>
                <Icon name="ChevronDown" size={14} className="text-gray-500" />
              </button>
            }
            align="right"
            panelClassName="w-72 mt-2"
          >
            <ul className="py-1">
              <li className="px-4 py-3 bg-gradient-to-r from-red-50 to-orange-50 mx-2 rounded-xl mb-1">
                <p className="text-sm font-bold text-gray-900">Gói Hội viên</p>
                <p className="text-xs text-gray-600 mt-0.5">
                  <span className="font-semibold text-primary">Tiết kiệm đến 39%</span> chi phí so với đăng tin/đẩy tin lẻ
                </p>
                <Link
                  href="/nguoi-ban/nap-tien"
                  className="mt-2 inline-block rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-white hover:bg-primary-hover transition-colors"
                >
                  Tìm hiểu thêm
                </Link>
              </li>

              <li className="px-4 py-2 border-b border-[#e8e8e8] mb-1">
                <span className="text-sm font-semibold text-gray-900">{user?.fullName}</span>
              </li>

              {user && hasAnyPermission(user.role, [Role.ADMIN, Role.SUPER_ADMIN]) && (
                <li className="border-b border-[#e8e8e8] pb-1 mb-1">
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    <Icon name="Lock" size={16} className="text-red-500" />
                    Trang quản trị Admin
                  </Link>
                </li>
              )}

              <li>
                <Link
                  href="/nguoi-ban"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Icon name="History" size={16} className="text-gray-400" />
                  Chuyển sang đăng tin
                </Link>
              </li>

              <li className="border-t border-[#e8e8e8] mt-1 pt-1">
                <Link
                  href="/nguoi-ban"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Icon name="Grid" size={16} className="text-gray-400" />
                  Tổng quan
                </Link>
              </li>

              <li>
                <Link
                  href="/nguoi-ban/tin-dang"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Icon name="FileText" size={16} className="text-gray-400" />
                  Quản lý tin đăng
                </Link>
              </li>

              <li>
                <Link
                  href="/nguoi-ban"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Icon name="UserCheck" size={16} className="text-gray-400" />
                  Quản lý khách hàng
                </Link>
              </li>

              <li>
                <Link
                  href="/tin-da-luu"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Icon name="Heart" size={16} className="text-gray-400" />
                  Tin đã lưu
                </Link>
              </li>

              <li>
                <Link
                  href="/tim-kiem-da-luu"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Icon name="Search" size={16} className="text-gray-400" />
                  Tìm kiếm đã lưu
                </Link>
              </li>

              <li>
                <Link
                  href="/nguoi-ban/tai-khoan"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Icon name="User" size={16} className="text-gray-400" />
                  Môi giới chuyên nghiệp
                </Link>
              </li>

              <li>
                <Link
                  href="/nguoi-ban/nap-tien"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Icon name="Wallet" size={16} className="text-gray-400" />
                  <div>
                    <span>Gói hội viên</span>
                    <span className="ml-2 inline-block rounded bg-red-50 px-1.5 py-0.5 text-[11px] font-bold text-primary">
                      -39%
                    </span>
                  </div>
                </Link>
              </li>

              <li>
                <Link
                  href="/nguoi-ban/nap-tien"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Icon name="CreditCard" size={16} className="text-gray-400" />
                  Nạp tiền
                </Link>
              </li>

              <li className="border-t border-[#e8e8e8] mt-1 pt-1">
                <Link
                  href="/nguoi-ban/tai-khoan"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Icon name="Info" size={16} className="text-gray-400" />
                  Cài đặt tài khoản
                </Link>
              </li>

              <li className="border-t border-[#e8e8e8] mt-1 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Icon name="LogOut" size={16} className="text-gray-400" />
                  Đăng xuất
                </button>
              </li>
            </ul>
          </Dropdown>
        </div>
      ) : (
        <div className="hidden lg:flex items-center gap-2 text-sm text-[#2c2c2c]">
          <button
            type="button"
            onClick={() => openDialog("login")}
            className="cursor-pointer font-medium transition-colors hover:text-primary"
          >
            Đăng nhập
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={() => openDialog("register")}
            className="cursor-pointer font-medium transition-colors hover:text-primary"
          >
            Đăng ký
          </button>
        </div>
      )}

      <Modal
        isOpen={isOpen}
        onClose={closeDialog}
        size="md"
        title={
          <div className="text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Tài khoản cá nhân
            </p>
            <h2 className="text-[22px] font-bold leading-tight text-[#1f2937] mt-1">
              {activeView === "login" ? "Đăng nhập để tiếp tục" : "Tạo tài khoản mới"}
            </h2>
          </div>
        }
      >
        <div className="bg-[radial-gradient(circle_at_top,_rgba(224,60,49,0.08),_transparent_48%)] -mx-6 -mt-4 px-6 pt-4 border-b border-slate-100">
          <div className="grid grid-cols-2 gap-2 rounded-t-[22px] bg-slate-50 p-1.5 mb-4">
            {[
              { label: "Đăng nhập", value: "login" },
              { label: "Đăng ký", value: "register" },
            ].map((item) => {
              const isActive = activeView === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    setActiveView(item.value as AuthView);
                    setError(null);
                  }}
                  className={`rounded-[18px] px-4 py-2.5 text-sm font-semibold transition ${
                    isActive ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          {activeView === "register" && (
            <FormField label="Họ và tên" required>
              <Input
                type="text"
                placeholder="Nhập họ và tên"
                value={fields.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
              />
            </FormField>
          )}

          <FormField label="Email" required>
            <Input
              type="email"
              placeholder="Nhập email"
              value={fields.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </FormField>

          {activeView === "register" && (
            <FormField label="Số điện thoại" required>
              <Input
                type="tel"
                placeholder="Nhập số điện thoại"
                value={fields.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </FormField>
          )}

          <FormField label="Mật khẩu" required>
            <Input
              type="password"
              placeholder="Nhập mật khẩu"
              value={fields.password}
              onChange={(e) => updateField("password", e.target.value)}
            />
          </FormField>

          {activeView === "register" && (
            <FormField label="Xác nhận mật khẩu" required>
              <Input
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={fields.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
              />
            </FormField>
          )}

          {activeView === "login" ? (
            <div className="flex items-center justify-between gap-3 text-sm">
              <label className="flex items-center gap-2 text-slate-500 cursor-pointer select-none">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <button type="button" className="font-medium text-primary transition hover:text-primary-hover cursor-pointer">
                Quên mật khẩu?
              </button>
            </div>
          ) : (
            <label className="flex items-start gap-3 text-sm leading-6 text-slate-500 cursor-pointer select-none">
              <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" />
              <span>
                Tôi đồng ý với <span className="font-medium text-primary">Điều khoản sử dụng</span> và{" "}
                <span className="font-medium text-primary">Chính sách bảo mật</span>.
              </span>
            </label>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>
          )}

          <Button
            type="submit"
            isLoading={isSubmitting}
            fullWidth
            className="py-3 text-sm font-semibold rounded-xl"
          >
            {activeView === "login" ? "Đăng nhập" : "Tạo tài khoản"}
          </Button>
        </form>

        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500 mt-4 text-center">
          {activeView === "login" ? (
            <p>
              Chưa có tài khoản?{" "}
              <button
                type="button"
                onClick={() => {
                  setActiveView("register");
                  setError(null);
                }}
                className="font-semibold text-primary transition hover:text-primary-hover cursor-pointer"
              >
                Đăng ký ngay
              </button>
            </p>
          ) : (
            <p>
              Đã có tài khoản?{" "}
              <button
                type="button"
                onClick={() => {
                  setActiveView("login");
                  setError(null);
                }}
                className="font-semibold text-primary transition hover:text-primary-hover cursor-pointer"
              >
                Đăng nhập
              </button>
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}
