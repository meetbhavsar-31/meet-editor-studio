'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function About() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" ref={ref as any} className="section-pad bg-obsidian relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-ember/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/4 rounded-full blur-3xl pointer-events-none" />

      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT: Photo + stats card */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Big watermark number */}
            <div
              className="absolute -top-8 -left-4 font-display font-black text-white/[0.03] leading-none select-none pointer-events-none"
              style={{ fontSize: 'clamp(120px, 20vw, 240px)' }}
            >
              2+
            </div>

            <div className="relative glass rounded-2xl ember-border">
              {/* Hero photo */}
              <div className="relative w-full bg-graphite group overflow-hidden" style={{ aspectRatio: '4/3' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="public/images/profile.png"
                  alt="Meet Bhavsar — Video Editor"
                  className={`w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setImgLoaded(true)}
                />
                {!imgLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-br from-ember/20 via-graphite to-void flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📹</div>
                      <p className="font-mono text-xs text-ash">Loading...</p>
                    </div>
                  </div>
                )}
                {/* Photo overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-graphite via-transparent to-transparent opacity-80" />
                {/* Name tag on photo */}
                <div className="absolute bottom-4 left-5 right-5">
                  <div className="font-mono text-[10px] text-ember uppercase tracking-[0.25em] mb-1">— Since 2020</div>
                  <blockquote className="font-display text-lg sm:text-xl text-pure leading-snug italic">
                    "Every frame is a choice.<br />Every cut is a statement."
                  </blockquote>
                </div>
              </div>

              {/* Stats grid below photo */}
              <div className="overflow-hidden grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/8 border-t border-white/8">
                {[
                  { n: '2+', label: 'Years' },
                  { n: '4+', label: 'Collaborations' },
                  { n: '2.5M+', label: 'Views' },
                  { n: '2024', label: 'Studio Founded' },
                ].map((s, i) => (
                  <div key={s.label} className={`p-5 text-center ${i >= 2 ? 'border-t border-white/8 sm:border-t-0' : ''}`}>
                    <div className="font-display font-black text-2xl ember-text">{s.n}</div>
                    <div className="font-mono text-[10px] text-ash uppercase tracking-wider mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Text */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="font-mono text-xs text-ember uppercase tracking-[0.3em] mb-4">
              About
            </div>
            <h2
              className="font-display font-black text-pure leading-tight mb-8"
              style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}
            >
              Turning Raw Footage<br />
              <span className="italic text-ash">Into Unforgettable</span><br />
              Stories
            </h2>

            <div className="space-y-5 text-ash text-base leading-relaxed">
              <p>
                My journey into video editing began in 2020, 
                when I first started exploring the creative world of content creation and visual storytelling. What began as a hobby soon evolved into a serious passion for crafting engaging videos.
              </p>
              <p>
                In 2024, I entered professional video editing and began working on real-world projects, 
                focusing on YouTube content, cinematic storytelling, reels, and motion graphics. Since then, 
                I've continuously refined my editing style, learning how to maximize audience retention, pacing, and visual impact.
              </p>
              <p>
                I collaborate with{' '}
                <a
                  href="https://www.youtube.com/@dhruvthakkar2604"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ember hover:text-gold transition-colors"
                >
                  Dhruv Thakkar
                </a>
                , one of Vadodara's most well-known YouTubers — editing key segments (1-2) and recreating archived content
                through clean cuts, smooth transitions, and creative visuals.
              </p>
              <p>
                Each project is more than just cutting clips. It's about crafting emotion, pacing,
                and visual rhythm that elevates even the simplest footage into something unforgettable.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Photoshop'].map(tool => (
                <span
                  key={tool}
                  className="px-4 py-2 rounded-full bg-graphite border border-white/10 font-mono text-xs text-ghost"
                >
                  {tool}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#reels"
                onClick={e => { e.preventDefault(); document.querySelector('#reels')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="px-7 py-3 bg-ember text-void font-mono text-xs uppercase tracking-widest font-bold rounded-full hover:shadow-[0_0_30px_rgba(255,77,26,0.5)] transition-shadow"
              >
                See My Work
              </a>
              <a
                href="#contact"
                onClick={e => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="px-7 py-3 border border-white/20 text-ghost font-mono text-xs uppercase tracking-widest rounded-full hover:border-ember hover:text-ember transition-all"
              >
                Hire Me
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
