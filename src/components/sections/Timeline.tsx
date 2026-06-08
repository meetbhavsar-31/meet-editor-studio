'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const milestones = [
  {
    year: '2020',
    title: 'The Beginning',
    desc: 'Started video editing out of pure curiosity. Downloaded Premiere Pro, watched tutorials for weeks, and edited the first project for free.',
    tag: 'Origin',
  },
  {
    year: '2021',
    title: 'First Clients',
    desc: 'Began taking on small freelance projects. Built a foundational skill set across color grading, transitions, and pacing.',
    tag: 'Growth',
  },
  {
    year: '2022',
    title: 'Mastering the Craft',
    desc: 'Deep-dived into After Effects and motion graphics. Explored cinematic color grading and storytelling through editing.',
    tag: 'Skill',
  },
  {
    year: '2026',
    title: 'Dhruv Thakkar Collaboration',
    desc: 'Partnered with Vadodara\'s prominent YouTuber Dhruv Thakkar. Edited segments 1-2 of multiple videos (4+ videos). Completed full segment editing for 1 video. Recreated archived content.',
    tag: 'Milestone',
  },
  {
    year: '2026',
    title: 'Meet Editor Studio',
    desc: 'Officially launched Meet Editor Studio. Expanded services to cover reels, animations, and complete video production.',
    tag: 'Studio',
  },
  {
    year: '2025+',
    title: 'Continuing the Journey',
    desc: 'Pushing boundaries with cinematic techniques, trending formats, and new creative directions. Constantly leveling up.',
    tag: 'Now',
  },
]

export default function Timeline() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref as any} className="section-pad bg-graphite overflow-hidden">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="mb-20"
        >
          <div className="font-mono text-xs text-ember uppercase tracking-[0.3em] mb-4">
            — The Journey
          </div>
          <h2
            className="font-display font-black text-pure leading-none"
            style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}
          >
            Creative<br />
            <span className="italic text-ash">Timeline</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-gradient-to-b from-ember via-ember/30 to-transparent" />

          <div className="space-y-0">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: -40 }}
                animate={visible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className={`relative pl-16 md:pl-28 pb-16 group cursor-pointer`}
                onMouseEnter={() => setActiveIdx(i)}
              >
                {/* Dot */}
                <div className={`absolute left-[18px] md:left-[42px] top-1 w-[13px] h-[13px] rounded-full border-2 transition-all duration-300 ${
                  activeIdx === i
                    ? 'bg-ember border-ember scale-125'
                    : 'bg-void border-ash/40 group-hover:border-ember'
                }`} />

                <div className={`transition-all duration-300 ${activeIdx === i ? '' : 'opacity-60'}`}>
                  <div className="flex flex-wrap items-center gap-4 mb-3">
                    <span className="font-mono text-xs text-ember">{m.year}</span>
                    <span className="px-2 py-0.5 rounded bg-ember/10 border border-ember/30 font-mono text-[10px] text-ember uppercase tracking-wider">
                      {m.tag}
                    </span>
                  </div>
                  <h3 className="font-display text-xl md:text-2xl font-bold text-pure mb-3">
                    {m.title}
                  </h3>
                  <p className="text-ash leading-relaxed max-w-lg text-sm md:text-base">
                    {m.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
