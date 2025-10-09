import React from 'react'
import SearchBar from './SearchBar'

const SearchHeader = ({ styles, aiFeatures, handleFeatureClick }: any) => {
  return (
    <header className={styles.hero}>
        <h1 className={styles.title}>Project Bharat Search</h1>
        <p className={styles.subtitle}>
          India-scale AI-powered search engine for fast, intelligent, multilingual search.
        </p>
        <SearchBar styles={styles} aiFeatures={aiFeatures} handleFeatureClick={handleFeatureClick} />
      </header>

  )
}

export default SearchHeader

