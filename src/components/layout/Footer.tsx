"use client"

import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../../lib/siteConfig'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-16">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="font-display text-2xl font-bold text-pure mb-2">
              Meet Editor Studio
            </div>
            <div className="font-mono text-xs text-ash tracking-widest uppercase">
              Video Editor · Vadodara, Gujarat, India
            </div>
          </div>

          <div className="flex items-center gap-8">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-wider text-ash hover:text-ember transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-ash/60">
            © {new Date().getFullYear()} Meet Bhavsar. All rights reserved.
          </p>
          <p className="font-mono text-xs text-ash/40">
            Meet Editor Studio
          </p>
        </div>
      </div>
    </footer>
  )
}
