export interface SearchResultItem {
  id: string;
  title: string;
  url: string;
  description: string;

  domain?: string;
  favicon?: string;

  // future-ready
  previewImage?: string;
  trustScore?: number;
}

export interface SearchMeta {
  latencyMs?: number;
  engine?: string;
  timestamp?: string;
}

export interface SearchResponse {
  query: string;
  page: number;
  pageSize: number;
  results: SearchResultItem[];
  meta?: SearchMeta;
}
