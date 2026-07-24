import React, { useState, useEffect } from 'react'
import { api, tvEmbedUrl, formatRating, getYear, backdropUrl, posterUrl } from '../lib/api.js'
import MediaGrid from '../components/MediaGrid.jsx'
import Player from '../components/Player.jsx'
import SeasonPicker from '../components/SeasonPicker.jsx'
import styles from './TV.module.css'

function persist(key, val) { try { sessionStorage.setItem(key, JSON.stringify(val)) } catch {} }
function hydrate(key) { try { const v = sessionStorage.getItem(key); return v ? JSON.parse(v) : null } catch { return null } }

export default function TV() {
  const [query, setQuery] = useState(() => hydrate('tv_query') || '')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [featured, setFeatured] = useState(null)
  const [selected, setSelected] = useState(() => hydrate('tv_selected'))
  const [player, setPlayer] = useState(() => hydrate('tv_player'))

  // Load trending or restore last search
  useEffect(() => {
    const savedQuery = hydrate('tv_query') || ''
    if (savedQuery) {
      api.searchTV(savedQuery)
        .then(d => {
          setResults(d.results || [])
          setFeatured(null)
        })
        .finally(() => setLoading(false))
    } else {
      api.trendingTV()
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
      persist('tv_query', '')
      const d = await api.trendingTV()
      const items = d.results || []
      setResults(items)
      if (items.length > 0) {
        setFeatured(items[0])
      }
      setLoading(false)
      return
    }

    setFeatured(null)
    persist('tv_query', q)
    const d = await api.searchTV(q)
    setResults(d.results || [])
    setLoading(false)
  }

  function handlePlay(season, episode) {
    if (!selected) return
    const p = {
      src: tvEmbedUrl(selected.id, season, episode),
      title: selected.name,
      year: getYear(selected.first_air_date),
      rating: formatRating(selected.vote_average),
      overview: selected.overview,
      badge: `S${season} · E${episode}`,
      selectedId: selected.id,
    }
    setPlayer(p)
    persist('tv_player', p)
  }

  function handlePlayDefault() {
    handlePlay(1, 1)
  }

  function handleCloseModal() {
    setSelected(null)
    setPlayer(null)
    persist('tv_selected', null)
    persist('tv_player', null)
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
            <span className={styles.heroBadge}>Featured TV Series</span>
            <h1 className={styles.heroTitle}>{featured.name}</h1>
            <div className={styles.heroMeta}>
              {getYear(featured.first_air_date) && <span className={styles.heroMetaItem}>{getYear(featured.first_air_date)}</span>}
              {formatRating(featured.vote_average) && <span className={styles.heroMetaItem}>★ {formatRating(featured.vote_average)}</span>}
            </div>
            <p className={styles.heroOverview}>{featured.overview}</p>
            <div className={styles.heroBtns}>
              <button 
                className={styles.heroPlayBtn} 
                onClick={() => {
                  setSelected(featured)
                  persist('tv_selected', featured)
                  const p = {
                    src: tvEmbedUrl(featured.id, 1, 1),
                    title: featured.name,
                    year: getYear(featured.first_air_date),
                    rating: formatRating(featured.vote_average),
                    overview: featured.overview,
                    badge: `S1 · E1`,
                    selectedId: featured.id,
                  }
                  setPlayer(p)
                  persist('tv_player', p)
                }}
              >
                ▶ Play
              </button>
              <button 
                className={styles.heroInfoBtn} 
                onClick={() => {
                  setSelected(featured)
                  persist('tv_selected', featured)
                  setPlayer(null)
                  persist('tv_player', null)
                }}
              >
                More Info
              </button>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <Player
          src={player?.src}
          backdrop={backdropUrl(selected.backdrop_path, 'w1280') || posterUrl(selected.poster_path, true)}
          title={selected.name}
          year={getYear(selected.first_air_date)}
          rating={formatRating(selected.vote_average)}
          overview={selected.overview}
          badge={player?.badge}
          onClose={handleCloseModal}
          onPlayDefault={handlePlayDefault}
        >
          <SeasonPicker show={selected} onPlay={handlePlay} />
        </Player>
      )}

      <p className={styles.sectionLabel}>{hydrate('tv_query') ? 'Results' : 'Trending Now'}</p>
      <MediaGrid
        items={results}
        type="tv"
        loading={loading}
        onSelect={(item) => {
          setSelected(item)
          persist('tv_selected', item)
          setPlayer(null)
          persist('tv_player', null)
        }}
        selectedId={selected?.id}
      />
    </div>
  )
}
