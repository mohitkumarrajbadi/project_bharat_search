import React, { useState } from "react";
import searchStyles from "../styles/search.module.css";
import { useSearch } from "../hooks/useSearch";
import AIFeatureBar from "./AIFeaturebar";
import SearchResult from "./SearchResult";
import { SearchResponse } from "../types";

interface SearchBarProps {
  aiFeatures: string[];
  handleFeatureClick: (feature: string) => void;
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  aiFeatures,
  handleFeatureClick,
  onSearch,
}) => {
  const { query, setQuery, search } = useSearch({ onSearch });
  const [isSearching, setIsSearching] = useState(false);
  const [searchResponse, setSearchResponse] =
    useState<SearchResponse | null>(null);

  const handleSearchWithAnimation = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsSearching(true);

    try {
      const result = await search(query);
      setSearchResponse(result);
      console.log("Search Result:", result);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setTimeout(() => setIsSearching(false), 1500);
    }
  };

  return (
    <div className={searchStyles.searchFeature}>
      {/* 🔍 Search Form */}
      <form
        className={`${searchStyles.searchContainer} ${
          isSearching ? searchStyles.searching : ""
        }`}
        onSubmit={handleSearchWithAnimation}
      >
        <input
          type="text"
          placeholder="Search BharatSearch..."
          className={searchStyles.searchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className={searchStyles.searchButton}
          disabled={isSearching}
        >
          {isSearching ? "Searching..." : "Search"}
        </button>
      </form>

      <AIFeatureBar
        aiFeatures={aiFeatures}
        handleFeatureClick={handleFeatureClick}
      />

      <SearchResult searchResponse={searchResponse} />
    </div>
  );
};

export default SearchBar;
