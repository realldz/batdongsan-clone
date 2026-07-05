import { adminEnterprises } from "@/app/admin/_data/mock";
import { handlePaginatedMockRequest } from "@/lib/api-helpers";

export async function GET(request: Request) {
  return handlePaginatedMockRequest(request, adminEnterprises, (data) => ({
    total: data.length,
    paidPlans: data.filter((e) => e.plan !== "Cơ bản").length,
    totalListings: data.reduce((sum, e) => sum + e.listings, 0),
  }));
}
