import React, { useState, useEffect } from 'react'
import { api, movieEmbedUrl, formatRating, getYear, backdropUrl, posterUrl } from '../lib/api.js'
import MediaGrid from '../components/MediaGrid.jsx'
import Player from '../components/Player.jsx'
import styles from './Movies.module.css'

function persist(key, val) {
  try { sessionStorage.setItem(key, JSON.stringify(val)) } catch {}
}
function hydrate(key) {
  try { const v = sessionStorage.getItem(key); return v ? JSON.parse(v) : null } catch { return null }
}

export default function Movies() {
  const savedQuery = hydrate('mv_query') || ''
  const savedPlayer = hydrate('mv_player')

  const [query, setQuery] = useState(savedQuery)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [featured, setFeatured] = useState(null)
  const [label, setLabel] = useState(savedQuery ? 'Results' : 'Trending Now')
  const [player, setPlayer] = useState(savedPlayer)

  useEffect(() => {
    if (savedQuery) {
      api.searchMovies(savedQuery)
        .then(d => {
          setResults(d.results || [])
          setFeatured(null)
        })
        .finally(() => setLoading(false))
    } else {
      api.trendingMovies()
        .then(d => {
          const items = d.results || []
          setResults(items)
          if (items.length > 0) {
            setFeatured(items[0])
          }
        })
        .finally(() => setLoading(false))
    }
  }, [])

  async function search(e) {
    e.preventDefault()
    const q = query.trim()
    setLoading(true)
    setResults([])
    
    if (!q) {
      setLabel('Trending Now')
      persist('mv_query', '')
      const d = await api.trendingMovies()
      const items = d.results || []
      setResults(items)
      if (items.length > 0) {
        setFeatured(items[0])
      }
      setLoading(false)
      return
    }

    setLabel('Results')
    setFeatured(null)
    persist('mv_query', q)
    const d = await api.searchMovies(q)
    setResults(d.results || [])
    setLoading(false)
  }

  function select(item) {
    const p = {
      src: movieEmbedUrl(item.id),
      title: item.title,
      year: getYear(item.release_date),
      rating: formatRating(item.vote_average),
      overview: item.overview,
      selectedId: item.id,
    }
    setPlayer(p)
    persist('mv_player', p)
  }

  function closePlayer() {
    setPlayer(null)
    persist('mv_player', null)
  }

  return (
    <div>
      <form className={styles.searchRow} onSubmit={search}>
        <div className={styles.searchBarWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Titles, people, genres..."
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.btn}>Search</button>
      </form>

      {featured && (
        <div 
          className={styles.hero} 
          style={{ 
            backgroundImage: `url(${backdropUrl(featured.backdrop_path, 'original') || posterUrl(featured.poster_path, true)})` 
          }}
        >
          <div className={styles.heroOverlay} />
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>Featured Movie</span>
            <h1 className={styles.heroTitle}>{featured.title}</h1>
            <div className={styles.heroMeta}>
              {getYear(featured.release_date) && <span className={styles.heroMetaItem}>{getYear(featured.release_date)}</span>}
              {formatRating(featured.vote_average) && <span className={styles.heroMetaItem}>★ {formatRating(featured.vote_average)}</span>}
            </div>
            <p className={styles.heroOverview}>{featured.overview}</p>
            <div className={styles.heroBtns}>
              <button className={styles.heroPlayBtn} onClick={() => select(featured)}>
                ▶ Play
              </button>
              <button className={styles.heroInfoBtn} onClick={() => select(featured)}>
                More Info
              </button>
            </div>
          </div>
        </div>
      )}

      {player && (
        <Player {...player} onClose={closePlayer} />
      )}

      <p className={styles.sectionLabel}>{label}</p>
      <MediaGrid
        items={results}
        type="movie"
        loading={loading}
        onSelect={select}
        selectedId={player?.selectedId}
      />
    </div>
  )
}
