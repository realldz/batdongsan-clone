import type { PaginatedResult } from "@/types";

export function unwrapArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const candidates = [record.data, record.items, record.results, record.docs];
    const found = candidates.find(Array.isArray);
    if (found) return found as T[];
  }

  return [];
}

export function unwrapPaginated<T>(value: unknown, fallbackPerPage = 10): PaginatedResult<T> {
  if (Array.isArray(value)) {
    const record = value as unknown as Record<string, unknown>;
    if (record.meta && typeof record.meta === "object") {
      const meta = record.meta as Record<string, unknown>;
      const total = typeof meta.total === "number" ? meta.total : (value as T[]).length;
      const page = typeof meta.page === "number" ? meta.page : 1;
      const perPage = typeof meta.perPage === "number" ? meta.perPage : typeof meta.per_page === "number" ? meta.per_page : fallbackPerPage;
      const totalPages = typeof meta.totalPages === "number" ? meta.totalPages : perPage > 0 ? Math.ceil(total / perPage) : 1;
      return { data: value as T[], pagination: { page, totalPages, total, perPage } };
    }
    return { data: value as T[], pagination: { page: 1, totalPages: 1, total: (value as T[]).length, perPage: (value as T[]).length } };
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const getNum = (key: string, fallback: number) => {
      const v = record[key];
      return typeof v === "number" ? v : fallback;
    };

    const total = getNum("total", 0);
    const page = getNum("page", 1);
    const perPage = getNum("perPage", fallbackPerPage) || getNum("per_page", fallbackPerPage);
    const totalPages = perPage > 0 ? Math.ceil(total / perPage) : 1;

    const data = (Array.isArray(record.data) ? record.data : Array.isArray(record.items) ? record.items : Array.isArray(record.results) ? record.results : Array.isArray(record.docs) ? record.docs : []) as T[];

    if (record.meta && typeof record.meta === "object") {
      const meta = record.meta as Record<string, unknown>;
      const metaTotal = typeof meta.total === "number" ? meta.total : total;
      const metaPage = typeof meta.page === "number" ? meta.page : page;
      const metaPerPage = typeof meta.perPage === "number" ? meta.perPage : typeof meta.per_page === "number" ? meta.per_page : perPage;
      return { data, pagination: { page: metaPage, totalPages: metaPerPage > 0 ? Math.ceil(metaTotal / metaPerPage) : 1, total: metaTotal, perPage: metaPerPage } };
    }

    return { data, pagination: { page, totalPages, total, perPage } };
  }

  return { data: [], pagination: { page: 1, totalPages: 0, total: 0, perPage: fallbackPerPage } };
}
