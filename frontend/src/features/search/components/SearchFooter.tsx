import React from 'react'

const SearchFooter = (styles:any) => {
  return (
    <footer className={styles.footer}>
        © {new Date().getFullYear()} BharatSearch. All rights reserved.
      </footer>
  )
}

export default SearchFooter