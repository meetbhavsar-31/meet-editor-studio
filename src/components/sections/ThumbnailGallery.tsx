'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const thumbnails = [
  {
    id: 1,
    src: '/thumbnails/tanay-tiwari.png',
    ytLink: 'https://youtu.be/YU82GAYwDtc',
    category: 'YouTube',
    title: 'Tanay Tiwari Thumbnail',
    client: 'Tanay Tiwari',
  },
  {
    id: 2,
    src: '/thumbnails/thumb-yt.png',
    ytLink: '',
    category: 'YouTube',
    title: 'High CTR YouTube Thumbnail',
    client: 'Meet Bhavsar',
  },
  {
    id: 3,
    src: '/thumbnails/thumb-reel.png',
    ytLink: '',
    category: 'Reel',
    title: 'Viral Reel Cover Design',
    client: 'Meet Bhavsar',
  },
  {
    id: 4,
    src: '/thumbnails/thumb-color.png',
    ytLink: '',
    category: 'YouTube',
    title: 'Cinematic YouTube Thumbnail',
    client: 'Meet Bhavsar',
  },
  {
    id: 5,
    src: '/thumbnails/thumb-motion.png',
    ytLink: '',
    category: 'Reel',
    title: 'Instagram Reel Cover',
    client: 'Meet Bhavsar',
  },
  {
    id: 6,
    src: '/thumbnails/thumb-6.png',
    ytLink: '',
    category: 'YouTube',
    title: 'Bhoot Thumbnail Design',
    client: 'Meet Bhavsar',
  },
  {
    id: 7,
    src: '/thumbnails/thumb-7.png',
    ytLink: '',
    category: 'YouTube',
    title: 'The Lightkeeper',
    client: 'Meet Bhavsar',
  },
  {
    id: 8,
    src: '/thumbnails/thumb-8.png',
    ytLink: '',
    category: 'Reel',
    title: 'ZERO balance challenge',
    client: 'Meet Bhavsar',
  },
  {
    id: 9,
    src: '/thumbnails/thumb-9.png',
    ytLink: '',
    category: 'YouTube',
    title: 'I Became a Crime Detective',
    client: 'Meet Bhavsar',
  },
]

type Thumb = typeof thumbnails[0]

function ThumbCard({ thumb, onClick, index }: { thumb: Thumb; onClick: () => void; index: number }) {
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="thumb-card group cursor-pointer"
      onClick={onClick}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumb.src}
        alt={thumb.title}
        className={`w-full aspect-video object-cover transition-all duration-700 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading="lazy"
        onLoad={() => setImgLoaded(true)}
      />
      {!imgLoaded && (
        <div className="absolute inset-0 bg-graphite animate-pulse" />
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-void/95 via-void/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <div className="font-mono text-[10px] uppercase tracking-wider text-ember mb-0.5">{thumb.category}</div>
        <div className="font-display text-sm font-bold text-pure mb-1">{thumb.title}</div>
        <div className="font-mono text-[10px] text-ash">Client: {thumb.client}</div>
        {thumb.ytLink && (
          <div className="mt-2 flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-ember/20 border border-ember/50 flex items-center justify-center">
              <svg width="7" height="7" viewBox="0 0 8 8" fill="white">
                <path d="M0 8L8 0M8 0H3M8 0V5" />
              </svg>
            </div>
            <span className="font-mono text-[9px] text-ash">View on YouTube</span>
          </div>
        )}
      </div>

      {/* Category badge */}
      <div className="absolute top-2 left-2">
        <span className="px-2 py-0.5 rounded bg-void/75 backdrop-blur font-mono text-[9px] uppercase tracking-wider text-ember border border-ember/30">
          {thumb.category}
        </span>
      </div>
    </motion.div>
  )
}

export default function ThumbnailGallery() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [filter, setFilter] = useState('All')
  const [lightbox, setLightbox] = useState<Thumb | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.08 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const cats = ['All', 'YouTube', 'Reel']
  const filtered = filter === 'All' ? thumbnails : thumbnails.filter(t => t.category === filter)

  const openLightbox = (thumb: Thumb) => {
    setLightbox(thumb)
    setCurrentIndex(filtered.indexOf(thumb))
  }

  const goToPrevious = () => {
    const newIdx = (currentIndex - 1 + filtered.length) % filtered.length
    setCurrentIndex(newIdx)
    setLightbox(filtered[newIdx])
  }

  const goToNext = () => {
    const newIdx = (currentIndex + 1) % filtered.length
    setCurrentIndex(newIdx)
    setLightbox(filtered[newIdx])
  }

  useEffect(() => {
    if (!lightbox) return
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
      if (e.key === 'Escape') setLightbox(null)
    }
    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [currentIndex, filtered, lightbox])

  return (
    <section id="thumbnails" ref={ref as any} className="section-pad bg-obsidian relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="mb-16"
        >
          <div className="font-mono text-xs text-ember uppercase tracking-[0.3em] mb-4">
            — Thumbnail Design
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2
              className="font-display font-black text-pure leading-none"
              style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}
            >
              Thumbnails
            </h2>
            <div className="flex gap-3 flex-wrap">
              {cats.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`filter-tab ${filter === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <p className="text-ash font-body text-sm mt-4 max-w-md">
            Eye-catching thumbnails designed to maximise click-through rates. More coming soon.
          </p>
        </motion.div>

        <motion.div layout className="thumb-grid">
          <AnimatePresence mode="popLayout">
            {filtered.map((thumb, i) => (
              <ThumbCard key={thumb.id} thumb={thumb} index={i} onClick={() => setLightbox(thumb)} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-void/97 backdrop-blur-xl p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              className="relative max-w-4xl w-full"
              onClick={e => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightbox.src}
                alt={lightbox.title}
                className="w-full rounded-2xl max-h-[85vh] object-contain"
              />
              
              {/* Left arrow */}
              {filtered.length > 1 && (
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-graphite/80 border border-white/20 flex items-center justify-center text-ghost hover:text-ember hover:border-ember hover:bg-graphite transition-all md:flex hidden backdrop-blur"
                  title="Previous (← Arrow)"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 4L6 10l6 6" />
                  </svg>
                </button>
              )}

              {/* Right arrow */}
              {filtered.length > 1 && (
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-graphite/80 border border-white/20 flex items-center justify-center text-ghost hover:text-ember hover:border-ember hover:bg-graphite transition-all md:flex hidden backdrop-blur"
                  title="Next (→ Arrow)"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 4l6 6-6 6" />
                  </svg>
                </button>
              )}

              {/* Close button */}
              <button
                onClick={() => setLightbox(null)}
                className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-graphite border border-white/10 flex items-center justify-center text-ghost hover:text-ember hover:border-ember transition-colors"
                title="Close (ESC)"
              >
                ✕
              </button>

              {/* Mobile nav buttons */}
              {filtered.length > 1 && (
                <div className="flex gap-3 md:hidden mt-4 justify-center">
                  <button
                    onClick={goToPrevious}
                    className="px-4 py-2 rounded-full bg-graphite border border-white/20 text-ghost hover:text-ember text-sm"
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={goToNext}
                    className="px-4 py-2 rounded-full bg-graphite border border-white/20 text-ghost hover:text-ember text-sm"
                  >
                    Next →
                  </button>
                </div>
              )}

              {/* Info and nav counter */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="font-mono text-xs text-ember uppercase tracking-wider">{lightbox.category} · {lightbox.client}</div>
                  <div className="font-display text-xl font-bold text-pure mt-1">{lightbox.title}</div>
                </div>
                <div className="flex items-center gap-4">
                  {filtered.length > 1 && (
                    <div className="font-mono text-xs text-ash">
                      {currentIndex + 1} / {filtered.length}
                    </div>
                  )}
                  {lightbox.ytLink && (
                    <a
                      href={lightbox.ytLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2 bg-ember text-void font-mono text-xs uppercase tracking-widest font-bold rounded-full hover:bg-gold transition-colors"
                    >
                      Watch Video
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 10L10 2M10 2H6M10 2V6" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
