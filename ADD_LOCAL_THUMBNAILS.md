# How to Add Local Thumbnails

## Step 1: Prepare Your Thumbnail Images

1. **Create a folder** for your thumbnails
   - Place them in: `public/images/thumbnails/`
   - Example filenames: `thumb1.jpg`, `thumb2.png`, `youtube-thumb.jpg`

2. **Image requirements:**
   - Format: JPG, PNG (JPG recommended for smaller size)
   - Size: Keep under 500KB per image
   - Aspect Ratio: 16:9 (YouTube standard)
   - Dimensions: At least 640×360px (ideally 1280×720px)

## Step 2: Upload Thumbnails to Your Site

**Option A: Using File Explorer (Easiest)**

1. Open: `meet-editor-studio/public/images/`
2. Create folder: `thumbnails/` (if it doesn't exist)
3. Drag & drop your thumbnail images here
4. That's it! Files are now ready to use

**Option B: Using Terminal**

```bash
cd c:\Users\Meet\Desktop\WEBSITES\meet-editor-studio
# Copy your thumbnails to the public folder
copy C:\your\thumbnail\folder\*.jpg public\images\thumbnails\
```

## Step 3: Add Thumbnails to Your Site

**File to edit**: `src/components/sections/ThumbnailGallery.tsx`

### Find the `thumbnails` array (around line 7):

```typescript
const thumbnails = [
  {
    id: 1,
    src: 'https://img.youtube.com/vi/YU82GAYwDtc/maxresdefault.jpg',
    ytLink: 'https://youtu.be/YU82GAYwDtc',
    category: 'YouTube',
    title: 'Tanay Tiwari Thumbnail',
    client: 'Tanay Tiwari',
  },
  // ... more items
]
```

### Add your local thumbnails like this:

```typescript
const thumbnails = [
  {
    id: 1,
    src: 'https://img.youtube.com/vi/YU82GAYwDtc/maxresdefault.jpg',
    ytLink: 'https://youtu.be/YU82GAYwDtc',
    category: 'YouTube',
    title: 'Tanay Tiwari Thumbnail',
    client: 'Tanay Tiwari',
  },
  {
    id: 2,
    src: '/images/thumbnails/thumb1.jpg',  // ← LOCAL FILE (new)
    ytLink: 'https://youtu.be/YOUR_VIDEO_ID',
    category: 'YouTube',
    title: 'My First YouTube Thumbnail',
    client: 'Dhruv Thakkar',
  },
  {
    id: 3,
    src: '/images/thumbnails/reel-thumb.png',  // ← ANOTHER LOCAL FILE
    ytLink: '',
    category: 'Reel',
    title: 'Instagram Reel Cover',
    client: 'Dhruv Thakkar',
  },
]
```

### Key Points:

- **Local files**: Use `/images/thumbnails/filename.jpg`
- **YouTube thumbnails**: Can still use `https://img.youtube.com/vi/{VIDEO_ID}/maxresdefault.jpg`
- **URLs**: Start with `/` for local files (not full URLs)
- **ID**: Must be unique for each thumbnail (1, 2, 3, etc.)

## Step 4: Examples for Different Scenarios

### YouTube Video Thumbnail
```typescript
{
  id: 10,
  src: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
  ytLink: 'https://youtu.be/dQw4w9WgXcQ',
  category: 'YouTube',
  title: 'Dhruv Thakkar Vlog #5',
  client: 'Dhruv Thakkar',
}
```

### Local Image (No YouTube Link)
```typescript
{
  id: 11,
  src: '/images/thumbnails/custom-design.jpg',
  ytLink: '',  // ← Leave empty if no YouTube link
  category: 'Reel',
  title: 'Custom Reel Design',
  client: 'Personal Project',
}
```

### Local Image with YouTube Link
```typescript
{
  id: 12,
  src: '/images/thumbnails/my-thumbnail.png',
  ytLink: 'https://youtu.be/ABC123DEF456',
  category: 'YouTube',
  title: 'My Custom Thumbnail',
  client: 'Dhruv Thakkar',
}
```

## Step 5: Verify Everything Works

1. **Save the file** after adding thumbnails
2. **Check dev server** - should auto-reload: http://localhost:3001
3. **Go to Thumbnails section** - your new thumbnails should appear
4. **Click a thumbnail** - should open in fullscreen
5. **Use arrow keys** - navigate between thumbnails

## Troubleshooting

### Thumbnail not showing?
- ✓ Check file exists in `public/images/thumbnails/`
- ✓ Verify filename matches exactly (case-sensitive on Linux)
- ✓ Check image format (JPG/PNG only)
- ✓ Check `src` path starts with `/images/thumbnails/`

### YouTube link not working?
- ✓ Verify `ytLink` is full URL: `https://youtu.be/...`
- ✓ Leave empty string `''` if no YouTube link

### File size too large?
- ✓ Compress with: https://compressor.io or https://tinypng.com
- ✓ Target: under 200KB per image
- ✓ Resize to 1280×720px maximum

## Adding More Galleries

You can use the **same approach** for:

### Reels Gallery
**File**: `src/components/sections/ReelsShowcase.tsx` (lines 7-21)

```typescript
const reels = [
  {
    id: 1,
    src: '/videos/my-reel.mp4',  // ← LOCAL VIDEO FILE
    poster: '/images/reels/reel-poster.jpg',
    title: 'Cinematic Reel #1',
    category: 'Short Form',
  },
]
```

### Long Form Videos
**File**: `src/components/sections/LongFormShowcase.tsx` (lines 7-25)

```typescript
const longFormVideos = [
  {
    id: 1,
    src: '/videos/longform1.mp4',  // ← LOCAL VIDEO FILE
    poster: '/images/longform/thumb1.jpg',
    title: 'Dhruv Vlog #1',
    client: 'Dhruv Thakkar',
    duration: '12 min',
    views: '2.5M+',
    tags: ['Vlog', 'Cinematic'],
  },
]
```

## Directory Structure

After adding local files, your structure should look like:

```
meet-editor-studio/
├── public/
│   ├── images/
│   │   ├── thumbnails/
│   │   │   ├── thumb1.jpg
│   │   │   ├── thumb2.jpg
│   │   │   ├── reel-cover.png
│   │   │   └── ...
│   │   ├── reels/
│   │   │   └── reel-poster.jpg
│   │   ├── longform/
│   │   │   └── thumb1.jpg
│   │   └── profile.png
│   ├── videos/
│   │   ├── longform1.mp4
│   │   ├── my-reel.mp4
│   │   └── ...
│   └── ...
├── src/
│   ├── components/
│   │   └── sections/
│   │       ├── ThumbnailGallery.tsx  ← Edit here
│   │       ├── ReelsShowcase.tsx     ← Edit here
│   │       └── LongFormShowcase.tsx  ← Edit here
│   └── ...
└── ...
```

## Quick Reference

| Location | File Path | Code Location |
|----------|-----------|---------------|
| Thumbnails | `src/components/sections/ThumbnailGallery.tsx` | Line ~7 |
| Reels Videos | `src/components/sections/ReelsShowcase.tsx` | Line ~7 |
| Long Form | `src/components/sections/LongFormShowcase.tsx` | Line ~7 |
| Store images | `public/images/` | Folder on disk |
| Store videos | `public/videos/` | Folder on disk |

---

**Tips:**
- ✓ Add multiple thumbnails at once in the array
- ✓ Use consistent naming: `thumb-`, `reel-`, `longform-`
- ✓ Keep IDs sequential (1, 2, 3, etc.)
- ✓ Save file → Next.js auto-reloads
