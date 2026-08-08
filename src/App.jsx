import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import Home from "./pages/Home.jsx";
import Movies from "./pages/Movies.jsx";
import TV from "./pages/TV.jsx";
import Anime from "./pages/Anime.jsx";
import Blog from "./pages/Blog.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import styles from "./App.module.css";

const BASE_URL = "https://lazymovies.vercel.app";
const DEFAULT_IMAGE = `${BASE_URL}/favicon.png`;

const PATH_TO_PAGE = {
  "/": "home",
  "/movies": "movies",
  "/tv": "tv",
  "/anime": "anime",
  "/blog": "blog",
  "/about": "about",
  "/contact": "contact",
  "/privacy": "privacy",
  "/terms": "terms",
};

const PAGE_TO_PATH = Object.fromEntries(
  Object.entries(PATH_TO_PAGE).map(([path, page]) => [page, path]),
);

const SEO_PAGES = {
  home: {
    title: "LazyMovies — Discover Movies, TV Shows & Anime",
    description:
      "LazyMovies is your free streaming and metadata search guide for movies, TV shows, and anime. Find trending titles, detailed reviews, and fast watch recommendations in one place.",
    keywords:
      "movies, TV shows, anime, streaming guide, watch online, film reviews, trending titles, streaming recommendations, metadata search",
    path: "/",
    ogTitle: "LazyMovies — Movies, TV Shows & Anime Search",
    ogDescription:
      "Discover trending movies, streaming TV shows, anime, and original reviews with fast search and filtering.",
    twitterTitle: "LazyMovies — Movies, TV Shows & Anime Search",
    twitterDescription:
      "Search trending movies, TV shows, and anime with advanced filters, reviews, and streaming suggestions.",
    image: DEFAULT_IMAGE,
  },
  movies: {
    title: "Movies — Trending Films, Reviews & Watch Guides",
    description:
      "Browse top-rated movies, latest film releases, and watch guides on LazyMovies. Filter by genre, year, country, and streaming availability.",
    keywords:
      "movies, trending movies, film reviews, watch guides, movie search, streaming movies",
    path: "/movies",
    ogTitle: "Movies — Trending Films on LazyMovies",
    ogDescription:
      "Browse top film releases, ratings, and watch suggestions on LazyMovies.",
    twitterTitle: "Movies — Trending Films on LazyMovies",
    twitterDescription:
      "Browse top film releases, ratings, and watch suggestions on LazyMovies.",
    image: DEFAULT_IMAGE,
  },
  tv: {
    title: "TV Shows — Popular Series & Streaming Guide",
    description:
      "Discover the best TV shows, binge-worthy series, and personalized streaming recommendations on LazyMovies.",
    keywords:
      "TV shows, streaming series, binge-worthy TV, popular TV, streaming guide",
    path: "/tv",
    ogTitle: "TV Shows — Popular Series on LazyMovies",
    ogDescription:
      "Discover the best TV shows and streaming series with ratings, summaries, and watch suggestions.",
    twitterTitle: "TV Shows — Popular Series on LazyMovies",
    twitterDescription:
      "Discover the best TV shows and streaming series with ratings, summaries, and watch suggestions.",
    image: DEFAULT_IMAGE,
  },
  anime: {
    title: "Anime — Trending Anime, Reviews & Watch List",
    description:
      "Explore anime series, films, and culture with expert recommendations, reviews, and streaming index pages.",
    keywords:
      "anime, trending anime, anime reviews, watch anime, anime streaming, anime guide",
    path: "/anime",
    ogTitle: "Anime — Trending Anime on LazyMovies",
    ogDescription:
      "Explore anime series, films, and reviews with streaming suggestions from LazyMovies.",
    twitterTitle: "Anime — Trending Anime on LazyMovies",
    twitterDescription:
      "Explore anime series, films, and reviews with streaming suggestions from LazyMovies.",
    image: DEFAULT_IMAGE,
  },
  blog: {
    title: "Blog & Reviews — Streaming Industry Insights",
    description:
      "Read original movie reviews, anime culture stories, and streaming industry analysis from LazyMovies.",
    keywords:
      "blog, movie reviews, anime culture, streaming industry, entertainment insights",
    path: "/blog",
    ogTitle: "Blog & Reviews — Streaming Insights on LazyMovies",
    ogDescription:
      "Read original reviews, industry analysis, and entertainment guides from LazyMovies.",
    twitterTitle: "Blog & Reviews — Streaming Insights on LazyMovies",
    twitterDescription:
      "Read original reviews, industry analysis, and entertainment guides from LazyMovies.",
    image: DEFAULT_IMAGE,
  },
  about: {
    title: "About LazyMovies — Your Streaming Search & Metadata Guide",
    description:
      "Learn more about LazyMovies, our mission to index movies, TV shows, and anime, and how we help viewers find what to watch next.",
    keywords:
      "about LazyMovies, streaming search, metadata guide, movie index, TV show index, anime index",
    path: "/about",
    ogTitle: "About LazyMovies — Streaming Search & Metadata Guide",
    ogDescription:
      "Learn more about LazyMovies and how we help viewers discover movies, TV shows, and anime.",
    twitterTitle: "About LazyMovies — Streaming Search & Metadata Guide",
    twitterDescription:
      "Learn more about LazyMovies and how we help viewers discover movies, TV shows, and anime.",
    image: DEFAULT_IMAGE,
  },
  contact: {
    title: "Contact LazyMovies — Get in Touch with Our Team",
    description:
      "Contact LazyMovies for support, feedback, advertising, or partnership inquiries in the movie and streaming metadata space.",
    keywords:
      "contact LazyMovies, support, feedback, advertising inquiry, partnership",
    path: "/contact",
    ogTitle: "Contact LazyMovies — Reach Our Team",
    ogDescription:
      "Contact LazyMovies for support, feedback, or partnership inquiries.",
    twitterTitle: "Contact LazyMovies — Reach Our Team",
    twitterDescription:
      "Contact LazyMovies for support, feedback, or partnership inquiries.",
    image: DEFAULT_IMAGE,
  },
  privacy: {
    title: "Privacy Policy — LazyMovies",
    description:
      "Read LazyMovies privacy policy to understand how we handle data, cookies, and user privacy on our movie and streaming guide website.",
    keywords:
      "privacy policy, LazyMovies privacy, data protection, cookies, user privacy",
    path: "/privacy",
    ogTitle: "Privacy Policy — LazyMovies",
    ogDescription:
      "Read LazyMovies privacy policy to understand our data handling and privacy practices.",
    twitterTitle: "Privacy Policy — LazyMovies",
    twitterDescription:
      "Read LazyMovies privacy policy to understand our data handling and privacy practices.",
    image: DEFAULT_IMAGE,
  },
  terms: {
    title: "Terms of Service — LazyMovies",
    description:
      "Review the LazyMovies terms of service, including our content usage, liability, and third-party streaming disclaimers.",
    keywords:
      "terms of service, LazyMovies terms, legal agreement, content usage, liability",
    path: "/terms",
    ogTitle: "Terms of Service — LazyMovies",
    ogDescription:
      "Review the LazyMovies terms of service and legal disclaimers for our streaming indexing platform.",
    twitterTitle: "Terms of Service — LazyMovies",
    twitterDescription:
      "Review the LazyMovies terms of service and legal disclaimers for our streaming indexing platform.",
    image: DEFAULT_IMAGE,
  },
};

function clearMovieSession() {
  ["mv_query", "mv_player", "home_selected_tv", "home_player"].forEach((k) =>
    sessionStorage.removeItem(k),
  );
}

function getPageFromUrl() {
  const path = window.location.pathname.toLowerCase().replace(/\/+$|^\//g, "");
  if (path === "") {
    return "home";
  }
  if (PATH_TO_PAGE[`/${path}`]) {
    return PATH_TO_PAGE[`/${path}`];
  }
  if (path.startsWith("blog/")) {
    return "blog";
  }

  const params = new URLSearchParams(window.location.search);
  const page = params.get("page");
  return page && Object.prototype.hasOwnProperty.call(SEO_PAGES, page)
    ? page
    : null;
}

function getPageHref(page) {
  return PAGE_TO_PATH[page] || "/";
}

function updateMetaTag(selector, attribute, value) {
  let tag = document.querySelector(selector);
  if (!tag) {
    const [tagName, attrName] = selector.split("[");
    tag = document.createElement(tagName);
    const attr = attrName.replace("]", "");
    const [name, attrValue] = attr.split("=").map((s) => s.replace(/"/g, ""));
    tag.setAttribute(name, attrValue);
    document.head.appendChild(tag);
  }
  tag.setAttribute(attribute, value);
}

function updateSeoMetadata(page) {
  const metadata = SEO_PAGES[page] || SEO_PAGES.home;
  const canonicalUrl = `${BASE_URL}${metadata.path}`;

  document.title = metadata.title;
  updateMetaTag('meta[name="description"]', "content", metadata.description);
  updateMetaTag('meta[name="keywords"]', "content", metadata.keywords);
  updateMetaTag('meta[name="robots"]', "content", "index, follow");
  updateMetaTag('meta[property="og:title"]', "content", metadata.ogTitle);
  updateMetaTag(
    'meta[property="og:description"]',
    "content",
    metadata.ogDescription,
  );
  updateMetaTag('meta[property="og:type"]', "content", "website");
  updateMetaTag('meta[property="og:url"]', "content", canonicalUrl);
  updateMetaTag('meta[property="og:image"]', "content", metadata.image);
  updateMetaTag('meta[name="twitter:card"]', "content", "summary_large_image");
  updateMetaTag('meta[name="twitter:title"]', "content", metadata.twitterTitle);
  updateMetaTag(
    'meta[name="twitter:description"]',
    "content",
    metadata.twitterDescription,
  );
  updateMetaTag('meta[name="twitter:image"]', "content", metadata.image);
  updateMetaTag('meta[name="twitter:site"]', "content", "@LazyMoviesApp");
  updateMetaTag('meta[name="twitter:creator"]', "content", "@LazyMoviesApp");

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = canonicalUrl;
  if (window.location.pathname !== metadata.path) {
    window.history.replaceState(null, "", canonicalUrl);
  }
}

export default function App() {
  const [tab, setTab] = useState(
    () => getPageFromUrl() || sessionStorage.getItem("cs_tab") || "home",
  );
  const [homeKey, setHomeKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  function goTab(page) {
    setTab(page);
    sessionStorage.setItem("cs_tab", page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goHome() {
    clearMovieSession();
    setTab("home");
    sessionStorage.setItem("cs_tab", "home");
    setHomeKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    updateSeoMetadata(tab);
  }, [tab]);

  useEffect(() => {
    const initialPage = getPageFromUrl();
    if (initialPage && initialPage !== tab) {
      setTab(initialPage);
      sessionStorage.setItem("cs_tab", initialPage);
    }
  }, []);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <a
            href={getPageHref("home")}
            className={styles.logo}
            onClick={(e) => {
              e.preventDefault();
              goHome();
            }}
            aria-label="Go to home"
          >
            LazyMovies
          </a>
          <nav className={styles.tabs}>
            <a
              href={getPageHref("home")}
              className={`${styles.tab} ${tab === "home" ? styles.active : ""}`}
              onClick={(e) => {
                e.preventDefault();
                goTab("home");
              }}
            >
              Home
            </a>
            <a
              href={getPageHref("movies")}
              className={`${styles.tab} ${tab === "movies" ? styles.active : ""}`}
              onClick={(e) => {
                e.preventDefault();
                goTab("movies");
              }}
            >
              Movies
            </a>
            <a
              href={getPageHref("tv")}
              className={`${styles.tab} ${tab === "tv" ? styles.active : ""}`}
              onClick={(e) => {
                e.preventDefault();
                goTab("tv");
              }}
            >
              TV Shows
            </a>
            <a
              href={getPageHref("anime")}
              className={`${styles.tab} ${tab === "anime" ? styles.active : ""}`}
              onClick={(e) => {
                e.preventDefault();
                goTab("anime");
              }}
            >
              Anime
            </a>
            <a
              href={getPageHref("blog")}
              className={`${styles.tab} ${tab === "blog" ? styles.active : ""}`}
              onClick={(e) => {
                e.preventDefault();
                goTab("blog");
              }}
            >
              Blog & Reviews
            </a>
          </nav>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.searchBarWrapper}>
            <Search className={styles.searchIcon} size={16} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Titles, people, genres..."
              className={styles.input}
            />
            {searchQuery && (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {tab === "home" && <Home searchQuery={searchQuery} key={homeKey} />}
        {tab === "movies" && <Movies searchQuery={searchQuery} />}
        {tab === "tv" && <TV searchQuery={searchQuery} />}
        {tab === "anime" && <Anime searchQuery={searchQuery} />}
        {tab === "blog" && <Blog />}
        {tab === "about" && <About />}
        {tab === "contact" && <Contact />}
        {tab === "privacy" && <Privacy />}
        {tab === "terms" && <Terms />}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a
            href={getPageHref("about")}
            className={styles.footerMenuBtn}
            onClick={(e) => {
              e.preventDefault();
              goTab("about");
            }}
          >
            About Us
          </a>
          <a
            href={getPageHref("contact")}
            className={styles.footerMenuBtn}
            onClick={(e) => {
              e.preventDefault();
              goTab("contact");
            }}
          >
            Contact Us
          </a>
          <a
            href={getPageHref("privacy")}
            className={styles.footerMenuBtn}
            onClick={(e) => {
              e.preventDefault();
              goTab("privacy");
            }}
          >
            Privacy Policy
          </a>
          <a
            href={getPageHref("terms")}
            className={styles.footerMenuBtn}
            onClick={(e) => {
              e.preventDefault();
              goTab("terms");
            }}
          >
            Terms of Service
          </a>
        </div>
        <p className={styles.footerText}>
          &copy; {new Date().getFullYear()}{" "}
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
  );
}
