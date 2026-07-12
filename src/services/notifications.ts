import { api } from "@/lib/api";

export type UserNotificationType =
  | "system"
  | "approved"
  | "rejected"
  | "new_lead"
  | "expiring"
  | "project_update";

export interface UserNotification {
  id: string;
  title: string;
  body: string;
  type: UserNotificationType;
  refType?: string | null;
  refId?: string | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
}

export async function listNotifications(): Promise<UserNotification[]> {
  return api.get<UserNotification[]>("/notifications?perPage=50", { cache: "no-store" });
}

export async function getUnreadCount(): Promise<number> {
  const res = await api.get<{ count: number }>("/notifications/unread-count", { cache: "no-store" });
  return res.count;
}

export async function markNotificationRead(id: string): Promise<void> {
  await api.patch(`/notifications/${id}/read`);
}
