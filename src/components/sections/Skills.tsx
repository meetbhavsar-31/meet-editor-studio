'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const skills = [
  { name: 'Premiere Pro', pct: 95, cat: 'Editing' },
  { name: 'After Effects', pct: 85, cat: 'Motion' },
  { name: 'DaVinci Resolve', pct: 80, cat: 'Color' },
  { name: 'Photoshop', pct: 75, cat: 'Design' },
  { name: 'Storytelling', pct: 92, cat: 'Creative' },
  { name: 'Color Grading', pct: 88, cat: 'Color' },
  { name: 'Motion Graphics', pct: 82, cat: 'Motion' },
  { name: 'Sound Design', pct: 70, cat: 'Audio' },
]

const tools = [
  {
    name: 'Premiere Pro',
    logo: '/images/tools/premiere-pro.png',
  },
  {
    name: 'After Effects',
    logo: '/images/tools/after-effects.png',
  },
  {
    name: 'Photoshop',
    logo: '/images/tools/photoshop.png',
  },
]

export default function Skills() {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)
  const [animBars, setAnimBars] = useState(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)

          timeoutId = setTimeout(() => {
            setAnimBars(true)
          }, 500)

          observer.disconnect()
        }
      },
      {
        threshold: 0.15,
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
      clearTimeout(timeoutId)
    }
  }, [])

  return (
    <section
      ref={ref}
      className="section-pad bg-obsidian overflow-hidden"
    >
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9 }}
          >
            <div className="font-mono text-xs text-ember uppercase tracking-[0.3em] mb-4">
              — Expertise
            </div>

            <h2
              className="font-display font-black text-pure leading-none mb-8"
              style={{ fontSize: 'clamp(40px, 5vw, 72px)' }}
            >
              Skills &
              <br />
              <span className="italic text-ash">Tools</span>
            </h2>

            <p className="text-ash leading-relaxed max-w-md">
              5+ years of daily practice across editing software,
              creative tools, and storytelling techniques.
              Each skill refined through real projects with real
              audiences.
            </p>

            {/* Tool Icons */}
            <div className="mt-12 grid grid-cols-4 gap-4">
              {tools.map((tool) => (
                <div
                  key={tool.name}
                  title={tool.name}
                  className="
                    aspect-square
                    rounded-xl
                    bg-graphite
                    border
                    border-white/8
                    flex
                    items-center
                    justify-center
                    hover:border-ember
                    transition-all
                    duration-300
                    cursor-default
                    overflow-hidden
                    group
                  "
                >
                  <Image
                    src={tool.logo}
                    alt={tool.name}
                    width={42}
                    height={42}
                    className="
                      object-contain
                      opacity-70
                      group-hover:opacity-100
                      transition-opacity
                      duration-300
                    "
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Skill Bars */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="space-y-8"
          >
            {skills.map((skill, i) => (
              <div key={skill.name}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-body text-sm text-pure">
                      {skill.name}
                    </span>

                    <span className="px-2 py-0.5 rounded bg-ember/10 font-mono text-[9px] text-ember uppercase tracking-wider">
                      {skill.cat}
                    </span>
                  </div>

                  <span className="font-mono text-xs text-ash">
                    {skill.pct}%
                  </span>
                </div>

                <div className="skill-bar">
                  <motion.div
                    className="skill-fill"
                    initial={{ scaleX: 0 }}
                    animate={
                      animBars
                        ? { scaleX: skill.pct / 100 }
                        : { scaleX: 0 }
                    }
                    transition={{
                      duration: 1.4,
                      delay: i * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      transformOrigin: 'left',
                    }}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}