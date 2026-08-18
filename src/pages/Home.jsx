import React, { useState, useEffect } from 'react'
import { Play, Info, Star } from 'lucide-react'
import { api, formatRating, getYear, backdropUrl, posterUrl } from '../lib/api.js'
import MediaGrid from '../components/MediaGrid.jsx'
import MediaRow from '../components/MediaRow.jsx'
import Player from '../components/Player.jsx'
import SeasonPicker from '../components/SeasonPicker.jsx'
import FilterBar from '../components/FilterBar.jsx'
import Pagination from '../components/Pagination.jsx'
import styles from './Home.module.css'

function persist(key, val) { try { sessionStorage.setItem(key, JSON.stringify(val)) } catch { } }
function hydrate(key) { try { const v = sessionStorage.getItem(key); return v ? JSON.parse(v) : null } catch { return null } }

export default function Home({ searchQuery }) {
  // Rows data states
  const [trending, setTrending] = useState([])
  const [topRatedMovies, setTopRatedMovies] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [popularTV, setPopularTV] = useState([])
  const [actionAdventure, setActionAdventure] = useState([])
  const [fantasy, setFantasy] = useState([])
  const [romance, setRomance] = useState([])
  const [funny, setFunny] = useState([])

  const [featured, setFeatured] = useState(null)
  const [loading, setLoading] = useState(true)

  // Search state
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)

  // Filter states
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    country: '',
    language: '',
    sortBy: 'ForYou',
    contentType: 'all',
    activeCategory: ''
  })
  const [filterPage, setFilterPage] = useState(1)
  const [filterTotalPages, setFilterTotalPages] = useState(1)
  const [discoverResults, setDiscoverResults] = useState([])
  const [discoverLoading, setDiscoverLoading] = useState(false)

  // Sub-view: "See All" grids
  const [viewSection, setViewSection] = useState(null)
  const [seeAllItems, setSeeAllItems] = useState([])
  const [seeAllLoading, setSeeAllLoading] = useState(false)
  const [seeAllPage, setSeeAllPage] = useState(1)
  const [seeAllTotalPages, setSeeAllTotalPages] = useState(1)

  // Playback & details modal overlay states
  const [selectedTV, setSelectedTV] = useState(() => hydrate('home_selected_tv'))
  const [player, setPlayer] = useState(() => hydrate('home_player'))

  // Load all sections on mount
  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.trendingAll(),
      api.topRatedMovies(),
      api.popularMovies(),
      api.popularTV(),
      api.discoverGenreMovies('28,12'),
      api.discoverGenreMovies('14'),
      api.discoverGenreMovies('10749'),
      api.discoverGenreMovies('35')
    ]).then(([trend, topM, popM, popT, act, fan, rom, fun]) => {
      const trendingItems = trend.results || []
      setTrending(trendingItems)

      // Filter trending movies for featured hero banner
      const movies = trendingItems.filter(item => item.media_type === 'movie' || (!item.media_type && item.title))
      if (movies.length > 0) {
        setFeatured(movies[0])
      } else if (trendingItems.length > 0) {
        setFeatured(trendingItems[0])
      }

      setTopRatedMovies(topM.results || [])
      setPopularMovies(popM.results || [])
      setPopularTV(popT.results || [])
      setActionAdventure(act.results || [])
      setFantasy(fan.results || [])
      setRomance(rom.results || [])
      setFunny(fun.results || [])
    }).finally(() => setLoading(false))
  }, [])

  // Execute global search
  useEffect(() => {
    const q = searchQuery.trim()
    if (!q) {
      setSearchResults([])
      return
    }

    setSearchLoading(true)
    const delayDebounce = setTimeout(() => {
      api.searchMulti(q)
        .then(d => {
          const items = (d.results || []).filter(item => item.media_type === 'movie' || item.media_type === 'tv')
          setSearchResults(items)
        })
        .finally(() => setSearchLoading(false))
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [searchQuery])

  // Fetch discover query based on filter selections
  const hasActiveFilters =
    filters.genre ||
    filters.year ||
    filters.country ||
    filters.language ||
    filters.activeCategory ||
    (filters.contentType && filters.contentType !== 'all') ||
    (filters.sortBy && filters.sortBy !== 'ForYou')

  useEffect(() => {
    if (!hasActiveFilters || searchQuery.trim()) return

    setDiscoverLoading(true)
    setDiscoverResults([])

    const { genre, year, sortBy, country, language } = filters
    const type = filters.contentType || 'all'

    if (type === 'movie') {
      api.discoverMovies({ genre, year, sortBy, country, language, page: filterPage })
        .then(d => {
          setDiscoverResults(d.results || [])
          setFilterTotalPages(d.total_pages || 1)
        })
        .finally(() => setDiscoverLoading(false))
    } else if (type === 'tv') {
      api.discoverTV({ genre, year, sortBy, country, language, page: filterPage })
        .then(d => {
          setDiscoverResults(d.results || [])
          setFilterTotalPages(d.total_pages || 1)
        })
        .finally(() => setDiscoverLoading(false))
    } else {
      // Mixed type: fetch both in parallel and merge
      const moviePromise = api.discoverMovies({ genre, year, sortBy, country, language, page: filterPage })
      const tvPromise = api.discoverTV({ genre, year, sortBy, country, language, page: filterPage })

      Promise.all([moviePromise, tvPromise])
        .then(([movies, tv]) => {
          const mixed = [
            ...(movies.results || []).map(item => ({ ...item, media_type: 'movie' })),
            ...(tv.results || []).map(item => ({ ...item, media_type: 'tv' }))
          ]

          // Sort mixed results
          if (sortBy === 'Rating') {
            mixed.sort((a, b) => b.vote_average - a.vote_average)
          } else if (sortBy === 'Latest') {
            const getDate = item => item.release_date || item.first_air_date || ''
            mixed.sort((a, b) => getDate(b).localeCompare(getDate(a)))
          } else {
            mixed.sort((a, b) => b.popularity - a.popularity)
          }

          setDiscoverResults(mixed.slice(0, 20))
          setFilterTotalPages(Math.max(movies.total_pages || 1, tv.total_pages || 1))
        })
        .finally(() => setDiscoverLoading(false))
    }
  }, [filters, filterPage, searchQuery, hasActiveFilters])

  // Fetch See All list
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

  // Reset page index on filter or search updates
  useEffect(() => {
    setFilterPage(1)
  }, [filters])

  // Unified select item handler (Movie or TV)
  function handleSelect(item) {
    const cardType = item.media_type || (item.name ? 'tv' : 'movie')
    if (cardType === 'tv') {
      setSelectedTV(item)
      setPlayer(null)
      persist('home_selected_tv', item)
      persist('home_player', null)
    } else {
      setSelectedTV(null)
      persist('home_selected_tv', null)
      const p = {
        tmdbId: item.id,
        type: 'movie',
        title: item.title || item.original_title,
        year: getYear(item.release_date),
        rating: formatRating(item.vote_average),
        overview: item.overview,
        selectedId: item.id,
      }
      setPlayer(p)
      persist('home_player', p)
    }
  }

  function handlePlay(season, episode) {
    if (!selectedTV) return
    const p = {
      tmdbId: selectedTV.id,
      type: 'tv',
      season: season,
      episode: episode,
      title: selectedTV.name,
      year: getYear(selectedTV.first_air_date),
      rating: formatRating(selectedTV.vote_average),
      overview: selectedTV.overview,
      badge: `S${season} · E${episode}`,
      selectedId: selectedTV.id,
    }
    setPlayer(p)
    persist('home_player', p)
  }

  function handlePlayDefault() {
    handlePlay(1, 1)
  }

  function handleCloseModal() {
    setSelectedTV(null)
    setPlayer(null)
    persist('home_selected_tv', null)
    persist('home_player', null)
  }

  // Render global search grid
  if (searchQuery.trim()) {
    return (
      <div className={styles.searchWrap}>
        <p className={styles.sectionLabel}>Search Results</p>
        <MediaGrid
          items={searchResults}
          type="movie"
          loading={searchLoading}
          onSelect={handleSelect}
          selectedId={player?.selectedId || selectedTV?.id}
        />
        {selectedTV && (
          <Player
            {...player}
            backdrop={backdropUrl(selectedTV.backdrop_path, 'w1280') || posterUrl(selectedTV.poster_path, true)}
            title={selectedTV.name}
            year={getYear(selectedTV.first_air_date)}
            rating={formatRating(selectedTV.vote_average)}
            overview={selectedTV.overview}
            badge={player?.badge}
            onClose={handleCloseModal}
            onPlayDefault={handlePlayDefault}
          >
            <SeasonPicker show={selectedTV} onPlay={handlePlay} />
          </Player>
        )}
        {player && !selectedTV && (
          <Player {...player} onClose={handleCloseModal} />
        )}
      </div>
    )
  }

  // Render paginated see all grid
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
          type={viewSection.type}
          loading={seeAllLoading}
          onSelect={handleSelect}
          selectedId={player?.selectedId || selectedTV?.id}
        />

        <Pagination
          currentPage={seeAllPage}
          totalPages={seeAllTotalPages}
          onPageChange={setSeeAllPage}
        />

        {selectedTV && (
          <Player
            {...player}
            backdrop={backdropUrl(selectedTV.backdrop_path, 'w1280') || posterUrl(selectedTV.poster_path, true)}
            title={selectedTV.name}
            year={getYear(selectedTV.first_air_date)}
            rating={formatRating(selectedTV.vote_average)}
            overview={selectedTV.overview}
            badge={player?.badge}
            onClose={handleCloseModal}
            onPlayDefault={handlePlayDefault}
          >
            <SeasonPicker show={selectedTV} onPlay={handlePlay} />
          </Player>
        )}
        {player && !selectedTV && (
          <Player {...player} onClose={handleCloseModal} />
        )}
      </div>
    )
  }

  return (
    <div>
      {/* Featured Banner */}
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
            <h1 className={styles.heroTitle}>{featured.title || featured.original_title}</h1>
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
              <button className={styles.heroPlayBtn} onClick={() => handleSelect(featured)}>
                <Play size={14} fill="currentColor" /> Play
              </button>
              <button className={styles.heroInfoBtn} onClick={() => handleSelect(featured)}>
                <Info size={15} /> More Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <FilterBar
        pageType="home"
        filters={filters}
        onChange={setFilters}
      />

      {/* Discover Filtered Grid (Shown when filters are active) */}
      {hasActiveFilters ? (
        <div className={styles.seeAllContainer}>
          <MediaGrid
            items={discoverResults}
            type={filters.contentType === 'tv' ? 'tv' : 'movie'}
            loading={discoverLoading}
            onSelect={handleSelect}
            selectedId={player?.selectedId || selectedTV?.id}
          />
          <Pagination
            currentPage={filterPage}
            totalPages={filterTotalPages}
            onPageChange={setFilterPage}
          />
        </div>
      ) : (
        /* Normal Rows Dashboard */
        loading ? (
          <div className={styles.loader}>
            <div className={styles.spinner}></div>
          </div>
        ) : (
          <div className={styles.rowsDashboard}>
            <MediaRow
              title="Trending Now"
              items={trending}
              onSelect={handleSelect}
              onSeeAll={() => {
                setSeeAllPage(1)
                setViewSection({
                  title: 'Trending Now',
                  fetchFn: api.trendingAll,
                  type: 'movie'
                })
              }}
            />



            <MediaRow
              title="Top Rated Movies"
              items={topRatedMovies}
              type="movie"
              onSelect={handleSelect}
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
              title="Popular Movies"
              items={popularMovies}
              type="movie"
              onSelect={handleSelect}
              onSeeAll={() => {
                setSeeAllPage(1)
                setViewSection({
                  title: 'Popular Movies',
                  fetchFn: api.popularMovies,
                  type: 'movie'
                })
              }}
            />
            <MediaRow
              title="Top 10 Movies"
              items={popularMovies}
              type="movie"
              isTop10={true}
              onSelect={handleSelect}
            />
            <MediaRow
              title="Popular TV Shows"
              items={popularTV}
              type="tv"
              onSelect={handleSelect}
              onSeeAll={() => {
                setSeeAllPage(1)
                setViewSection({
                  title: 'Popular TV Shows',
                  fetchFn: api.popularTV,
                  type: 'tv'
                })
              }}
            />
            <MediaRow
              title="Top 10 TV Shows"
              items={popularTV}
              type="tv"
              isTop10={true}
              onSelect={handleSelect}
            />

            {/* Genre Sections */}
            <MediaRow
              title="Action & Adventure"
              items={actionAdventure}
              type="movie"
              onSelect={handleSelect}
              onSeeAll={() => {
                setSeeAllPage(1)
                setViewSection({
                  title: 'Action & Adventure',
                  fetchFn: (p) => api.discoverGenreMovies('28,12', p),
                  type: 'movie'
                })
              }}
            />
            <MediaRow
              title="Fantasy"
              items={fantasy}
              type="movie"
              onSelect={handleSelect}
              onSeeAll={() => {
                setSeeAllPage(1)
                setViewSection({
                  title: 'Fantasy',
                  fetchFn: (p) => api.discoverGenreMovies('14', p),
                  type: 'movie'
                })
              }}
            />
            <MediaRow
              title="Romance"
              items={romance}
              type="movie"
              onSelect={handleSelect}
              onSeeAll={() => {
                setSeeAllPage(1)
                setViewSection({
                  title: 'Romance',
                  fetchFn: (p) => api.discoverGenreMovies('10749', p),
                  type: 'movie'
                })
              }}
            />
            <MediaRow
              title="Funny"
              items={funny}
              type="movie"
              onSelect={handleSelect}
              onSeeAll={() => {
                setSeeAllPage(1)
                setViewSection({
                  title: 'Funny',
                  fetchFn: (p) => api.discoverGenreMovies('35', p),
                  type: 'movie'
                })
              }}
            />

            {/* Rich Publisher Content Section for AdSense Value */}
            <section className={styles.guideSection}>
              <h2 className={styles.guideTitle}>LazyMovies — Free Streaming & Metadata Indexing Guide</h2>
              <p className={styles.guideParagraph}>
                LazyMovies is a comprehensive, open entertainment index designed to help film buffs, TV show binge-watchers, and anime enthusiasts discover, organize, and explore world cinema. Our database aggregates metadata, user ratings, cast profiles, and release schedules from verified public data endpoints including The Movie Database (TMDB).
              </p>
              <p className={styles.guideParagraph}>
                Whether you are searching for award-winning Hollywood blockbusters, critically acclaimed independent films, trending Korean dramas, or classic 90s hand-drawn Japanese animation, LazyMovies offers fast multi-faceted search filters by genre, year of release, country of origin, and language.
              </p>

              <div className={styles.guideGrid}>
                <div className={styles.guideCard}>
                  <h3 className={styles.guideCardTitle}>🎬 Thousands of Titles Indexed</h3>
                  <p className={styles.guideCardText}>
                    Explore over 100,000+ indexed movies, television series, and animated features updated daily with real-time popularity rankings and ratings.
                  </p>
                </div>
                <div className={styles.guideCard}>
                  <h3 className={styles.guideCardTitle}>🔍 Advanced Dynamic Filtering</h3>
                  <p className={styles.guideCardText}>
                    Refine your search across 30+ film genres, release years ranging from classic cinema to 2026 releases, and 25+ international production origins.
                  </p>
                </div>
                <div className={styles.guideCard}>
                  <h3 className={styles.guideCardTitle}>📝 Original Editorial Reviews</h3>
                  <p className={styles.guideCardText}>
                    Visit our Blog & Reviews section for in-depth film breakdowns, streaming industry economic analysis, and cultural retrospectives written by our editorial team.
                  </p>
                </div>
              </div>
            </section>

            {/* Frequently Asked Questions (FAQ) */}
            <section className={styles.faqSection}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              <div className={styles.faqList}>
                <div className={styles.faqItem}>
                  <h3 className={styles.faqQuestion}>What is LazyMovies?</h3>
                  <p className={styles.faqAnswer}>
                    LazyMovies is a free online catalog and search engine for movies, television series, and anime. We consolidate ratings, cast information, plot summaries, and streaming references into a unified, user-friendly interface.
                  </p>
                </div>
                <div className={styles.faqItem}>
                  <h3 className={styles.faqQuestion}>How does LazyMovies source its media content?</h3>
                  <p className={styles.faqAnswer}>
                    All movie and television metadata—including artwork, overviews, ratings, and release dates—is fetched programmatically via the TMDB API. Video streaming links rely on third-party public indexing widgets.
                  </p>
                </div>
                <div className={styles.faqItem}>
                  <h3 className={styles.faqQuestion}>Is LazyMovies free to use?</h3>
                  <p className={styles.faqAnswer}>
                    Yes, LazyMovies is 100% free to access without registration or subscription fees. Our site is supported by non-intrusive advertising on pages containing original publisher content.
                  </p>
                </div>
                <div className={styles.faqItem}>
                  <h3 className={styles.faqQuestion}>How can I submit feedback or report issues?</h3>
                  <p className={styles.faqAnswer}>
                    You can contact our support and editorial team at any time via the Contact Us page or by emailing support@lazymovies.app.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )
      )}

      {/* Detail Overlay Modals */}
      {selectedTV && (
        <Player
          {...player}
          backdrop={backdropUrl(selectedTV.backdrop_path, 'w1280') || posterUrl(selectedTV.poster_path, true)}
          title={selectedTV.name}
          year={getYear(selectedTV.first_air_date)}
          rating={formatRating(selectedTV.vote_average)}
          overview={selectedTV.overview}
          badge={player?.badge}
          onClose={handleCloseModal}
          onPlayDefault={handlePlayDefault}
        >
          <SeasonPicker show={selectedTV} onPlay={handlePlay} />
        </Player>
      )}
      {player && !selectedTV && (
        <Player {...player} onClose={handleCloseModal} />
      )}
    </div>
  )
}
