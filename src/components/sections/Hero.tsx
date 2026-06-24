'use client'

import { useEffect, useState } from 'react'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../../lib/siteConfig'
import { motion } from 'framer-motion'

export default function Hero() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  const scrollToWork = () => {
    document.querySelector('#reels')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-void">
      {/* Animated gradient bg */}
      <div className="absolute inset-0 hero-gradient" />

      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(240,240,248,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(240,240,248,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Floating orbs */}
      <motion.div
        className="orb w-96 h-96 bg-ember/20"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{ top: '20%', left: '5%' }}
      />
      <motion.div
        className="orb w-64 h-64 bg-gold/10"
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        style={{ bottom: '20%', right: '10%' }}
      />

      {/* Content — two column on large screens */}
      <div className="container-wide relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">

          {/* Left: text */}
          <div className="flex-1 text-center lg:text-left">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-3 mb-8"
            >
              <span className="w-8 h-px bg-ember" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-ember">
                Meet Editor Studio
              </span>
              <span className="w-8 h-px bg-ember" />
            </motion.div>

            {/* Main headline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={loaded ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.4 }}
              className="overflow-hidden mb-6"
            >
              <motion.h1
                initial={{ y: 120 }}
                animate={loaded ? { y: 0 } : {}}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-black leading-none"
                style={{ fontSize: 'clamp(52px, 9vw, 140px)' }}
              >
                <span className="block text-pure">MEET</span>
                <span className="block ember-text italic">BHAVSAR</span>
              </motion.h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-body text-ash text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-6"
            >
              Cinematic video editor crafting stories from raw footage.
              <br />
              <span className="text-ghost">Vadodara, Gujarat, India.</span>
            </motion.p>

            {/* Specialty tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-10"
            >
              {['YouTube Edits', 'Instagram Reels', 'Color Grading', 'Motion Graphics'].map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full border border-white/10 font-mono text-xs text-ash uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <button
                onClick={scrollToWork}
                className="group relative overflow-hidden px-8 py-4 bg-ember text-void font-mono text-sm uppercase tracking-widest font-bold rounded-full transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,77,26,0.5)] w-full sm:w-auto"
              >
                <span className="relative z-10">View My Work</span>
                <div className="absolute inset-0 bg-gold translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              </button>

              <a
  href="https://www.instagram.com/meet_editor31/"
  target="_blank"
  rel="noopener noreferrer"
  onClick={(e) => {
    e.preventDefault()
    e.stopPropagation()
    window.open('https://www.instagram.com/meet_editor31/', '_blank')
  }}
  className="YOUR-EXISTING-CLASSES"
>
  Follow on Instagram
</a>
            </motion.div>
          </div>

          {/* Right: Profile photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 60 }}
            animate={loaded ? { opacity: 1, scale: 1, x: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0 relative hidden lg:block"
          >
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full bg-ember/20 blur-3xl scale-110 pointer-events-none" />
            {/* Border ring */}
            <div className="relative w-72 xl:w-80 aspect-square rounded-full border-2 border-ember/40 overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/profile.png"
                alt="Meet Bhavsar"
                className="w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-110"
              />
              {/* Subtle bottom vignette */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-void/40 to-transparent pointer-events-none" />
            </div>
            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-4 -left-4 glass rounded-xl px-4 py-3 border border-white/10"
            >
              <div className="font-mono text-[9px] text-ember uppercase tracking-wider mb-0.5">Experience</div>
              <div className="font-display font-black text-xl text-pure">2+ Years</div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -top-2 -right-6 glass rounded-xl px-4 py-3 border border-white/10"
            >
              <div className="font-mono text-[9px] text-ember uppercase tracking-wider mb-0.5">Views</div>
              <div className="font-display font-black text-xl text-pure">2.5M+</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ delay: 2 }}
        onClick={scrollToWork}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 group"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ash group-hover:text-ember transition-colors">
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-ash to-transparent relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full h-full bg-ember"
            animate={{ y: ['0%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </motion.button>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-void to-transparent" />
    </section>
  )
}
