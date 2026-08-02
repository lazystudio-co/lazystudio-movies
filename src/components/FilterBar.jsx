import React from 'react'
import styles from './FilterBar.module.css'

const GENRES = [
  { id: '28', name: 'Action' },
  { id: '12', name: 'Adventure' },
  { id: '35', name: 'Comedy' },
  { id: '18', name: 'Drama' },
  { id: '14', name: 'Fantasy' },
  { id: '27', name: 'Horror' },
  { id: '10749', name: 'Romance' },
  { id: '878', name: 'Sci-Fi' },
  { id: '53', name: 'Thriller' }
]

const YEARS = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019']

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'IN', name: 'India' },
  { code: 'KR', name: 'South Korea' },
  { code: 'JP', name: 'Japan' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'DE', name: 'Germany' },
  { code: 'CA', name: 'Canada' },
  { code: 'CN', name: 'China' },
  { code: 'AU', name: 'Australia' }
]

export default function FilterBar({ pageType, filters, onChange }) {
  const isHome = pageType === 'home'
  
  function handleSelect(field, val) {
    onChange({
      ...filters,
      [field]: val
    })
  }

  function handleClear() {
    onChange({
      genre: '',
      year: '',
      country: '',
      sortBy: 'popularity.desc',
      contentType: 'all'
    })
  }

  const hasActiveFilters = filters.genre || filters.year || filters.country || (filters.contentType && filters.contentType !== 'all') || filters.sortBy !== 'popularity.desc'

  return (
    <div className={styles.filterBar}>
      <div className={styles.filtersGroup}>
        {/* Content Type Filter - Home page only */}
        {isHome && (
          <div className={styles.selectWrapper}>
            <label className={styles.label}>Type</label>
            <select
              value={filters.contentType || 'all'}
              onChange={e => handleSelect('contentType', e.target.value)}
              className={styles.select}
            >
              <option value="all">All Content</option>
              <option value="movie">Movies</option>
              <option value="tv">TV Shows</option>
            </select>
          </div>
        )}

        {/* Genre Filter */}
        <div className={styles.selectWrapper}>
          <label className={styles.label}>Genre</label>
          <select
            value={filters.genre || ''}
            onChange={e => handleSelect('genre', e.target.value)}
            className={styles.select}
          >
            <option value="">All Genres</option>
            {GENRES.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>

        {/* Year Filter - Home page only */}
        {isHome && (
          <div className={styles.selectWrapper}>
            <label className={styles.label}>Year</label>
            <select
              value={filters.year || ''}
              onChange={e => handleSelect('year', e.target.value)}
              className={styles.select}
            >
              <option value="">All Years</option>
              {YEARS.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        )}

        {/* Country Filter - Show everywhere except anime */}
        {pageType !== 'anime' && (
          <div className={styles.selectWrapper}>
            <label className={styles.label}>Country</label>
            <select
              value={filters.country || ''}
              onChange={e => handleSelect('country', e.target.value)}
              className={styles.select}
            >
              <option value="">All Countries</option>
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Sort By Filter */}
        <div className={styles.selectWrapper}>
          <label className={styles.label}>Sort By</label>
          <select
            value={filters.sortBy || 'popularity.desc'}
            onChange={e => handleSelect('sortBy', e.target.value)}
            className={styles.select}
          >
            <option value="popularity.desc">Popularity</option>
            <option value="vote_average.desc">Rating</option>
            <option value="release_date.desc">Release Date</option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <button className={styles.clearBtn} onClick={handleClear}>
          Clear Filters
        </button>
      )}
    </div>
  )
}
