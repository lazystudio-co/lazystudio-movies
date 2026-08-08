import React, { useState } from 'react'
import { Search, X } from 'lucide-react'
import Home from './pages/Home.jsx'
import Movies from './pages/Movies.jsx'
import TV from './pages/TV.jsx'
import Anime from './pages/Anime.jsx'
import Blog from './pages/Blog.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Privacy from './pages/Privacy.jsx'
import Terms from './pages/Terms.jsx'
import styles from './App.module.css'

function clearMovieSession() {
  ['mv_query', 'mv_player', 'home_selected_tv', 'home_player'].forEach(k => sessionStorage.removeItem(k))
}

export default function App() {
  const [tab, setTab] = useState(() => sessionStorage.getItem('cs_tab') || 'home')
  const [homeKey, setHomeKey] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  function goTab(t) {
    setTab(t)
    sessionStorage.setItem('cs_tab', t)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goHome() {
    clearMovieSession()
    setTab('home')
    sessionStorage.setItem('cs_tab', 'home')
    setHomeKey(k => k + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.logo} onClick={goHome} aria-label="Go to home">
            LazyMovies
          </button>
          <nav className={styles.tabs}>
            <button
              className={`${styles.tab} ${tab === 'home' ? styles.active : ''}`}
              onClick={() => goTab('home')}
            >
              Home
            </button>
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
            <button
              className={`${styles.tab} ${tab === 'anime' ? styles.active : ''}`}
              onClick={() => goTab('anime')}
            >
              Anime
            </button>
            <button
              className={`${styles.tab} ${tab === 'blog' ? styles.active : ''}`}
              onClick={() => goTab('blog')}
            >
              Blog & Reviews
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
        {tab === 'home' && <Home searchQuery={searchQuery} key={homeKey} />}
        {tab === 'movies' && <Movies searchQuery={searchQuery} />}
        {tab === 'tv' && <TV searchQuery={searchQuery} />}
        {tab === 'anime' && <Anime searchQuery={searchQuery} />}
        {tab === 'blog' && <Blog />}
        {tab === 'about' && <About />}
        {tab === 'contact' && <Contact />}
        {tab === 'privacy' && <Privacy />}
        {tab === 'terms' && <Terms />}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <button onClick={() => goTab('about')} className={styles.footerMenuBtn}>About Us</button>
          <button onClick={() => goTab('contact')} className={styles.footerMenuBtn}>Contact Us</button>
          <button onClick={() => goTab('privacy')} className={styles.footerMenuBtn}>Privacy Policy</button>
          <button onClick={() => goTab('terms')} className={styles.footerMenuBtn}>Terms of Service</button>
        </div>
        <p className={styles.footerText}>
          &copy; {new Date().getFullYear()}{' '}
          <a
            href="https://lazystudio.co"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            LazyStudio
          </a>
          . All rights reserved.
        </p>
      </footer>
    </div>
  )
}
