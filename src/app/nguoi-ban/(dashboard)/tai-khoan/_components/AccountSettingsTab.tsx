import React from "react";

interface AccountSettingsTabProps {
  passwordForm: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  setPasswordForm: React.Dispatch<
    React.SetStateAction<{
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }>
  >;
  isChangingPassword: boolean;
  handlePasswordChange: () => Promise<void>;
}

export function AccountSettingsTab({
  passwordForm,
  setPasswordForm,
  isChangingPassword,
  handlePasswordChange,
}: AccountSettingsTabProps) {
  return (
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
            type="button"
            onClick={handlePasswordChange}
            disabled={isChangingPassword}
            className="bg-primary hover:bg-[#c42c23] text-white px-8 py-3 rounded-lg font-bold text-sm transition-colors shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isChangingPassword ? "Đang đổi..." : "Đổi mật khẩu"}
          </button>
        </div>
      </section>
    </div>
  );
}
