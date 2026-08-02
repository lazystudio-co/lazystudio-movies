export const TMDB_KEY = 'f2cf8015356367c33cd3983ded071cbc' // get tmdb api key free at https://www.themoviedb.org/settings/api
export const EMBED_BASE = 'https://api.codespecters.com'
export const IMG_BASE = 'https://image.tmdb.org/t/p/w300'
export const IMG_BASE_LG = 'https://image.tmdb.org/t/p/w780'

const MOVIE_GENRE_MAP = {
  'Action': '28',
  'Adventure': '12',
  'Animation': '16',
  'Biography': '36', // History
  'Comedy': '35',
  'Crime': '80',
  'Documentary': '99',
  'Drama': '18',
  'Family': '10751',
  'Fantasy': '14',
  'Film-Noir': '80,9648',
  'Game-Show': '10764',
  'History': '36',
  'Horror': '27',
  'Music': '10402',
  'Musical': '10402',
  'Mystery': '9648',
  'News': '10763',
  'Reality-TV': '10764',
  'Romance': '10749',
  'Sci-Fi': '878',
  'Short': '10770',
  'Sport': '99',
  'Talk-Show': '10767',
  'Thriller': '53',
  'War': '10752',
  'Western': '37'
}

const TV_GENRE_MAP = {
  'Action': '10759',
  'Adventure': '10759',
  'Animation': '16',
  'Biography': '99',
  'Comedy': '35',
  'Crime': '80',
  'Documentary': '99',
  'Drama': '18',
  'Family': '10751',
  'Fantasy': '10765',
  'Film-Noir': '80,9648',
  'Game-Show': '10764',
  'History': '36',
  'Horror': '27',
  'Music': '10402',
  'Musical': '10402',
  'Mystery': '9648',
  'News': '10763',
  'Reality-TV': '10764',
  'Romance': '10749',
  'Sci-Fi': '10765',
  'Short': '16',
  'Sport': '10759',
  'Talk-Show': '10767',
  'Thriller': '9648',
  'War': '10768',
  'Western': '37'
}

const COUNTRY_MAP = {
  'United States': 'US',
  'United Kingdom': 'GB',
  'Korea': 'KR',
  'Japan': 'JP',
  'Bangladesh': 'BD',
  'China': 'CN',
  'Egypt': 'EG',
  'France': 'FR',
  'Germany': 'DE',
  'India': 'IN',
  'Indonesia': 'ID',
  'Iraq': 'IQ',
  'Italy': 'IT',
  'Ivory Coast': 'CI',
  'Kenya': 'KE',
  'Lebanon': 'LB',
  'Mexico': 'MX',
  'Morocco': 'MA',
  'Nigeria': 'NG',
  'Pakistan': 'PK',
  'Philippines': 'PH',
  'Russia': 'RU',
  'Saudi Arabia': 'SA',
  'South Africa': 'ZA',
  'Spain': 'ES',
  'Syria': 'SY',
  'Thailand': 'TH',
  'Malaysia': 'MY',
  'Turkey': 'TR'
}

const LANGUAGE_MAP = {
  'English dub': 'en',
  'French dub': 'fr',
  'Hindi dub': 'hi',
  'Bengali dub': 'bn',
  'Urdu dub': 'ur',
  'Punjabi dub': 'pa',
  'Tamil dub': 'ta',
  'Telugu dub': 'te',
  'Malayalam dub': 'ml',
  'Kannada dub': 'kn',
  'Arabic dub': 'ar',
  'Arabic sub': 'ar',
  'Tagalog dub': 'tl',
  'Indonesian dub': 'id',
  'Russian dub': 'ru',
  'Kurdish sub': 'ku',
  'Spanish dub': 'es',
  'Spanish sub': 'es',
  'SpanishLatam dub': 'es'
}

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
  
  discoverMovies: ({ genre, year, sortBy, country, language, page = 1 }) => {
    let path = `/discover/movie?page=${page}`
    
    if (genre) {
      const genreId = MOVIE_GENRE_MAP[genre]
      if (genreId) path += `&with_genres=${genreId}`
    }
    
    if (year) {
      if (year.endsWith('s')) {
        const decadeStart = parseInt(year)
        path += `&primary_release_date.gte=${decadeStart}-01-01&primary_release_date.lte=${decadeStart + 9}-12-31`
      } else if (year === 'Other') {
        path += `&primary_release_date.lte=1979-12-31`
      } else {
        path += `&primary_release_year=${year}`
      }
    }
    
    let sortByParam = 'popularity.desc'
    if (sortBy === 'Hottest') {
      sortByParam = 'popularity.desc'
    } else if (sortBy === 'Latest') {
      sortByParam = 'release_date.desc'
    } else if (sortBy === 'Rating') {
      sortByParam = 'vote_average.desc&vote_count.gte=100'
    } else if (sortBy) {
      sortByParam = sortBy
    }
    path += `&sort_by=${sortByParam}`
    
    if (country) {
      if (country === 'Other') {
        // Exclude major countries
        path += `&without_countries=US,GB,KR,JP,IN,CN,FR,DE,IT,ES`
      } else {
        const countryCode = COUNTRY_MAP[country]
        if (countryCode) path += `&with_origin_country=${countryCode}`
      }
    }
    
    if (language) {
      const langCode = LANGUAGE_MAP[language]
      if (langCode) path += `&with_original_language=${langCode}`
    }
    
    return tmdbFetch(path)
  },
  
  discoverTV: ({ genre, year, sortBy, country, language, page = 1 }) => {
    let path = `/discover/tv?page=${page}`
    
    if (genre) {
      const genreId = TV_GENRE_MAP[genre]
      if (genreId) path += `&with_genres=${genreId}`
    }
    
    if (year) {
      if (year.endsWith('s')) {
        const decadeStart = parseInt(year)
        path += `&first_air_date.gte=${decadeStart}-01-01&first_air_date.lte=${decadeStart + 9}-12-31`
      } else if (year === 'Other') {
        path += `&first_air_date.lte=1979-12-31`
      } else {
        path += `&first_air_date_year=${year}`
      }
    }
    
    let sortByParam = 'popularity.desc'
    if (sortBy === 'Hottest') {
      sortByParam = 'popularity.desc'
    } else if (sortBy === 'Latest') {
      sortByParam = 'first_air_date.desc'
    } else if (sortBy === 'Rating') {
      sortByParam = 'vote_average.desc&vote_count.gte=30'
    } else if (sortBy) {
      sortByParam = sortBy
    }
    path += `&sort_by=${sortByParam}`
    
    if (country) {
      if (country === 'Other') {
        path += `&without_countries=US,GB,KR,JP,IN,CN,FR,DE,IT,ES`
      } else {
        const countryCode = COUNTRY_MAP[country]
        if (countryCode) path += `&with_origin_country=${countryCode}`
      }
    }
    
    if (language) {
      const langCode = LANGUAGE_MAP[language]
      if (langCode) path += `&with_original_language=${langCode}`
    }
    
    return tmdbFetch(path)
  },
  
  discoverAnime: ({ genre, year, sortBy, page = 1 }) => {
    let path = `/discover/tv?with_genres=16&with_original_language=ja&origin_country=JP&page=${page}`
    
    if (genre) {
      const genreId = TV_GENRE_MAP[genre]
      if (genreId && genreId !== '16') {
        path += `,${genreId}`
      }
    }
    
    if (year) {
      if (year.endsWith('s')) {
        const decadeStart = parseInt(year)
        path += `&first_air_date.gte=${decadeStart}-01-01&first_air_date.lte=${decadeStart + 9}-12-31`
      } else if (year === 'Other') {
        path += `&first_air_date.lte=1979-12-31`
      } else {
        path += `&first_air_date_year=${year}`
      }
    }
    
    let sortByParam = 'popularity.desc'
    if (sortBy === 'Hottest') {
      sortByParam = 'popularity.desc'
    } else if (sortBy === 'Latest') {
      sortByParam = 'first_air_date.desc'
    } else if (sortBy === 'Rating') {
      sortByParam = 'vote_average.desc&vote_count.gte=10'
    } else if (sortBy) {
      sortByParam = sortBy
    }
    path += `&sort_by=${sortByParam}`
    
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
