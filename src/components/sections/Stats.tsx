'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const stats = [
  { value: 2, suffix: '+', label: 'Years Editing', desc: 'Main Editing 2024' },
  { value: 10, suffix: '+', label: 'Projects Completed', desc: 'Across all formats' },
  { value: 2.5, suffix: 'M+', label: 'Views Generated', desc: 'For clients' },
  { value: 4, suffix: '', label: 'Core Services', desc: 'End-to-end production' },
]

function Counter({ value, suffix, visible }: { value: number; suffix: string; visible: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!visible) return
    let start = 0
    const duration = 2000
    const step = Math.ceil(value / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [visible, value])

  return (
    <span>
      {count}
      {suffix}
    </span>
  )
}

export default function Stats() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref as any} className="section-pad bg-void relative overflow-hidden">
      {/* Giant bg text */}
      <div
        className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
        style={{ overflow: 'hidden' }}
      >
        <span
          className="font-display font-black text-white/[0.02]"
          style={{ fontSize: 'clamp(120px, 20vw, 280px)' }}
        >
          NUMBERS
        </span>
      </div>

      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="mb-20 text-center"
        >
          <div className="font-mono text-xs text-ember uppercase tracking-[0.3em] mb-4">
            — By The Numbers
          </div>
          <h2
            className="font-display font-black text-pure leading-none"
            style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}
          >
            The Impact
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="text-center group"
            >
              <div className="stat-value ember-text mb-2">
                <Counter value={stat.value} suffix={stat.suffix} visible={visible} />
              </div>
              <div className="font-body text-ghost text-sm mb-1">{stat.label}</div>
              <div className="font-mono text-[10px] text-ash uppercase tracking-wider">{stat.desc}</div>

              {/* Hover line */}
              <div className="mt-6 h-px bg-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-ember w-0 group-hover:w-full transition-all duration-700" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
