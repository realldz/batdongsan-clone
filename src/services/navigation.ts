import { api } from "@/lib/api";
import { getNavLinks, type NavLink, type NavSubItem } from "@/config/navigation";
import type { NavSearchFilters } from "@/config/search-filters";

export interface ApiNavSubItem {
  text: string;
  href: string;
  openInNewTab?: boolean;
}

export interface ApiNavLink {
  text: string;
  href: string;
  openInNewTab?: boolean;
  subItems?: ApiNavSubItem[];
}

function mapApiToNavLink(item: ApiNavLink): NavLink {
  const link: NavLink = { text: item.text, href: item.href || "#" };
  if (item.subItems && item.subItems.length > 0) {
    link.subItems = item.subItems.map(
      (sub): NavSubItem => ({ text: sub.text, href: sub.href || "#" }),
    );
  }
  return link;
}

/**
 * Fetch the header navigation from the API. Falls back to the hardcoded
 * `getNavLinks()` structure if the request fails so the header always renders.
 */
export async function getNavigation(): Promise<NavLink[]> {
  try {
    const data = await api.get<ApiNavLink[]>("/navigation", {
      next: { revalidate: 300 },
    });
    if (Array.isArray(data) && data.length > 0) {
      return data.map(mapApiToNavLink);
    }
    return getNavLinks();
  } catch {
    return getNavLinks();
  }
}

// ---- Admin management ----

export interface AdminNavItem {
  id: string;
  label: string;
  href: string;
  parentId?: string | null;
  sortOrder: number;
  isActive: boolean;
  openInNewTab: boolean;
  searchFilters?: NavSearchFilters | null;
}

export interface NavItemPayload {
  label: string;
  href?: string;
  parentId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
  openInNewTab?: boolean;
  searchFilters?: NavSearchFilters | null;
}

export interface ReorderEntry {
  id: string;
  sortOrder: number;
  parentId?: string | null;
}

export async function getAdminNav(): Promise<AdminNavItem[]> {
  return api.get<AdminNavItem[]>("/admin/navigation");
}

export async function createNavItem(payload: NavItemPayload): Promise<AdminNavItem> {
  return api.post<AdminNavItem>("/admin/navigation", payload);
}

export async function updateNavItem(
  id: string,
  payload: Partial<NavItemPayload>,
): Promise<AdminNavItem> {
  return api.patch<AdminNavItem>(`/admin/navigation/${id}`, payload);
}

export async function deleteNavItem(id: string): Promise<{ success: boolean }> {
  return api.delete<{ success: boolean }>(`/admin/navigation/${id}`);
}

export async function reorderNav(items: ReorderEntry[]): Promise<AdminNavItem[]> {
  return api.patch<AdminNavItem[]>("/admin/navigation/reorder", { items });
}
