import React from 'react'
import styles from './Pagination.module.css'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // TMDB API limits search pagination to page 500
  const maxPages = Math.min(totalPages || 1, 500)
  
  if (maxPages <= 1) return null

  return (
    <div className={styles.pagination}>
      <button 
        className={styles.btn} 
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        &larr; Prev
      </button>
      <span className={styles.info}>
        Page {currentPage} of {maxPages}
      </span>
      <button 
        className={styles.btn} 
        disabled={currentPage >= maxPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next &rarr;
      </button>
    </div>
  )
}
