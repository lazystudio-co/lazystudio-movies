import React, { useState, useEffect } from 'react'
import { Play, Info, Star } from 'lucide-react'
import { api, formatRating, getYear, backdropUrl, posterUrl } from '../lib/api.js'
import MediaGrid from '../components/MediaGrid.jsx'
import MediaRow from '../components/MediaRow.jsx'
import Player from '../components/Player.jsx'
import FilterBar from '../components/FilterBar.jsx'
import Pagination from '../components/Pagination.jsx'
import styles from './Movies.module.css'

function persist(key, val) { try { sessionStorage.setItem(key, JSON.stringify(val)) } catch {} }
function hydrate(key) { try { const v = sessionStorage.getItem(key); return v ? JSON.parse(v) : null } catch { return null } }

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default function Movies({ searchQuery }) {
  // Category row states
  const [trending, setTrending] = useState([])
  const [topRated, setTopRated] = useState([])
  const [popular, setPopular] = useState([])
  const [scramble, setScramble] = useState([])

  const [featured, setFeatured] = useState(null)
  const [loading, setLoading] = useState(true)

  // Filter states
  const [filters, setFilters] = useState({
    genre: '',
    sortBy: 'popularity.desc'
  })
  const [filterPage, setFilterPage] = useState(1)
  const [filterTotalPages, setFilterTotalPages] = useState(1)
  const [discoverResults, setDiscoverResults] = useState([])
  const [discoverLoading, setDiscoverLoading] = useState(false)

  // See All states
  const [viewSection, setViewSection] = useState(null)
  const [seeAllItems, setSeeAllItems] = useState([])
  const [seeAllLoading, setSeeAllLoading] = useState(false)
  const [seeAllPage, setSeeAllPage] = useState(1)
  const [seeAllTotalPages, setSeeAllTotalPages] = useState(1)

  const [player, setPlayer] = useState(() => hydrate('mv_player'))

  // Load category datasets on mount
  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.trendingMovies(),
      api.topRatedMovies(),
      api.popularMovies()
    ]).then(([trend, top, pop]) => {
      const trendingItems = trend.results || []
      setTrending(trendingItems)
      
      if (trendingItems.length > 0) {
        setFeatured(trendingItems[0])
      }
      
      setTopRated(top.results || [])
      setPopular(pop.results || [])
      
      // Shuffle popular items to make a Scramble list
      if (pop.results && pop.results.length > 0) {
        setScramble(shuffle(pop.results))
      }
    }).finally(() => setLoading(false))
  }, [])

  // Execute discover filter queries
  const hasActiveFilters = filters.genre || filters.sortBy !== 'popularity.desc'
  
  useEffect(() => {
    if (!hasActiveFilters || searchQuery.trim()) return

    setDiscoverLoading(true)
    setDiscoverResults([])

    api.discoverMovies({
      genre: filters.genre,
      sortBy: filters.sortBy,
      page: filterPage
    }).then(d => {
      setDiscoverResults(d.results || [])
      setFilterTotalPages(d.total_pages || 1)
    }).finally(() => setDiscoverLoading(false))
  }, [filters, filterPage, searchQuery, hasActiveFilters])

  // Reset page index on filter updates
  useEffect(() => {
    setFilterPage(1)
  }, [filters])

  // Fetch paginated see all view
  useEffect(() => {
    if (!viewSection) return
    setSeeAllLoading(true)
    setSeeAllItems([])
    viewSection.fetchFn(seeAllPage)
      .then(d => {
        setSeeAllItems(d.results || [])
        setSeeAllTotalPages(d.total_pages || 1)
      })
      .finally(() => setSeeAllLoading(false))
  }, [viewSection, seeAllPage])

  function select(item) {
    const p = {
      tmdbId: item.id,
      type: 'movie',
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

  // Render paginated see all list
  if (viewSection) {
    return (
      <div className={styles.seeAllContainer}>
        <div className={styles.seeAllHeader}>
          <button className={styles.backBtn} onClick={() => setViewSection(null)}>
            &larr; Back
          </button>
          <h1 className={styles.seeAllTitle}>{viewSection.title}</h1>
        </div>

        <MediaGrid
          items={seeAllItems}
          type="movie"
          loading={seeAllLoading}
          onSelect={select}
          selectedId={player?.selectedId}
        />

        <Pagination
          currentPage={seeAllPage}
          totalPages={seeAllTotalPages}
          onPageChange={setSeeAllPage}
        />

        {player && (
          <Player {...player} onClose={closePlayer} />
        )}
      </div>
    )
  }

  return (
    <div>
      {featured && !hasActiveFilters && (
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
              {formatRating(featured.vote_average) && (
                <span className={`${styles.heroMetaItem} ${styles.heroRating}`}>
                  <Star size={12} fill="currentColor" stroke="none" />
                  {formatRating(featured.vote_average)}
                </span>
              )}
            </div>
            <p className={styles.heroOverview}>{featured.overview}</p>
            <div className={styles.heroBtns}>
              <button className={styles.heroPlayBtn} onClick={() => select(featured)}>
                <Play size={14} fill="currentColor" /> Play
              </button>
              <button className={styles.heroInfoBtn} onClick={() => select(featured)}>
                <Info size={15} /> More Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimal Filter Bar */}
      <FilterBar 
        pageType="movies" 
        filters={filters} 
        onChange={setFilters} 
      />

      {hasActiveFilters ? (
        <div className={styles.seeAllContainer}>
          <MediaGrid
            items={discoverResults}
            type="movie"
            loading={discoverLoading}
            onSelect={select}
            selectedId={player?.selectedId}
          />
          <Pagination
            currentPage={filterPage}
            totalPages={filterTotalPages}
            onPageChange={setFilterPage}
          />
        </div>
      ) : (
        loading ? (
          <div className={styles.loader}>
            <div className={styles.spinner}></div>
          </div>
        ) : (
          <div className={styles.rowsDashboard}>
            <MediaRow
              title="Trending Movies"
              items={trending}
              type="movie"
              onSelect={select}
              onSeeAll={() => {
                setSeeAllPage(1)
                setViewSection({
                  title: 'Trending Movies',
                  fetchFn: api.trendingMovies,
                  type: 'movie'
                })
              }}
            />
            <MediaRow
              title="Top Rated Movies"
              items={topRated}
              type="movie"
              onSelect={select}
              onSeeAll={() => {
                setSeeAllPage(1)
                setViewSection({
                  title: 'Top Rated Movies',
                  fetchFn: api.topRatedMovies,
                  type: 'movie'
                })
              }}
            />
            <MediaRow
              title="Top 10 Movies"
              items={popular}
              type="movie"
              isTop10={true}
              onSelect={select}
            />
            <MediaRow
              title="Scramble Movies"
              items={scramble}
              type="movie"
              onSelect={select}
            />
          </div>
        )
      )}

      {player && (
        <Player {...player} onClose={closePlayer} />
      )}
    </div>
  )
}
