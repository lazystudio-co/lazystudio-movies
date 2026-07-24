import React, { useState, useEffect } from 'react'
import { Play, Star } from 'lucide-react'
import { api } from '../lib/api.js'
import styles from './SeasonPicker.module.css'

export default function SeasonPicker({ show, onPlay }) {
  const [seasons, setSeasons] = useState([])
  const [activeSeason, setActiveSeason] = useState(1)
  const [episodes, setEpisodes] = useState([])
  const [epLoading, setEpLoading] = useState(false)

  // Build season list from show data
  useEffect(() => {
    if (!show) return
    api.tvDetails(show.id).then(details => {
      const s = (details.seasons || []).filter(s => s.season_number > 0)
      if (s.length === 0 && details.number_of_seasons) {
        const arr = []
        for (let i = 1; i <= details.number_of_seasons; i++) {
          arr.push({ season_number: i, name: `Season ${i}`, episode_count: null })
        }
        setSeasons(arr)
      } else {
        setSeasons(s)
      }
      setActiveSeason(s[0]?.season_number || 1)
    }).catch(() => {
      const n = show.number_of_seasons || 1
      const arr = []
      for (let i = 1; i <= n; i++) {
        arr.push({ season_number: i, name: `Season ${i}`, episode_count: null })
      }
      setSeasons(arr)
      setActiveSeason(1)
    })
  }, [show.id])

  // Load episodes for activeSeason
  useEffect(() => {
    if (!activeSeason) return
    setEpLoading(true)
    setEpisodes([])
    api.seasonDetails(show.id, activeSeason).then(data => {
      setEpisodes(data.episodes || [])
    }).catch(() => setEpisodes([])).finally(() => setEpLoading(false))
  }, [show.id, activeSeason])

  if (!show) return null

  return (
    <div className={styles.wrap}>
      <div className={styles.headerRow}>
        <span className={styles.sectionTitle}>Episodes</span>
        
        {seasons.length > 0 && (
          <select 
            className={styles.seasonSelector} 
            value={activeSeason}
            onChange={(e) => setActiveSeason(Number(e.target.value))}
          >
            {seasons.map(s => (
              <option key={s.season_number} value={s.season_number}>
                Season {s.season_number}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className={styles.episodesWrap}>
        {epLoading ? (
          <div className={styles.epList}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={styles.epSkeleton} />
            ))}
          </div>
        ) : episodes.length > 0 ? (
          <div className={styles.epList}>
            {episodes.map(ep => (
              <button
                key={ep.episode_number}
                className={styles.epRow}
                onClick={() => onPlay(activeSeason, ep.episode_number)}
                title={ep.name}
              >
                <span className={styles.epIndex}>{ep.episode_number}</span>
                <div className={styles.epThumb}>
                  {ep.still_path ? (
                    <img src={`https://image.tmdb.org/t/p/w300${ep.still_path}`} alt={ep.name} loading="lazy" />
                  ) : (
                    <div className={styles.epThumbFallback}>
                      <Play size={16} fill="currentColor" stroke="none" />
                    </div>
                  )}
                  <div className={styles.epPlayOverlay}>
                    <Play size={20} fill="currentColor" stroke="none" />
                  </div>
                </div>
                <div className={styles.epInfo}>
                  <div className={styles.epTitleRow}>
                    <span className={styles.epName}>{ep.name}</span>
                    {ep.vote_average > 0 && (
                      <span className={styles.epRating}>
                        <Star size={11} fill="currentColor" stroke="none" />
                        {ep.vote_average.toFixed(1)}
                      </span>
                    )}
                  </div>
                  {ep.overview && (
                    <p className={styles.epOverview}>{ep.overview.slice(0, 110)}...</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className={styles.noEps}>No episode data available.</p>
        )}
      </div>
    </div>
  )
}
