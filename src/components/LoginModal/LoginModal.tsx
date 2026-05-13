"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-store";
import { ApiError } from "@/lib/api";

export function LoginModal({
  onSuccess,
  onClose,
}: {
  onSuccess: (name: string, phone: string) => void;
  onClose: () => void;
}) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      const userRaw = localStorage.getItem("user");
      const user = userRaw ? JSON.parse(userRaw) : null;
      onSuccess(user?.fullName ?? "", user?.phone ?? "");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
        <h3 className="text-lg font-bold text-[#2c2c2c] mb-1 mt-2">Đăng nhập để xem số</h3>
        <p className="text-sm text-gray-500 mb-4">Đăng nhập để gửi thông tin liên hệ và xem số điện thoại</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="login-modal-email" className="text-sm font-medium text-[#2c2c2c]">
              Email
            </label>
            <input
              id="login-modal-email"
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#e03c31] focus:ring-2 focus:ring-red-100"
            />
          </div>
          <div>
            <label htmlFor="login-modal-password" className="text-sm font-medium text-[#2c2c2c]">
              Mật khẩu
            </label>
            <input
              id="login-modal-password"
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#e03c31] focus:ring-2 focus:ring-red-100"
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#e03c31] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#c62828] disabled:opacity-60 transition-colors"
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>
        <button
          onClick={onClose}
          className="mt-3 w-full text-sm text-gray-500 hover:text-gray-700"
        >
          Để sau
        </button>
      </div>
    </div>
  );
}
