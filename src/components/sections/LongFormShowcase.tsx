'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const getYoutubeId = (url: string) => {
  const regExp =
    /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[1].length === 11 ? match[1] : ''
}

const longFormVideos = [
  {
    id: 1,
    youtubeUrl: 'https://youtu.be/iAZneS8Aelg',
    title: "Going to a Stranger's Wedding Without an Invitation",
    client: 'Dhruv Thakkar',
    duration: '',
    views: 'Re-Edit Project',
    tags: ['Re-Edit', 'Storytelling', 'YouTube'],
  },
  {
    id: 2,
    youtubeUrl: 'https://youtu.be/347KC-myLFI',
    title: "Hiding in a YouTuber's Video (2 Segments)",
    client: 'Dhruv Thakkar',
    duration: '',
    views: '75K Views • 3 Days Ago',
    tags: ['Re-Edit', 'Retention Editing', 'YouTube'],
  },
  {
    id: 3,
    youtubeUrl: 'https://youtu.be/moJJxkZJZ-o',
    title: 'IKEA Meet Re-Edit',
    client: 'Dhruv Thakkar',
    duration: '',
    views: 'Re-Edit Project',
    tags: ['Re-Edit', 'Cinematic', 'YouTube'],
  },
  {
    id: 4,
    youtubeUrl: 'https://youtu.be/MZ0imzxkNDA',
    title: 'Classroom Challenge Segment',
    client: 'Dhruv Thakkar',
    duration: '',
    views: '434K Views • 3 Months Ago',
    tags: ['Segment Edit', 'Retention Editing', 'YouTube'],
  },
 {
    id: 5,
    youtubeUrl: "https://youtu.be/rehBk2jh_O8",
    title: "Live Stream Highlights Edit",
    client: "Dhruv Thakkar",
    views: "Re-Edit Project",
    tags: ["Live Stream", "Highlights", "YouTube"],
  },
  {
    id: 6,
    youtubeUrl: "https://youtu.be/2D2juZwXLhA",
    title: "Loyalty Test & Scam Investigation Animations",
    client: "Dhruv Thakkar",
    views: "1.46M+ Combined Views",
    tags: ["Animation", "Motion Graphics", "YouTube"],
  },
];


type Video = typeof longFormVideos[0]

function LongFormCard({ video, index, onClick }: { video: Video; index: number; onClick: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hovering, setHovering] = useState(false)

  const handleMouseEnter = () => {
    setHovering(true)
    videoRef.current?.play().catch(() => {})
  }
  const handleMouseLeave = () => {
    setHovering(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="longform-card group cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Video / poster area */}
      <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: '16/9' }}>
       <img
  src={`https://img.youtube.com/vi/${getYoutubeId(video.youtubeUrl)}/maxresdefault.jpg`}
  alt={video.title}
  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
/>
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{ background: 'linear-gradient(to top, rgba(5,5,8,0.9) 0%, transparent 60%)', opacity: hovering ? 0.5 : 1 }}
        />
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: hovering ? 1.15 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="w-16 h-16 rounded-full bg-ember/90 backdrop-blur flex items-center justify-center shadow-[0_0_30px_rgba(255,77,26,0.5)]"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
              <path d="M7 4L17 10L7 16V4Z" />
            </svg>
          </motion.div>
        </div>
        {/* Duration badge */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded bg-void/80 backdrop-blur font-mono text-[10px] text-ash border border-white/10">
          {video.duration}
        </div>
        {/* YT badge */}
        <div className="absolute top-3 left-3 px-2 py-1 rounded bg-ember/20 border border-ember/40 font-mono text-[9px] text-ember uppercase tracking-wider backdrop-blur">
          YouTube
        </div>
      </div>

      {/* Info below */}
      <div className="pt-4 px-1">
        <h3 className="font-display font-bold text-pure text-base sm:text-lg group-hover:text-ember transition-colors duration-300 mb-1">
          {video.title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs text-ash">
            Client: <span className="text-ghost">{video.client}</span>
          </div>
          <div className="font-mono text-xs text-ember">{video.views} views</div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {video.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 rounded-full bg-obsidian border border-white/8 font-mono text-[9px] text-ash uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function LongFormLightbox({ video, onClose, onPrevious, onNext, currentIndex, total }: { video: Video; onClose: () => void; onPrevious?: () => void; onNext?: () => void; currentIndex?: number; total?: number }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { 
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && onPrevious) onPrevious()
      if (e.key === 'ArrowRight' && onNext) onNext()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrevious, onNext])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-void/97 backdrop-blur-xl p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className="relative w-full max-w-5xl"
          onClick={e => e.stopPropagation()}
        >
          <iframe
  src={`https://www.youtube.com/embed/${getYoutubeId(
    video.youtubeUrl
  )}?autoplay=1`}
  title={video.title}
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
  className="w-full rounded-2xl"
  style={{
    maxHeight: '80vh',
    aspectRatio: '16/9',
  }}
/>

          {/* Left arrow */}
          {total && total > 1 && onPrevious && (
            <button
              onClick={onPrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-20 w-10 h-10 rounded-full bg-graphite/80 border border-white/20 flex items-center justify-center text-ghost hover:text-ember hover:border-ember transition-all hidden md:flex"
              title="Previous (← Arrow)"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 4L6 10l6 6" />
              </svg>
            </button>
          )}

          {/* Right arrow */}
          {total && total > 1 && onNext && (
            <button
              onClick={onNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-20 w-10 h-10 rounded-full bg-graphite/80 border border-white/20 flex items-center justify-center text-ghost hover:text-ember hover:border-ember transition-all hidden md:flex"
              title="Next (→ Arrow)"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 4l6 6-6 6" />
              </svg>
            </button>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-graphite border border-white/10 flex items-center justify-center text-ghost hover:text-ember hover:border-ember transition-colors z-10"
            title="Close (ESC)"
          >
            ✕
          </button>

          {/* Mobile nav buttons */}
          {total && total > 1 && (
            <div className="flex gap-3 md:hidden mt-4 justify-center">
              {onPrevious && (
                <button
                  onClick={onPrevious}
                  className="px-4 py-2 rounded-full bg-graphite border border-white/20 text-ghost hover:text-ember text-sm"
                >
                  ← Prev
                </button>
              )}
              {onNext && (
                <button
                  onClick={onNext}
                  className="px-4 py-2 rounded-full bg-graphite border border-white/20 text-ghost hover:text-ember text-sm"
                >
                  Next →
                </button>
              )}
            </div>
          )}

          {/* Info */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="font-mono text-xs text-ember uppercase tracking-wider">Long Form · YouTube</div>
              <div className="font-display text-xl font-bold text-pure mt-1">{video.title}</div>
            </div>
            <div className="flex items-center gap-4">
              {currentIndex !== undefined && total && (
                <div className="font-mono text-xs text-ash">{currentIndex + 1} / {total}</div>
              )}
              <div className="font-mono text-sm text-ash">
                {video.views} views · {video.duration}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function LongFormShowcase() {
  const [activeVideo, setActiveVideo] = useState<Video | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.08 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const openVideo = (video: Video) => {
    setActiveVideo(video)
    setCurrentIndex(longFormVideos.indexOf(video))
  }

  const goToPrevious = () => {
    const newIdx = (currentIndex - 1 + longFormVideos.length) % longFormVideos.length
    setCurrentIndex(newIdx)
    setActiveVideo(longFormVideos[newIdx])
  }

  const goToNext = () => {
    const newIdx = (currentIndex + 1) % longFormVideos.length
    setCurrentIndex(newIdx)
    setActiveVideo(longFormVideos[newIdx])
  }

  useEffect(() => {
    if (!activeVideo) return
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
      if (e.key === 'Escape') setActiveVideo(null)
    }
    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [currentIndex, activeVideo])

  return (
    <section id="longform" ref={ref as any} className="section-pad bg-graphite relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-ember/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/4 rounded-full blur-3xl pointer-events-none" />

      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="mb-16"
        >
          <div className="font-mono text-xs text-ember uppercase tracking-[0.3em] mb-4">
            — Long Form
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2
              className="font-display font-black text-pure leading-none"
              style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}
            >
              YouTube Edits
            </h2>
            <p className="text-ash font-body text-sm max-w-xs md:text-right">
              Long-form edits with cinematic storytelling, precision cuts, and retention-optimised pacing.
            </p>
          </div>

          {/* Stats strip */}
          <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-white/8">
            {[
              { val: '2.5M+', label: 'Total Views' },
              { val: '5+', label: 'Videos Edited' },
              { val: '2 Months', label: 'With Dhruv Thakkar' },
              { val: '4K', label: 'Quality Output' },
            ].map(s => (
              <div key={s.label}>
                <div className="font-display font-black text-2xl ember-text">{s.val}</div>
                <div className="font-mono text-[10px] text-ash uppercase tracking-wider mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Grid — 2 cols on mobile, 2 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          <AnimatePresence>
            {visible && longFormVideos.map((video, i) => (
              <LongFormCard
                key={video.id}
                video={video}
                index={i}
                onClick={() => openVideo(video)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Link to channel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <a
            href="https://www.youtube.com/@dhruvthakkar2604"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-3 border border-white/20 rounded-full font-mono text-xs text-ash uppercase tracking-widest hover:border-ember hover:text-ember transition-all duration-300"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm3.2 8.32l-4.4 2.88A.4.4 0 016 10.88V5.12a.4.4 0 01.8-.32l4.4 2.88a.4.4 0 010 .64z" />
            </svg>
            View Full Channel
          </a>
        </motion.div>
      </div>

      {activeVideo && (
        <LongFormLightbox 
          video={activeVideo} 
          onClose={() => setActiveVideo(null)} 
          onPrevious={goToPrevious}
          onNext={goToNext}
          currentIndex={currentIndex}
          total={longFormVideos.length}
        />
      )}
    </section>
  )
}
