"use client";

import { useEffect, useState } from "react";
import { ArrowUpDown, Download, Lock, Pencil, Plus, Unlock } from "lucide-react";

import { apiUserToAdminUser, unwrapPaginated } from "@/lib/api-adapters";
import { createAdminUser, getAdminUsers, promoteToMerchant, restoreUser, softDeleteUser, updateUser, type ApiUser } from "@/services/admin";

import { type AdminUser, type AdminUserRole, type AdminUserStatus } from "../_data/types";
import { AdminHeader } from "../_components/organisms/AdminHeader";
import { StatusBadge } from "../_components/atoms/StatusBadge";
import { SearchInput } from "../_components/atoms/SearchInput";
import { ActionButton } from "../_components/atoms/ActionButton";
import { TableShell } from "../_components/molecules/TableShell";
import { EmptyState } from "../_components/atoms/EmptyState";
import { FilterBar } from "../_components/molecules/FilterBar";
import { AdminPagination } from "../_components/molecules/AdminPagination";
import { AdminPageTemplate } from "../_components/templates/AdminPageTemplate";
import { UserFormModal } from "../_components/organisms/UserFormModal";
import { downloadCsv } from "../_components/utils/csv-export";

const PAGE_SIZE = 20;

function getUserStatusTone(status: string) {
  if (status === "Đang hoạt động") return "green";
  if (status === "Chờ xác minh") return "amber";
  return "red";
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadUsers() {
      setLoading(true);
      try {
        const params: Record<string, string | number> = { page: currentPage, perPage: PAGE_SIZE };
        if (search.trim()) params.keyword = search.trim();
        const response = await getAdminUsers(params as unknown as Parameters<typeof getAdminUsers>[0]);
        const result = unwrapPaginated<ApiUser>(response, PAGE_SIZE);
        const apiUsers = result.data.map(apiUserToAdminUser);

        if (!ignore) {
          setUsers(apiUsers);
          setTotal(result.pagination.total);
          setTotalPages(result.pagination.totalPages || 1);
        }
      } catch {
        if (!ignore) {
          setUsers([]);
          setTotal(0);
          setTotalPages(1);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadUsers();
    return () => {
      ignore = true;
    };
  }, [currentPage, search]);

  const toggleLock = async (userId: string) => {
    const currentUser = users.find((user) => user.id === userId);
    if (!currentUser) return;
    const nextStatus: AdminUserStatus = currentUser.status === "Tạm khóa" ? "Đang hoạt động" : "Tạm khóa";
    setUsers((current) => current.map((user) => (user.id === userId ? { ...user, status: nextStatus } : user)));
    try {
      if (nextStatus === "Tạm khóa") {
        await softDeleteUser(userId);
      } else {
        await restoreUser(userId);
      }
    } catch {
      setUsers((current) => current.map((user) => (user.id === userId ? currentUser : user)));
    }
  };

  const handlePromote = async (userId: string) => {
    const currentUser = users.find((user) => user.id === userId);
    if (!currentUser || currentUser.roleNumber >= 3) return;

    setUsers((current) => current.map((user) =>
      user.id === userId ? { ...user, role: "Môi giới", roleNumber: 3 } : user,
    ));

    try {
      await promoteToMerchant(userId);
    } catch {
      setUsers((current) => current.map((user) => (user.id === userId ? currentUser : user)));
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleSaveUser = async (data: {
    fullName?: string;
    email?: string;
    password?: string;
    phone?: string;
    role: AdminUserRole;
    note?: string;
  }) => {
    if (editingUser) {
      await updateUser(editingUser.id, {
        role: data.role === "Admin" ? 15 : data.role === "Biên tập viên" ? 7 : data.role === "Môi giới" || data.role === "Doanh nghiệp" ? 3 : 1,
      });
      setUsers((current) =>
        current.map((user) =>
          user.id === editingUser.id ? { ...user, role: data.role, note: data.note || "" } : user
        )
      );
      setEditingUser(null);
    } else {
      const created = await createAdminUser({
        fullName: data.fullName!,
        email: data.email!,
        password: data.password!,
        phone: data.phone || undefined,
        role: data.role === "Admin" ? 15 : data.role === "Biên tập viên" ? 7 : data.role === "Môi giới" || data.role === "Doanh nghiệp" ? 3 : 1,
      });
      setUsers((current) => [apiUserToAdminUser(created), ...current]);
      setIsCreateOpen(false);
    }
  };

  const handleExportCsv = () => {
    downloadCsv(
      "admin-nguoi-dung.csv",
      ["Tên", "SĐT", "Email", "Vai trò", "Trạng thái", "Tin đăng", "Doanh thu"],
      users,
      (row) => [
        row.name,
        row.phone,
        row.email,
        row.role,
        row.status,
        String(row.listings),
        row.revenue,
      ]
    );
  };

  const header = <AdminHeader title="Quản lý người dùng" description="Quản lý tài khoản, khóa/mở khóa, đổi vai trò, nâng cấp lên môi giới." />;

  return (
    <AdminPageTemplate header={header}>
      <FilterBar
        actions={
          <>
            <ActionButton variant="secondary" icon={<Plus className="w-4 h-4" />} onClick={() => setIsCreateOpen(true)}>
              Tạo user
            </ActionButton>
            <ActionButton variant="primary" icon={<Download className="w-4 h-4" />} onClick={handleExportCsv}>
              Xuất CSV
            </ActionButton>
          </>
        }
      >
        <SearchInput
          placeholder="Tìm theo tên, SĐT, email"
          value={search}
          onChange={handleSearchChange}
          className="flex-1 min-w-[240px] max-w-md"
        />
      </FilterBar>

      <TableShell title="Danh sách người dùng" description={`Trang ${currentPage}/${totalPages} · ${total} tài khoản`}>
        {loading ? (
          <div className="p-10 text-center text-gray-500">Đang tải...</div>
        ) : users.length === 0 ? (
          <EmptyState title="Không có người dùng" description="Thử đổi từ khóa hoặc bộ lọc khác." />
        ) : (
          <>
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
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 align-top">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#e03c31] text-white flex items-center justify-center font-extrabold select-none">{user.name.charAt(0)}</div>
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
                        {user.roleNumber < 3 ? (
                          <button onClick={() => handlePromote(user.id)} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-extrabold text-gray-700 hover:bg-white hover:border-gray-300 flex items-center gap-1.5 cursor-pointer"><ArrowUpDown className="w-3.5 h-3.5" /> Nâng cấp</button>
                        ) : null}
                        <button onClick={() => setEditingUser(user)} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-extrabold text-gray-700 hover:bg-white hover:border-gray-300 flex items-center gap-1.5 cursor-pointer"><Pencil className="w-3.5 h-3.5" /> Sửa</button>
                        <button onClick={() => toggleLock(user.id)} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-extrabold text-gray-700 hover:bg-white hover:border-gray-300 flex items-center gap-1.5 cursor-pointer">{user.status === "Tạm khóa" ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />} {user.status === "Tạm khóa" ? "Mở" : "Khóa"}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <AdminPagination page={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
          </>
        )}
      </TableShell>

      <UserFormModal
        isOpen={isCreateOpen || !!editingUser}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingUser(null);
        }}
        user={editingUser}
        onSave={handleSaveUser}
      />
    </AdminPageTemplate>
  );
}
