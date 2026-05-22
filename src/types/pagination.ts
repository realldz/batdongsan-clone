export interface PaginationMeta {
  page: number;
  totalPages: number;
  total: number;
  perPage: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMeta;
}
