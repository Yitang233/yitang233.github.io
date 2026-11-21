(function () {
  'use strict';
  /* Visitor counter: GoatCounter (open source, no cookies). Put the site code here, e.g. 'yitang233'. Empty = off. */
  var GC_CODE = 'muxidixi';

  var d = document, root = d.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  root.classList.add('js');
  var sda = !reduce && window.CSS && CSS.supports && CSS.supports('animation-timeline: view()');
  if (sda) root.classList.add('sda');

  /* ---------- sliding thumb for any segmented control ---------- */
  var segs = [];
  function place(seg) {
    var th = $('.thumb', seg), on = $('[aria-selected="true"], .on', seg);
    if (!th) return;
    if (!on || !on.offsetWidth) { th.classList.remove('ready'); return; }
    th.style.width = on.offsetWidth + 'px';
    th.style.setProperty('--x', on.offsetLeft + 'px');
    th.classList.add('ready');
    if (seg.scrollWidth > seg.clientWidth) {
      var target = on.offsetLeft - (seg.clientWidth - on.offsetWidth) / 2;
      seg.scrollTo({ left: target, behavior: reduce ? 'auto' : 'smooth' });
    }
  }
  function replaceAll() { segs.forEach(place); }
  $$('.seg').forEach(function (s) { segs.push(s); });
  addEventListener('resize', replaceAll);
  addEventListener('load', replaceAll);
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(replaceAll);

  /* ---------- nav: scroll-spy ---------- */
  var navs = $$('[data-nav]'), navLinks = [];
  navs.forEach(function (n) { $$('a', n).forEach(function (a) { navLinks.push(a); }); });
  function setNav(id) {
    navLinks.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + id); });
    navs.forEach(place);
  }
  var spies = $$('[data-spy]'), current = '';
  function spy() {
    var line = innerHeight * 0.4, best = '';
    spies.forEach(function (s) { var r = s.getBoundingClientRect(); if (r.top <= line && r.bottom > line) best = s.id; });
    if (best !== current) { current = best; setNav(best); }
  }
  addEventListener('scroll', spy, { passive: true }); addEventListener('resize', spy); spy();

  var dock = $('.dock'), end = $('#end');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { dock.classList.toggle('away', e[0].isIntersecting); }, { threshold: 0.6 }).observe(end);
  }

  /* ---------- reveals: text lifts out of a fog (rises, loses its blur, wiped in from the bottom up). Time-based, once per element,
     in a short cascade from the top of what has just come into view. The page's top plays on load. ---------- */
  $$('.rtitle, .rlist, .sig, .who').forEach(function (el) { if (!el.closest('.rv, .rise')) el.classList.add('rv'); });
  $$('.rv, .rise').forEach(function (el) {
    el.addEventListener('animationend', function (e) { if (e.target === el && e.animationName === 'fog') el.classList.add('done'); });   // drops the mask so shadows and borders are never clipped
  });
  var fogs = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var fio = new IntersectionObserver(function (es) {
      var n = 0;
      es.filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; })
        .forEach(function (e) { e.target.style.setProperty('--st', Math.min(n++, 4) * 70 + 'ms'); e.target.classList.add('in'); fio.unobserve(e.target); });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    fogs.forEach(function (el) { fio.observe(el); });
  } else { fogs.forEach(function (el) { el.classList.add('in', 'done'); }); }
  // The frames, the tour and the sign-off keep their own motion: scroll-driven where supported, an observer otherwise.
  if (!sda) {
    var targets = $$('.film, .tour, .signoff');
    if ('IntersectionObserver' in window && !reduce) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
      targets.forEach(function (el) { io.observe(el); });
    } else { targets.forEach(function (el) { el.classList.add('in'); }); }
  }

  /* ---------- theme button ---------- */
  var tsw = $('[data-theme-sw]');
  var mq = matchMedia('(prefers-color-scheme: dark)');
  function isDark() { var t = root.dataset.theme; return t ? t === 'dark' : mq.matches; }
  function syncTheme() { var dk = isDark(); tsw.setAttribute('aria-pressed', dk ? 'true' : 'false'); tsw.setAttribute('aria-label', dk ? 'Switch to light theme' : 'Switch to dark theme'); }
  tsw.addEventListener('click', function () { var t = isDark() ? 'light' : 'dark'; root.dataset.theme = t; store.set('theme', t); syncTheme(); });
  mq.addEventListener && mq.addEventListener('change', syncTheme);
  syncTheme();

  /* ---------- email: the address is put together here, on click only ---------- */
  var mailParts = ['270giy', 'dscu', 'ude'];
  function rev(s) { return s.split('').reverse().join(''); }
  $$('[data-mail]').forEach(function (b) {
    b.hidden = false;
    b.addEventListener('click', function () { location.href = 'mailto:' + rev(mailParts[0]) + '@' + rev(mailParts[1]) + '.' + rev(mailParts[2]); });
  });

  /* ---------- visitors: GoatCounter stores each page view privately, no cookies; the footer shows one total ---------- */
  var local = /^(localhost|127\.0\.0\.1|\[::1\]|.*\.localhost)$/.test(location.hostname);
  if (GC_CODE && /^[a-z0-9-]+$/.test(GC_CODE) && !local) {
    var gcHost = 'https://' + GC_CODE + '.goatcounter.com';
    var dnt = navigator.doNotTrack === '1' || window.doNotTrack === '1';
    if (!dnt) {
      var gs = d.createElement('script');
      gs.async = true; gs.src = 'https://gc.zgo.at/count.v5.js'; gs.crossOrigin = 'anonymous';
      gs.integrity = 'sha384-atnOLvQb9t+jTSipvd75X2yginT4PjVbqDdlJAmxMm+wYElFmeR6EmLP5bYeoRVQ';
      gs.setAttribute('data-goatcounter', gcHost + '/count');
      d.head.appendChild(gs);
    }
    /* one public number: TOTAL.json returns {"count": "1,204"} (page views, formatted, cached up to 4 h) */
    var cnt = $('[data-count]');
    if (cnt && window.fetch) {
      fetch(gcHost + '/counter/TOTAL.json').then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
        var n = j && parseInt(String(j.count).replace(/\D/g, ''), 10);
        if (n > 0) { $('b', cnt).textContent = n.toLocaleString('en-US'); cnt.hidden = false; }
      }).catch(function () {});
    }
  }

  /* ---------- readers map: v/visitors.json (country totals, written daily by .github/workflows/visitors.yml) ---------- */
  var rd = $('[data-readers]');
  if (rd && window.fetch) {
    Promise.all([fetch('v/visitors.json').then(function (r) { return r.ok ? r.json() : null; }), fetch('v/world.json').then(function (r) { return r.ok ? r.json() : null; })]).then(function (a) {
      var vis = a[0], w = a[1];
      if (!vis || !w || !vis.countries || !vis.countries.length) return;
      var NS = 'http://www.w3.org/2000/svg', svg = $('.rmap', rd), by = {}, max = 0;
      vis.countries.forEach(function (c) { by[c.c] = c.v; if (c.v > max) max = c.v; });
      svg.setAttribute('viewBox', '0 0 ' + w.w + ' ' + w.h);
      Object.keys(w.c).forEach(function (k) {
        var p = d.createElementNS(NS, 'path'), v = by[k] || 0;
        p.setAttribute('d', w.c[k].d);
        p.setAttribute('class', v ? 'on l' + (1 + Math.min(3, Math.floor(4 * Math.sqrt(v / max) - 1e-9))) : 'off');
        if (v) { var t = d.createElementNS(NS, 'title'); t.textContent = w.c[k].n + ': ' + v.toLocaleString('en-US') + (v === 1 ? ' view' : ' views'); p.appendChild(t); }
        svg.appendChild(p);
      });
      var ol = $('.rlist', rd);
      vis.countries.slice(0, 6).forEach(function (c) {
        var li = d.createElement('li'), n = d.createElement('span'), b = d.createElement('b');
        n.textContent = c.n; b.textContent = c.v.toLocaleString('en-US');
        li.appendChild(n); li.appendChild(b); ol.appendChild(li);
      });
      rd.hidden = false;
    }).catch(function () {});
  }

  /* ---------- tour ---------- */
  $$('[data-tour]').forEach(function (tour) {
    var seg = $('[data-seg]', tour), tabs = $$('[role="tab"]', seg), stage = $('.stage', tour), shots = $$('.shot', stage);
    var phone = matchMedia('(max-width: 719.98px)'), active = 0;
    function show(i, fromScroll) {
      active = i;
      tabs.forEach(function (t, k) { t.setAttribute('aria-selected', k === i ? 'true' : 'false'); t.tabIndex = k === i ? 0 : -1; });
      shots.forEach(function (s, k) { s.classList.toggle('on', k === i); });
      var im = $('img', shots[i]); if (im) im.loading = 'eager';
      place(seg);
      if (!fromScroll && phone.matches) {
        stage.scrollTo({ left: shots[i].offsetLeft - (stage.clientWidth - shots[i].offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
      }
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(i); });
      t.addEventListener('keydown', function (e) {
        var k = e.key, n = k === 'ArrowRight' ? i + 1 : k === 'ArrowLeft' ? i - 1 : k === 'Home' ? 0 : k === 'End' ? tabs.length - 1 : -1;
        if (n < 0) return;
        e.preventDefault(); n = (n + tabs.length) % tabs.length; show(n); tabs[n].focus();
      });
    });
    var tick;
    stage.addEventListener('scroll', function () {
      if (!phone.matches) return;
      clearTimeout(tick);
      tick = setTimeout(function () {
        var mid = stage.scrollLeft + stage.clientWidth / 2, best = 0, bd = 1e9;
        shots.forEach(function (s, k) { var dd = Math.abs(s.offsetLeft + s.offsetWidth / 2 - mid); if (dd < bd) { bd = dd; best = k; } });
        if (best !== active) show(best, true);
      }, 60);
    }, { passive: true });
    show(0, true);
  });

  /* ---------- lightbox ---------- */
  if (typeof HTMLDialogElement === 'function') {
    var box = d.createElement('dialog');
    box.className = 'lightbox'; box.setAttribute('aria-label', 'Screen, enlarged');
    box.innerHTML = '<button type="button" aria-label="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-close"/></svg></button><img alt=""><p></p>';
    d.body.appendChild(box);
    var big = $('img', box), cap = $('p', box), src = null;
    var vt = typeof d.startViewTransition === 'function' && !reduce;
    var open = function (img) {
      var go = function () {
        big.src = img.currentSrc || img.src; big.alt = img.alt;
        var fc = img.parentElement.querySelector('figcaption'); cap.textContent = fc ? fc.textContent : '';
        box.showModal(); d.body.classList.add('lb');
      };
      if (vt) { src = img; img.style.viewTransitionName = 'zoom'; d.startViewTransition(function () { img.style.viewTransitionName = ''; big.style.viewTransitionName = 'zoom'; go(); }); }
      else go();
    };
    var close = function () {
      var done = function () { box.close(); big.style.viewTransitionName = ''; };
      if (vt && src) { big.style.viewTransitionName = ''; src.style.viewTransitionName = 'zoom'; d.startViewTransition(function () { done(); src.style.viewTransitionName = ''; }); }
      else done();
    };
    d.addEventListener('click', function (e) {
      var img = e.target.closest && e.target.closest('.shot img');
      if (img) return open(img);
      if (box.open && e.target.closest && (e.target === box || e.target !== big && box.contains(e.target))) close();
    });
    box.addEventListener('close', function () { d.body.classList.remove('lb'); });
    box.addEventListener('cancel', function () { d.body.classList.remove('lb'); });
  }

  /* ---------- films: the music is inside each clip. One Sound state for both films. ---------- */
  var films = $$('[data-film]'), items = [], soundOn = false;
  // The cover's live title: the product's mark (a flat redrawing of its icon, parts classed so CSS can draw them on), its name and its pitch.
  var COVERS = {
    flow: { name: 'Flow', pitch: 'A private activity journal and planner for focused weeks.',
      mark: '<svg viewBox="0 0 220 220" aria-hidden="true"><defs><linearGradient id="cvfg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c5a5f"/><stop offset="1" stop-color="#2f8a86"/></linearGradient><clipPath id="cvfc"><rect width="220" height="220" rx="52"/></clipPath></defs><rect width="220" height="220" rx="52" fill="url(#cvfg)"/><g clip-path="url(#cvfc)" fill="none" stroke-linecap="round"><path class="m-a" pathLength="1" d="M124 78 C 88 104, 150 132, 112 162 S 70 214, 96 236" stroke="#bff0df" stroke-width="30" opacity=".35"/><path class="m-b" pathLength="1" d="M124 78 C 88 104, 150 132, 112 162 S 70 214, 96 236" stroke="#d9fbef" stroke-width="13"/></g><circle class="m-dot" cx="128" cy="62" r="17" fill="#f7cd7c"/></svg>' },
    quant: { name: 'Quantitative Research Platform', pitch: 'Every research desk, in one app.',
      mark: '<svg viewBox="0 0 220 220" aria-hidden="true"><defs><linearGradient id="cvqg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7a69e6"/><stop offset="1" stop-color="#5140b4"/></linearGradient></defs><rect width="220" height="220" rx="52" fill="url(#cvqg)"/><path class="m-b" pathLength="1" d="M52 152 L 92 118 L 124 134 L 160 86" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><circle class="m-dot" cx="52" cy="152" r="11" fill="#fff"/><circle class="m-p" cx="92" cy="118" r="9" fill="#fff"/><circle class="m-p" cx="124" cy="134" r="9" fill="#fff"/><path class="m-star" d="M166 38 C 168 54, 172 58, 188 60 C 172 62, 168 66, 166 82 C 164 66, 160 62, 144 60 C 160 58, 164 54, 166 38 Z" fill="#ffe9a8"/></svg>' }
  };
  function fade(o, to, done) {
    var v = o.v; clearInterval(o.fx);
    if (reduce) { v.volume = to; if (done) done(); return; }
    var from = v.volume, t0 = performance.now();
    o.fx = setInterval(function () {
      var k = Math.min(1, (performance.now() - t0) / 400); v.volume = from + (to - from) * k;
      if (k === 1) { clearInterval(o.fx); if (done) done(); }
    }, 30);
  }
  function paintSound() {
    items.forEach(function (o) {
      o.snd.classList.toggle('on', soundOn);
      $('.st', o.snd).textContent = soundOn ? 'Sound on' : 'Sound off';
    });
  }
  // Called from the click handler, so the browser counts it as the viewer's own action.
  function setSound(on) {
    soundOn = on; paintSound();
    items.forEach(function (o) {
      var v = o.v;
      if (on) {
        v.muted = false;
        if (o.visible) { v.volume = 0; fade(o, 1); }
        else {
          // Unlock the film that is out of view while the tap is still fresh, so it can play with sound when it scrolls in.
          v.volume = 0;
          var p = v.play(); v.pause();
          if (p && p.catch) p.catch(function () {});
        }
      } else {
        fade(o, 0, function () { v.muted = true; });
      }
    });
  }
  function startFilm(o) {
    var v = o.v, p;
    if (soundOn) { v.muted = false; v.volume = 0; }
    p = v.play();
    if (p && p.then) p.then(function () { if (soundOn) fade(o, 1); }, function () {
      if (soundOn) { v.muted = true; setSound(false); p = v.play(); if (p && p.catch) p.catch(function () { v.controls = true; }); }
      else v.controls = true;
    });
  }

  var subsOn = true, CARD = 2.0, REST = 0.4, FADE = 400;   // CARD and REST are only fall-backs for film data without take and end
  function paintSubs() {
    items.forEach(function (o) {
      o.film.classList.toggle('nosub', !subsOn);
      o.sbt.classList.toggle('on', subsOn);
      var t = subsOn ? 'Subtitles on' : 'Subtitles off';
      $('.st', o.sbt).textContent = t; o.sbt.setAttribute('aria-label', t);
    });
  }

  films.forEach(function (film) {
    var name = film.dataset.film, v = $('video', film), btn = $('.play', film), snd = $('.snd', film), sbt = $('.sbt', film), sub = $('.fsub span', film), bar = $('.bar', film), chap = $('.chap', film), chl = $('.chl', film);
    var beats = null, legacy = false, userPaused = false, last = -1, line = null, segsEl = [], tm = 0, o = { v: v, film: film, snd: snd, sbt: sbt, visible: false, fx: 0 };
    items.push(o);
    snd.addEventListener('click', function () { setSound(!soundOn); });
    sbt.addEventListener('click', function () { subsOn = !subsOn; paintSubs(); });
    if (!reduce) { v.controls = false; btn.hidden = false; bar.hidden = false; snd.hidden = false; sbt.hidden = false; }
    paintSubs();

    // The cover: the film's poster with a Start button. Nothing plays until the visitor asks; once the film is running the cover
    // dissolves into its first frame (CSS, 700 ms). Without script, or with reduced motion, the native poster and controls stay.
    var started = false;
    if (!reduce && 'IntersectionObserver' in window) {
      var C = COVERS[name], cover = d.createElement('div'), n = C.name.length, letters = '';
      C.name.split('').forEach(function (ch, i) { letters += '<i>' + (ch === ' ' ? ' ' : ch) + '</i>'; });
      cover.className = 'cover'; cover.style.setProperty('--nd', (1 + n * 0.045 + 0.5).toFixed(2) + 's');   // when the name has finished typing
      cover.innerHTML = '<img class="bg" alt="" src="m/' + name + '-cover-1600.webp"><div class="lock"><span class="mk">' + C.mark + '</span><span class="nm" aria-hidden="true">' + letters + '</span><span class="pt">' + C.pitch + '</span></div>' +
        '<button type="button" class="start"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg><span>Start demo</span></button>';
      // Per-letter timing goes through the style object (the page's content policy does not allow inline style attributes).
      Array.prototype.forEach.call(cover.querySelectorAll('.nm i'), function (el, i) { el.style.animationDelay = (1 + i * 0.045).toFixed(3) + 's,' + (1.1 + n * 0.045 + i * 0.11).toFixed(3) + 's'; });
      $('.frame', film).appendChild(cover); film.classList.add('cover-on');
      $('.start', cover).addEventListener('click', function () { cover.classList.add('busy'); userPaused = false; startFilm(o); });
      // The title animates when the cover scrolls into view, not at page load.
      var cio = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { cover.classList.add('go'); cio.disconnect(); } }, { threshold: 0.35 });
      cio.observe(cover);
    }
    v.addEventListener('playing', function () { started = true; film.classList.remove('cover-on'); });

    function sync() { var p = v.paused; btn.classList.toggle('paused', p); btn.setAttribute('aria-label', p ? 'Play' : 'Pause'); }
    btn.addEventListener('click', function () {
      if (v.paused) { userPaused = false; startFilm(o); } else { userPaused = true; v.pause(); }
    });
    v.addEventListener('play', sync); v.addEventListener('pause', sync); sync();

    function takeOf(b) { return b.take != null ? b.take : b.t + CARD; }
    function endOf(i) { return i + 1 < beats.length ? beats[i + 1].t : v.duration; }
    function build() {
      if (!beats) return;
      chap.innerHTML = '';
      segsEl = beats.map(function (b, i) {
        var el = d.createElement('button'), lb = d.createElement('span');
        el.type = 'button'; el.setAttribute('aria-label', 'Jump to ' + b.headline); el.style.flex = (v.duration ? endOf(i) - b.t : 1) + ' 0 auto';
        lb.textContent = b.label; el.appendChild(lb);
        el.addEventListener('click', function () { v.currentTime = b.t + 0.05; if (v.paused && !userPaused) startFilm(o); });
        chap.appendChild(el); return el;
      });
      last = -1; tick();
    }
    // The same chapters and lines as plain text: for screen readers, and shown in full under reduced motion.
    function text() {
      var ol = d.createElement('ol');
      beats.forEach(function (b) {
        var li = d.createElement('li'), h = d.createElement('b'), ul = d.createElement('ul');
        h.textContent = b.headline; li.appendChild(h);
        b.steps.forEach(function (s) { var l = d.createElement('li'); l.textContent = s.line; ul.appendChild(l); });
        li.appendChild(ul); ol.appendChild(li);
      });
      chl.innerHTML = ''; chl.appendChild(ol);
      if (reduce) chl.classList.remove('vh');
    }
    // A line fades in and out through opacity only. Lines carry their own end and a rest between them in the data; if one
    // line still follows another at once, the old one fades out first, then the new one fades in.
    function setLine(s) {
      if (s === line) return; line = s;
      clearTimeout(tm);
      var box = sub.parentNode, wasOn = box.classList.contains('on');
      box.classList.remove('on');
      if (s === null) return;
      function put() { if (line === s) { sub.textContent = s; box.classList.add('on'); } }
      if (reduce) put(); else if (wasOn) tm = setTimeout(put, FADE); else put();
    }
    function show(i) {
      if (i === last) return; last = i;
      segsEl.forEach(function (el, k) { if (k === i) el.setAttribute('aria-current', 'true'); else el.removeAttribute('aria-current'); });
      // Keep the current chapter in view when the bar scrolls (a phone).
      var el = segsEl[i];
      if (el && chap.scrollWidth > chap.clientWidth) {
        var to = Math.max(0, el.offsetLeft - (chap.clientWidth - el.offsetWidth) / 2);
        try { chap.scrollTo({ left: to, behavior: reduce ? 'auto' : 'smooth' }); } catch (e) { chap.scrollLeft = to; }
      }
    }
    // Chapters in the new shape; until the new films arrive, the old clip file is read as one-line chapters.
    function load() {
      return fetch('m/' + name + '-film.json').then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (j) {
        if (!Array.isArray(j) || !j.length) throw 0; return j;
      }).catch(function () {
        return fetch('m/' + name + '-clip.json').then(function (r) { return r.json(); }).then(function (j) {
          legacy = true;
          return j.map(function (b, i) { return { t: b.t, id: 'c' + i, label: b.label, headline: b.label, steps: [{ t: b.t, line: b.line }] }; });
        });
      });
    }
    load().then(function (j) {
      beats = j; build(); text(); show(0); tick();
      if (!legacy) {
        var tr = d.createElement('track');
        tr.kind = 'captions'; tr.srclang = 'en'; tr.label = 'English'; tr.src = 'm/' + name + '-film.vtt';
        if (reduce) tr.default = true;
        v.appendChild(tr);
        if (!reduce) tr.mode = 'disabled'; // our own overlay draws the lines; the track is for the native controls
      }
    }).catch(function () { beats = null; });
    v.addEventListener('loadedmetadata', build);
    function tick() {
      if (!beats || !v.duration) return;
      var t = v.currentTime, i = 0, s = null, k, st;
      beats.forEach(function (b, n) { if (t >= b.t) i = n; });
      show(i);
      // A line shows only between its own start and end (never over a title card: its first line starts after the card).
      st = beats[i].steps;
      for (k = 0; k < st.length; k++) {
        var e = st[k].end != null ? st[k].end : (k + 1 < st.length ? st[k + 1].t - REST : endOf(i));
        if (t >= st[k].t && t < e && (legacy || t >= takeOf(beats[i]))) s = st[k].line;
      }
      setLine(s);
      segsEl.forEach(function (el, n) {
        var a = beats[n].t, e = endOf(n);
        el.style.setProperty('--p', Math.max(0, Math.min(1, (t - a) / (e - a))).toFixed(3));
      });
    }
    v.addEventListener('timeupdate', tick);
    // timeupdate is too coarse for subtitles: follow the frame clock while the film plays.
    var raf = 0;
    function loop() { tick(); raf = v.paused ? 0 : requestAnimationFrame(loop); }
    v.addEventListener('play', function () { if (!raf) raf = requestAnimationFrame(loop); });
    v.addEventListener('seeked', tick);

    if (reduce || !('IntersectionObserver' in window)) { v.controls = true; return; }
    // A film plays only while it is on screen, so only the film in view is heard.
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        o.visible = e.isIntersecting;
        if (e.isIntersecting) {
          if (v.preload !== 'auto') v.preload = 'auto';
          if (started && !userPaused) startFilm(o);   // a film the visitor has started resumes when it scrolls back; one they have not started waits on its cover
        } else { clearInterval(o.fx); v.pause(); }
      });
    }, { threshold: 0.5 }).observe(v);
  });
})();
