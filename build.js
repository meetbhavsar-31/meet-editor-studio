// Builds the website: src/ -> public/   (npm run build, or npm run watch while editing)
const fs = require('fs'), path = require('path');
const S = path.join(__dirname, 'src'), O = path.join(__dirname, 'public');
const rd = f => fs.readFileSync(path.join(S, f), 'utf8');
const jr = (f, d) => { try { return JSON.parse(rd(f)); } catch (e) { return d; } };
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const md = s => esc(s).replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a class="ac" href="$2" target="_blank" rel="noopener noreferrer">$1</a>');   // [text](link)
const IMG = /\.(png|jpe?g|webp|gif|avif)$/i, PER = 12;   // PER = how many items show before "Show more"
const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
const LABEL = { thumbnails: 'YouTube thumbnail', 'reel-covers': 'reel cover', posts: 'social media post design' };
const KIND = { thumbnails: 'Thumbnail', 'reel-covers': 'Reel cover', posts: 'Post' };
const tg = a => (Array.isArray(a) ? a : String(a || '').split(',')).map(x => String(x).trim().toLowerCase()).filter(Boolean);
const num = (a, b) => a.localeCompare(b, undefined, { numeric: true });
// accepts a full YouTube link (watch, youtu.be, shorts, embed, live) or just the 11-character video ID
const ytId = s => { s = String(s || '').trim(); const m = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/|v\/))([\w-]{11})/.exec(s); return m ? m[1] : /^[\w-]{11}$/.test(s) ? s : ''; };

function dims(f) {   // image width/height from the file header (png, jpg, gif, webp)
  try {
    const b = fs.readFileSync(f);
    if (b.readUInt32BE(0) === 0x89504e47) return [b.readUInt32BE(16), b.readUInt32BE(20)];
    if (b.toString('ascii', 0, 3) === 'GIF') return [b.readUInt16LE(6), b.readUInt16LE(8)];
    if (b[0] === 0xff && b[1] === 0xd8) { let i = 2; while (i < b.length) { if (b[i] !== 0xff) { i++; continue; } const m = b[i + 1]; if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)]; i += 2 + b.readUInt16BE(i + 2); } }
    if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
      const t = b.toString('ascii', 12, 16);
      if (t === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
      if (t === 'VP8L') { const v = b.readUInt32LE(21); return [(v & 0x3fff) + 1, ((v >> 14) & 0x3fff) + 1]; }
      if (t === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
    }
  } catch (e) {}
  return null;
}
function parseRss(xml) {   // latest public videos from a YouTube channel RSS feed
  const out = [], re = /<entry>([\s\S]*?)<\/entry>/g; let m;
  while ((m = re.exec(xml)) && out.length < 3) {
    const id = (/<yt:videoId>([^<]+)<\/yt:videoId>/.exec(m[1]) || [])[1], t = (/<title>([^<]*)<\/title>/.exec(m[1]) || [])[1] || '';
    if (id) out.push({ id, title: t.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'") });
  }
  return out;
}

// ---- YouTube videos: src/content/youtube.json has two lists, "reels" and "long". Paste links; titles are fetched automatically.
const CACHE = path.join(__dirname, '.cache', 'yt-titles.json');
let ytCache = {}; try { ytCache = JSON.parse(fs.readFileSync(CACHE, 'utf8')); } catch (e) {}
async function ytTitle(id) {
  if (ytCache[id]) return ytCache[id];
  try { const r = await fetch('https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + id), { signal: AbortSignal.timeout(6000) }); if (r.ok) { const j = await r.json(); if (j && j.title) return (ytCache[id] = j.title); } } catch (e) {}
  return '';
}
async function videoList() {
  const j = jr('content/youtube.json', {}), out = [], seen = new Set();
  const push = (it, kind) => {
    if (!it) return; const o = typeof it === 'string' ? { link: it } : it, src = o.link || o.id || o.url || '', id = ytId(src);
    if (!id) { if (src && !/PASTE|HERE/i.test(src)) console.log('Skipped (not a valid YouTube link or ID):', src); return; }
    if (seen.has(id)) { console.log('Skipped (listed twice):', id); return; } seen.add(id);
    const isShort = /\/shorts\//.test(src);
    let type = o.type || kind || (isShort ? 'short' : 'long');
    if (kind === 'long' && !o.type && isShort) type = 'short';   // a /shorts/ link in the long list goes to Reels
    out.push({ id, type: type === 'long' ? 'long' : 'short', title: o.title || '', tags: tg(o.tags) });
  };
  if (Array.isArray(j)) j.forEach(x => push(x, ''));
  else { (j.long || []).forEach(x => push(x, 'long')); (j.reels || j.shorts || []).forEach(x => push(x, 'short')); (j.videos || []).forEach(x => push(x, '')); }
  await Promise.all(out.filter(v => !v.title).map(async v => { v.title = await ytTitle(v.id); }));
  let nl = 0, nr = 0; out.forEach(v => { if (!v.title) v.title = v.type === 'long' ? 'Video ' + (++nl) : 'Reel ' + (++nr); });
  try { fs.mkdirSync(path.dirname(CACHE), { recursive: true }); fs.writeFileSync(CACHE, JSON.stringify(ytCache)); } catch (e) {}
  return out;
}

async function build() {
  const site = jr('site.json', {}), legal = jr('content/legal.json', {}), meta = jr('content/meta.json', {});
  const D = {}; ['home', 'services', 'about', 'testimonials', 'clients', 'social', 'legal', 'site'].forEach(k => { D[k] = k === 'site' ? site : jr('content/' + k + '.json', {}); });
  fs.rmSync(O, { recursive: true, force: true }); fs.mkdirSync(O, { recursive: true });
  ['assets', 'images', 'media', 'admin'].forEach(d => { if (fs.existsSync(path.join(S, d))) fs.cpSync(path.join(S, d), path.join(O, d), { recursive: true }); });
  let yt = []; if (site.youtubeChannelId) { try { const r = await fetch('https://www.youtube.com/feeds/videos.xml?channel_id=' + encodeURIComponent(site.youtubeChannelId), { signal: AbortSignal.timeout(8000) }); if (r.ok) yt = parseRss(await r.text()); } catch (e) { console.log('(YouTube feed skipped:', e.message + ')'); } }
  const fill = s => s.replace(/\{\{(url|name|owner|email|instagram|handle|city)\}\}/g, (m, k) => site[k] || '')
    .replace(/\{\{legal:(\w+)\}\}/g, (m, k) => legal[k] ? esc(legal[k]) : '<mark>[add ' + (k === 'advance' ? 'advance %' : k === 'revisions' ? 'number' : k) + ']</mark>')
    .replace(/\{\{data:([\w.]+)\}\}/g, (m, p) => { const [f, ...k] = p.split('.'); let v = D[f]; k.forEach(x => { v = v && v[x]; }); return esc(v); });
  const partial = n => fill(rd('partials/' + n + '.html'));
  const nice = f => f.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const slug = f => f.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  // works in a folder: items from src/content/<folder>.json (admin) first, then any other image dropped in src/media/<folder>/
  const works = dir => {
    const d = path.join(S, 'media', dir), out = [], seen = new Set();
    const add = (f, o) => { const fp = path.join(d, f); if (seen.has(f) || !IMG.test(f) || !fs.existsSync(fp)) return; seen.add(f); const m = meta[f] || {}, z = dims(fp);
      out.push({ id: slug(f), file: 'media/' + dir + '/' + encodeURIComponent(f), title: o.title || m.title || nice(f), client: o.client || m.client || '', tags: tg(o.tags || m.tags), w: z && z[0], h: z && z[1] }); };
    (jr('content/' + dir + '.json', {}).items || []).forEach(it => { if (it && it.image) add(path.basename(decodeURIComponent(it.image)), it); });
    if (fs.existsSync(d)) fs.readdirSync(d).filter(f => IMG.test(f)).sort(num).forEach(f => add(f, {}));
    return out;
  };
  const empty = '<div class="em">Coming soon. Want one made? <a class="ac" href="contact.html">Get in touch</a>.</div>';
  const tools = arr => {
    if (!arr.length) return '';
    const tags = [...new Set(arr.flatMap(x => x.tags || []))].sort();
    return '<div class="tools"><input id="q" type="search" placeholder="Search by name or tag…" aria-label="Search" autocomplete="off"><select id="so" aria-label="Sort"><option value="feat">Featured</option><option value="likes">Most liked</option></select></div>' +
      (tags.length ? '<div class="tags" role="group" aria-label="Filter by tag"><button type="button" class="tg on" data-tag="">All</button>' + tags.map(t => '<button type="button" class="tg" data-tag="' + esc(t) + '">' + esc(t) + '</button>').join('') + '</div>' : '') + '<p class="nores" hidden>No matches. Try another word or tag.</p>';
  };
  const VIDS = await videoList();
  const pages = [], stats = [], all = [];
  for (const file of fs.readdirSync(path.join(S, 'pages')).filter(f => f.endsWith('.html')).sort()) {
    const sl = file.replace('.html', ''); let idx = 0, body = fill(rd('pages/' + file)), fm = {}, image = site.url + '/images/profile.png';
    body = body.replace(/^\s*<!--([\s\S]*?)-->\s*/, (m, t) => { t.split('\n').forEach(l => { const i = l.indexOf(':'); if (i > 0) fm[l.slice(0, i).trim()] = l.slice(i + 1).trim(); }); return ''; });
    const card = o => '<article class="cd" data-i="' + (idx++) + '" data-id="' + esc(o.id) + '" data-lid="' + esc(o.lid) + '" data-title="' + esc(o.title) + '" data-tags="' + esc((o.tags || []).join(' ')) + '" data-s="' + esc((o.title + ' ' + (o.sub || '') + ' ' + (o.tags || []).join(' ')).toLowerCase()) + '"' + o.attrs + '><button class="op" type="button" aria-label="' + esc(o.label) + '"><div class="th ' + o.cls + '"' + (o.style || '') + '>' + o.img + (o.play || '') + '</div></button><div class="cb"><div class="ci"><b>' + esc(o.title) + '</b><small>' + esc(o.sub || '') + '</small></div><button class="lk" type="button" aria-pressed="false" aria-label="Like ' + esc(o.title) + '">' + HEART + '<span class="n"></span></button></div></article>';
    const images = (d, mode) => {
      const it = works(d); stats.push(d + ':' + it.length); if (!it.length) return empty;
      image = site.url + '/' + it[0].file; const k = LABEL[d] || 'design', masonry = mode === 'masonry', reel = d === 'reel-covers';
      it.forEach(x => all.push({ lid: d + ':' + x.id, id: x.id, title: x.title, kind: KIND[d] || 'Design', page: file, img: x.file }));
      return tools(it) + '<div class="' + (masonry ? 'msn' : 'gr ' + (reel ? 'g4' : 'g3')) + '" data-gal ' + (masonry ? 'data-masonry ' : '') + 'data-per="' + PER + '">' + it.map(x => card({
        id: x.id, lid: d + ':' + x.id, title: x.title, sub: x.client, tags: x.tags, label: 'View ' + x.title, cls: reel ? 'v' : '',
        attrs: ' data-full="' + x.file + '"' + (x.w ? ' data-ar="' + (x.h / x.w).toFixed(4) + '"' : ''),
        style: masonry ? ' style="aspect-ratio:' + (x.w ? x.w + '/' + x.h : '4/5') + '"' : '',
        img: '<img loading="lazy" src="' + x.file + '" alt="' + esc(x.title + ' — ' + k + ' by ' + site.owner) + '"' + (x.w ? ' width="' + x.w + '" height="' + x.h + '"' : '') + '>'
      })).join('') + '</div>';
    };
    const M = {
      videos: () => {
        const v = VIDS; stats.push('youtube:' + v.length); if (!v.length) return empty;
        const L = v.filter(x => x.type === 'long'), R = v.filter(x => x.type !== 'long');
        v.forEach(x => all.push({ lid: 'video:' + x.id, id: x.id, title: x.title || 'Video', kind: x.type === 'long' ? 'Video' : 'Reel', page: file, img: 'https://i.ytimg.com/vi/' + x.id + '/hqdefault.jpg' }));
        const vc = (x, sh) => { const t = x.title || 'Video'; return card({ id: x.id, lid: 'video:' + x.id, title: t, sub: sh ? 'Reel' : 'Long video', tags: x.tags, cls: sh ? 'v' : '', label: 'Play ' + t, attrs: ' data-yt="' + esc(x.id) + '" data-k="' + (sh ? 'short' : 'long') + '"', img: '<img loading="lazy" src="https://i.ytimg.com/vi/' + esc(x.id) + '/hqdefault.jpg" alt="' + esc(t + ' — video edited by ' + site.owner) + '">', play: '<span class="pl">▶</span>' }); };
        const grp = (k, h, a, c) => a.length ? '<div class="grp" data-group="' + k + '"><h2 class="gh">' + h + '<span>' + a.length + '</span></h2><div class="gr ' + c + '" data-gal data-per="' + PER + '">' + a.map(x => vc(x, k === 'short')).join('') + '</div></div>' : '';
        return tools(v) + (L.length && R.length ? '<div class="fl" role="group" aria-label="Filter videos"><button class="f on" data-f="all" aria-pressed="true">All</button><button class="f" data-f="short" aria-pressed="false">Reels</button><button class="f" data-f="long" aria-pressed="false">Long videos</button></div>' : '') + grp('long', 'Long videos', L, 'g3') + grp('short', 'Reels', R, 'g4');
      },
      hero: () => {   // home photo: src/images/hero.webm or hero.mp4 (logo video) if present, otherwise profile.png
        const has = f => fs.existsSync(path.join(S, 'images', f)), vids = ['webm', 'mp4'].filter(e => has('hero.' + e));
        const media = vids.length ? '<video autoplay muted loop playsinline preload="metadata"' + (has('profile.png') ? ' poster="images/profile.png"' : '') + '>' + vids.map(e => '<source src="images/hero.' + e + '" type="video/' + e + '">').join('') + '</video>' : '<img src="images/profile.png" alt="' + esc(site.owner + ', video editor and designer') + '" onerror="this.remove()">';
        return '<div class="pfw"><div class="pf" id="pf" role="button" tabindex="0" aria-label="Tap the photo for a surprise">' + media + '</div><span class="say" aria-live="polite"></span></div>';
      },
      spec: () => (D.home.spec || []).map(s => '<div><small>' + esc(s.label) + '</small><b>' + esc(s.value) + '</b></div>').join(''),
      services: () => (D.services.items || []).map(s => '<div><h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p>' + (Array.isArray(s.tags) ? s.tags : []).map(t => '<span class="tag">' + esc(t) + '</span>').join('') + '</div>').join(''),
      process: () => (D.services.process || []).map(s => '<div><h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p></div>').join(''),
      aboutText: () => (D.about.paragraphs || []).map(p => '<p>' + md(p) + '</p>').join('') + '<p>' + (D.about.tools || []).map(t => '<span class="tag">' + esc(t) + '</span>').join('') + '</p>',
      timeline: () => (D.about.timeline || []).map(t => '<div><b>' + esc(t.year) + '</b><span>' + esc(t.text) + '</span></div>').join(''),
      testimonials: () => {   // two columns side by side: video editing reviews + thumbnail/cover design reviews (if you add any)
        const ok = l => (l || []).filter(x => x && x.quote), a = ok(D.testimonials.items), d = ok(D.testimonials.design);
        if (!a.length && !d.length) return '';
        const col = (q, title) => !q.length ? '' : '<div class="rcol">' + (title ? '<h3 class="rh">' + esc(title) + '</h3>' : '') + '<div class="slider"><div class="strack">' + q.map(x => '<div class="q"><p>“' + esc(x.quote) + '”</p><b>' + esc(x.name) + '</b><br><small>' + esc(x.role) + '</small></div>').join('') + '</div><div class="snav"><button type="button" class="sprev" aria-label="Previous review">‹</button><div class="sdots"></div><button type="button" class="snext" aria-label="Next review">›</button></div></div></div>';
        const two = a.length && d.length;
        return '<section id="reviews"><div class="w"><h2>What clients say</h2><p class="sub">Words from people I have worked with.</p><div class="rgrid' + (two ? ' two' : '') + '">' + col(a, two ? 'Video editing' : '') + col(d, two || !a.length ? 'Thumbnails & covers' : '') + '</div></div></section>';
      },
      clients: () => {
        const items = [], seen = new Set(), d = path.join(S, 'media', 'clients');
        (D.clients.items || []).forEach(c => { if (c && c.logo) { const f = path.basename(decodeURIComponent(c.logo)); if (fs.existsSync(path.join(d, f))) { seen.add(f); items.push({ name: c.name || nice(f), file: 'media/clients/' + encodeURIComponent(f), url: c.url }); } } });
        if (fs.existsSync(d)) fs.readdirSync(d).filter(f => IMG.test(f) && !seen.has(f)).sort(num).forEach(f => items.push({ name: nice(f), file: 'media/clients/' + encodeURIComponent(f) }));
        if (!items.length) return ''; let half = items.slice(); while (half.length < 8) half = half.concat(items);
        const li = (c, hid) => { const im = '<img loading="lazy" src="' + c.file + '" alt="' + (hid ? '' : esc(c.name)) + '" height="40">'; return c.url ? '<a class="lg2" href="' + esc(c.url) + '" target="_blank" rel="noopener noreferrer"' + (hid ? ' tabindex="-1" aria-hidden="true"' : '') + '>' + im + '</a>' : '<span class="lg2"' + (hid ? ' aria-hidden="true"' : '') + '>' + im + '</span>'; };
        return '<section class="logos"><div class="w"><p class="eyebrow">Trusted by creators and brands</p></div><div class="marq"><div class="mtrack">' + half.map(c => li(c, 0)).join('') + half.map(c => li(c, 1)).join('') + '</div></div></section>';
      },
      follow: () => {
        const ig = (D.social.instagramPosts || []).map(x => typeof x === 'string' ? x : x && x.url).filter(u => /^https:\/\/www\.instagram\.com\/(p|reel|tv)\/[\w-]+\/?$/.test(u || ''));
        return '<section id="follow"><div class="w"><h2>Follow my work</h2><p class="sub">New edits and designs all the time.</p><div class="fol"><a class="ln" href="' + esc(site.instagram) + '"><small>Instagram</small><b>' + esc(site.handle) + '</b></a>' + (site.youtube ? '<a class="ln" href="' + esc(site.youtube) + '"><small>YouTube</small><b>Subscribe to the channel</b></a>' : '') + '</div>' +
          (yt.length ? '<div class="gr g3 tcs">' + yt.map(v => '<a class="cd tc" href="https://www.youtube.com/watch?v=' + esc(v.id) + '"><div class="th"><img loading="lazy" src="https://i.ytimg.com/vi/' + esc(v.id) + '/hqdefault.jpg" alt="' + esc(v.title) + '"><span class="pl">▶</span></div><div class="cb"><div class="ci"><b>' + esc(v.title) + '</b><small>Latest on YouTube</small></div></div></a>').join('') + '</div>' : '') +
          (ig.length ? '<div class="gr g3 igs">' + ig.map(u => '<button class="igp" type="button" data-ig="' + esc(u.replace(/\/?$/, '/') + 'embed') + '"><b>Instagram</b><span>Tap to load this post</span></button>').join('') + '</div>' : '') + '</div></section>';
      },
      top: () => '<section id="topw" hidden><div class="w"><h2>Top works</h2><p class="sub">Most loved by visitors · <b data-total>0</b> likes so far</p><div class="gr g3" id="tw"></div></div></section>'
    };
    body = body.replace(/\{\{gallery:([\w-]+)\}\}/g, (m, d) => images(d, 'grid')).replace(/\{\{masonry:([\w-]+)\}\}/g, (m, d) => images(d, 'masonry')).replace(/\{\{(\w+)\}\}/g, (m, k) => M[k] ? M[k]() : m);
    const canon = site.url + (sl === 'index' ? '/' : '/' + sl);
    const head = partial('head').replace(/\{\{(title|description)\}\}/g, (m, k) => esc(fm[k] || site.name)).replace(/\{\{canonical\}\}/g, canon).replace(/\{\{image\}\}/g, image).replace(/\{\{robots\}\}/g, fm.robots || 'index,follow');
    const hdr = partial('header').replace(/\{\{cur:([\w-]+)\}\}/g, (m, s) => s === sl ? 'aria-current="page"' : '');
    fs.writeFileSync(path.join(O, file), '<!DOCTYPE html>\n<html lang="en" data-theme="ember"><head>' + head + '</head><body><div class="pb" id="pb"></div>' + hdr + '<main id="top">' + body + '</main>' + partial('footer') + partial('viewer') + partial('legal') + '<script src="assets/js/lenis.min.js" defer></script><script src="assets/js/app.js" defer></script></body></html>');
    if (fm.sitemap !== 'no') pages.push(canon);
  }
  fs.writeFileSync(path.join(O, 'works.json'), JSON.stringify(all));
  const d = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(path.join(O, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + pages.map(u => '<url><loc>' + u + '</loc><lastmod>' + d + '</lastmod></url>').join('\n') + '\n</urlset>\n');
  fs.writeFileSync(path.join(O, 'robots.txt'), 'User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: ' + site.url + '/sitemap.xml\n');
  console.log('Built ' + pages.length + ' pages | ' + stats.join(' | '));
}
module.exports = { parseRss, build, ytId };
if (require.main === module) {
  build().then(() => {
    if (process.argv.includes('--watch')) {
      let t; console.log('Watching src/ for changes... (Ctrl+C to stop)');
      fs.watch(S, { recursive: true }, () => { clearTimeout(t); t = setTimeout(() => build().catch(e => console.log('Build error:', e.message)), 300); });
    }
  }).catch(e => { console.error(e); process.exit(1); });
}
