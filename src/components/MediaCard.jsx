import React from 'react'
import { Star } from 'lucide-react'
import { posterUrl, formatRating, getYear } from '../lib/api.js'
import styles from './MediaCard.module.css'

export default function MediaCard({ item, type = 'movie', onClick, selected }) {
  const cardType = item.media_type || type
  const title = cardType === 'movie' ? item.title : item.name
  const date = cardType === 'movie' ? item.release_date : item.first_air_date
  const year = getYear(date)
  const rating = formatRating(item.vote_average)
  const poster = posterUrl(item.poster_path)

  return (
    <div
      className={`${styles.card} ${selected ? styles.selected : ''}`}
      onClick={() => onClick(item)}
    >
      <div className={styles.poster}>
        {poster
          ? <img src={poster} alt={title} loading="lazy" />
          : <div className={styles.noPoster}>{title?.slice(0, 2)}</div>
        }
      </div>
      <div className={styles.info}>
        <div className={styles.title} title={title}>{title}</div>
        <div className={styles.metaRow}>
          {year && <span className={styles.year}>{year}</span>}
          {rating && (
            <span className={styles.rating}>
              <Star size={11} fill="currentColor" stroke="none" />
              {rating}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
