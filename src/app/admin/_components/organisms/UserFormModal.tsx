"use client";

import { useEffect, useState } from "react";
import type { AdminUser, AdminUserRole } from "../../_data/types";
import { AdminModal } from "../molecules/AdminModal";
import { FormField } from "../molecules/FormField";
import { ActionButton } from "../atoms/ActionButton";

const roleOptions = ["Admin", "Biên tập viên", "Môi giới", "Doanh nghiệp", "Người bán"] as const;

export interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    fullName?: string;
    email?: string;
    password?: string;
    phone?: string;
    role: AdminUserRole;
    note?: string;
  }) => Promise<void>;
  user?: AdminUser | null;
}

export function UserFormModal({
  isOpen,
  onClose,
  onSave,
  user = null,
}: UserFormModalProps) {
  const isEdit = !!user;
  
  // Create mode fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  
  // Shared & Edit mode fields
  const [role, setRole] = useState<AdminUserRole>("Người bán");
  const [note, setNote] = useState("");
  
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (user) {
        setRole(user.role);
        setNote(user.note || "");
        setFullName("");
        setEmail("");
        setPassword("");
        setPhone("");
      } else {
        setFullName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setRole("Người bán");
        setNote("");
      }
      setErrorMsg("");
      setIsSubmitting(false);
    }
  }, [isOpen, user]);

  const handleSubmit = async () => {
    if (!isEdit) {
      if (!fullName.trim() || !email.trim() || password.length < 8) {
        setErrorMsg("Vui lòng nhập tên, email và mật khẩu tối thiểu 8 ký tự.");
        return;
      }
    }
    
    setErrorMsg("");
    setIsSubmitting(true);
    try {
      if (isEdit) {
        await onSave({
          role,
          note,
        });
      } else {
        await onSave({
          fullName,
          email,
          password,
          phone,
          role,
        });
      }
      onClose();
    } catch (err) {
      const error = err as { message?: string };
      setErrorMsg(error.message || "Đã xảy ra lỗi, vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const footer = (
    <>
      <ActionButton variant="secondary" onClick={onClose}>
        Hủy
      </ActionButton>
      <ActionButton 
        variant="primary" 
        onClick={handleSubmit} 
        disabled={isSubmitting}
      >
        {isSubmitting 
          ? (isEdit ? "Đang lưu..." : "Đang tạo...") 
          : (isEdit ? "Lưu thay đổi" : "Tạo người dùng")}
      </ActionButton>
    </>
  );

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Sửa nhanh người dùng" : "Tạo người dùng"}
      footer={footer}
      size="sm"
    >
      <div className="space-y-4">
        {errorMsg && (
          <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-bold text-[#e03c31]">
            {errorMsg}
          </div>
        )}

        {isEdit ? (
          <div className="-mx-5 -mt-5 px-5 py-3 border-b border-gray-100 text-sm mb-4 bg-gray-50/50">
            <span className="text-gray-500">Tài khoản: </span>
            <span className="font-bold text-gray-900">{user.name}</span>
          </div>
        ) : (
          <>
            <FormField label="Họ tên *">
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-200 px-3 font-bold outline-none focus:border-[#e03c31] text-sm bg-white"
              />
            </FormField>

            <FormField label="Email *">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-200 px-3 font-bold outline-none focus:border-[#e03c31] text-sm bg-white"
              />
            </FormField>

            <FormField label="Mật khẩu *">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-200 px-3 font-bold outline-none focus:border-[#e03c31] text-sm bg-white"
                placeholder="Tối thiểu 8 ký tự"
              />
            </FormField>

            <FormField label="Số điện thoại">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-200 px-3 font-bold outline-none focus:border-[#e03c31] text-sm bg-white"
              />
            </FormField>
          </>
        )}

        <FormField label="Vai trò">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as AdminUserRole)}
            className="w-full h-11 rounded-lg border border-gray-200 px-3 font-bold outline-none focus:border-[#e03c31] text-sm bg-white"
          >
            {roleOptions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </FormField>

        {isEdit && (
          <FormField label="Ghi chú">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-gray-200 px-3 py-3 font-medium outline-none focus:border-[#e03c31] resize-none text-sm bg-white"
            />
          </FormField>
        )}
      </div>
    </AdminModal>
  );
}
