"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  createSearchAlert,
  deleteSearchAlert,
  listSearchAlerts,
  updateSearchAlert,
  type CreateSearchAlertRequest,
  type SearchAlert,
  type UpdateSearchAlertRequest,
} from "@/services/search-alerts";

interface UseSearchAlertsResult {
  alerts: SearchAlert[];
  loading: boolean;
  submitting: boolean;
  refresh: () => Promise<void>;
  create: (data: CreateSearchAlertRequest) => Promise<boolean>;
  update: (id: string, data: UpdateSearchAlertRequest) => Promise<boolean>;
  remove: (id: string) => Promise<void>;
  toggleActive: (id: string, isActive: boolean) => Promise<void>;
}

export function useSearchAlerts(): UseSearchAlertsResult {
  const [alerts, setAlerts] = useState<SearchAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const data = await listSearchAlerts();
      setAlerts(data);
    } catch (error) {
      console.error("Failed to load search alerts", error);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const data = await listSearchAlerts();
        if (!ignore) setAlerts(data);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const create = useCallback(
    async (data: CreateSearchAlertRequest): Promise<boolean> => {
      setSubmitting(true);
      try {
        await createSearchAlert(data);
        toast.success("Đã lưu tìm kiếm.");
        await refresh();
        return true;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Không thể lưu tìm kiếm.");
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [refresh],
  );

  const update = useCallback(
    async (id: string, data: UpdateSearchAlertRequest): Promise<boolean> => {
      setSubmitting(true);
      try {
        await updateSearchAlert(id, data);
        toast.success("Đã cập nhật tìm kiếm.");
        await refresh();
        return true;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Không thể cập nhật tìm kiếm.");
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      setSubmitting(true);
      try {
        await deleteSearchAlert(id);
        toast.success("Đã xóa tìm kiếm đã lưu.");
        await refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Không thể xóa.");
      } finally {
        setSubmitting(false);
      }
    },
    [refresh],
  );

  const toggleActive = useCallback(
    async (id: string, isActive: boolean) => {
      try {
        await updateSearchAlert(id, { isActive });
        toast.success(isActive ? "Đã bật lại cảnh báo." : "Đã tạm dừng cảnh báo.");
        await refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Không thể cập nhật trạng thái.");
      }
    },
    [refresh],
  );

  return { alerts, loading, submitting, refresh, create, update, remove, toggleActive };
}
