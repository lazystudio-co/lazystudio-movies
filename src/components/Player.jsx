import React, { useEffect } from 'react'
import { X, Play, Star } from 'lucide-react'
import styles from './Player.module.css'

export default function Player({
  src,
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

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close Player">
          <X size={18} />
        </button>
        
        <div className={styles.mediaArea}>
          {src ? (
            <iframe
              src={src}
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
            {overview && <p className={styles.overview}>{overview}</p>}
          </div>
          {children && <div className={styles.children}>{children}</div>}
        </div>
      </div>
    </div>
  )
}
