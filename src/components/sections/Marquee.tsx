'use client'

const items = [
  'Video Editing',
  '✦',
  'Color Grading',
  '✦',
  'Motion Graphics',
  '✦',
  'Instagram Reels',
  '✦',
  'YouTube Content',
  '✦',
  'Cinematic Cuts',
  '✦',
  'Storytelling',
  '✦',
  'Sound Design',
  '✦',
]

export default function Marquee() {
  const doubled = [...items, ...items, ...items, ...items]

  return (
    <div className="py-6 border-y border-white/5 overflow-hidden bg-obsidian">
      <div className="marquee-track">
        <div className="marquee-content">
          {doubled.map((item, i) => (
            <span
              key={i}
              className={`mx-6 whitespace-nowrap font-mono text-xs uppercase tracking-widest ${
                item === '✦' ? 'text-ember' : 'text-ash'
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
