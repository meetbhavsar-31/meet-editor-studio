# Meet Editor Studio — Portfolio Website

Premium cinematic portfolio for video editor Meet Bhavsar.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Custom CSS
- **Animations**: Framer Motion
- **Smooth Scroll**: Lenis
- **Language**: TypeScript

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Open in browser
# http://localhost:3000
```

## Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Deploy to Netlify / Vercel

### Vercel (Recommended)
1. Push to GitHub
2. Connect repo at vercel.com
3. Deploy (zero config needed)

### Netlify
1. Push to GitHub
2. Connect repo at netlify.com
3. Build command: `npm run build`
4. Publish directory: `.next`

## Folder Structure

```
src/
├── app/
│   ├── globals.css       # All global styles, variables, animations
│   ├── layout.tsx        # Root layout with cursor + smooth scroll
│   └── page.tsx          # Main page (imports all sections)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx    # Fixed nav with mobile menu
│   │   └── Footer.tsx    # Footer
│   ├── sections/
│   │   ├── Hero.tsx           # Full-screen cinematic hero
│   │   ├── Marquee.tsx        # Scrolling skills ticker
│   │   ├── About.tsx          # Bio + quick stats
│   │   ├── ReelsShowcase.tsx  # Video reels grid + lightbox
│   │   ├── Services.tsx       # 4 services list
│   │   ├── ThumbnailGallery.tsx # Filterable gallery + lightbox
│   │   ├── Projects.tsx       # Featured projects
│   │   ├── Timeline.tsx       # Creative journey timeline
│   │   ├── Skills.tsx         # Animated skill bars
│   │   ├── Stats.tsx          # Animated counters
│   │   ├── Testimonials.tsx   # Client feedback
│   │   └── Contact.tsx        # Contact section
│   └── ui/
│       ├── CustomCursor.tsx   # Ember-colored cursor
│       └── SmoothScroll.tsx   # Lenis smooth scroll
└── hooks/
    └── useReveal.ts           # Intersection observer hook
```

## Customization

### Add real videos
Replace video `src` URLs in `ReelsShowcase.tsx` with your actual video files placed in `/public/videos/`.

### Add real thumbnails
Replace image `src` URLs in `ThumbnailGallery.tsx` with your actual images in `/public/images/`.

### Colors
Edit CSS variables in `globals.css`:
```css
--ember: #ff4d1a;   /* Main accent */
--gold: #f5c842;    /* Secondary accent */
--void: #050508;    /* Background */
```

### Content
All text content is in the individual section components. Easy to find and edit.

## Credits

Built for Meet Bhavsar — Meet Editor Studio
Instagram: @meetwitheditor
