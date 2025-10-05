export interface ListOptions {
  paginator?: number;
  page?: number;
  searchValue?: string;
  direction?: "ASC" | "DESC";
  sortBy?: string | null;
  [key: string]: unknown;
}
