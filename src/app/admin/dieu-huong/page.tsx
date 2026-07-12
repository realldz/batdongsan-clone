"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { AdminPageTemplate } from "../_components/templates/AdminPageTemplate";
import { AdminHeader } from "../_components/organisms/AdminHeader";
import { TableShell } from "../_components/molecules/TableShell";
import {
  getAdminNav,
  deleteNavItem,
  updateNavItem,
  reorderNav,
  type AdminNavItem,
} from "@/services/navigation";
import { toast } from "sonner";
import { NavItemFormModal } from "./_components/organisms/NavItemFormModal";
import { NavItemRow } from "./_components/organisms/NavItemRow";
import { buildDisplayRows, siblingsOf } from "./_components/nav-tree.util";

export default function AdminNavigationPage() {
  const [items, setItems] = useState<AdminNavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminNavItem | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      try {
        const data = await getAdminNav();
        if (!ignore) setItems(data);
      } catch {
        if (!ignore) toast.error("Không tải được danh sách điều hướng");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  const rows = useMemo(() => buildDisplayRows(items), [items]);
  const parentOptions = useMemo(
    () =>
      items
        .filter((i) => !i.parentId)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((i) => ({ id: i.id, label: i.label })),
    [items],
  );

  const refresh = () => setRefreshKey((k) => k + 1);

  const handleAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (item: AdminNavItem) => {
    setEditing(item);
    setModalOpen(true);
  };

  const handleToggle = async (item: AdminNavItem) => {
    try {
      await updateNavItem(item.id, { isActive: !item.isActive });
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isActive: !i.isActive } : i)),
      );
    } catch {
      toast.error("Không cập nhật được trạng thái");
    }
  };

  const handleDelete = async (item: AdminNavItem) => {
    const hasChildren = items.some((i) => i.parentId === item.id);
    const msg = hasChildren
      ? `Xóa "${item.label}" và toàn bộ mục con?`
      : `Xóa "${item.label}"?`;
    if (!confirm(msg)) return;
    try {
      await deleteNavItem(item.id);
      toast.success("Đã xóa mục điều hướng");
      refresh();
    } catch {
      toast.error("Không xóa được mục điều hướng");
    }
  };

  // Swap the item with its adjacent sibling, then persist both sortOrders.
  const handleMove = async (item: AdminNavItem, dir: -1 | 1) => {
    const siblings = siblingsOf(items, item);
    const idx = siblings.findIndex((s) => s.id === item.id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= siblings.length) return;

    const other = siblings[swapIdx];
    const entries = [
      { id: item.id, sortOrder: other.sortOrder },
      { id: other.id, sortOrder: item.sortOrder },
    ];

    setItems((prev) =>
      prev.map((i) => {
        if (i.id === item.id) return { ...i, sortOrder: other.sortOrder };
        if (i.id === other.id) return { ...i, sortOrder: item.sortOrder };
        return i;
      }),
    );

    try {
      await reorderNav(entries);
    } catch {
      toast.error("Không lưu được thứ tự");
      refresh();
    }
  };

  const header = (
    <AdminHeader
      title="Quản lý điều hướng"
      description="Cấu hình các mục menu hiển thị trên thanh điều hướng của trang người dùng."
      actions={
        <button
          onClick={handleAdd}
          className="h-10 px-4 rounded-full bg-[#e03c31] text-white text-sm font-bold hover:bg-[#c9362c] transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Thêm mục
        </button>
      }
    />
  );

  return (
    <AdminPageTemplate header={header}>
      <TableShell
        title="Mục điều hướng"
        description={loading ? "Đang tải..." : `${items.length} mục`}
      >
        <div className="min-w-[720px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Mục / Đường dẫn</th>
                <th className="px-4 py-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-4 py-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Tab</th>
                <th className="px-4 py-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-[13px] text-gray-400">
                    Chưa có mục điều hướng nào.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <NavItemRow
                    key={row.item.id}
                    item={row.item}
                    isChild={row.isChild}
                    isFirst={row.isFirst}
                    isLast={row.isLast}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                    onMove={handleMove}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </TableShell>

      <NavItemFormModal
        isOpen={modalOpen}
        initialData={editing}
        parentOptions={parentOptions}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          refresh();
        }}
      />
    </AdminPageTemplate>
  );
}
