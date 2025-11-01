import React from 'react'
import searchstyles from "../styles/search.module.css";

const SearchResult = () => {
  return (
    <div className={searchstyles.searchResultContainer}>
        <p className={searchstyles.searchResultText}>No results found.</p>
    </div>
  )
}

export default SearchResult