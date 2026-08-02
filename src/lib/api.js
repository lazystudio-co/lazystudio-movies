export const TMDB_KEY = 'f2cf8015356367c33cd3983ded071cbc' // get tmdb api key free at https://www.themoviedb.org/settings/api
export const EMBED_API_KEY = 'nx_f463c46b30f6b4d73c97fe110930aa26' // get movie api key at https://api.codespecters.com/api
export const EMBED_BASE = 'https://api.codespecters.com'
export const IMG_BASE = 'https://image.tmdb.org/t/p/w300'
export const IMG_BASE_LG = 'https://image.tmdb.org/t/p/w780'

async function tmdbFetch(path) {
  const sep = path.includes('?') ? '&' : '?'
  const res = await fetch(`https://api.themoviedb.org/3${path}${sep}api_key=${TMDB_KEY}`)
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`)
  return res.json()
}

export const api = {
  trendingAll: (page = 1) => tmdbFetch(`/trending/all/week?page=${page}`),
  trendingMovies: (page = 1) => tmdbFetch(`/trending/movie/week?page=${page}`),
  trendingTV: (page = 1) => tmdbFetch(`/trending/tv/week?page=${page}`),
  searchMovies: (q, page = 1) => tmdbFetch(`/search/movie?query=${encodeURIComponent(q)}&page=${page}`),
  searchTV: (q, page = 1) => tmdbFetch(`/search/tv?query=${encodeURIComponent(q)}&page=${page}`),
  movieDetails: (id) => tmdbFetch(`/movie/${id}`),
  tvDetails: (id) => tmdbFetch(`/tv/${id}`),
  seasonDetails: (id, season) => tmdbFetch(`/tv/${id}/season/${season}`),
  trendingAnime: (page = 1) => tmdbFetch(`/discover/tv?with_genres=16&with_original_language=ja&sort_by=popularity.desc&page=${page}`),
  searchAnime: (q, page = 1) => tmdbFetch(`/search/tv?query=${encodeURIComponent(q)}&page=${page}`)
    .then(d => {
      const results = (d.results || []).filter(item => 
        (item.genre_ids && item.genre_ids.includes(16)) || 
        item.original_language === 'ja' ||
        (item.origin_country && item.origin_country.includes('JP'))
      )
      return { results, total_pages: d.total_pages }
    }),
  topRatedMovies: (page = 1) => tmdbFetch(`/movie/top_rated?page=${page}`),
  popularMovies: (page = 1) => tmdbFetch(`/movie/popular?page=${page}`),
  popularTV: (page = 1) => tmdbFetch(`/tv/popular?page=${page}`),
  topRatedTV: (page = 1) => tmdbFetch(`/tv/top_rated?page=${page}`),
  discoverGenreMovies: (genreId, page = 1) => tmdbFetch(`/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=${page}`),
  searchMulti: (q, page = 1) => tmdbFetch(`/search/multi?query=${encodeURIComponent(q)}&page=${page}`),
  
  discoverMovies: ({ genre, year, sortBy, country, page = 1 }) => {
    let path = `/discover/movie?page=${page}`
    if (genre) path += `&with_genres=${genre}`
    if (year) path += `&primary_release_year=${year}`
    if (sortBy) path += `&sort_by=${sortBy}`
    if (country) path += `&with_origin_country=${country}`
    return tmdbFetch(path)
  },
  discoverTV: ({ genre, year, sortBy, country, page = 1 }) => {
    let path = `/discover/tv?page=${page}`
    if (genre) path += `&with_genres=${genre}`
    if (year) path += `&first_air_date_year=${year}`
    if (sortBy) path += `&sort_by=${sortBy}`
    if (country) path += `&with_origin_country=${country}`
    return tmdbFetch(path)
  },
  discoverAnime: ({ genre, sortBy, page = 1 }) => {
    let path = `/discover/tv?with_genres=16&with_original_language=ja&origin_country=JP&page=${page}`
    if (genre && genre !== '16') path += `,${genre}`
    if (sortBy) path += `&sort_by=${sortBy}`
    return tmdbFetch(path)
  }
}

export function movieEmbedUrl(tmdbId) {
  return `${EMBED_BASE}/embed/movie/${tmdbId}?apikey=${EMBED_API_KEY}`
}

export function tvEmbedUrl(tmdbId, season, episode) {
  return `${EMBED_BASE}/embed/tv/${tmdbId}/${season}/${episode}?apikey=${EMBED_API_KEY}`
}

export function posterUrl(path, large = false) {
  if (!path) return null
  return (large ? IMG_BASE_LG : IMG_BASE) + path
}

export function backdropUrl(path, size = 'w1280') {
  if (!path) return null
  return `https://image.tmdb.org/t/p/${size}${path}`
}

export function formatRating(rating) {
  if (!rating) return null
  return parseFloat(rating).toFixed(1)
}

export function getYear(dateStr) {
  return (dateStr || '').slice(0, 4)
}
