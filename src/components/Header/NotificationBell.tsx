"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useAuth } from "@/lib/auth-store";
import { useNotifications } from "@/lib/notifications-store";
import { Dropdown } from "@/components/molecules";
import { formatDate } from "@/lib/formatters/date";
import type { UserNotification } from "@/services/notifications";

function NotificationItem({
  notification,
  onRead,
}: {
  notification: UserNotification;
  onRead: (id: string) => void;
}) {
  const content = (
    <div
      className={`px-4 py-3 text-sm transition-colors hover:bg-gray-50 ${
        notification.isRead ? "" : "bg-red-50/60"
      }`}
    >
      <p className="font-semibold text-gray-900">{notification.title}</p>
      <p className="mt-0.5 text-gray-600 line-clamp-2">{notification.body}</p>
      <p className="mt-1 text-xs text-gray-400">{formatDate(notification.createdAt)}</p>
    </div>
  );

  const handleClick = () => onRead(notification.id);

  if (notification.refType === "property" && notification.refId) {
    return (
      <Link href={`/properties/${notification.refId}`} onClick={handleClick} className="block">
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={handleClick} className="block w-full text-left cursor-pointer">
      {content}
    </button>
  );
}

export function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();

  if (!isAuthenticated) return null;

  return (
    <Dropdown
      trigger={
        <button
          type="button"
          className="relative rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          <Bell className="h-5 w-5 stroke-[1.5]" />
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      }
      align="right"
      panelClassName="w-80 max-h-96 overflow-y-auto py-0"
    >
      {notifications.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-gray-500">Không có thông báo mới</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {notifications.map((n) => (
            <li key={n.id}>
              <NotificationItem notification={n} onRead={markAsRead} />
            </li>
          ))}
        </ul>
      )}
    </Dropdown>
  );
}
