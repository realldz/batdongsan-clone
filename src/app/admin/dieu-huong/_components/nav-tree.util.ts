import type { AdminNavItem } from "@/services/navigation";

export interface DisplayRow {
  item: AdminNavItem;
  isChild: boolean;
  isFirst: boolean;
  isLast: boolean;
}

/**
 * Flatten nav items into display order: each top-level parent (sorted by
 * sortOrder) followed by its children (sorted by sortOrder). isFirst/isLast
 * mark position within the item's own sibling group for move-button state.
 */
export function buildDisplayRows(items: AdminNavItem[]): DisplayRow[] {
  const byOrder = (a: AdminNavItem, b: AdminNavItem) => a.sortOrder - b.sortOrder;
  const parents = items.filter((i) => !i.parentId).sort(byOrder);
  const childrenOf = (parentId: string) =>
    items.filter((i) => i.parentId === parentId).sort(byOrder);

  const rows: DisplayRow[] = [];
  parents.forEach((parent, pIdx) => {
    rows.push({
      item: parent,
      isChild: false,
      isFirst: pIdx === 0,
      isLast: pIdx === parents.length - 1,
    });
    const children = childrenOf(parent.id);
    children.forEach((child, cIdx) => {
      rows.push({
        item: child,
        isChild: true,
        isFirst: cIdx === 0,
        isLast: cIdx === children.length - 1,
      });
    });
  });
  return rows;
}

/** Return the ordered sibling group an item belongs to (top-level or same parent). */
export function siblingsOf(items: AdminNavItem[], item: AdminNavItem): AdminNavItem[] {
  return items
    .filter((i) => (i.parentId ?? null) === (item.parentId ?? null))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
