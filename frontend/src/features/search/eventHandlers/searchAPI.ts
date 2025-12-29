import { SearchResponse } from "../types";

interface SearchAPIOptions {
  page?: number;
  pageSize?: number;
  signal?: AbortSignal;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000";

export default async function searchAPI(
  query: string,
  options: SearchAPIOptions = {}
): Promise<SearchResponse> {
  const { page = 1, pageSize = 10, signal } = options;

  const params = new URLSearchParams({
    query,
    page: String(page),
    page_size: String(pageSize),
  });

  const url = `${BASE_URL}/api/search?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    signal,
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(
      `Search API failed (${response.status})`
    );
  }

  return response.json();
}
