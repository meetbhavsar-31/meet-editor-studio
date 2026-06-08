# Custom Logo Setup Guide

## How to Change the M Logo

The "M" logo appears in two places on your site:
1. **Navbar** - Fixed navigation bar at top
2. **Header** - Site branding

### Quick Steps to Replace with Your Logo

#### Option 1: Use an Image URL (Recommended - Easiest)

1. **Get your logo URL**
   - Upload your logo to a hosting service (Netlify, Imgbb, Cloudinary, etc.)
   - Copy the direct image URL
   - Ensure it's a PNG or SVG for best quality

2. **Edit [src/components/layout/Navbar.tsx](src/components/layout/Navbar.tsx)**
   
   Find this section (around line 44):
   ```tsx
   <div className="w-8 h-8 rounded-full bg-ember flex items-center justify-center text-void font-mono text-xs font-bold">
     M
   </div>
   ```

   Replace it with:
   ```tsx
   <img 
     src="YOUR_LOGO_URL_HERE" 
     alt="Meet Logo"
     className="w-8 h-8 object-contain"
   />
   ```

   Example with Netlify image:
   ```tsx
   <img 
     src="https://meeteditorstudio.netlify.app/images/your-logo.png" 
     alt="Meet Logo"
     className="w-8 h-8 object-contain"
   />
   ```

#### Option 2: Use a Local Image File

1. **Add your logo to the project**
   - Place your logo file in: `public/images/your-logo.png`
   - The `public/` folder is for static assets

2. **Update [src/components/layout/Navbar.tsx](src/components/layout/Navbar.tsx)**
   
   Replace the M logo with:
   ```tsx
   <img 
     src="/images/your-logo.png" 
     alt="Meet Logo"
     className="w-8 h-8 object-contain"
   />
   ```

#### Option 3: Use an SVG Inline (Best Quality)

1. **Copy your SVG code**
   - Export your logo as SVG
   - Open it in a text editor
   - Copy the `<svg>` content

2. **Update [src/components/layout/Navbar.tsx](src/components/layout/Navbar.tsx)**
   
   Replace the M logo with:
   ```tsx
   <svg viewBox="0 0 32 32" className="w-8 h-8">
     {/* Your SVG path/content here */}
   </svg>
   ```

### Example: Full Update

**Before:**
```tsx
<button
  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
  className="flex items-center gap-3 group"
>
  <div className="w-8 h-8 rounded-full bg-ember flex items-center justify-center text-void font-mono text-xs font-bold">
    M
  </div>
  <span className="font-display text-lg font-bold text-pure hidden sm:block">
    Meet Editor Studio
  </span>
</button>
```

**After (with image):**
```tsx
<button
  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
  className="flex items-center gap-3 group"
>
  <img 
    src="/images/meet-logo.png" 
    alt="Meet Logo"
    className="w-8 h-8 object-contain"
  />
  <span className="font-display text-lg font-bold text-pure hidden sm:block">
    Meet Editor Studio
  </span>
</button>
```

### Best Practices

- **Logo Size**: Keep logo files under 50KB for fast loading
- **Dimensions**: Use square images (1:1 ratio) for best results
- **Format**: PNG with transparency or SVG for clean look
- **Color**: Ensure your logo is visible on dark background (your site is dark-themed)
- **Consistency**: Use the same logo in these locations:
  - Navbar (already done)
  - Favicon - `public/favicon.ico`
  - Social media profiles

### Need Help?

- Logo dimensions should be at least 200x200px
- If image isn't showing, check the URL is correct
- For SVG logos, use: `viewBox="0 0 width height"` in the SVG tag
- Ensure `public/images/` folder exists before placing files there

### Favicon (Browser Tab Icon)

To also change the favicon:
1. Replace `public/favicon.ico` with your own
2. Or add: `<link rel="icon" href="/images/your-logo.png" />`

---

**Questions?** The navbar component is in [src/components/layout/Navbar.tsx](src/components/layout/Navbar.tsx) - feel free to customize further!
