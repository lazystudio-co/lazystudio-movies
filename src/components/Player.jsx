import React, { useEffect, useState } from 'react'
import { X, Play, Star } from 'lucide-react'
import { movieEmbedUrl, tvEmbedUrl } from '../lib/api.js'
import styles from './Player.module.css'

export default function Player({
  tmdbId,
  type,
  season,
  episode,
  backdrop,
  title,
  year,
  rating,
  overview,
  badge,
  onClose,
  onPlayDefault,
  children
}) {
  const [activeServer, setActiveServer] = useState('codespecters')

  useEffect(() => {
    // Lock background scrolling when modal is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Construct iframe stream source dynamically based on selected server
  let videoSrc = ''
  if (tmdbId) {
    if (type === 'movie') {
      videoSrc = activeServer === 'codespecters'
        ? movieEmbedUrl(tmdbId)
        : `https://streamrip.fun/movie/${tmdbId}`
    } else if (type === 'tv' && season && episode) {
      videoSrc = activeServer === 'codespecters'
        ? tvEmbedUrl(tmdbId, season, episode)
        : `https://streamrip.fun/tv/${tmdbId}/${season}/${episode}`
    }
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close Player">
          <X size={18} />
        </button>

        <div className={styles.mediaArea}>
          {videoSrc ? (
            <iframe
              src={videoSrc}
              allowFullScreen
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              title={title}
              className={styles.iframe}
            />
          ) : (
            <div
              className={styles.backdropPreview}
              style={{ backgroundImage: backdrop ? `url(${backdrop})` : 'none' }}
            >
              <div className={styles.backdropOverlay} />
              {onPlayDefault && (
                <button className={styles.playBtn} onClick={onPlayDefault}>
                  <Play size={14} fill="currentColor" /> Play Episode 1
                </button>
              )}
            </div>
          )}
        </div>

        <div className={styles.details}>
          <div className={styles.meta}>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.pills}>
              {year && <span className={styles.pill}>{year}</span>}
              {rating && (
                <span className={`${styles.pill} ${styles.ratingPill}`}>
                  <Star size={11} fill="currentColor" stroke="none" />
                  {rating}
                </span>
              )}
              {badge && <span className={`${styles.pill} ${styles.badge}`}>{badge}</span>}
            </div>

            {videoSrc && (
              <div className={styles.serversRow}>
                <span className={styles.serverLabel}>Server:</span>
                <button
                  className={`${styles.serverBtn} ${activeServer === 'codespecters' ? styles.serverActive : ''}`}
                  onClick={() => setActiveServer('codespecters')}
                >
                  Server 1
                </button>
                <button
                  className={`${styles.serverBtn} ${activeServer === 'streamrip' ? styles.serverActive : ''}`}
                  onClick={() => setActiveServer('streamrip')}
                >
                  Server 2
                </button>
              </div>
            )}

            {overview && <p className={styles.overview}>{overview}</p>}
          </div>
          {children && <div className={styles.children}>{children}</div>}
        </div>
      </div>
    </div>
  )
}
