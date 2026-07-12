"use client";

import { useEffect, useState } from "react";
import { Loader2, Edit, CheckCircle2, XCircle } from "lucide-react";
import { AdminPageTemplate } from "../_components/templates/AdminPageTemplate";
import { AdminHeader } from "../_components/organisms/AdminHeader";
import { TableShell } from "../_components/molecules/TableShell";
import { SEO_PAGES } from "@/lib/seo-pages.constant";
import { getSeoConfig, type SeoConfig } from "@/services/seo";
import { SeoFormModal } from "./_components/organisms/SeoFormModal";

interface Selected {
  page: string;
  label: string;
  config: SeoConfig | null;
}

function isConfigured(config: SeoConfig | null): boolean {
  if (!config) return false;
  return [config.title, config.description, config.keywords, config.ogImage].some((v) => v && v.trim());
}

export default function AdminSeoPage() {
  const [configs, setConfigs] = useState<Record<string, SeoConfig | null>>({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Selected | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function fetchConfigs() {
      setLoading(true);
      try {
        const results = await Promise.all(SEO_PAGES.map((p) => getSeoConfig(p.key)));
        if (!ignore) {
          const record: Record<string, SeoConfig | null> = {};
          SEO_PAGES.forEach((p, i) => {
            record[p.key] = results[i];
          });
          setConfigs(record);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchConfigs();

    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  const handleOpenEdit = (page: string, label: string) => {
    setSelected({ page, label, config: configs[page] ?? null });
    setModalOpen(true);
  };

  const handleSuccess = () => {
    setModalOpen(false);
    setRefreshKey((k) => k + 1);
  };

  const header = (
    <AdminHeader
      title="Quản lý SEO"
      description="Chỉnh sửa tiêu đề, mô tả, từ khóa và ảnh OG cho các trang chính."
    />
  );

  return (
    <AdminPageTemplate header={header}>
      <TableShell
        title="Cấu hình SEO theo trang"
        description={loading ? "Đang tải..." : `${SEO_PAGES.length} trang`}
      >
        <div className="min-w-[800px] border border-gray-200 rounded-xl overflow-hidden bg-white mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Trang</th>
                <th className="px-4 py-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                <th className="px-4 py-3 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Trạng thái</th>
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
              ) : (
                SEO_PAGES.map(({ key, label }) => {
                  const config = configs[key] ?? null;
                  const configured = isConfigured(config);

                  return (
                    <tr key={key} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="text-[13px] font-extrabold text-gray-900">{label}</div>
                        <div className="text-[11px] text-gray-400">{key}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-[13px] font-medium text-gray-700 truncate max-w-[280px]">
                          {config?.title || "—"}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold w-fit ${
                            configured
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-gray-100 text-gray-600 border border-gray-200"
                          }`}
                        >
                          {configured ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {configured ? "Đã cấu hình" : "Chưa cấu hình"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleOpenEdit(key, label)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </TableShell>

      <SeoFormModal
        isOpen={modalOpen}
        page={selected?.page ?? ""}
        label={selected?.label ?? ""}
        initialData={selected?.config ?? null}
        onClose={() => setModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </AdminPageTemplate>
  );
}
