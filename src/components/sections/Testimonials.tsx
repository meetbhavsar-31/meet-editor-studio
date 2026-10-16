'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'Dhruv Thakkar',
    role: 'YouTuber, Vadodara',
    channel: 'youtube.com/@dhruvthakkar2604',
    quote:
      "Meet has been editing my content for years. His understanding of pacing, storytelling, and the audience's attention span is unmatched. Every video he touches comes out better than I imagined.",
    initials: 'DT',
    color: '#ff4d1a',
  },
  {
    name: 'Content Creator',
    role: 'Instagram, India',
    channel: 'Instagram',
    quote:
      'The reels Meet edited for me went viral twice. His sense of rhythm and his ability to match cuts to the music is genuinely remarkable. He gets what makes content work.',
    initials: 'CC',
    color: '#f5c842',
  },
  {
    name: 'Brand Client',
    role: 'Product Brand, Gujarat',
    channel: 'Confidential',
    quote:
      'We needed promotional videos that actually converted. Meet delivered cinematic quality within tight deadlines, and the results exceeded our expectations every time.',
    initials: 'BC',
    color: '#cc44ff',
  },
]

export default function Testimonials() {
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
    <section ref={ref as any} className="section-pad bg-graphite relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-ember/5 rounded-full blur-3xl" />

      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="mb-20 text-center"
        >
          <div className="font-mono text-xs text-ember uppercase tracking-[0.3em] mb-4">
            — Social Proof
          </div>
          <h2
            className="font-display font-black text-pure leading-none"
            style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}
          >
            What They Say
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 50 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="testimonial-card group"
            >
              {/* Quote icon */}
              <div className="text-5xl mb-6 font-display leading-none"
                   style={{ color: t.color, opacity: 0.5 }}>
                "
              </div>

              <p className="text-ghost leading-relaxed text-sm mb-8 italic">
                {t.quote}
              </p>

              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-void text-sm flex-shrink-0"
                  style={{ background: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="font-body font-medium text-pure text-sm">{t.name}</div>
                  <div className="font-mono text-[10px] text-ash uppercase tracking-wider">{t.role}</div>
                </div>
              </div>

              {/* Accent */}
              <div className="mt-6 h-px w-0 group-hover:w-full transition-all duration-700"
                   style={{ background: t.color }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
