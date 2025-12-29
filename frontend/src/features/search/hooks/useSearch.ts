import { useState, useRef, useCallback } from "react";
import searchAPI from "../eventHandlers/searchAPI";
import { SearchResponse, SearchResultItem } from "../types";

interface UseSearchOptions {
  onSearch?: (query: string) => void;
  pageSize?: number;
}

export function useSearch(options: UseSearchOptions = {}) {
  const { onSearch, pageSize = 10 } = options;

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const reset = () => {
    setPage(1);
    setResults([]);
    setError(null);
  };

  const executeSearch = useCallback(
    async (q: string, targetPage: number): Promise<SearchResponse> => {
      const trimmed = q.trim();
      if (!trimmed) {
        return {
          query: "",
          page: 1,
          pageSize,
          results: [],
        };
      }

      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setLoading(true);
      setError(null);
      onSearch?.(trimmed);

      try {
        const response = await searchAPI(trimmed, {
          page: targetPage,
          pageSize,
          signal: abortRef.current.signal,
        });

        setResults((prev) =>
          targetPage === 1
            ? response.results
            : [...prev, ...response.results]
        );

        setPage(targetPage);
        return response;
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError("Search temporarily unavailable");
          throw err;
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [onSearch, pageSize]
  );

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    page,

    search: (q: string) => {
      reset();
      return executeSearch(q, 1);
    },

    loadMore: () => executeSearch(query, page + 1),
  };
}
