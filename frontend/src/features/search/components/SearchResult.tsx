import React from "react";
import searchStyles from "../styles/searchresult.module.css";
import { SearchResponse } from "../types";

interface SearchResultProps {
  searchResponse?: SearchResponse | null;
}

const SearchResult: React.FC<SearchResultProps> = ({ searchResponse }) => {
  if (!searchResponse) return null;

  const { results, meta } = searchResponse;

  if (results.length === 0) {
    return (
      <div className={searchStyles.searchResultEmpty}>
        <p className={searchStyles.searchResultText}>No results found</p>
        <span className={searchStyles.searchResultHint}>
          Try broader keywords or a different phrasing.
        </span>
      </div>
    );
  }

  return (
    <section
      className={searchStyles.searchResultContainer}
      aria-label="Search results"
    >
      {/* 🔍 Optional meta info (Apple-subtle) */}
      {meta && (
        <div className={searchStyles.searchMeta}>
          {meta.engine && <span>Source: {meta.engine}</span>}
          {meta.latencyMs && <span>• {meta.latencyMs} ms</span>}
        </div>
      )}

      {results.map((item) => (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className={searchStyles.searchResultLink}
        >
          <article className={searchStyles.searchResultCard}>
            {/* 🌐 Site identity */}
            <div className={searchStyles.resultHeader}>
              <div className={searchStyles.iconWrapper}>
                {item.favicon ? (
                  <img
                    src={item.favicon}
                    alt={`${item.domain ?? "Website"} icon`}
                    className={searchStyles.resultFavicon}
                    loading="lazy"
                  />
                ) : (
                  <div className={searchStyles.fallbackIcon}>
                    {item.domain?.[0]?.toUpperCase() ?? "🌐"}
                  </div>
                )}
              </div>

              <span className={searchStyles.resultDomain}>
                {item.domain}
              </span>

              {/* ⭐ Trust (future-ready, optional) */}
              {item.trustScore && item.trustScore > 0.8 && (
                <span className={searchStyles.trustBadge}>Trusted</span>
              )}
            </div>

            {/* 🧠 Preview image (optional, Apple-style) */}
            {item.previewImage && (
              <img
                src={item.previewImage}
                alt=""
                className={searchStyles.previewImage}
                loading="lazy"
              />
            )}

            {/* 🔗 Title */}
            <h3 className={searchStyles.searchResultTitle}>
              {item.title}
            </h3>

            {/* 📄 Description */}
            <p className={searchStyles.searchResultDescription}>
              {item.description}
            </p>
          </article>
        </a>
      ))}
    </section>
  );
};

export default SearchResult;
