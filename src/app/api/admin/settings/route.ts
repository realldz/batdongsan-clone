import { adminSettings } from "@/app/admin/_data/mock";
import { handlePaginatedMockRequest } from "@/lib/api-helpers";

export async function GET(request: Request) {
  return handlePaginatedMockRequest(request, adminSettings, (data) => ({
    total: data.length,
    active: data.filter((s) => s.status === "Đang áp dụng").length,
    checking: data.filter((s) => s.status === "Cần kiểm tra").length,
  }));
}
