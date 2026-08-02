import React from 'react'
import { Filter, ArrowLeft } from 'lucide-react'
import styles from './FilterBar.module.css'

const CATEGORIES = [
  { id: 'all', name: 'All', bg: 'linear-gradient(135deg, #162a1d, #0f1c13)', filters: { country: '', language: '' } },
  { id: 'hollywood', name: 'Hollywood', bg: 'linear-gradient(135deg, #152e4d, #0d1d33)', filters: { country: 'United States', language: '' } },
  { id: 'bollywood', name: 'Bollywood', bg: 'linear-gradient(135deg, #3d2345, #231129)', filters: { country: 'India', language: 'Hindi dub' } },
  { id: 'bengali', name: 'Bengali', bg: 'linear-gradient(135deg, #4d3319, #2d1e0d)', filters: { country: '', language: 'Bengali dub' } }
]

const GENRES = [
  'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 
  'Fantasy', 'Film-Noir', 'Game-Show', 'History', 'Horror', 'Music', 'Musical', 'Mystery', 'News', 
  'Reality-TV', 'Romance', 'Sci-Fi', 'Short', 'Sport', 'Talk-Show', 'Thriller', 'War', 'Western', 'Other'
]

const COUNTRIES = [
  'United States', 'United Kingdom', 'Korea', 'Japan', 'Bangladesh', 'China', 'Egypt', 'France', 
  'Germany', 'India', 'Indonesia', 'Iraq', 'Italy', 'Ivory Coast', 'Kenya', 'Lebanon', 'Mexico', 
  'Morocco', 'Nigeria', 'Pakistan', 'Philippines', 'Russia', 'Saudi Arabia', 'South Africa', 'Spain', 
  'Syria', 'Thailand', 'Malaysia', 'Turkey', 'Other'
]

const YEARS = [
  '2026', '2025', '2024', '2023', '2022', '2021', '2020', '2010s', '2000s', '1990s', '1980s', 'Other'
]

const LANGUAGES = [
  'English dub', 'French dub', 'Hindi dub', 'Bengali dub', 'Urdu dub', 'Punjabi dub', 'Tamil dub', 
  'Telugu dub', 'Malayalam dub', 'Kannada dub', 'Arabic dub', 'Arabic sub', 'Tagalog dub', 'Indonesian dub', 
  'Russian dub', 'Kurdish sub', 'Spanish dub', 'Spanish sub', 'SpanishLatam dub'
]

const SORT_BY = [
  { id: 'ForYou', name: 'ForYou' },
  { id: 'Hottest', name: 'Hottest' },
  { id: 'Latest', name: 'Latest' },
  { id: 'Rating', name: 'Rating' }
]

export default function FilterBar({ pageType, filters, onChange }) {
  const isHome = pageType === 'home'
  const isAnime = pageType === 'anime'

  const activeCategoryName = filters.activeCategory 
    ? CATEGORIES.find(c => c.id === filters.activeCategory)?.name 
    : ''

  function handleSelect(field, val) {
    onChange({
      ...filters,
      [field]: val
    })
  }

  function handleCategoryClick(catId) {
    if (filters.activeCategory === catId) {
      // Toggle off / collapse detailed filters and reset country/language
      onChange({
        ...filters,
        activeCategory: '',
        country: '',
        language: ''
      })
    } else {
      const cat = CATEGORIES.find(c => c.id === catId)
      onChange({
        ...filters,
        activeCategory: catId,
        country: cat.filters.country,
        language: cat.filters.language
      })
    }
  }

  function handleBackToCategories() {
    onChange({
      ...filters,
      activeCategory: '',
      country: '',
      language: ''
    })
  }

  function handleClear() {
    onChange({
      genre: '',
      year: '',
      country: '',
      language: '',
      sortBy: 'ForYou',
      contentType: 'all',
      activeCategory: ''
    })
  }

  const hasActiveFilters = 
    filters.genre || 
    filters.year || 
    filters.country || 
    filters.language || 
    filters.activeCategory ||
    (filters.contentType && filters.contentType !== 'all') || 
    (filters.sortBy && filters.sortBy !== 'ForYou')

  const showDetailed = isAnime || !!filters.activeCategory

  return (
    <div className={styles.filterContainer}>
      {/* Categories Row - Show on Home, Movies, TV pages */}
      {!isAnime && (
        <div className={styles.categoriesSection}>
          {!filters.activeCategory ? (
            <>
              <h2 className={styles.categoriesHeader}>Categories</h2>
              <div className={styles.categoriesRow}>
                {CATEGORIES.map(cat => (
                  <div
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`${styles.categoryCard} ${filters.activeCategory === cat.id ? styles.activeCard : ''}`}
                    style={{ background: cat.bg }}
                  >
                    <div className={styles.cardOverlay}></div>
                    <span className={styles.cardText}>{cat.name}</span>
                    {cat.id === 'all' && (
                      <span className={styles.cardIcon}>
                        <Filter size={18} />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className={styles.categorySelectedHeader}>
              <button onClick={handleBackToCategories} className={styles.backBtn}>
                <ArrowLeft size={14} /> Back to Categories
              </button>
              <span className={styles.activeCategoryLabel}>
                Selected Category: <strong>{activeCategoryName}</strong>
              </span>
            </div>
          )}
        </div>
      )}

      {showDetailed && (
        <div className={styles.detailedFilters}>
          {/* Type Row - Home only */}
          {isHome && (
            <div className={styles.filterRow}>
              <span className={styles.rowLabel}>Type</span>
              <div className={styles.optionsList}>
                <button
                  onClick={() => handleSelect('contentType', 'all')}
                  className={filters.contentType === 'all' || !filters.contentType ? styles.activeTag : styles.tag}
                >
                  All
                </button>
                <button
                  onClick={() => handleSelect('contentType', 'movie')}
                  className={filters.contentType === 'movie' ? styles.activeTag : styles.tag}
                >
                  Movies
                </button>
                <button
                  onClick={() => handleSelect('contentType', 'tv')}
                  className={filters.contentType === 'tv' ? styles.activeTag : styles.tag}
                >
                  TV Shows
                </button>
              </div>
            </div>
          )}

          {/* Genre Row */}
          <div className={styles.filterRow}>
            <span className={styles.rowLabel}>Genre</span>
            <div className={styles.optionsList}>
              <button
                onClick={() => handleSelect('genre', '')}
                className={!filters.genre ? styles.activeTag : styles.tag}
              >
                All
              </button>
              {GENRES.map(g => (
                <button
                  key={g}
                  onClick={() => handleSelect('genre', g)}
                  className={filters.genre === g ? styles.activeTag : styles.tag}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Country Row - Show everywhere except anime */}
          {!isAnime && (
            <div className={styles.filterRow}>
              <span className={styles.rowLabel}>Country</span>
              <div className={styles.optionsList}>
                <button
                  onClick={() => handleSelect('country', '')}
                  className={!filters.country ? styles.activeTag : styles.tag}
                >
                  All
                </button>
                {COUNTRIES.map(c => (
                  <button
                    key={c}
                    onClick={() => handleSelect('country', c)}
                    className={filters.country === c ? styles.activeTag : styles.tag}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Year Row */}
          <div className={styles.filterRow}>
            <span className={styles.rowLabel}>Year</span>
            <div className={styles.optionsList}>
              <button
                onClick={() => handleSelect('year', '')}
                className={!filters.year ? styles.activeTag : styles.tag}
              >
                All
              </button>
              {YEARS.map(y => (
                <button
                  key={y}
                  onClick={() => handleSelect('year', y)}
                  className={filters.year === y ? styles.activeTag : styles.tag}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          {/* Language Row - Show everywhere except anime */}
          {!isAnime && (
            <div className={styles.filterRow}>
              <span className={styles.rowLabel}>Language</span>
              <div className={styles.optionsList}>
                <button
                  onClick={() => handleSelect('language', '')}
                  className={!filters.language ? styles.activeTag : styles.tag}
                >
                  All
                </button>
                {LANGUAGES.map(l => (
                  <button
                    key={l}
                    onClick={() => handleSelect('language', l)}
                    className={filters.language === l ? styles.activeTag : styles.tag}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sort By Row */}
          <div className={styles.filterRow}>
            <span className={styles.rowLabel}>Sort by</span>
            <div className={styles.optionsList}>
              {SORT_BY.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleSelect('sortBy', s.id)}
                  className={(filters.sortBy === s.id || (!filters.sortBy && s.id === 'ForYou')) ? styles.activeTag : styles.tag}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <div className={styles.clearRow}>
              <button className={styles.clearBtn} onClick={handleClear}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
