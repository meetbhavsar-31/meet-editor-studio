'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const services = [
  {
    num: '01',
    title: 'YouTube Video Editing',
    desc: 'Professional long-form editing with precise cuts, music sync, storytelling, and retention-optimized pacing. Built for creators who want their audience to stay until the end.',
    tags: ['Long Form', 'Retention', 'Storytelling'],
    icon: '▶',
  },
  {
    num: '02',
    title: 'Instagram Reels Editing',
    desc: 'High-energy short-form edits with punchy transitions, dynamic effects, and caption design. Made to stop the scroll and drive engagement.',
    tags: ['Short Form', 'Reels', 'Viral'],
    icon: '◎',
  },
  {
    num: '03',
    title: 'Color Grading',
    desc: 'Cinematic color tones, mood enhancement, skin tone correction. Transform flat footage into rich, atmospheric visuals that tell the story through color.',
    tags: ['Cinematic', 'LUTs', 'Mood'],
    icon: '◈',
  },
  {
    num: '04',
    title: 'Motion Graphics',
    desc: 'Engaging animated titles, lower thirds, intro sequences, and custom visual effects. Elevate your brand with motion that communicates.',
    tags: ['Animation', 'After Effects', 'Visual FX'],
    icon: '◇',
  },
]

export default function Services() {
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
    <section id="services" ref={ref as any} className="section-pad bg-graphite relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-ember/8 rounded-full blur-3xl" />

      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="mb-20"
        >
          <div className="font-mono text-xs text-ember uppercase tracking-[0.3em] mb-4">
            — What I Do
          </div>
          <h2
            className="font-display font-black text-pure leading-none"
            style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}
          >
            Services
          </h2>
        </motion.div>

        <div className="space-y-0">
          {services.map((service, i) => (
            <motion.div
              key={service.num}
              initial={{ opacity: 0, y: 30 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="group border-t border-white/8 py-10 grid md:grid-cols-[80px_1fr_auto] gap-8 items-start hover:border-ember/30 transition-colors duration-300 cursor-default"
            >
              {/* Number */}
              <div className="font-mono text-sm text-ash group-hover:text-ember transition-colors">
                {service.num}
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl text-ember">{service.icon}</span>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-pure group-hover:text-ember transition-colors duration-300">
                    {service.title}
                  </h3>
                </div>
                <p className="text-ash leading-relaxed max-w-xl">
                  {service.desc}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 md:justify-end">
                {service.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-obsidian border border-white/10 font-mono text-[10px] text-ash uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
          <div className="border-t border-white/8" />
        </div>
      </div>
    </section>
  )
}
