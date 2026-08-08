import React, { useState, useEffect } from 'react'
import styles from './Blog.module.css'

const ARTICLES = [
  {
    id: 'scifi-guide-2026',
    title: 'Top 10 Sci-Fi TV Shows of 2026: The Ultimate Streaming Guide',
    date: 'August 8, 2026',
    author: 'Leo Vance',
    category: 'Streaming Guide',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    summary: 'Explore the absolute best science fiction television series airing in 2026. From deep-space political dramas to mind-bending cyberpunk thrillers, here is your essential watch list.',
    content: (
      <>
        <p>
          Science fiction television has entered a golden age in 2026. With larger budgets, advanced digital production techniques, and an unprecedented focus on cerebral storytelling, creators are pushing boundaries like never before. In this guide, we break down the top 10 sci-fi shows that you need to watch right now, detailing their premises, why they stand out, and where they fit in the broader evolution of the genre.
        </p>

        <h2>1. Echoes of Kepler (Season 2)</h2>
        <p>
          Following the stunning cliffhanger of its freshman season, <em>Echoes of Kepler</em> returns with a heavier emphasis on interplanetary politics and the psychological toll of deep-space colonization. Set on a humid, biologically dense exoplanet in the Kepler-186 system, the series follows a fragmented crew of scientists and military personnel who discover a dormant bio-mechanical network beneath the planet's crust.
        </p>
        <p>
          What makes Season 2 a masterpiece is its commitment to "hard" science fiction. Rather than relying on soft sci-fi tropes, the writers consult astrophysicists and exobiologists to portray realistic colony structures, atmospheric pressures, and evolutionary pathways. The visual effects are breathtaking, blending physical sets with state-of-the-art virtual stages to create an immersive, claustrophobic atmosphere.
        </p>

        <h2>2. Cyber-City: Neo-Kobe</h2>
        <p>
          Adapting the cult-classic graphical novel series, <em>Cyber-City: Neo-Kobe</em> is a neon-drenched cyberpunk thriller that explores the intersection of corporate hegemony and cognitive liberty. In a hyper-dense metropolis controlled by rival cybernetics conglomerates, a disgraced digital detective is hired to track down a rogue artificial intelligence that is compiling human consciousnesses.
        </p>
        <p>
          The show excels in its thematic depth. It asks challenging questions about the nature of identity: If your memories can be backed up, modified, or leased by a corporation, do you still own your soul? Neo-Kobe features a pulsing synth-wave soundtrack and stunning cinematography that mirrors the dark, rain-slicked aesthetics of classic cyberpunk.
        </p>

        <h2>3. Chrono-Loop</h2>
        <p>
          Time travel is notoriously difficult to write without creating plot holes, but <em>Chrono-Loop</em> handles its mechanics with mathematical precision. The story centers on a team of research physicists who accidentally invent a device capable of sending a single human consciousness exactly 11 minutes into the past.
        </p>
        <p>
          Instead of saving the world, the characters use the device to prevent local crimes, resolve personal tragedies, and manipulate financial markets. Naturally, the butterfly effect spirals out of control. Each episode is a tense, self-contained puzzle that contributes to a larger, mind-bending seasonal arc. It demands your full attention and rewards multiple viewings.
        </p>

        <h2>4. The Solar Wind</h2>
        <p>
          Part survival drama, part character study, <em>The Solar Wind</em> is set entirely aboard a cargo shuttle traveling from Earth to Mars. When a massive coronal mass ejection destroys the ship's communications array and damages the life support system, the crew must rely on their ingenuity—and deal with their growing paranoia—to survive the remaining four months of the journey.
        </p>
        <p>
          The series is highly praised for its realistic depiction of zero-gravity physics and the psychological effects of sensory deprivation. With a small cast and a single location, it relies heavily on top-tier acting and a claustrophobic script that highlights human resilience.
        </p>

        <h2>5. Silicon Dreams</h2>
        <p>
          In a world where humanoid androids are fully integrated into civil society, <em>Silicon Dreams</em> explores the legal, ethical, and personal dynamics of artificial consciousness. Unlike other action-focused android dramas, this series is a slow-burn courtroom and political procedural.
        </p>
        <p>
          The show follows a dedicated human rights lawyer defending an android accused of murder. It raises profound legal questions about machine autonomy and programming compliance. If an android's neural network evolves beyond its factory parameters, does it deserve civil rights? The intellectual debates are as gripping as any action sequence.
        </p>

        <h2>6. Outpost Delta</h2>
        <p>
          Situated at the edge of the solar system, Outpost Delta is a mining station on a frozen moon of Saturn. When the drill pierces through miles of ice into a hidden subsurface ocean, they uncover a non-carbon-based life form.
        </p>
        <p>
          The show masterfully builds tension, morphing from an industrial workplace drama into an eerie sci-fi horror series. It avoids cheap jump scares, opting instead for psychological terror and the dread of the unknown.
        </p>

        <h2>7. The Singularity</h2>
        <p>
          This anthology series explores different facets of the near-future, post-human transition. Each standalone episode is set in a different decade, charting humanity's relationship with neural interfaces, synthetic biology, and space elevator engineering.
        </p>
        <p>
          It serves as a speculative mirror to our modern technological trajectory, warning us of the social stratification and identity loss that could accompany unchecked biological augmentation.
        </p>

        <h2>8. Void Runners</h2>
        <p>
          For fans of space operas, <em>Void Runners</em> offers a massive, galaxy-spanning epic. It follows a ragtag group of scrap metal haulers who stumble upon an ancient, faster-than-light engine from a long-lost alien civilization.
        </p>
        <p>
          Suddenly target number one for the galactic government, the crew must navigate corrupt space stations, asteroid belts, and outlaw colonies. The show features incredibly creative alien designs and fun, witty dialogue.
        </p>

        <h2>9. The Grid</h2>
        <p>
          Set in a completely virtual reality world where the wealthy have uploaded their minds to escape a ruined Earth, <em>The Grid</em> follows a hacker who uncovers a dark secret: the simulation is running out of memory, and low-income digital residents are being quietly deleted.
        </p>
        <p>
          It is a sharp allegory for socioeconomic inequality, wrapped in a high-octane matrix-style action thriller.
        </p>

        <h2>10. Last Horizon</h2>
        <p>
          An optimistic, retro-futuristic exploration drama, <em>Last Horizon</em> is about the first crewed mission to exit the Oort Cloud and head toward Alpha Centauri. It focuses on the power of scientific discovery, cooperation, and the hope of finding a new home.
        </p>
        <p>
          In contrast to the dark, dystopian tone of most modern sci-fi, this show is a refreshing return to the sense of wonder and adventure that defined classic science fiction.
        </p>
      </>
    )
  },
  {
    id: 'retro-anime-comeback',
    title: 'Why Retro Anime is Making a Massive Comeback this Decade',
    date: 'August 1, 2026',
    author: 'Sora Tanaka',
    category: 'Anime Culture',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    summary: 'A look at the resurgence of 80s and 90s aesthetic in modern anime, the rise of city pop culture, and why hand-drawn styles are captivating the new generation.',
    content: (
      <>
        <p>
          Walk into any anime convention in 2026, and you will notice a fascinating trend: teenage fans are rocking vintage gear, raving about shows released thirty years ago, and listening to city pop. Retro anime—specifically works from the late 1980s and the 1990s—is experiencing a massive cultural renaissance. But this is more than just nostalgic pining; it is a profound aesthetic shift that is redefining the industry.
        </p>

        <h2>The Aesthetic Rebellion Against Digital Cleanliness</h2>
        <p>
          For the past two decades, anime production has transitioned almost entirely to digital painting and compositing. While this has allowed for spectacular action sequences and clean lines, it has also introduced a uniform "digital sheen."
        </p>
        <p>
          Modern viewers, saturated with pixel-perfect, computer-generated animation, are finding themselves drawn to the imperfections of hand-drawn cell animation. The rich grain of film, the slight paint inconsistencies, the watercolor backdrops, and the dramatic cel shading of vintage anime like <em>Neon Genesis Evangelion</em>, <em>Cowboy Bebop</em>, or <em>Akira</em> possess a tangible, organic warmth that digital software struggles to replicate.
        </p>

        <h2>The City Pop and Future Funk Influence</h2>
        <p>
          You cannot talk about the retro anime boom without discussing the music that accompanies it. The global rediscovery of Japanese City Pop (such as Mariya Takeuchi's "Plastic Love") has sparked a visual movement. YouTube channels and music producers loop clips of vintage anime characters riding trains at night or walking through rain-slicked Tokyo streets to accompany lo-fi beats and future funk.
        </p>
        <p>
          This has created a powerful synergy: the music drives fans to seek out the anime, and the anime aesthetics inspire the music. Shows like <em>Kimagure Orange Road</em>, <em>City Hunter</em>, and <em>Bubblegum Crisis</em> have found entirely new audiences through this digital loop.
        </p>

        <h2>Coping with the Future: Retrofuturism</h2>
        <p>
          The late 20th century was a unique period in human history, characterized by rapid technological advancement mixed with analog hardware. Retro anime captures this transition perfectly, featuring CRT monitors, cassette tapes, floppy disks, and bulky cybernetic limbs.
        </p>
        <p>
          This "analog-futurism" feels incredibly romantic to a generation that has grown up in a world of touchscreens, algorithms, and cloud storage. It represents a future that was physical, mechanical, and tactile.
        </p>

        <h2>How Modern Studios Are Adapting</h2>
        <p>
          Recognizing this demand, modern studios are beginning to emulate retro design choices. We are seeing a rise in shows that use artificial film grain, warmer color palettes, and rounder, more expressive character designs reminiscent of the late 90s.
        </p>
        <p>
          The retro comeback shows us that in animation, newer isn't always better. By looking back, the industry is finding new ways to innovate, creating a bridge between the analog mastery of the past and the digital tools of the present.
        </p>
      </>
    )
  },
  {
    id: 'oppenheimer-review',
    title: "A Deep-Dive Review of Oppenheimer: Christopher Nolan's Magnum Opus",
    date: 'July 25, 2026',
    author: 'Elena Rostova',
    category: 'Movie Review',
    image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80',
    summary: 'An analytical review of Nolan’s historical masterpiece, exploring its non-linear narrative, sound design, character studies, and moral complexity.',
    content: (
      <>
        <p>
          Christopher Nolan has built his reputation on temporal manipulation, cerebral puzzles, and cinematic scale. Yet, with <em>Oppenheimer</em>, the director channels these techniques into a historical biography that registers as a psychological thriller. It is a terrifying, brilliant, and morally complex look at the man who ushered in the atomic age.
        </p>

        <h2>The Tension of a Non-Linear Mind</h2>
        <p>
          Rather than telling J. Robert Oppenheimer's story chronologically, Nolan structures the movie around two distinct perspectives: "Fission" (in color, representing Oppenheimer's subjective experience) and "Fusion" (in black and white, representing the objective political machinations of Lewis Strauss).
        </p>
        <p>
          This structural division is not just a gimmick. It mirrors the dual nature of Oppenheimer himself: a brilliant theorist who is simultaneously a naive political player, a creator of a weapon of mass destruction who becomes a champion for international nuclear control. The editing is frantic yet controlled, jumping across decades to build tension that rivals any thriller.
        </p>

        <h2>Sound Design as a Weapon</h2>
        <p>
          While the visual effects—especially the recreation of the Trinity test using practical effects—are stunning, it is the sound design that carries the movie's psychological weight. Nolan uses silence as a dramatic device, leaving the audience alone with the deafening quiet of the blast before the sonic boom hits.
        </p>
        <p>
          Even more impressive is the recurring motif of foot-stomping. First heard as a celebratory applause at Los Alamos, it slowly mutates into a terrifying, mechanical roar of guilt in Oppenheimer's mind. The score by Ludwig Göransson is equally vital, replacing traditional sweeping orchestral melodies with anxious violin solos and metallic synths that reflect the protagonist's fractured mental state.
        </p>

        <h2>Cillian Murphy's Haunted Portrayal</h2>
        <p>
          At the center of this hurricane is Cillian Murphy, whose performance is a masterclass in subtlety. With minimal dialogue, Murphy conveys Oppenheimer's intelligence, vanity, and ultimate horror through his eyes. He portrays a man haunted by the demon he has unleashed, realizing too late that he has given humanity the tools for its own destruction.
        </p>
        <p>
          The supporting cast, particularly Robert Downey Jr. as Lewis Strauss, is stellar. Downey Jr. delivers a sharp, calculated performance that contrasts beautifully with Murphy's quiet intensity.
        </p>

        <h2>A Moral Inquiry for the Modern Age</h2>
        <p>
          Ultimately, <em>Oppenheimer</em> is not just a biography; it is a warning. It asks us to consider the ethical responsibilities of scientific discovery. As we stand on the brink of new technological revolutions in artificial intelligence and gene editing, Nolan's film serves as a powerful reminder of what happens when scientific progress outpaces moral wisdom.
        </p>
      </>
    )
  },
  {
    id: 'streaming-evolution-2026',
    title: 'Streaming Evolution: How Free Platforms Are Changing the Industry Landscape',
    date: 'July 18, 2026',
    author: 'Marcus Brody',
    category: 'Industry Analysis',
    image: 'https://images.unsplash.com/photo-1593789198777-f29bc259780e?auto=format&fit=crop&w=800&q=80',
    summary: 'An industry report on the shift from expensive subscription fatigue to hybrid ad-supported models, database aggregators, and the changing economics of media consumption.',
    content: (
      <>
        <p>
          Ten years ago, the future of media consumption was clear: a few premium, ad-free subscription platforms would completely replace traditional television. But in 2026, the landscape looks dramatically different. Subscription fatigue, rising prices, and database fragmentation have led to a massive resurgence in ad-supported and free indexing models.
        </p>

        <h2>The Rise of Subscription Fatigue</h2>
        <p>
          At the height of the streaming boom, users could access almost all major releases with one or two subscriptions. Today, content is divided across dozens of platforms, each demanding monthly fees.
        </p>
        <p>
          The average consumer is faced with a choice: pay upwards of $100 a month for multiple services, or miss out on popular shows. This fragmentation has driven users back to search engines, metadata aggregators, and ad-supported indexes that consolidate information and streaming options into a single, unified database.
        </p>

        <h2>The Economics of Ad-Supported Models</h2>
        <p>
          Advertisers are moving away from traditional television, shifting their budgets toward digital streaming sites. This has made ad-supported streaming highly lucrative. Platforms can offer content for free to the consumer while generating significant revenue through programmatic ad networks like Google AdSense.
        </p>
        <p>
          This hybrid model benefits both parties: users get free access to massive media databases, and publishers can monetize their traffic without charging users subscription fees.
        </p>

        <h2>The Role of Aggregators</h2>
        <p>
          In this fragmented environment, indexing sites have become essential tools. By indexing metadata from sources like TMDB, these platforms allow users to search for titles, check ratings, read reviews, and find stream sources from a single, clean dashboard.
        </p>
        <p>
          As the industry continues to evolve, the platforms that offer the most convenient, integrated user experience will succeed. The future of streaming is not locked behind expensive paywalls; it is open, ad-supported, and user-centric.
        </p>
      </>
    )
  }
]

export default function Blog() {
  const [selectedArticle, setSelectedArticle] = useState(null)

  useEffect(() => {
    // Scroll to top when switching article or entering/exiting reading mode
    window.scrollTo(0, 0)
  }, [selectedArticle])

  if (selectedArticle) {
    return (
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={() => setSelectedArticle(null)}>
          &larr; Back to Articles
        </button>

        <article className={styles.articleDetail}>
          <div className={styles.badge}>{selectedArticle.category}</div>
          <h1 className={styles.articleTitle}>{selectedArticle.title}</h1>
          
          <div className={styles.meta}>
            <span>By {selectedArticle.author}</span>
            <span className={styles.dot}>•</span>
            <span>{selectedArticle.date}</span>
          </div>

          <div 
            className={styles.detailHeroImage} 
            style={{ backgroundImage: `url(${selectedArticle.image})` }} 
          />

          <div className={styles.articleBody}>
            {selectedArticle.content}
          </div>

          {/* Compliant AdSense container inside detailed, rich article view */}
          <div className={styles.adContainer}>
            <p className={styles.adLabel}>Advertisement</p>
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
                    console.error('Adsense error inside blog:', e);
                  }
                }
              }}
            />
          </div>
        </article>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.hubHeader}>
        <h1 className={styles.hubTitle}>Blog & Reviews</h1>
        <p className={styles.hubSubtitle}>Original movie reviews, cultural insights, and industry streaming guides.</p>
      </div>

      <div className={styles.articleGrid}>
        {ARTICLES.map((article) => (
          <div 
            key={article.id} 
            className={styles.articleCard}
            onClick={() => setSelectedArticle(article)}
          >
            <div 
              className={styles.cardImage} 
              style={{ backgroundImage: `url(${article.image})` }}
            />
            <div className={styles.cardContent}>
              <span className={styles.cardCategory}>{article.category}</span>
              <h3 className={styles.cardTitle}>{article.title}</h3>
              <p className={styles.cardSummary}>{article.summary}</p>
              <div className={styles.cardMeta}>
                <span>{article.date}</span>
                <span className={styles.readMore}>Read Article &rarr;</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
