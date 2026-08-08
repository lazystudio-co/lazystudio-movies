import React from 'react'
import styles from './About.module.css'

export default function About() {
  return (
    <div className={styles.container}>
      <div className={styles.heroSection}>
        <h1 className={styles.title}>About LazyMovies</h1>
        <p className={styles.subtitle}>
          Your ultimate portal to discover movies, TV series, and anime from around the world.
          LazyMovies was built to make entertainment discovery simple, fast, and enjoyable.
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardIcon}>🎬</div>
          <h3>Our Mission</h3>
          <p>
            We aim to simplify your streaming workflow. In an era where media content is scattered
            across dozens of services, LazyMovies brings catalog search, database statistics, and
            meta-details together into one lightning-fast user interface — completely free of charge.
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>🔍</div>
          <h3>Smart Discovery</h3>
          <p>
            Find exactly what you want using advanced filtering. Browse by genre, year of release,
            country of production, language, or sort by popularity, latest, or top rating. Our
            filter system covers 30+ genres and 25+ countries.
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>📺</div>
          <h3>Extensive Catalog</h3>
          <p>
            Access metadata and stream links for thousands of Hollywood blockbusters, Bollywood hits,
            K-dramas, Japanese anime, and independent films — all in one single, unified dashboard.
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>📝</div>
          <h3>Original Reviews</h3>
          <p>
            Our Blog & Reviews section features hand-written, in-depth articles covering movie
            reviews, streaming industry analysis, and cultural guides — giving you the context
            you need to decide what to watch next.
          </p>
        </div>
      </div>

      <section className={styles.attributionSection}>
        <h2>Data Attribution</h2>
        <p>
          All movie, television, and actor metadata — including plot summaries, ratings, cast lists,
          and poster images — is sourced from The Movie Database (TMDB) API, the world's most
          comprehensive open-access entertainment database.
        </p>
        <div className={styles.tmdbBox}>
          <p className={styles.tmdbText}>
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
          <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className={styles.tmdbLink}>
            Visit TMDB →
          </a>
        </div>
      </section>

      <section className={styles.legalSection}>
        <h2>Copyright &amp; DMCA Disclaimer</h2>
        <p>
          LazyMovies is an open database browser and indexing engine. All movie information and image
          links are populated programmatically via public web interfaces (TMDB API). We do
          <strong> not host, upload, store, or distribute</strong> any copyrighted video files,
          movies, or media assets on our servers.
        </p>
        <p>
          All embedded video players shown on this site are provided by independent third-party
          hosting services. LazyMovies has no control over the content of those third-party services.
          If you believe any content infringes on your copyright, please contact the respective
          third-party hosting provider directly.
        </p>
        <p>
          For DMCA inquiries specifically regarding LazyMovies.vercel.app, contact us at:{' '}
          <a href="mailto:dmca@lazymovies.app" className={styles.emailLink}>dmca@lazymovies.app</a>
        </p>
      </section>

      <section className={styles.legalSection}>
        <h2>Advertising</h2>
        <p>
          LazyMovies is supported by advertising via Google AdSense. We display ads on pages
          containing rich editorial content (such as our Blog & Reviews section). We do not
          display ads on pages without substantial user-facing content. Google may use cookies
          to serve relevant ads to you based on your browsing history. For more information,
          see our{' '}
          <strong>Privacy Policy</strong>.
        </p>
      </section>
    </div>
  )
}
