import { CheckCircle2, Crown, XCircle } from "lucide-react";
import { type Subscription, tierLabelFromNumeric } from "@/services/subscriptions";

interface ActiveSubscriptionCardProps {
  subscription: Subscription;
  submitting: boolean;
  onCancel: (id: string) => void;
  onReactivate: (id: string) => void;
}

const STATUS_META: Record<string, { label: string; className: string }> = {
  active: { label: "Đang hoạt động", className: "bg-green-100 text-green-700" },
  cancelled: { label: "Đã tắt gia hạn", className: "bg-amber-100 text-amber-700" },
  expired: { label: "Đã hết hạn", className: "bg-gray-100 text-gray-600" },
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function ActiveSubscriptionCard({
  subscription,
  submitting,
  onCancel,
  onReactivate,
}: ActiveSubscriptionCardProps) {
  const status = STATUS_META[subscription.status] ?? STATUS_META.active;
  const isActive = subscription.status === "active";
  const canReactivate =
    subscription.status === "cancelled" || subscription.status === "expired";

  return (
    <div className="rounded-xl border border-red-100 bg-[linear-gradient(135deg,#fff7f6_0%,#fff_60%,#fff3f1_100%)] p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-sm text-[#e03c31]">
            <Crown className="h-6 w-6" />
          </div>
          <div>
            <div className="mb-1 flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-gray-900">
                {tierLabelFromNumeric(subscription.tier)}
              </h3>
              <span
                className={`rounded px-2 py-0.5 text-[11px] font-bold ${status.className}`}
              >
                {status.label}
              </span>
            </div>
            <p className="text-[13px] font-medium text-gray-600">
              Hết hạn: <b className="text-gray-900">{formatDate(subscription.expiredAt)}</b>
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[12px] font-medium text-gray-500">
              {subscription.autoRenew ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  Tự động gia hạn hàng tháng
                </>
              ) : (
                <>
                  <XCircle className="h-3.5 w-3.5 text-gray-400" />
                  Không tự động gia hạn
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-3">
          {isActive && subscription.autoRenew && (
            <button
              onClick={() => onCancel(subscription.id)}
              disabled={submitting}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-[13px] font-bold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Tắt gia hạn
            </button>
          )}
          {canReactivate && (
            <button
              onClick={() => onReactivate(subscription.id)}
              disabled={submitting}
              className="rounded-lg border border-[#e03c31] bg-[#e03c31] px-4 py-2 text-[13px] font-bold text-white transition-colors hover:bg-[#c9362c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Kích hoạt lại
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
