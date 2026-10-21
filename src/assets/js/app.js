(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
  var vw = $('#vw'), vs = $('#vs'), shp = $('#shp'), cmp = $('#cmp'), items = [], cur = 0, last = null;
  var mode = { sort: 'feat', q: '', tag: '' }, API = '/api/likes', LS = {}, counts = {}, api = null, tok = '', total = 0;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function toast(m) { var t = $('#ts'); t.textContent = m; t.classList.add('on'); setTimeout(function () { t.classList.remove('on'); }, 2400); }
  function vis(e) { return !e.hidden && !e.closest('[hidden]') && !e.classList.contains('mo'); }
  function byI(a, b) { return a.dataset.i - b.dataset.i; }
  function ord(a, b) { if (mode.sort === 'likes') { var d = (counts[b.dataset.lid] || 0) - (counts[a.dataset.lid] || 0); if (d) return d; } return a.dataset.i - b.dataset.i; }
  function stagger(list) { list.forEach(function (c) { c.classList.remove('in'); }); void root.offsetWidth; list.forEach(function (c, i) { c.style.setProperty('--d', Math.min(i, 10) * 50 + 'ms'); c.classList.add('in'); }); }

  /* ---------- privacy-friendly visit counting (no cookies, no IP, off if Do Not Track) ---------- */
  function track(o) { try { if (navigator.doNotTrack === '1' || localStorage.getItem('noTrack')) return; var b = JSON.stringify(o); if (navigator.sendBeacon) navigator.sendBeacon('/api/track', new Blob([b], { type: 'application/json' })); else fetch('/api/track', { method: 'POST', body: b, keepalive: true }); } catch (e) {} }
  (function () { var ns = false, rf = ''; try { if (!sessionStorage.getItem('vs')) { sessionStorage.setItem('vs', '1'); ns = true; } } catch (e) {} try { rf = document.referrer ? new URL(document.referrer).hostname : ''; if (rf === location.hostname) rf = ''; } catch (e) {} track({ p: location.pathname.replace(/index\.html$/, '').replace(/\.html$/, '') || '/', r: rf, w: innerWidth, s: ns }); })();

  /* ---------- smooth scrolling (Lenis). Touch devices keep native scrolling. ---------- */
  var lenis = null;
  if (window.Lenis && !reduce) { lenis = new Lenis({ lerp: 0.1, anchors: true }); (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0); }
  var pb = $('#pb'), bt = $('#bt'), hd = $('header');
  function sc() { var h = root.scrollHeight - innerHeight, y = scrollY; pb.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')'; hd.classList.toggle('sm', y > 20); bt.classList.toggle('on', y > 600); }
  addEventListener('scroll', sc, { passive: true }); sc();
  bt.onclick = function () { lenis ? lenis.scrollTo(0) : scrollTo({ top: 0, behavior: 'smooth' }); };

  /* ---------- reveal animations (added by script, so the page is fully visible without JavaScript) ---------- */
  var rv = $$('main .hero .pill, main .hero h1, main .hero .lead, main .hero .btn, main .spec, main h1.ph, main h2, main .sub, main .fl, main .tools, main .tags, main .cd, main .sv>div, main .st>div, main .tl>div, main .q, main .tile, main .ln, main form, main .ab>div, main .em, main .eyebrow');
  rv.forEach(function (e) { e.classList.add('rv'); });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }); }, { threshold: 0.08 });
    rv.forEach(function (e, i) { e.style.setProperty('--d', (i % 5) * 70 + 'ms'); io.observe(e); });
  } else rv.forEach(function (e) { e.classList.add('in'); });

  /* ---------- menu, links ---------- */
  var bg = $('.bg'), nav = $('#nav');
  bg.onclick = function () { var o = nav.classList.toggle('on'); bg.setAttribute('aria-expanded', o); };
  nav.onclick = function (e) { if (e.target.tagName === 'A') nav.classList.remove('on'); };
  $$('a[href^="http"]').forEach(function (a) { a.target = '_blank'; a.rel = 'noopener noreferrer'; });

  /* ---------- Terms & Privacy popups ---------- */
  ['terms', 'privacy'].forEach(function (id) { var t = $('#tpl-' + id), b = $('#' + id + ' .body'); if (t && b) b.appendChild(t.content.cloneNode(true)); });
  function openM(id) { $('#' + id).classList.add('on'); root.classList.add('lock'); if (lenis) lenis.stop(); }
  function closeMs() { var m = $$('.md.on'); m.forEach(function (x) { x.classList.remove('on'); }); if (m.length && vw.hidden) { root.classList.remove('lock'); if (lenis) lenis.start(); } return m.length > 0; }
  document.addEventListener('click', function (e) {
    var l = e.target.closest('[data-m]'); if (l) { e.preventDefault(); openM(l.dataset.m); return; }
    var m = $$('.md.on')[0]; if (m && (e.target === m || e.target.closest('[data-x]'))) closeMs();
    var g = e.target.closest('[data-ig]'); if (g) { var f = document.createElement('iframe'); f.src = g.dataset.ig; f.loading = 'lazy'; f.title = 'Instagram post'; f.setAttribute('scrolling', 'no'); f.className = 'igf'; g.replaceWith(f); }
  });

  /* ---------- galleries: search, tags, sort, "Show more", masonry ---------- */
  function cols() { return innerWidth < 560 ? 2 : innerWidth < 900 ? 3 : 4; }
  function layoutM(g, force) {
    var n = g.dataset.cols ? Math.min(+g.dataset.cols, cols()) : cols(); if (!force && g._n === n) return; g._n = n;
    var cards = $$('.cd', g).sort(ord); g.classList.add('on'); g.innerHTML = '';
    var cs = [], hs = []; for (var i = 0; i < n; i++) { var c = document.createElement('div'); c.className = 'mc'; g.appendChild(c); cs.push(c); hs.push(0); }
    cards.forEach(function (c) { if (c.hidden || c.classList.contains('mo')) { cs[0].appendChild(c); return; } var k = hs.indexOf(Math.min.apply(null, hs)); cs[k].appendChild(c); hs[k] += (parseFloat(c.dataset.ar) || 1.25) + 0.3; });
  }
  function fixAr(g) {
    $$('.cd:not([data-ar])', g).forEach(function (c) {
      var im = $('img', c); function f() { if (!im.naturalWidth) return; c.dataset.ar = im.naturalHeight / im.naturalWidth; $('.th', c).style.aspectRatio = im.naturalWidth + '/' + im.naturalHeight; clearTimeout(g._t); g._t = setTimeout(function () { layoutM(g, true); }, 80); }
      if (im.complete) f(); else im.addEventListener('load', f);
    });
  }
  function match(c) { return (!mode.q || (c.dataset.s || '').indexOf(mode.q) > -1) && (!mode.tag || (' ' + c.dataset.tags + ' ').indexOf(' ' + mode.tag + ' ') > -1); }
  function refresh(g) {
    var per = +g.dataset.per || 12, pg = g._pg || 1, all = $$('.cd', g), m = all.filter(match).sort(ord);
    all.forEach(function (c) { c.hidden = m.indexOf(c) < 0; });
    m.forEach(function (c, i) { c.classList.toggle('mo', i >= per * pg); });
    if (g._more) g._more.hidden = m.length <= per * pg;
    if (g.hasAttribute('data-masonry')) layoutM(g, true);
    else all.slice().sort(function (a, b) { return (a.hidden - b.hidden) || ord(a, b); }).forEach(function (c) { g.appendChild(c); });
  }
  function refreshAll(anim) {
    $$('[data-gal]').forEach(refresh);
    var nr = $('.nores'); if (nr) nr.hidden = $$('[data-gal] .cd').some(function (c) { return !c.hidden; });
    if (anim) stagger($$('[data-gal] .cd').filter(vis));
  }
  $$('.f[data-f]').forEach(function (b) { b.onclick = function () {
    $$('.f[data-f]').forEach(function (y) { y.classList.toggle('on', y === b); y.setAttribute('aria-pressed', y === b); });
    $$('.grp').forEach(function (g) { g.hidden = b.dataset.f !== 'all' && g.dataset.group !== b.dataset.f; });
    stagger($$('.grp:not([hidden]) .cd').filter(vis));
  }; });
  var qi = $('#q'), so = $('#so'), qt;
  if (qi) qi.addEventListener('input', function () { clearTimeout(qt); qt = setTimeout(function () { mode.q = qi.value.trim().toLowerCase(); $$('[data-gal]').forEach(function (g) { g._pg = 1; }); refreshAll(true); }, 150); });
  if (so) so.onchange = function () { mode.sort = so.value; refreshAll(true); };
  $$('.tg').forEach(function (b) { b.onclick = function () { mode.tag = b.dataset.tag; $$('.tg').forEach(function (y) { y.classList.toggle('on', y === b); }); $$('[data-gal]').forEach(function (g) { g._pg = 1; }); refreshAll(true); }; });
  $$('[data-gal]').forEach(function (g) {
    var per = +g.dataset.per || 12, n = $$('.cd', g).length; g._pg = 1;
    var w = document.createElement('div'); w.className = 'more'; w.hidden = n <= per; w.innerHTML = '<button class="btn o" type="button">Show more</button>'; g.parentNode.insertBefore(w, g.nextSibling); g._more = w;
    w.firstChild.onclick = function () { var before = $$('.cd', g).filter(function (c) { return !c.hidden && c.classList.contains('mo'); }).sort(ord).slice(0, per); g._pg++; refresh(g); stagger(before); };
    refresh(g); if (g.hasAttribute('data-masonry')) fixAr(g);
    g.onclick = function (e) { var c = e.target.closest('.cd'); if (!c) return; if (e.target.closest('.lk')) toggle(c.dataset.lid, c); else openV(c); };
  });
  var rz; addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(function () { $$('[data-masonry]').forEach(function (g) { layoutM(g); }); }, 150); });

  /* ---------- viewer (images + YouTube) with arrows, keyboard, swipe, likes, comments, share ---------- */
  function show(i, d) {
    var n = items.length; cur = (i + n) % n; var el = items[cur], t = el.dataset.title, y = el.dataset.yt;
    vs.className = 'vs' + (d > 0 ? ' sl' : d < 0 ? ' sr' : '');
    vs.innerHTML = y
      ? '<div class="yb' + (el.dataset.k === 'short' ? ' v' : '') + '"><iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(y) + '?autoplay=1&rel=0&playsinline=1" title="' + esc(t) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>'
      : '<img src="' + el.dataset.full + '" alt="' + esc(t) + '" draggable="false">';
    if (y) track({ e: 'play' });
    $('#vt').textContent = t; $('#vc').textContent = (cur + 1) + ' / ' + n;
    $$('.vn', vw).forEach(function (b) { b.hidden = n < 2; });
    history.replaceState(null, '', '#' + el.dataset.id); upd($('#vl'), el.dataset.lid); $('#vcm .n').textContent = ''; if (!cmp.hidden) cmLoad();
    [1, -1].forEach(function (k) { var o = items[(cur + k + n) % n]; if (o && o.dataset.full) (new Image()).src = o.dataset.full; });
  }
  function openV(el) {
    items = $$('[data-gal] .cd').filter(vis).sort(ord); var i = items.indexOf(el); if (i < 0) return;
    last = document.activeElement; vw.hidden = false; root.classList.add('lock'); if (lenis) lenis.stop(); show(i, 0); $('.vx', vw).focus();
  }
  function closeV() {
    vs.innerHTML = ''; vw.hidden = true; shp.hidden = true; cmp.hidden = true; root.classList.remove('lock'); if (lenis) lenis.start();
    history.replaceState(null, '', location.pathname + location.search); if (last && last.focus) last.focus();
  }
  vw.onclick = function (e) { if (!shp.hidden) return; if (e.target === vw || e.target.hasAttribute('data-c')) closeV(); };
  $('[data-p]', vw).onclick = function () { show(cur - 1, -1); };
  $('[data-n]', vw).onclick = function () { show(cur + 1, 1); };
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (!shp.hidden) shp.hidden = true; else if (!cmp.hidden) cmp.hidden = true; else if (closeMs()) {} else if (!vw.hidden) closeV(); return; }
    if (vw.hidden || e.target.closest('input,textarea,select')) return; if (e.key === 'ArrowRight') show(cur + 1, 1); else if (e.key === 'ArrowLeft') show(cur - 1, -1);
  });
  var tx = 0, ty = 0, sw = true;
  vw.addEventListener('touchstart', function (e) { sw = !e.target.closest('#cmp'); tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  vw.addEventListener('touchend', function (e) {
    if (!sw) return; var dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) show(cur + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  }, { passive: true });
  (function deep() {
    var h = decodeURIComponent(location.hash.slice(1)); if (!h) return;
    var el = $$('[data-gal] .cd').filter(function (e) { return e.dataset.id === h; })[0]; if (!el) return;
    var g = el.closest('[data-gal]'); if (el.classList.contains('mo')) { var k = 0; while (el.classList.contains('mo') && k++ < 50) { g._pg++; refresh(g); } }
    openV(el);
  })();

  /* ---------- comments ---------- */
  function cmLoad() {
    var el = items[cur]; if (!el) return;
    fetch('/api/comments?id=' + encodeURIComponent(el.dataset.lid)).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (j) {
      if (items[cur] !== el) return; $('#vcm .n').textContent = j.count || '';
      $('#cml').innerHTML = j.comments.length ? j.comments.map(function (c) { return '<div class="cm"><b>' + esc(c.name || 'Visitor') + '</b><p>' + esc(c.text) + '</p></div>'; }).join('') : '<p class="mu">No comments yet. Be the first!</p>';
    }).catch(function () { $('#cml').innerHTML = '<p class="mu">Comments are not available right now.</p>'; });
  }
  $('#vcm').onclick = function () { cmp.hidden = !cmp.hidden; if (!cmp.hidden) { shp.hidden = true; cmLoad(); } };
  $('#cmx').onclick = function () { cmp.hidden = true; };
  $('#cmf').onsubmit = function (e) {
    e.preventDefault(); var el = items[cur], t = $('#cmt').value.trim(), m = $('#cmm'); if (!el) return; if (t.length < 2) { m.textContent = 'Please write a comment.'; return; }
    m.textContent = 'Sending…';
    fetch('/api/comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: el.dataset.lid, token: tok, name: $('#cmn').value, text: t, hp: $('#cmh').value }) })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || 'Error'); return j; }); })
      .then(function (j) { $('#cmt').value = ''; m.textContent = j.pending ? 'Thanks! Your comment will appear after I approve it.' : 'Thanks! Your comment is live.'; track({ e: 'comment' }); if (!j.pending) cmLoad(); })
      .catch(function (x) { m.textContent = x.message || 'Could not send. Try again.'; });
  };

  /* ---------- likes (one per visitor per item; counts visible to everyone; needs the /api function on Netlify) ---------- */
  function rnd() { var a = new Uint8Array(16); if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(a); else for (var i = 0; i < 16; i++) a[i] = Math.random() * 256; return [].map.call(a, function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); }
  try { tok = localStorage.getItem('vid') || ''; if (!/^[a-f0-9]{32}$/.test(tok)) { tok = rnd(); localStorage.setItem('vid', tok); } LS = JSON.parse(localStorage.getItem('liked') || '{}'); } catch (e) { tok = tok || rnd(); }
  function save() { try { localStorage.setItem('liked', JSON.stringify(LS)); } catch (e) {} }
  function fmt(n) { return n >= 1e6 ? (n / 1e6).toFixed(1).replace('.0', '') + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1).replace('.0', '') + 'k' : String(n); }
  function upd(b, id) { if (!b) return; b.setAttribute('aria-pressed', !!LS[id]); $('.n', b).textContent = api === true ? fmt(counts[id] || 0) : ''; }
  function paint() {
    $$('.cd[data-lid]').forEach(function (c) { upd($('.lk', c), c.dataset.lid); }); if (!vw.hidden && items[cur]) upd($('#vl'), items[cur].dataset.lid);
    $$('[data-total]').forEach(function (e) { e.textContent = total.toLocaleString(); }); $$('[data-totwrap]').forEach(function (e) { e.hidden = !(api === true && total > 0); });
  }
  function burst(b) {   // big heart + flying hearts + ring (only when LIKING, never on un-like)
    if (reduce) return;
    var r = b.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2, h = '<div class="bh">' + HEART + '</div><i class="rg" style="left:' + x + 'px;top:' + y + 'px"></i>';
    for (var i = 0; i < 14; i++) { var a = Math.random() * Math.PI * 2, d = 50 + Math.random() * 90; h += '<span class="mh" style="left:' + x + 'px;top:' + y + 'px;--dx:' + (Math.cos(a) * d).toFixed(0) + 'px;--dy:' + (Math.sin(a) * d - 50).toFixed(0) + 'px;--r:' + (Math.random() * 120 - 60).toFixed(0) + 'deg">' + HEART + '</span>'; }
    var fx = document.createElement('div'); fx.className = 'hx'; fx.innerHTML = h; document.body.appendChild(fx); setTimeout(function () { fx.remove(); }, 1100);
    if (navigator.vibrate) navigator.vibrate(15);
  }
  function toggle(id, card) {
    var on = !LS[id], b = !vw.hidden ? $('#vl') : $('.lk', card);
    if (on) { LS[id] = 1; counts[id] = (counts[id] || 0) + 1; total++; track({ e: 'like' }); if (b) { b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); burst(b); } }
    else { delete LS[id]; counts[id] = Math.max(0, (counts[id] || 0) - 1); total = Math.max(0, total - 1); }
    save(); paint();
    fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: id, token: tok, action: on ? 'like' : 'unlike' }) })
      .then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { if (j && typeof j.n === 'number') { total += j.n - (counts[id] || 0); counts[id] = j.n; api = true; paint(); } }).catch(function () {});
  }
  $('#vl').onclick = function () { var el = items[cur]; if (el) toggle(el.dataset.lid, el); };
  vs.addEventListener('dblclick', function () { var el = items[cur]; if (el && !LS[el.dataset.lid]) toggle(el.dataset.lid, el); });   // double-tap = like (never un-likes)
  paint();
  function topWorks() {
    var box = $('#tw'); if (!box) return;
    fetch('works.json').then(function (r) { return r.json(); }).then(function (w) {
      var a = w.filter(function (x) { return counts[x.lid] > 0; }).sort(function (x, y) { return counts[y.lid] - counts[x.lid]; }).slice(0, 6); if (!a.length) return;
      box.innerHTML = a.map(function (x, i) {
        var ar = x.ar || 0.75;
        return '<a class="cd tc" data-i="' + i + '" data-lid="' + esc(x.lid) + '" data-ar="' + ar + '" href="' + x.page + '#' + encodeURIComponent(x.id) + '"><div class="th" style="aspect-ratio:' + (1 / ar).toFixed(4) + '"><img loading="lazy" src="' + x.img + '" alt="' + esc(x.title) + '">' + (x.play ? '<span class="pl">▶</span>' : '') + '</div><div class="cb"><div class="ci"><b>' + esc(x.title) + '</b><small>' + esc(x.kind) + '</small></div><span class="lk" aria-pressed="true">' + HEART + '<span class="n">' + fmt(counts[x.lid]) + '</span></span></div></a>';
      }).join('');
      $('#topw').hidden = false; layoutM(box, true); $$('.cd', box).forEach(function (c) { c.classList.add('rv', 'in'); });
    }).catch(function () {});
  }
  fetch(API).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (j) {
    counts = j.counts || {}; total = j.total || 0; api = true; paint(); topWorks(); if (mode.sort === 'likes') refreshAll(false);
  }).catch(function () { api = false; paint(); });

  /* ---------- sharing ---------- */
  function copy(t) { (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { toast('Link copied'); }, function () { prompt('Copy this link:', t); }); }
  function share() {
    track({ e: 'share' });
    var el = vw.hidden ? null : items[cur], url = location.origin + location.pathname + (el ? '#' + el.dataset.id : ''), txt = (el ? el.dataset.title + ' — by Meet Bhavsar' : document.title);
    if (navigator.share && matchMedia('(pointer:coarse)').matches) { navigator.share({ title: txt, text: txt, url: url }).catch(function () {}); return; }
    var u = encodeURIComponent(url), t = encodeURIComponent(txt);
    var L = [['WhatsApp', 'https://wa.me/?text=' + t + '%20' + u], ['X', 'https://twitter.com/intent/tweet?text=' + t + '&url=' + u], ['Facebook', 'https://www.facebook.com/sharer/sharer.php?u=' + u], ['LinkedIn', 'https://www.linkedin.com/sharing/share-offsite/?url=' + u], ['Telegram', 'https://t.me/share/url?url=' + u + '&text=' + t], ['Email', 'mailto:?subject=' + t + '&body=' + u]];
    $('#shg').innerHTML = L.map(function (l) { return '<a href="' + l[1] + '"' + (l[0] === 'Email' ? '' : ' target="_blank" rel="noopener noreferrer"') + '>' + l[0] + '</a>'; }).join('') + '<button class="sb" type="button" data-copy-link>Copy link</button>';
    $('[data-copy-link]', shp).onclick = function () { copy(url); shp.hidden = true; };
    $$('a', shp).forEach(function (x) { x.onclick = function () { setTimeout(function () { shp.hidden = true; }, 100); }; });
    shp.hidden = !shp.hidden;
  }
  document.addEventListener('click', function (e) { if (!shp.hidden && !e.target.closest('#shp') && !e.target.closest('#shb') && !e.target.closest('[data-share-page]')) shp.hidden = true; });
  $('#shb').onclick = share; $$('[data-share-page]').forEach(function (b) { b.onclick = share; });

  /* ---------- testimonials slider ---------- */
  $$('.slider').forEach(function (s) {
    var tr = $('.strack', s), qs = $$('.q', tr), dots = $('.sdots', s), i = 0, hov = false;
    if (qs.length < 2) { $('.snav', s).hidden = true; return; }
    dots.innerHTML = qs.map(function () { return '<button type="button" aria-label="Go to review"></button>'; }).join(''); var db = $$('button', dots);
    function paintD() { db.forEach(function (d, k) { d.classList.toggle('on', k === i); }); }
    function go(n) { i = (n + qs.length) % qs.length; tr.scrollTo({ left: qs[i].offsetLeft - qs[0].offsetLeft, behavior: reduce ? 'auto' : 'smooth' }); paintD(); }
    tr.addEventListener('scroll', function () { var k = Math.round(tr.scrollLeft / (qs[1].offsetLeft - qs[0].offsetLeft || 1)); if (k !== i && k >= 0 && k < qs.length) { i = k; paintD(); } }, { passive: true });
    db.forEach(function (d, k) { d.onclick = function () { go(k); }; }); $('.sprev', s).onclick = function () { go(i - 1); }; $('.snext', s).onclick = function () { go(i + 1); };
    s.addEventListener('mouseenter', function () { hov = true; }); s.addEventListener('mouseleave', function () { hov = false; }); s.addEventListener('focusin', function () { hov = true; }); s.addEventListener('focusout', function () { hov = false; });
    if (!reduce) setInterval(function () { if (!hov && !document.hidden) go(i + 1); }, 6000); paintD();
  });

  /* ---------- home photo: tilt on hover, a different effect on every click ---------- */
  var pf = $('#pf');
  if (pf) {
    var pw = pf.parentNode, say = $('.say', pw), tm, n = 0, msgs = ['Hey there! 👋', 'Let’s create something great 🎬', 'Love the click ❤️', 'Your video, my edit ✂️', 'Say hi on Instagram 📸'];
    var clr = function () { pf.className = pf.className.replace(/\s*fx\d/g, ''); };
    var fx = function () {
      var k = n % 3; clr(); void pf.offsetWidth; pf.classList.add('fx' + (k + 1));
      if (!reduce) {
        var c = ['var(--ac)', '#ffffff', '#ffd36b'], i;
        for (i = 0; i < 20; i++) { var s = document.createElement('i'), a = Math.PI * 2 * i / 20 + Math.random() * 0.3, d = 110 + Math.random() * 100; s.className = 'sp'; s.style.cssText = '--x:' + (Math.cos(a) * d).toFixed(0) + 'px;--y:' + (Math.sin(a) * d).toFixed(0) + 'px;--c:' + c[i % 3]; pw.appendChild(s); setTimeout(s.remove.bind(s), 950); }
        if (k === 2) for (i = 0; i < 3; i++) { var r = document.createElement('i'); r.className = 'rgp'; r.style.animationDelay = (i * 0.15) + 's'; pw.appendChild(r); setTimeout(r.remove.bind(r), 1300); }
      }
      say.textContent = msgs[n % msgs.length]; say.classList.add('on'); clearTimeout(tm); tm = setTimeout(function () { say.classList.remove('on'); }, 1800); n++;
    };
    pf.addEventListener('click', fx);
    pf.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fx(); } });
    pf.addEventListener('animationend', function (e) { if (/^fx/.test(e.animationName)) clr(); });
    if (matchMedia('(pointer:fine)').matches && !reduce) {
      pw.addEventListener('pointermove', function (e) { var r = pw.getBoundingClientRect(); pf.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 16).toFixed(1) + 'deg'); pf.style.setProperty('--rx', (-((e.clientY - r.top) / r.height - 0.5) * 16).toFixed(1) + 'deg'); });
      pw.addEventListener('pointerleave', function () { pf.style.setProperty('--rx', '0deg'); pf.style.setProperty('--ry', '0deg'); });
    }
  }

  /* ---------- contact page ---------- */
  var cf = $('#cf'), cp = $('#cp');
  if (cp) cp.onclick = function () { var m = cp.dataset.copy; navigator.clipboard ? navigator.clipboard.writeText(m).then(function () { toast('Email copied'); }, function () { toast(m); }) : toast(m); };
  if (cf) cf.onsubmit = function (e) {
    e.preventDefault();
    var n = $('#n').value.trim(), em = $('#e').value.trim(), m = $('#m').value.trim(), s = $('#s').value, er = $('#er');
    if (!n || !m) { er.textContent = 'Enter your name and a message.'; return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) { er.textContent = 'Enter a valid email address.'; return; }
    if (!$('#a').checked) { er.textContent = 'Please agree to the Terms & Conditions and Privacy Policy.'; return; }
    er.textContent = ''; track({ e: 'contact' });
    location.href = 'mailto:' + cf.dataset.mail + '?subject=' + encodeURIComponent('Inquiry: ' + s + ' — ' + n) + '&body=' + encodeURIComponent('Name: ' + n + '\nEmail: ' + em + '\nService: ' + s + '\n\n' + m);
    toast('Opening your email app…');
  };

  /* ---------- theme ---------- */
  function theme(t, anim) {
    if (anim) { root.classList.add('tt'); clearTimeout(theme._t); theme._t = setTimeout(function () { root.classList.remove('tt'); }, 450); }
    root.dataset.theme = t;
    $$('.dots button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.t === t); });
    $('meta[name=theme-color]').content = getComputedStyle(root).getPropertyValue('--bg').trim();
    try { localStorage.setItem('theme', t); } catch (e) {}
  }
  $$('.dots button').forEach(function (b) { b.onclick = function () { theme(b.dataset.t, true); }; });
  var sv = 'ember'; try { sv = localStorage.getItem('theme') || 'ember'; } catch (e) {}
  theme(sv);
})();
