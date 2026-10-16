"use client"

import { useEffect, useRef, useState } from 'react'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, GMAIL_COMPOSE_URL } from '../../lib/siteConfig'
import { motion } from 'framer-motion'

export default function Contact() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="contact" ref={ref as any} className="section-pad bg-obsidian relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-ember/8 rounded-full blur-3xl pointer-events-none" />

      <div className="container-wide relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9 }}
          >
            <div className="font-mono text-xs text-ember uppercase tracking-[0.3em] mb-6">
              — Let's Create
            </div>

            <h2
              className="font-display font-black text-pure leading-none mb-8"
              style={{ fontSize: 'clamp(48px, 8vw, 112px)' }}
            >
              Let's Talk
            </h2>

            <p className="text-ash text-lg leading-relaxed mb-12 max-w-xl mx-auto">
              Have a project? Want cinematic edits, stunning reels, or motion graphics
              that actually make people stop scrolling? Reach out.
            </p>

            {/* Contact links */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a
  href="https://www.instagram.com/meet_editor31/"
  target="_blank"
  rel="noopener noreferrer"
  onClick={(e) => {
    e.stopPropagation()
    window.open('https://www.instagram.com/meet_editor31/', '_blank')
  }}
  className="group flex items-center gap-3 px-8 py-4 bg-ember text-void font-mono text-sm uppercase tracking-widest font-bold rounded-full"
>
  Instagram
</a>

              <a
                href={GMAIL_COMPOSE_URL('Inquiry from website','Hi Meet,\n\nI would like to discuss a project...')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-8 py-4 border border-white/20 text-ghost font-mono text-sm uppercase tracking-widest rounded-full hover:border-ember hover:text-ember transition-all duration-300"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                Email Me
              </a>
            </div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={visible ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="mt-16 font-mono text-xs text-ash uppercase tracking-[0.3em]"
            >
              Based in Vadodara, Gujarat, India · Available Worldwide
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
