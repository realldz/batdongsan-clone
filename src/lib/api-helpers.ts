import { NextResponse } from "next/server";

export function handlePaginatedMockRequest<T, S = unknown>(
  request: Request,
  allData: T[],
  getStats?: (data: T[]) => S
) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("perPage") || "10", 10);

  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginated = allData.slice(start, end);
  const totalPages = Math.ceil(allData.length / perPage);

  const responseBody: {
    data: T[];
    pagination: {
      page: number;
      totalPages: number;
      total: number;
      perPage: number;
    };
    stats?: S;
  } = {
    data: paginated,
    pagination: {
      page,
      totalPages,
      total: allData.length,
      perPage,
    },
  };

  if (getStats) {
    responseBody.stats = getStats(allData);
  }

  return NextResponse.json(responseBody);
}
