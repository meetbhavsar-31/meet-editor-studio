# Meet Editor Studio — site folder (v4)

## Quick start (your computer)
1. Install Node.js 22 or newer (nodejs.org). Open this folder in VS Code.
2. In the terminal run: `npm install`   (needed once — the likes/comments server part uses a package)
3. Normal editing: `npm run watch`, then right-click `public/index.html` -> Open with Live Server.
   (Hearts and animations work. Like counts, comments and the dashboard need step 4.)
4. To test the server part too (likes, comments, dashboard): `npm run dev`, then open http://localhost:8888
   If you see "Cannot find package '@netlify/blobs'" you skipped step 2: run `npm install` and start again.

## Folder structure
```
meet-editor-studio/
├─ build.js                  builds src/ -> public/
├─ netlify.toml              Netlify settings (build, publish folder, functions, Node 22)
├─ netlify/functions/api.mjs likes + visit statistics + comments + admin API (one function)
└─ src/
   ├─ site.json              name, email, Instagram, YouTube, site address
   ├─ pages/                 one file per page (home, videos, thumbnails, reel-covers, posts, services, about, contact)
   ├─ partials/              header, footer, head (SEO), viewer, legal (Terms & Privacy popups)
   ├─ content/               DATA the admin editor changes: youtube, thumbnails, reel-covers, posts,
   │                         testimonials, clients, social, home, services, about, legal (+ optional meta.json)
   ├─ media/                 thumbnails/ reel-covers/ posts/ clients/ (images). Dropping a file here also works.
   ├─ images/                logo.jpg, profile.png, optional hero.webm / hero.mp4 (logo video)
   ├─ admin/                 /admin/ home, /admin/dashboard.html, /admin/cms/ (editor + config.yml)
   └─ assets/                css/style.css, js/app.js, js/lenis.min.js
```
`public/` is generated. Never edit it.

## The admin (only you)
| Address | What it does | How it is protected |
|---|---|---|
| `/admin/` | Two big buttons | nothing to see without signing in |
| `/admin/cms/` | Upload images, add YouTube videos/reels, edit text, reviews, logos, contact details | GitHub login. Only people with write access to your repo can save. |
| `/admin/dashboard.html` | Visitors, popular pages, likes, comments approval | Your ADMIN_TOKEN |

Each save in the editor is a commit to GitHub, and Netlify rebuilds the site in about a minute.

### One-time setup (about 20 minutes)
1. **GitHub + Netlify:** push this folder to your GitHub repo and connect it in Netlify (build settings are already in netlify.toml).
2. **Dashboard password:** Netlify -> Project configuration -> Environment variables -> add `ADMIN_TOKEN` = a long random password (at least 12 characters, use a password manager). Redeploy.
   Optional: `COMMENTS_AUTO` = `1` to publish comments without approval (default: you approve each one).
3. **Editor login (GitHub):**
   - Open `src/admin/cms/config.yml` and set `repo:` to `YOUR-USERNAME/YOUR-REPO` (and `branch:` if it is not `main`).
   - GitHub -> Settings -> Developer settings -> OAuth Apps -> New. Homepage = your site address. Callback URL = `https://api.netlify.com/auth/done`. Copy the Client ID and create a Client secret.
   - Netlify -> Project configuration -> Access & security -> OAuth -> Install provider -> GitHub -> paste the ID and secret.
   (Menu names in Netlify/GitHub change now and then. Search "Netlify OAuth GitHub Decap CMS" if a name differs.)
4. Open `/admin/`. On the dashboard, signing in once also marks that browser so your own visits are not counted.

## Where to change things
| I want to... | Do this |
|---|---|
| Add a video or reel | Admin editor -> Videos & Reels -> add the YouTube link under Reels or Long videos |
| Add a thumbnail / reel cover / post | Admin editor -> choose the section -> add item: upload image, title, client, tags |
| Show client logos | Admin editor -> Reviews, clients & social -> Client logos |
| Add a review | Admin editor -> Testimonials |
| Change page text, services, timeline, Terms blanks | Admin editor -> Page text |
| Change contact details | Admin editor -> Contact & site settings |
| Add a new section (e.g. Posters) | New folder in `src/media/`, copy `src/pages/posts.html`, use `{{masonry:posters}}` or `{{gallery:posters}}`, add a menu link in `src/partials/header.html` |
| Home photo -> logo video | Put `hero.webm` / `hero.mp4` in `src/images/` |
| Colors | Variables at the top of `src/assets/css/style.css` |

Without the editor: you can still drop images into `src/media/<section>/` and edit the files in `src/content/` by hand.

## Layout
Long videos 3 per row, reels 4 per row, thumbnails 3, reel covers 4, posts = masonry (every image keeps its size). Phones: 1 / 2 per row. 12 items show first, then "Show more" (change `PER` in `build.js`).

## Features that need the server part (Netlify)
- Likes (one per visitor, counts visible to everyone), Top works, total likes
- Comments (approval needed), visit statistics, dashboard
On Live Server these show hearts/animation only. Use `npm run dev` to test everything locally.

## Good to know
- Likes and comments are anonymous. Someone who clears browser data can like again.
- Renaming an image (or changing a YouTube ID) starts its likes again from 0.
- Statistics count page views, device type, country and referrer as daily totals. No cookies, no IP stored. Browsers with "Do Not Track" are not counted.
- The YouTube "latest videos" strip only shows PUBLIC videos (unlisted ones never appear). Add your channel ID in settings to turn it on.
- Fill the two blanks (advance %, revisions) in Admin -> Page text -> Terms & Privacy.

## SEO checklist (after launch)
1. Google Search Console: add the site, submit `/sitemap.xml`.
2. Use a custom domain, then update the site address in the admin settings.
3. Link the site in your Instagram bio and YouTube descriptions.
4. Unique page titles/descriptions (top comment of each page file), clear image titles.

## Add works WITHOUT the admin page
Everything the admin does is just editing files, so you can do it by hand in VS Code.

**1. Images (thumbnails, reel covers, posts, client logos)**
Copy the image into the right folder. Nothing else is needed. It appears with a title made from the file name.
| Folder | For | Good size |
|---|---|---|
| `src/media/thumbnails/` | YouTube thumbnails | 1280 x 720 |
| `src/media/reel-covers/` | reel covers | 1080 x 1920 (9:16) |
| `src/media/posts/` | posts, posters (any size, masonry) | any |
| `src/media/clients/` | client logos | PNG, about 400 px wide, transparent |
File names: letters, numbers and hyphens, e.g. `gaming-intro.png`. Keep each image under about 500 KB (squoosh.app or tinypng.com). Order = number order of the names, or the order in the content file below.

**2. YouTube videos and reels (unlisted is fine)**
Open `src/content/youtube.json`. It has two lists: `"reels"` (Shorts / vertical) and `"long"` (landscape). Paste the YouTube link into the right list:
```json
{
  "reels": [
    { "link": "https://www.youtube.com/shorts/3wiYSCtsIUo" },
    { "link": "https://youtu.be/PUT_REEL_ID_HERE" }
  ],
  "long": [
    { "link": "https://www.youtube.com/watch?v=PUT_VIDEO_ID_HERE" },
    { "link": "https://youtu.be/ANOTHER_ID", "title": "My own title", "tags": ["wedding"] }
  ]
}
```
- Only `link` is needed. `title` and `tags` are optional. If you skip the title, the site reads it from YouTube during the build (if YouTube cannot be reached it shows "Video 1", "Reel 1").
- Any link works: watch, youtu.be, shorts, embed, unlisted. A plain 11-character ID works too.
- The list you choose decides the section: `reels` -> Reels (4 per row, vertical), `long` -> Long videos (3 per row, landscape). One safety rule: a `/shorts/` link put in `long` is moved to Reels automatically.
- A comma after every block except the last one in each list. A bad link or a link listed twice is skipped and the build tells you.
- The cover picture comes from YouTube and the video plays on your site. The video must allow embedding in YouTube Studio.
- Put the newest video at the top of its list if you want it shown first.

**3. Titles, client names, tags and order (optional)**
Open `src/content/thumbnails.json` (or `reel-covers.json`, `posts.json`) and list the images you want to control. Items you list come first, in that order. Other images in the folder still show after them.
```json
{ "items": [
  { "image": "/media/thumbnails/gaming-intro.png", "title": "Gaming Intro", "client": "Tanay Tiwari", "tags": ["gaming"] }
] }
```
**4. Preview and publish**
- Preview: `npm run watch`, then open `public/index.html` with Live Server.
- Publish: commit and push to GitHub (VS Code: Source Control icon -> type a message -> Commit -> Sync Changes; or `git add . && git commit -m "new work" && git push`). Netlify rebuilds in about a minute.
- Do not drag-and-drop only the `public` folder into Netlify: that skips the server part (likes, comments, dashboard). Use GitHub.
- GitHub rejects files over 100 MB. Videos belong on YouTube, not in the folders (the home logo video `hero.webm` is the one exception, keep it under about 5 MB).

## About the stylesheet
`src/assets/css/style.css` is one ordered file (tokens/themes, base, layout, header, hero, sections, cards, features, forms, footer, viewer/popups, effects, motion). Colors live at the top. The page is as wide as the screen up to 1600 px, the home hero always fits one screen (text scales with the window width AND height), and the menu turns into the phone menu below 900 px.

## Signing in (admin and dashboard)
**Dashboard** (`/admin/dashboard.html`, or the "Dashboard & comments" button on `/admin/`)
1. One time: Netlify -> Project configuration -> Environment variables -> add `ADMIN_TOKEN` with a long random password (12+ characters). Redeploy the site.
2. Open `https://YOUR-SITE/admin/dashboard.html`, type that same password in the box, press "Open dashboard". Tick "Remember on this device" if it is your own computer or phone.
3. Wrong password = "Wrong token". "ADMIN_TOKEN is not set" = step 1 not done or not redeployed.
4. Locally (`npm run dev`): create a file named `.env` in the project folder containing `ADMIN_TOKEN=any-long-test-password`. Never commit `.env` (it is already ignored).

**Editor** (`/admin/cms/`)
1. One time setup is in "The admin (only you)" above (repo name in `config.yml`, GitHub OAuth app, Netlify OAuth provider).
2. Open `https://YOUR-SITE/admin/cms/`, press "Login with GitHub", allow access. Only GitHub accounts with write access to the repo can save.
3. Left menu: pick a section (for example Thumbnails), press "Add" to add an item, choose the image, fill the title, press Publish. The site updates in about a minute.
4. "Config Errors" on the page means `repo:` in `src/admin/cms/config.yml` still has the placeholder text.
5. Testing the editor on your computer without GitHub: in one terminal run `npx decap-server`, in another `npm run dev`, then open http://localhost:8888/admin/cms/ . Changes are written to your local files.

## Client reviews: two columns (video editing + thumbnails & covers)
Reviews live in `src/content/testimonials.json` in two lists. `items` = video editing reviews, `design` = graphic design reviews (thumbnails and covers).
```json
{
  "items":  [ { "quote": "Feedback about your editing", "name": "Client name", "role": "YouTuber, Vadodara" } ],
  "design": [ { "quote": "Feedback about your thumbnails/covers", "name": "Client name", "role": "Creator" } ]
}
```
- Both lists filled: shown side by side (stacked on phones), each with its own arrows and dots.
- Only one list filled: it is shown alone, full width. Empty `[]` is fine.
- The home page and the About page use the same reviews. Add the review only in this file.
- If a section appears twice on a page, the line `{{testimonials}}` is written twice in that page file in `src/pages/`. Delete one.
- Never edit files in `public/`. They are rebuilt from `src/` every time.
