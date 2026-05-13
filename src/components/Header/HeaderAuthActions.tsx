"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-store";
import { ApiError } from "@/lib/api";

type AuthView = "login" | "register";

const inputClassName =
  "w-full rounded-xl border border-[#d7dbe0] bg-white px-4 py-3 text-sm text-[#2c2c2c] outline-none transition focus:border-primary focus:ring-4 focus:ring-red-100";

interface FormFields {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialFields: FormFields = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function HeaderAuthActions() {
  const { isAuthenticated, isLoading, user, login, register, logout } = useAuth();
  const router = useRouter();
  const [activeView, setActiveView] = useState<AuthView>("login");
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [fields, setFields] = useState<FormFields>(initialFields);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

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
        <div className="hidden lg:flex items-center gap-2 text-sm text-[#2c2c2c]" ref={menuRef}>
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-full bg-[#f5f5f5] px-3 py-1.5 transition-colors hover:bg-[#eaeaea]"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                {user?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
              </div>
              <span className="font-medium">{user?.fullName?.split(" ").pop()}</span>
              <svg className={`h-4 w-4 text-gray-500 transition-transform ${menuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {menuOpen ? (
              <ul className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-[#e8e8e8] bg-white py-2 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">

                <li className="px-4 py-3 bg-gradient-to-r from-red-50 to-orange-50 mx-2 rounded-xl mb-1">
                  <p className="text-sm font-bold text-gray-900">Gói Hội viên</p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    <span className="font-semibold text-primary">Tiết kiệm đến 39%</span> chi phí so với đăng tin/đẩy tin lẻ
                  </p>
                  <Link
                    href="/nguoi-ban/nap-tien"
                    onClick={() => setMenuOpen(false)}
                    className="mt-2 inline-block rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-white hover:bg-primary-hover transition-colors"
                  >
                    Tìm hiểu thêm
                  </Link>
                </li>

                <li className="px-4 py-2 border-b border-[#e8e8e8] mb-1">
                  <span className="text-sm font-semibold text-gray-900">{user?.fullName}</span>
                </li>

                <li>
                  <Link
                    href="/nguoi-ban"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Chuyển sang đăng tin
                  </Link>
                </li>

                <li className="border-t border-[#e8e8e8] mt-1 pt-1">
                  <Link
                    href="/nguoi-ban"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                    Tổng quan
                  </Link>
                </li>

                <li>
                  <Link
                    href="/nguoi-ban/tin-dang"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Quản lý tin đăng
                  </Link>
                </li>

                <li>
                  <Link
                    href="/nguoi-ban"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Quản lý khách hàng
                  </Link>
                </li>

                <li>
                  <Link
                    href="/tin-da-luu"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                    Tin đã lưu
                  </Link>
                </li>

                <li>
                  <Link
                    href="/nguoi-ban/tai-khoan"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Môi giới chuyên nghiệp
                  </Link>
                </li>

                <li>
                  <Link
                    href="/nguoi-ban/nap-tien"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <span>Gói hội viên</span>
                      <span className="ml-2 inline-block rounded bg-red-50 px-1.5 py-0.5 text-[11px] font-bold text-primary">
                        Tiết kiệm đến -39%
                      </span>
                    </div>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/nguoi-ban/nap-tien"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Nạp tiền
                  </Link>
                </li>

                <li className="border-t border-[#e8e8e8] mt-1 pt-1">
                  <Link
                    href="/nguoi-ban/tai-khoan"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Cài đặt tài khoản
                  </Link>
                </li>

                <li>
                  <Link
                    href="/nguoi-ban/tai-khoan"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Đổi mật khẩu
                  </Link>
                </li>

                <li className="border-t border-[#e8e8e8] mt-1 pt-1">
                  <button
                    type="button"
                    onClick={() => { logout(); router.push('/'); }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Đăng xuất
                  </button>
                </li>
              </ul>
            ) : null}
          </div>
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

      {isOpen ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-[2px]"
          onClick={closeDialog}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-dialog-title"
            className="relative w-full max-w-[440px] overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeDialog}
              aria-label="Đóng dialog xác thực"
              className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>

            <div className="border-b border-slate-100 bg-[radial-gradient(circle_at_top,_rgba(224,60,49,0.14),_transparent_48%)] px-6 pt-6">
              <div className="mb-5 pr-12">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Tài khoản cá nhân
                </p>
                <h2 id="auth-dialog-title" className="text-[28px] font-bold leading-tight text-[#1f2937]">
                  {activeView === "login" ? "Đăng nhập để tiếp tục" : "Tạo tài khoản mới"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {activeView === "login"
                    ? "Theo dõi tin đã lưu, lịch sử tìm kiếm và quản lý nhu cầu bất động sản của bạn ở một nơi."
                    : "Đăng ký miễn phí để lưu tin, nhận gợi ý phù hợp và bắt đầu hành trình tìm nhà nhanh hơn."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 rounded-t-[22px] bg-slate-50 p-1.5">
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
                      className={`rounded-[18px] px-4 py-3 text-sm font-semibold transition ${isActive
                          ? "bg-white text-primary shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-5 px-6 py-6">
              {/* <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#d7dbe0] bg-white px-4 py-3 text-sm font-medium text-[#2c2c2c] transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <span className="text-base text-[#ea4335]">G</span>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#1877f2] bg-[#1877f2] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#166fe5]"
                >
                  <span className="text-base font-bold">f</span>
                  <span>Facebook</span>
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-slate-400">
                <div className="h-px flex-1 bg-slate-200" />
                <span>Hoặc</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div> */}

              <form className="space-y-4" onSubmit={handleSubmit}>
                {activeView === "register" ? (
                  <div className="space-y-2">
                    <label htmlFor="auth-name" className="text-sm font-medium text-[#2c2c2c]">
                      Họ và tên
                    </label>
                    <input
                      id="auth-name"
                      type="text"
                      placeholder="Nhập họ và tên"
                      className={inputClassName}
                      value={fields.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                    />
                  </div>
                ) : null}

                <div className="space-y-2">
                  <label htmlFor="auth-email" className="text-sm font-medium text-[#2c2c2c]">
                    Email
                  </label>
                  <input
                    id="auth-email"
                    type="email"
                    placeholder="Nhập email"
                    className={inputClassName}
                    value={fields.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="auth-password" className="text-sm font-medium text-[#2c2c2c]">
                    Mật khẩu
                  </label>
                  <input
                    id="auth-password"
                    type="password"
                    placeholder="Nhập mật khẩu"
                    className={inputClassName}
                    value={fields.password}
                    onChange={(e) => updateField("password", e.target.value)}
                  />
                </div>

                {activeView === "register" ? (
                  <div className="space-y-2">
                    <label htmlFor="auth-confirm-password" className="text-sm font-medium text-[#2c2c2c]">
                      Xác nhận mật khẩu
                    </label>
                    <input
                      id="auth-confirm-password"
                      type="password"
                      placeholder="Nhập lại mật khẩu"
                      className={inputClassName}
                      value={fields.confirmPassword}
                      onChange={(e) => updateField("confirmPassword", e.target.value)}
                    />
                  </div>
                ) : null}

                {activeView === "login" ? (
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <label className="flex items-center gap-2 text-slate-500">
                      <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" />
                      <span>Ghi nhớ đăng nhập</span>
                    </label>
                    <button type="button" className="font-medium text-primary transition hover:text-primary-hover">
                      Quên mật khẩu?
                    </button>
                  </div>
                ) : (
                  <label className="flex items-start gap-3 text-sm leading-6 text-slate-500">
                    <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" />
                    <span>
                      Tôi đồng ý với <span className="font-medium text-primary">Điều khoản sử dụng</span> và{" "}
                      <span className="font-medium text-primary">Chính sách bảo mật</span>.
                    </span>
                  </label>
                )}

                {error ? (
                  <div className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? "Đang xử lý..."
                    : activeView === "login"
                      ? "Đăng nhập"
                      : "Tạo tài khoản"}
                </button>
              </form>

              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                {activeView === "login" ? (
                  <p>
                    Chưa có tài khoản?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveView("register");
                        setError(null);
                      }}
                      className="font-semibold text-primary transition hover:text-primary-hover"
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
                      className="font-semibold text-primary transition hover:text-primary-hover"
                    >
                      Đăng nhập
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
