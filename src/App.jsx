import React, { useState } from 'react'
import { Search, X } from 'lucide-react'
import Movies from './pages/Movies.jsx'
import TV from './pages/TV.jsx'
import styles from './App.module.css'

function clearMovieSession() {
  ['mv_query', 'mv_player'].forEach(k => sessionStorage.removeItem(k))
}

export default function App() {
  const [tab, setTab] = useState(() => sessionStorage.getItem('cs_tab') || 'movies')
  const [homeKey, setHomeKey] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  function goTab(t) {
    setTab(t)
    sessionStorage.setItem('cs_tab', t)
  }

  function goHome() {
    clearMovieSession()
    setTab('movies')
    sessionStorage.setItem('cs_tab', 'movies')
    setHomeKey(k => k + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.logo} onClick={goHome} aria-label="Go to home">
            LazyStudio
          </button>
          <nav className={styles.tabs}>
            <button
              className={`${styles.tab} ${tab === 'movies' ? styles.active : ''}`}
              onClick={() => goTab('movies')}
            >
              Movies
            </button>
            <button
              className={`${styles.tab} ${tab === 'tv' ? styles.active : ''}`}
              onClick={() => goTab('tv')}
            >
              TV Shows
            </button>
          </nav>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.searchBarWrapper}>
            <Search className={styles.searchIcon} size={16} />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Titles, people, genres..."
              className={styles.input}
            />
            {searchQuery && (
              <button 
                type="button" 
                className={styles.clearBtn} 
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {tab === 'movies'
          ? <Movies searchQuery={searchQuery} key={homeKey} />
          : <TV searchQuery={searchQuery} />
        }
      </main>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          &copy; {new Date().getFullYear()} All rights reserved{' '}
          <a
            href="https://www.codespecters.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            Code Specter
          </a>
          {' '}| Digital Entertainment Democratized
        </p>
      </footer>
    </div>
  )
}
