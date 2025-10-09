import React, { useState } from "react";
import searchstyles from "../styles/search.module.css";
import { useSearch } from "../hooks/useSearch";

interface SearchBarProps {
  styles: {
    aiFeatures: string;
    featureButton: string;
  };
  aiFeatures: string[];
  handleFeatureClick: (feature: string) => void;
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  styles,
  aiFeatures,
  handleFeatureClick,
  onSearch,
}) => {
  const { query, setQuery, handleSearch } = useSearch(onSearch);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchWithAnimation = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSearching(true);
    handleSearch(event);

    // Stop animation after 1.5s (or when search completes)
    setTimeout(() => setIsSearching(false), 1500);
  };

  return (
    <div className={searchstyles.searchFeature}>
      {/* Search Input */}
      <form
        className={`${searchstyles.searchContainer} ${
          isSearching ? searchstyles.searching : ""
        }`}
        onSubmit={handleSearchWithAnimation}
      >
        <input
          type="text"
          placeholder="Search BharatSearch..."
          className={searchstyles.searchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className={searchstyles.searchButton}>
          Search
        </button>
      </form>

      {/* AI Feature Buttons */}
      <div className={styles.aiFeatures}>
        {aiFeatures.map((feature) => (
          <button
            key={feature}
            type="button"
            className={styles.featureButton}
            onClick={() => handleFeatureClick(feature)}
          >
            {feature}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
