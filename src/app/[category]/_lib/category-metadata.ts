import { CATEGORIES_BY_SLUG } from "@/config/categories";

export function getTypeLabel(type: string | undefined): { breadcrumb: string; title: string } {
  if (type === "sale") return { breadcrumb: "Bán", title: "Mua bán" };
  if (type === "rent") return { breadcrumb: "Cho thuê", title: "Cho thuê" };
  return { breadcrumb: "Bán", title: "Mua bán" };
}

export function resolveCategoryMeta(category: string): { defaultType: "sale" | "rent"; categoryLabel: string } {
  const config = CATEGORIES_BY_SLUG[category] as (typeof CATEGORIES_BY_SLUG)[string] | undefined;

  if (category === "nha-dat") {
    return { defaultType: "sale", categoryLabel: "Nhà đất" };
  }

  const defaultType = config?.type ?? (category.startsWith("ban-") ? "sale" : category.startsWith("thue-") ? "rent" : "sale");
  const categoryLabel = config?.label ?? category.replace(/^(ban|thue)-/, "").replace(/-/g, " ");
  return { defaultType, categoryLabel };
}
