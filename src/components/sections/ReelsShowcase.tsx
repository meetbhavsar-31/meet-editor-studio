'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const getYoutubeId = (url: string) => {
  const match = url.match(
    /(?:youtube\.com\/shorts\/|youtu\.be\/|youtube\.com\/watch\?v=)([^?&/]+)/
  )
  return match ? match[1] : ''
}

const reels: Reel[] = [
  {
    id: 1,
    youtubeUrl: 'https://youtube.com/shorts/3wiYSCtsIUo',
    title: 'Cinematic Reel #1',
    category: 'Short Form',
  },
  {
    id: 2,
    youtubeUrl: 'https://youtube.com/shorts/ZMJQd18Nl08',
    title: 'Cinematic Reel #2',
    category: 'Short Form',
  },
  {
    id: 3,
    youtubeUrl: 'https://youtube.com/shorts/AidMyjvZDNU',
    title: 'Cinematic Reel #3',
    category: 'Short Form',
  },
]

type Reel = {
  id: number
  youtubeUrl: string
  title: string
  category: string
}

function ReelCard({
  reel,
  onClick,
}: {
  reel: Reel
  onClick: () => void
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="reel-card group cursor-pointer"
      onClick={onClick}
    >
      <img
        src={`https://img.youtube.com/vi/${getYoutubeId(
          reel.youtubeUrl
        )}/maxresdefault.jpg`}
        alt={reel.title}
        className="w-full h-full object-cover"
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(5,5,8,0.85) 0%, transparent 55%)',
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
            <path d="M6 3.5L14.5 9L6 14.5V3.5Z" />
          </svg>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="font-mono text-[10px] uppercase tracking-wider text-ember mb-1">
          {reel.category}
        </div>

        <div className="font-display text-sm font-bold text-pure">
          {reel.title}
        </div>
      </div>
    </motion.div>
  )
}


 

function VideoLightbox({ reel, onClose, onPrevious, onNext, currentIndex, total }: { reel: Reel; onClose: () => void; onPrevious?: () => void; onNext?: () => void; currentIndex?: number; total?: number }) {
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
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative w-full max-w-[320px] sm:max-w-sm"
          onClick={e => e.stopPropagation()}
        >
          <iframe
  src={`https://www.youtube.com/embed/${getYoutubeId(
    reel.youtubeUrl
  )}?autoplay=1`}
  title={reel.title}
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
  className="w-full rounded-2xl"
  style={{
    maxHeight: '85vh',
    aspectRatio: '9/16',
  }}
/>

          {/* Left arrow */}
          {total && total > 1 && onPrevious && (
            <button
              onClick={onPrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-10 h-10 rounded-full bg-graphite/80 border border-white/20 flex items-center justify-center text-ghost hover:text-ember hover:border-ember transition-all"
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
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-10 h-10 rounded-full bg-graphite/80 border border-white/20 flex items-center justify-center text-ghost hover:text-ember hover:border-ember transition-all"
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
            className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-graphite border border-white/10 flex items-center justify-center text-ghost hover:text-ember hover:border-ember transition-colors"
            title="Close (ESC)"
          >
            ✕
          </button>

          {/* Info */}
          <div className="mt-4 text-center">
            <div className="font-mono text-xs text-ember uppercase tracking-wider">{reel.category}</div>
            <div className="font-display text-lg font-bold text-pure mt-1">{reel.title}</div>
            {currentIndex !== undefined && total && (
              <div className="font-mono text-xs text-ash mt-2">{currentIndex + 1} / {total}</div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function ReelsShowcase() {
  const [activeReel, setActiveReel] = useState<Reel | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const openReel = (reel: Reel) => {
    setActiveReel(reel)
    setCurrentIndex(reels.indexOf(reel))
  }

  const goToPrevious = () => {
    const newIdx = (currentIndex - 1 + reels.length) % reels.length
    setCurrentIndex(newIdx)
    setActiveReel(reels[newIdx])
  }

  const goToNext = () => {
    const newIdx = (currentIndex + 1) % reels.length
    setCurrentIndex(newIdx)
    setActiveReel(reels[newIdx])
  }

  useEffect(() => {
    if (!activeReel) return
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
      if (e.key === 'Escape') setActiveReel(null)
    }
    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [currentIndex, activeReel])

  return (
    <section id="reels" ref={ref as any} className="section-pad bg-void">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="mb-16"
        >
          <div className="font-mono text-xs text-ember uppercase tracking-[0.3em] mb-4">
            — Short Form
          </div>
          <h2
            className="font-display font-black text-pure leading-none"
            style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}
          >
            Reels &amp; Short Form
          </h2>
        </motion.div>

        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <AnimatePresence mode="popLayout">
            {reels.map((reel) => (
              <ReelCard key={reel.id} reel={reel} onClick={() => openReel(reel)} />
            ))}
          </AnimatePresence>
        </motion.div>

        <p className="text-center font-mono text-xs text-ash/50 mt-6 md:hidden">
          Tap to play · Tap again to open
        </p>
      </div>

      {activeReel && (
        <VideoLightbox 
          reel={activeReel} 
          onClose={() => setActiveReel(null)} 
          onPrevious={goToPrevious}
          onNext={goToNext}
          currentIndex={currentIndex}
          total={reels.length}
        />
      )}
    </section>
  )
}
