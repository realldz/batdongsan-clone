"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PublicPageLayout } from "@/components/templates";
import { Button, Icon } from "@/components/atoms";
import { useSearchAlerts } from "./_hooks/use-search-alerts";
import { SearchAlertCard } from "./_components/organisms/SearchAlertCard";
import { SearchAlertFormModal } from "./_components/organisms/SearchAlertFormModal";
import type { SearchAlert } from "@/services/search-alerts";

export default function TimKiemDaLuuPage() {
  const { alerts, loading, submitting, create, update, remove, toggleActive } = useSearchAlerts();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SearchAlert | null>(null);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (alert: SearchAlert) => {
    setEditing(alert);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Xóa tìm kiếm đã lưu này? Bạn sẽ không nhận thông báo cho tiêu chí này nữa.")) {
      remove(id);
    }
  };

  const handleSubmit = (data: Parameters<typeof create>[0]) =>
    editing ? update(editing.id, data) : create(data);

  return (
    <PublicPageLayout className="bg-[#f1f5f9] py-6">
      <div className="max-w-[1240px] mx-auto px-4 lg:px-0">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#2c2c2c] mb-1">Tìm kiếm đã lưu</h1>
            <p className="text-sm text-gray-500">
              Nhận thông báo ngay khi có tin đăng mới phù hợp với tiêu chí của bạn
            </p>
          </div>
          <Button onClick={openCreate} leftIcon={<Plus className="h-4 w-4" />}>
            Tạo tìm kiếm
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-white border border-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-100 rounded-xl shadow-sm">
            <div className="mb-4">
              <Icon name="Search" size={64} className="mx-auto text-gray-300" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Chưa có tìm kiếm nào được lưu</h2>
            <p className="text-gray-500 mb-6">
              Lưu tiêu chí tìm kiếm để được thông báo ngay khi có tin đăng mới phù hợp.
            </p>
            <Button onClick={openCreate}>Tạo tìm kiếm đầu tiên</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <SearchAlertCard
                key={alert.id}
                alert={alert}
                onEdit={openEdit}
                onDelete={handleDelete}
                onToggleActive={toggleActive}
              />
            ))}
          </div>
        )}
      </div>

      <SearchAlertFormModal
        isOpen={modalOpen}
        editing={editing}
        submitting={submitting}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </PublicPageLayout>
  );
}
