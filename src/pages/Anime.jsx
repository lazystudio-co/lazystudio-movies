import React, { useState, useEffect } from 'react'
import { Search, Play, Info, Star } from 'lucide-react'
import { api, formatRating, getYear, backdropUrl, posterUrl } from '../lib/api.js'
import MediaGrid from '../components/MediaGrid.jsx'
import Player from '../components/Player.jsx'
import SeasonPicker from '../components/SeasonPicker.jsx'
import styles from './TV.module.css'

function persist(key, val) { try { sessionStorage.setItem(key, JSON.stringify(val)) } catch {} }
function hydrate(key) { try { const v = sessionStorage.getItem(key); return v ? JSON.parse(v) : null } catch { return null } }

export default function Anime({ searchQuery }) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [featured, setFeatured] = useState(null)
  const [selected, setSelected] = useState(() => hydrate('ani_selected'))
  const [player, setPlayer] = useState(() => hydrate('ani_player'))

  // Load trending anime or search
  useEffect(() => {
    const q = searchQuery.trim()
    
    const delayDebounce = setTimeout(() => {
      setLoading(true)
      setResults([])

      if (!q) {
        api.trendingAnime()
          .then(d => {
            const items = d.results || []
            setResults(items)
            if (items.length > 0) {
              setFeatured(items[0])
            }
          })
          .finally(() => setLoading(false))
      } else {
        setFeatured(null)
        api.searchAnime(q)
          .then(d => {
            setResults(d.results || [])
          })
          .finally(() => setLoading(false))
      }
    }, q ? 300 : 0)

    return () => clearTimeout(delayDebounce)
  }, [searchQuery])

  function handlePlay(season, episode) {
    if (!selected) return
    const p = {
      tmdbId: selected.id,
      type: 'tv',
      season: season,
      episode: episode,
      title: selected.name,
      year: getYear(selected.first_air_date),
      rating: formatRating(selected.vote_average),
      overview: selected.overview,
      badge: `S${season} · E${episode}`,
      selectedId: selected.id,
    }
    setPlayer(p)
    persist('ani_player', p)
  }

  function handlePlayDefault() {
    handlePlay(1, 1)
  }

  function handleCloseModal() {
    setSelected(null)
    setPlayer(null)
    persist('ani_selected', null)
    persist('ani_player', null)
  }

  return (
    <div>
      {featured && (
        <div 
          className={styles.hero} 
          style={{ 
            backgroundImage: `url(${backdropUrl(featured.backdrop_path, 'original') || posterUrl(featured.poster_path, true)})` 
          }}
        >
          <div className={styles.heroOverlay} />
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>Featured Anime</span>
            <h1 className={styles.heroTitle}>{featured.name}</h1>
            <div className={styles.heroMeta}>
              {getYear(featured.first_air_date) && <span className={styles.heroMetaItem}>{getYear(featured.first_air_date)}</span>}
              {formatRating(featured.vote_average) && (
                <span className={`${styles.heroMetaItem} ${styles.heroRating}`}>
                  <Star size={12} fill="currentColor" stroke="none" />
                  {formatRating(featured.vote_average)}
                </span>
              )}
            </div>
            <p className={styles.heroOverview}>{featured.overview}</p>
            <div className={styles.heroBtns}>
              <button 
                className={styles.heroPlayBtn} 
                onClick={() => {
                  setSelected(featured)
                  persist('ani_selected', featured)
                  const p = {
                    tmdbId: featured.id,
                    type: 'tv',
                    season: 1,
                    episode: 1,
                    title: featured.name,
                    year: getYear(featured.first_air_date),
                    rating: formatRating(featured.vote_average),
                    overview: featured.overview,
                    badge: `S1 · E1`,
                    selectedId: featured.id,
                  }
                  setPlayer(p)
                  persist('ani_player', p)
                }}
              >
                <Play size={14} fill="currentColor" /> Play
              </button>
              <button 
                className={styles.heroInfoBtn} 
                onClick={() => {
                  setSelected(featured)
                  persist('ani_selected', featured)
                  setPlayer(null)
                  persist('ani_player', null)
                }}
              >
                <Info size={15} /> More Info
              </button>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <Player
          {...player}
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

      <p className={styles.sectionLabel}>{searchQuery.trim() ? 'Results' : 'Trending Anime'}</p>
      <MediaGrid
        items={results}
        type="tv"
        loading={loading}
        onSelect={(item) => {
          setSelected(item)
          persist('ani_selected', item)
          setPlayer(null)
          persist('ani_player', null)
        }}
        selectedId={selected?.id}
      />
    </div>
  )
}
