"use client"

import { useEffect, useRef, useState } from 'react'
import { INSTAGRAM_URL } from '../../lib/siteConfig'
import { motion } from 'framer-motion'

const projects = [
  {
    id: 1,
    title: 'Dhruv Thakkar — YouTube Channel',
    category: 'Long Form · YouTube',
    desc: "Long-form video editing for Vadodara's prominent YouTuber Dhruv Thakkar. Produced compelling vlogs, travel content, and lifestyle videos with cinematic storytelling.",
    metrics: [
      { val: '2.5M+', label: 'Views' },
      { val: '5+', label: 'Videos' },
      { val: '2+', label: 'Monthns' },
    ],
    color: '#ff4d1a',
    yt: 'https://www.youtube.com/@dhruvthakkar2604',
    thumb: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
  },
  {
    id: 2,
    title: 'Instagram Reels — Short Form',
    category: 'Short Form · Instagram',
    desc: 'High-impact short-form reels with dynamic transitions, trending audio sync, and motion-heavy effects. Optimized for maximum reach and engagement.',
    metrics: [
      { val: '10+', label: 'Reels' },
      { val: 'Viral', label: 'Reach' },
      { val: '4K', label: 'Quality' },
    ],
    color: '#f5c842',
    yt: INSTAGRAM_URL,
    thumb: '',
  },
  {
    id: 3,
    title: 'Motion Graphics Package',
    category: 'Animation · After Effects',
    desc: 'Custom animated intros, lower thirds, and transition packs for content creators. Bringing brand identity to life through motion.',
    metrics: [
      { val: '20+', label: 'Animations' },
      { val: 'Custom', label: 'Design' },
      { val: 'AE', label: 'Powered' },
    ],
    color: '#cc44ff',
    yt: '#',
    thumb: '',
  },
]

export default function Projects() {
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

  return (
    <section ref={ref as any} className="section-pad bg-void relative overflow-hidden">
      <div className="absolute inset-0 hero-gradient opacity-50" />
      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="mb-20"
        >
          <div className="font-mono text-xs text-ember uppercase tracking-[0.3em] mb-4">
            — Featured Projects
          </div>
          <h2
            className="font-display font-black text-pure leading-none"
            style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}
          >
            Projects
          </h2>
        </motion.div>

        <div className="space-y-8">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 50 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="group glass rounded-2xl overflow-hidden ember-border hover:border-ember/60 transition-all duration-500"
            >
              <div className="p-8 md:p-12 grid md:grid-cols-[1fr_auto] gap-8 items-start">
                <div>
                  {/* Category */}
                  <div className="font-mono text-xs uppercase tracking-widest mb-3"
                       style={{ color: p.color }}>
                    {p.category}
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-pure mb-5 group-hover:text-ghost transition-colors">
                    {p.title}
                  </h3>

                  {/* Desc */}
                  <p className="text-ash leading-relaxed max-w-xl mb-8">{p.desc}</p>

                  {/* Metrics */}
                  <div className="flex gap-10">
                    {p.metrics.map(m => (
                      <div key={m.label}>
                        <div className="font-display font-black text-2xl" style={{ color: p.color }}>
                          {m.val}
                        </div>
                        <div className="font-mono text-xs text-ash uppercase tracking-wider mt-1">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Arrow link */}
                <a
                  href={p.yt}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-ash hover:border-ember hover:text-ember hover:bg-ember/10 transition-all duration-300 group-hover:border-ember/30"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 15L15 3M15 3H8M15 3V10"/>
                  </svg>
                </a>
              </div>

              {/* Color accent bar */}
              <div className="h-0.5 w-0 group-hover:w-full transition-all duration-700"
                   style={{ background: p.color }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
