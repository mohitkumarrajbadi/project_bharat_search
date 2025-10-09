import { useState } from "react";
import searchAPI from "../eventHandlers/searchAPI";

interface UseSearchOptions {
  onSearch?: (query: string) => void;
}

export function useSearch({ onSearch }: UseSearchOptions = {}) {
  const [query, setQuery] = useState("");

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      onSearch?.(trimmedQuery);
      console.log("Searching for:", trimmedQuery);
      try{
        var response = searchAPI(trimmedQuery);
      }catch(error){
        throw error;
      }
    }
  };

  return { query, setQuery, handleSearch };
}
