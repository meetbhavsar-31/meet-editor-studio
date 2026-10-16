// One serverless function for: likes, privacy-friendly analytics, comments and the admin API.
// Storage: Netlify Blobs. Admin routes need the ADMIN_TOKEN environment variable (set it in Netlify).
import { timingSafeEqual } from 'node:crypto';

const ID = /^[a-z0-9-]{1,30}:[A-Za-z0-9_.-]{1,100}$/, TK = /^[a-f0-9]{16,64}$/;
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const inc = (o, k, n = 1) => { o[k] = (o[k] || 0) + n; };
const clean = (s, n) => String(s || '').replace(/[\u0000-\u001f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);
const env = k => (globalThis.Netlify && Netlify.env && Netlify.env.get(k)) || process.env[k] || '';
const rid = () => Math.random().toString(16).slice(2, 10) + Date.now().toString(16);
const day = (off = 0) => new Date(Date.now() - off * 864e5).toISOString().slice(0, 10);
const same = (a, b) => { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); };

export default async (req, context) => {
  try { return await route(req, context || {}); }
  catch (e) {
    const m = String((e && e.message) || e), dep = /Cannot find package/.test(m);
    return json({ error: dep ? 'Missing dependency. Run "npm install" in the project folder.' : 'Server error' }, dep ? 503 : 500);
  }
};

async function route(req, ctx) {
  const { getStore } = await import('@netlify/blobs');
  const url = new URL(req.url), path = url.pathname.replace(/\/+$/, ''), M = req.method;
  const L = getStore('likes'), A = getStore('analytics'), C = getStore('comments');
  const body = async () => { try { return await req.json(); } catch (e) { return null; } };

  /* ---- likes ---- */
  if (path === '/api/likes') {
    if (M === 'GET') { const s = (await L.get('summary', { type: 'json' })) || {}; return json({ counts: s, total: Object.values(s).reduce((a, b) => a + b, 0) }); }
    if (M === 'POST') {
      const b = await body(); if (!b || !ID.test(b.id || '') || !TK.test(b.token || '') || !['like', 'unlike'].includes(b.action)) return json({ error: 'bad request' }, 400);
      const d = (await L.get('i:' + b.id, { type: 'json' })) || { v: [] }, has = d.v.includes(b.token);
      if (b.action === 'like' && !has && d.v.length < 10000) d.v.push(b.token);
      if (b.action === 'unlike' && has) d.v = d.v.filter(x => x !== b.token);
      await L.setJSON('i:' + b.id, d);
      const s = (await L.get('summary', { type: 'json' })) || {}; if (d.v.length) s[b.id] = d.v.length; else delete s[b.id]; await L.setJSON('summary', s);
      return json({ n: d.v.length, liked: d.v.includes(b.token) });
    }
  }

  /* ---- analytics (no cookies, no IP stored, only daily totals) ---- */
  if (path === '/api/track' && M === 'POST') {
    if (/bot|crawl|spider/i.test(req.headers.get('user-agent') || '')) return new Response(null, { status: 204 });
    const b = await body(); if (!b) return json({ error: 'bad request' }, 400);
    const k = 'd:' + day(), d = (await A.get(k, { type: 'json' })) || { pvt: 0, visits: 0, pv: {}, ref: {}, dev: {}, cty: {}, ev: {} };
    if (typeof b.p === 'string' && /^\/[\w\-./]{0,80}$/.test(b.p)) {
      inc(d, 'pvt'); inc(d.pv, b.p); if (b.s) inc(d, 'visits');
      if (typeof b.r === 'string' && /^[\w.-]{1,60}$/.test(b.r)) inc(d.ref, b.r);
      const w = +b.w || 0; inc(d.dev, w && w < 600 ? 'mobile' : w && w < 1024 ? 'tablet' : 'desktop');
      inc(d.cty, (ctx.geo && ctx.geo.country && ctx.geo.country.code) || '??');
    }
    if (['play', 'share', 'like', 'comment', 'contact'].includes(b.e)) inc(d.ev, b.e);
    await A.setJSON(k, d); return new Response(null, { status: 204 });
  }

  /* ---- comments (held for approval unless COMMENTS_AUTO=1) ---- */
  if (path === '/api/comments') {
    if (M === 'GET') {
      const id = url.searchParams.get('id') || ''; if (!ID.test(id)) return json({ error: 'bad id' }, 400);
      const c = ((await C.get('c:' + id, { type: 'json' })) || []).filter(x => x.ok).reverse().slice(0, 50);
      return json({ comments: c.map(x => ({ name: x.name, text: x.text, ts: x.ts })), count: c.length });
    }
    if (M === 'POST') {
      const b = await body(); if (!b || !ID.test(b.id || '') || !TK.test(b.token || '')) return json({ error: 'bad request' }, 400);
      if (b.hp) return json({ ok: true, pending: true });                 // honeypot: bots fill this
      const text = clean(b.text, 500), name = clean(b.name, 40); if (text.length < 2) return json({ error: 'Please write a comment.' }, 400);
      const rl = (await C.get('rl:' + b.token, { type: 'json' })) || { t: Date.now(), n: 0 };
      if (Date.now() - rl.t > 36e5) { rl.t = Date.now(); rl.n = 0; } if (rl.n >= 5) return json({ error: 'Too many comments. Try again later.' }, 429);
      rl.n++; await C.setJSON('rl:' + b.token, rl);
      const list = (await C.get('c:' + b.id, { type: 'json' })) || [];
      if (list.length >= 300 || list.some(x => x.text === text && x.name === name)) return json({ ok: true, pending: true });
      const auto = env('COMMENTS_AUTO') === '1', c = { cid: rid(), name, text, ts: Date.now(), ok: auto };
      list.push(c); await C.setJSON('c:' + b.id, list);
      const key = auto ? 'recent' : 'pending', q = (await C.get(key, { type: 'json' })) || []; q.unshift({ lid: b.id, ...c }); await C.setJSON(key, q.slice(0, 100));
      return json({ ok: true, pending: !auto });
    }
  }

  /* ---- admin (token protected) ---- */
  if (path.startsWith('/api/admin/')) {
    const tk = env('ADMIN_TOKEN'); if (tk.length < 12) return json({ error: 'ADMIN_TOKEN is not set (or too short). Add it in Netlify > Site configuration > Environment variables.' }, 503);
    const got = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, ''); if (!same(got, tk)) return json({ error: 'Wrong token' }, 401);
    if (path === '/api/admin/stats' && M === 'GET') {
      const n = Math.min(90, Math.max(1, +url.searchParams.get('days') || 30)), ds = [...Array(n)].map((_, i) => day(n - 1 - i));
      const rows = await Promise.all(ds.map(async d => ({ d, ...((await A.get('d:' + d, { type: 'json' })) || {}) })));
      const t = { pv: {}, ref: {}, dev: {}, cty: {}, ev: {} }; let pvt = 0, visits = 0;
      rows.forEach(r => { pvt += r.pvt || 0; visits += r.visits || 0; ['pv', 'ref', 'dev', 'cty', 'ev'].forEach(k => Object.entries(r[k] || {}).forEach(([a, v]) => inc(t[k], a, v))); });
      const s = (await L.get('summary', { type: 'json' })) || {}, top = Object.entries(s).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([id, n]) => ({ id, n }));
      return json({ days: rows.map(r => ({ d: r.d, pv: r.pvt || 0, visits: r.visits || 0 })), pvt, visits, ...t, likes: { total: Object.values(s).reduce((a, b) => a + b, 0), top } });
    }
    if (path === '/api/admin/comments') {
      if (M === 'GET') return json({ pending: (await C.get('pending', { type: 'json' })) || [], recent: ((await C.get('recent', { type: 'json' })) || []).slice(0, 30) });
      if (M === 'POST') {
        const b = await body(); if (!b || !ID.test(b.lid || '') || !b.cid || !['approve', 'delete'].includes(b.action)) return json({ error: 'bad request' }, 400);
        const list = (await C.get('c:' + b.lid, { type: 'json' })) || [], c = list.find(x => x.cid === b.cid); if (!c) return json({ error: 'not found' }, 404);
        let pend = ((await C.get('pending', { type: 'json' })) || []).filter(x => x.cid !== b.cid), rec = ((await C.get('recent', { type: 'json' })) || []).filter(x => x.cid !== b.cid);
        if (b.action === 'approve') { c.ok = true; rec.unshift({ lid: b.lid, ...c }); await C.setJSON('c:' + b.lid, list); }
        else await C.setJSON('c:' + b.lid, list.filter(x => x.cid !== b.cid));
        await C.setJSON('pending', pend); await C.setJSON('recent', rec.slice(0, 100)); return json({ ok: true });
      }
    }
  }
  return json({ error: 'not found' }, 404);
}
export const config = { path: ['/api/likes', '/api/track', '/api/comments', '/api/admin/stats', '/api/admin/comments'] };
