import { adminAgents } from "@/app/admin/_data/mock";
import { handlePaginatedMockRequest } from "@/lib/api-helpers";

export async function GET(request: Request) {
  return handlePaginatedMockRequest(request, adminAgents, (data) => ({
    total: data.length,
    verified: data.filter((a) => a.verified).length,
    totalListings: data.reduce((sum, a) => sum + a.listings, 0),
  }));
}
