"use client";

import { AdminHeader } from "../_components/AdminHeader";
import { AdminTableShell, EmptyState, StatusBadge } from "../_components/AdminUi";
import { adminUsers, type AdminUser, type AdminUserRole, type AdminUserStatus } from "../_data/mock";
import { apiUserToAdminUser, mapAdminRoleToApiRole, unwrapArray } from "@/lib/api-adapters";
import { createAdminUser, getAdminUsers, restoreUser, softDeleteUser, updateUser, type ApiUser } from "@/services/admin";
import { Download, Lock, Pencil, Plus, Search, Unlock, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const roleOptions = ["Admin", "Biên tập viên", "Môi giới", "Doanh nghiệp", "Người bán"] as const;
const statusOptions = ["Tất cả", "Đang hoạt động", "Tạm khóa", "Chờ xác minh"] as const;

const initialCreateDraft = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  role: "Người bán" as AdminUserRole,
};

function getUserStatusTone(status: AdminUserStatus) {
  if (status === "Đang hoạt động") {
    return "green";
  }

  if (status === "Chờ xác minh") {
    return "amber";
  }

  return "red";
}

function downloadCsv(rows: AdminUser[]) {
  const header = ["Tên", "SĐT", "Email", "Vai trò", "Trạng thái", "Tin đăng", "Doanh thu"];
  const csvRows = rows.map((row) => [row.name, row.phone, row.email, row.role, row.status, String(row.listings), row.revenue]);
  const csv = [header, ...csvRows].map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "admin-nguoi-dung.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState(adminUsers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>("Tất cả");
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [draftRole, setDraftRole] = useState<AdminUserRole>("Người bán");
  const [draftNote, setDraftNote] = useState("");
  const [dataSource, setDataSource] = useState("mock");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createDraft, setCreateDraft] = useState(initialCreateDraft);
  const [createMessage, setCreateMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadUsers() {
      try {
        const response = await getAdminUsers({ page: 1, perPage: 100 });
        const apiUsers = unwrapArray<ApiUser>(response).map(apiUserToAdminUser);

        if (!ignore && apiUsers.length > 0) {
          setUsers(apiUsers);
          setDataSource("api");
        }
      } catch {
        if (!ignore) setDataSource("mock");
      }
    }

    loadUsers();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch = keyword.length === 0 || user.name.toLowerCase().includes(keyword) || user.phone.toLowerCase().includes(keyword) || user.email.toLowerCase().includes(keyword);
      const matchesStatus = statusFilter === "Tất cả" || user.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  const openEdit = (user: AdminUser) => {
    setEditingUser(user);
    setDraftRole(user.role);
    setDraftNote(user.note);
  };

  const saveEdit = async () => {
    if (!editingUser) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (dataSource === "api") {
        await updateUser(editingUser.id, { role: mapAdminRoleToApiRole(draftRole) });
      }

      setUsers((current) => current.map((user) => (user.id === editingUser.id ? { ...user, role: draftRole, note: draftNote } : user)));
      setEditingUser(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLock = async (userId: string) => {
    const currentUser = users.find((user) => user.id === userId);
    const nextStatus: AdminUserStatus = currentUser?.status === "Tạm khóa" ? "Đang hoạt động" : "Tạm khóa";

    setUsers((current) => current.map((user) => (user.id === userId ? { ...user, status: nextStatus } : user)));

    if (dataSource !== "api") {
      return;
    }

    try {
      if (nextStatus === "Tạm khóa") {
        await softDeleteUser(userId);
      } else {
        await restoreUser(userId);
      }
    } catch {
      setUsers((current) => current.map((user) => (user.id === userId && currentUser ? currentUser : user)));
    }
  };

  const createUser = async () => {
    if (!createDraft.fullName || !createDraft.email || createDraft.password.length < 8) {
      setCreateMessage("Vui lòng nhập tên, email và mật khẩu tối thiểu 8 ký tự.");
      return;
    }

    setIsSubmitting(true);
    setCreateMessage("");

    try {
      const created = await createAdminUser({
        fullName: createDraft.fullName,
        email: createDraft.email,
        password: createDraft.password,
        phone: createDraft.phone || undefined,
        role: mapAdminRoleToApiRole(createDraft.role),
      });
      setUsers((current) => [apiUserToAdminUser(created), ...current]);
      setCreateDraft(initialCreateDraft);
      setIsCreateOpen(false);
    } catch {
      setCreateMessage("Chưa thể tạo người dùng, vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AdminHeader title="Quản lý người dùng" description={`Quản lý tài khoản, khóa/mở khóa, đổi vai trò và xuất báo cáo (${dataSource === "api" ? "API" : "mock"}).`} />
      <main className="flex-1 overflow-y-auto p-5 lg:p-7 space-y-5 pb-12">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5"><div className="text-sm font-bold text-gray-500 mb-2">Tổng tài khoản</div><div className="text-3xl font-extrabold text-gray-900">{users.length}</div></div>
          <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5"><div className="text-sm font-bold text-gray-500 mb-2">Đang hoạt động</div><div className="text-3xl font-extrabold text-gray-900">{users.filter((user) => user.status === "Đang hoạt động").length}</div></div>
          <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5"><div className="text-sm font-bold text-gray-500 mb-2">Cần xử lý</div><div className="text-3xl font-extrabold text-gray-900">{users.filter((user) => user.status !== "Đang hoạt động").length}</div></div>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-[420px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm theo tên, SĐT, email" className="w-full h-11 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm font-medium outline-none focus:border-[#e03c31] focus:bg-white" />
          </div>
          <div className="flex flex-wrap gap-3">
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as (typeof statusOptions)[number])} className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm font-bold text-gray-700 outline-none focus:border-[#e03c31]">
              {statusOptions.map((status) => <option key={status}>{status}</option>)}
            </select>
            <button onClick={() => setIsCreateOpen(true)} className="h-11 rounded-lg border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"><Plus className="w-4 h-4" /> Tạo user</button>
            <button onClick={() => downloadCsv(filteredUsers)} className="h-11 rounded-lg bg-gray-900 px-4 text-white text-sm font-bold hover:bg-black transition-colors flex items-center gap-2"><Download className="w-4 h-4" /> Xuất CSV</button>
          </div>
        </section>

        <AdminTableShell title="Danh sách người dùng" description={`${filteredUsers.length} tài khoản phù hợp bộ lọc hiện tại`}>
          {filteredUsers.length === 0 ? (
            <EmptyState title="Không có người dùng" description="Thử đổi từ khóa hoặc bộ lọc khác." />
          ) : (
            <table className="w-full min-w-[1040px] text-left">
              <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500 font-extrabold">
                <tr>
                  <th className="px-5 py-3">Người dùng</th>
                  <th className="px-5 py-3">Liên hệ</th>
                  <th className="px-5 py-3">Vai trò</th>
                  <th className="px-5 py-3">Hiệu suất</th>
                  <th className="px-5 py-3">Trạng thái</th>
                  <th className="px-5 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 align-top">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#e03c31] text-white flex items-center justify-center font-extrabold">{user.name.charAt(0)}</div>
                        <div>
                          <div className="font-extrabold text-gray-900">{user.name}</div>
                          <div className="text-xs font-medium text-gray-500 mt-1">Tham gia {user.joinedAt}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><div className="font-bold text-gray-800">{user.phone}</div><div className="text-xs font-medium text-gray-500 mt-1">{user.email}</div></td>
                    <td className="px-5 py-4 font-bold text-gray-700">{user.role}</td>
                    <td className="px-5 py-4"><div className="font-extrabold text-gray-900">{user.listings} tin</div><div className="text-xs font-medium text-gray-500 mt-1">{user.revenue}</div></td>
                    <td className="px-5 py-4"><StatusBadge tone={getUserStatusTone(user.status)}>{user.status}</StatusBadge></td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(user)} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-extrabold text-gray-700 hover:bg-white hover:border-gray-300 flex items-center gap-1.5"><Pencil className="w-3.5 h-3.5" /> Sửa</button>
                        <button onClick={() => toggleLock(user.id)} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-extrabold text-gray-700 hover:bg-white hover:border-gray-300 flex items-center gap-1.5">{user.status === "Tạm khóa" ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />} {user.status === "Tạm khóa" ? "Mở" : "Khóa"}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </AdminTableShell>
      </main>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="w-full max-w-[560px] rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div><h2 className="text-lg font-extrabold text-gray-900">Tạo người dùng</h2><p className="text-xs font-medium text-gray-500 mt-1">Tạo tài khoản bằng Admin API</p></div>
              <button onClick={() => setIsCreateOpen(false)} className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              {createMessage && <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-bold text-[#e03c31]">{createMessage}</div>}
              <label className="block">
                <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Họ tên</span>
                <input value={createDraft.fullName} onChange={(event) => setCreateDraft((current) => ({ ...current, fullName: event.target.value }))} className="mt-2 w-full h-11 rounded-lg border border-gray-200 px-3 font-bold outline-none focus:border-[#e03c31]" />
              </label>
              <label className="block">
                <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Email</span>
                <input type="email" value={createDraft.email} onChange={(event) => setCreateDraft((current) => ({ ...current, email: event.target.value }))} className="mt-2 w-full h-11 rounded-lg border border-gray-200 px-3 font-bold outline-none focus:border-[#e03c31]" />
              </label>
              <label className="block">
                <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Mật khẩu</span>
                <input type="password" value={createDraft.password} onChange={(event) => setCreateDraft((current) => ({ ...current, password: event.target.value }))} className="mt-2 w-full h-11 rounded-lg border border-gray-200 px-3 font-bold outline-none focus:border-[#e03c31]" />
              </label>
              <label className="block">
                <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Số điện thoại</span>
                <input value={createDraft.phone} onChange={(event) => setCreateDraft((current) => ({ ...current, phone: event.target.value }))} className="mt-2 w-full h-11 rounded-lg border border-gray-200 px-3 font-bold outline-none focus:border-[#e03c31]" />
              </label>
              <label className="block">
                <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Vai trò</span>
                <select value={createDraft.role} onChange={(event) => setCreateDraft((current) => ({ ...current, role: event.target.value as AdminUserRole }))} className="mt-2 w-full h-11 rounded-lg border border-gray-200 px-3 font-bold outline-none focus:border-[#e03c31]">
                  {roleOptions.map((role) => <option key={role}>{role}</option>)}
                </select>
              </label>
            </div>
            <div className="px-5 py-4 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setIsCreateOpen(false)} className="h-10 px-4 rounded-lg border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50">Hủy</button>
              <button onClick={createUser} disabled={isSubmitting} className="h-10 px-4 rounded-lg bg-[#e03c31] text-white text-sm font-extrabold hover:bg-[#c43329] disabled:opacity-60 disabled:cursor-not-allowed">{isSubmitting ? "Đang tạo..." : "Tạo user"}</button>
            </div>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="w-full max-w-[520px] rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div><h2 className="text-lg font-extrabold text-gray-900">Sửa nhanh người dùng</h2><p className="text-xs font-medium text-gray-500 mt-1">{editingUser.name}</p></div>
              <button onClick={() => setEditingUser(null)} className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <label className="block">
                <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Vai trò</span>
                <select value={draftRole} onChange={(event) => setDraftRole(event.target.value as AdminUserRole)} className="mt-2 w-full h-11 rounded-lg border border-gray-200 px-3 font-bold outline-none focus:border-[#e03c31]">
                  {roleOptions.map((role) => <option key={role}>{role}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Ghi chú</span>
                <textarea value={draftNote} onChange={(event) => setDraftNote(event.target.value)} rows={4} className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-3 font-medium outline-none focus:border-[#e03c31] resize-none" />
              </label>
            </div>
            <div className="px-5 py-4 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setEditingUser(null)} className="h-10 px-4 rounded-lg border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50">Hủy</button>
              <button onClick={saveEdit} disabled={isSubmitting} className="h-10 px-4 rounded-lg bg-[#e03c31] text-white text-sm font-extrabold hover:bg-[#c43329] disabled:opacity-60 disabled:cursor-not-allowed">{isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
