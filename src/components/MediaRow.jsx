import React from 'react'
import MediaCard from './MediaCard.jsx'
import styles from './MediaRow.module.css'

export default function MediaRow({ title, items, type = 'movie', isTop10 = false, onSelect, onSeeAll }) {
  if (!items || items.length === 0) return null

  // We only show the first 6 items in the row
  const displayItems = items.slice(0, 6)

  return (
    <div className={styles.rowContainer}>
      <div className={styles.rowHeader}>
        <h2 className={styles.rowTitle}>{title}</h2>
        {onSeeAll && (
          <button className={styles.seeAllBtn} onClick={onSeeAll}>
            See All &rsaquo;
          </button>
        )}
      </div>

      <div className={isTop10 ? styles.top10Grid : styles.grid}>
        {displayItems.map((item, index) => {
          const cardType = item.media_type || type
          
          if (isTop10) {
            return (
              <div key={item.id} className={styles.top10CardWrapper}>
                <span className={styles.rankNumber}>{index + 1}</span>
                <div className={styles.cardInner}>
                  <MediaCard
                    item={item}
                    type={cardType}
                    onClick={onSelect}
                  />
                </div>
              </div>
            )
          }

          return (
            <MediaCard
              key={item.id}
              item={item}
              type={cardType}
              onClick={onSelect}
            />
          )
        })}
      </div>
    </div>
  )
}
