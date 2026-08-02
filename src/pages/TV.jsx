import React, { useState, useEffect } from 'react'
import { Play, Info, Star } from 'lucide-react'
import { api, formatRating, getYear, backdropUrl, posterUrl } from '../lib/api.js'
import MediaGrid from '../components/MediaGrid.jsx'
import MediaRow from '../components/MediaRow.jsx'
import Player from '../components/Player.jsx'
import SeasonPicker from '../components/SeasonPicker.jsx'
import FilterBar from '../components/FilterBar.jsx'
import Pagination from '../components/Pagination.jsx'
import styles from './TV.module.css'

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

export default function TV({ searchQuery }) {
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
    country: '',
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

  // Search state
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)

  const [selected, setSelected] = useState(() => hydrate('tv_selected'))
  const [player, setPlayer] = useState(() => hydrate('tv_player'))

  // Load category datasets on mount
  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.trendingTV(),
      api.topRatedTV(),
      api.popularTV()
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
  const hasActiveFilters = filters.genre || filters.country || filters.sortBy !== 'popularity.desc'
  
  useEffect(() => {
    if (!hasActiveFilters || searchQuery.trim()) return

    setDiscoverLoading(true)
    setDiscoverResults([])

    api.discoverTV({
      genre: filters.genre,
      sortBy: filters.sortBy,
      country: filters.country,
      page: filterPage
    }).then(d => {
      setDiscoverResults(d.results || [])
      setFilterTotalPages(d.total_pages || 1)
    }).finally(() => setDiscoverLoading(false))
  }, [filters, filterPage, searchQuery, hasActiveFilters])

  // Execute global search
  useEffect(() => {
    const q = searchQuery.trim()
    if (!q) {
      setSearchResults([])
      return
    }

    setSearchLoading(true)
    const delayDebounce = setTimeout(() => {
      api.searchTV(q)
        .then(d => {
          setSearchResults(d.results || [])
        })
        .finally(() => setSearchLoading(false))
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [searchQuery])

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
          type="tv"
          loading={seeAllLoading}
          onSelect={(item) => {
            setSelected(item)
            persist('tv_selected', item)
            setPlayer(null)
            persist('tv_player', null)
          }}
          selectedId={selected?.id}
        />

        <Pagination
          currentPage={seeAllPage}
          totalPages={seeAllTotalPages}
          onPageChange={setSeeAllPage}
        />

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
      </div>
    )
  }

  // Render global search grid
  if (searchQuery.trim()) {
    return (
      <div className={styles.seeAllContainer}>
        <div className={styles.seeAllHeader}>
          <h1 className={styles.seeAllTitle}>Search Results</h1>
        </div>

        <MediaGrid
          items={searchResults}
          type="tv"
          loading={searchLoading}
          onSelect={(item) => {
            setSelected(item)
            persist('tv_selected', item)
            setPlayer(null)
            persist('tv_player', null)
          }}
          selectedId={selected?.id}
        />

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
            <span className={styles.heroBadge}>Featured TV Series</span>
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
                  persist('tv_selected', featured)
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
                  persist('tv_player', p)
                }}
              >
                <Play size={14} fill="currentColor" /> Play
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
                <Info size={15} /> More Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimal Filter Bar */}
      <FilterBar 
        pageType="tv" 
        filters={filters} 
        onChange={setFilters} 
      />

      {hasActiveFilters ? (
        <div className={styles.seeAllContainer}>
          <MediaGrid
            items={discoverResults}
            type="tv"
            loading={discoverLoading}
            onSelect={(item) => {
              setSelected(item)
              persist('tv_selected', item)
              setPlayer(null)
              persist('tv_player', null)
            }}
            selectedId={selected?.id}
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
              title="Trending TV Shows"
              items={trending}
              type="tv"
              onSelect={(item) => {
                setSelected(item)
                persist('tv_selected', item)
                setPlayer(null)
                persist('tv_player', null)
              }}
              onSeeAll={() => {
                setSeeAllPage(1)
                setViewSection({
                  title: 'Trending TV Shows',
                  fetchFn: api.trendingTV,
                  type: 'tv'
                })
              }}
            />

            {/* expad */}
            <div className={styles.adContainer}>
              <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-2988471757020856"
                data-ad-slot="9353223324"
                data-ad-format="auto"
                data-full-width-responsive="true"
                ref={(el) => {
                  if (el && !el.dataset.adInitialized) {
                    try {
                      (window.adsbygoogle = window.adsbygoogle || []).push({});
                      el.dataset.adInitialized = 'true';
                    } catch (e) {
                      console.error('Adsense error:', e);
                    }
                  }
                }}
              />
            </div>

            <MediaRow
              title="Top Rated TV Shows"
              items={topRated}
              type="tv"
              onSelect={(item) => {
                setSelected(item)
                persist('tv_selected', item)
                setPlayer(null)
                persist('tv_player', null)
              }}
              onSeeAll={() => {
                setSeeAllPage(1)
                setViewSection({
                  title: 'Top Rated TV Shows',
                  fetchFn: api.topRatedTV,
                  type: 'tv'
                })
              }}
            />
            <MediaRow
              title="Top 10 TV Shows"
              items={popular}
              type="tv"
              isTop10={true}
              onSelect={(item) => {
                setSelected(item)
                persist('tv_selected', item)
                setPlayer(null)
                persist('tv_player', null)
              }}
            />
            <MediaRow
              title="Scramble TV Shows"
              items={scramble}
              type="tv"
              onSelect={(item) => {
                setSelected(item)
                persist('tv_selected', item)
                setPlayer(null)
                persist('tv_player', null)
              }}
            />
          </div>
        )
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
    </div>
  )
}
