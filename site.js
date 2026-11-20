(function () {
  'use strict';
  /* Visitor counter: GoatCounter (open source, no cookies). Put the site code here, e.g. 'yitang233'. Empty = off. */
  var GC_CODE = '';

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

  /* ---------- nav: glass after 8px, scroll-spy ---------- */
  var top = $('.top');
  function onScroll() { top.classList.toggle('scrolled', scrollY > 8); }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

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

  /* ---------- reveals: scroll-driven in CSS where supported, observer fallback otherwise ---------- */
  if (!sda) {
    var targets = $$('.rv, .film, .tour, .signoff');
    if ('IntersectionObserver' in window && !reduce) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
      targets.forEach(function (el, i) { if (el.classList.contains('rv')) el.style.setProperty('--st', (i % 4) * 70 + 'ms'); io.observe(el); });
    } else { targets.forEach(function (el) { el.classList.add('in'); }); }
  }

  /* ---------- theme switch ---------- */
  var tsw = $('[data-theme-sw]');
  var mq = matchMedia('(prefers-color-scheme: dark)');
  function isDark() { var t = root.dataset.theme; return t ? t === 'dark' : mq.matches; }
  function syncTheme() { tsw.setAttribute('aria-checked', isDark() ? 'true' : 'false'); }
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

  /* ---------- visitors: GoatCounter, no cookies; the count in the footer ---------- */
  if (GC_CODE && /^[a-z0-9-]+$/.test(GC_CODE)) {
    var gcHost = 'https://' + GC_CODE + '.goatcounter.com';
    var dnt = navigator.doNotTrack === '1' || window.doNotTrack === '1';
    if (!dnt && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      var gs = d.createElement('script');
      gs.async = true; gs.src = 'https://gc.zgo.at/count.v5.js'; gs.crossOrigin = 'anonymous';
      gs.integrity = 'sha384-atnOLvQb9t+jTSipvd75X2yginT4PjVbqDdlJAmxMm+wYElFmeR6EmLP5bYeoRVQ';
      gs.setAttribute('data-goatcounter', gcHost + '/count');
      d.head.appendChild(gs);
    }
    var cnt = $('[data-count]');
    if (cnt && window.fetch) {
      fetch(gcHost + '/counter/TOTAL.json').then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
        if (j && j.count) { $('span', cnt).textContent = j.count; cnt.hidden = false; }
      }).catch(function () {});
    }
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
    box.innerHTML = '<button type="button" aria-label="Close">×</button><img alt=""><p></p>';
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

  films.forEach(function (film) {
    var name = film.dataset.film, v = $('video', film), btn = $('.play', film), snd = $('.snd', film), bar = $('.bar', film), chap = $('.chap', film), cap = $('.cap', film);
    var beats = null, userPaused = false, last = -1, segsEl = [], o = { v: v, snd: snd, visible: false, fx: 0 };
    items.push(o);
    snd.addEventListener('click', function () { setSound(!soundOn); });
    if (!reduce) { v.controls = false; btn.hidden = false; bar.hidden = false; snd.hidden = false; }

    function sync() { var p = v.paused; btn.classList.toggle('paused', p); btn.setAttribute('aria-label', p ? 'Play' : 'Pause'); }
    btn.addEventListener('click', function () {
      if (v.paused) { userPaused = false; startFilm(o); } else { userPaused = true; v.pause(); }
    });
    v.addEventListener('play', sync); v.addEventListener('pause', sync); sync();

    function build() {
      if (!beats || !v.duration) return;
      chap.innerHTML = '';
      segsEl = beats.map(function (b, i) {
        var end = i + 1 < beats.length ? beats[i + 1].t : v.duration, el = d.createElement('i');
        el.style.flex = (end - b.t) + ' 1 0'; chap.appendChild(el); return el;
      });
    }
    function show(i) {
      if (i === last) return; last = i;
      cap.classList.add('swap');
      setTimeout(function () { cap.innerHTML = ''; var b = d.createElement('b'); b.textContent = beats[i].label; cap.appendChild(b); cap.appendChild(d.createTextNode(beats[i].line)); cap.classList.remove('swap'); }, reduce ? 0 : 150);
    }
    fetch('m/' + name + '-clip.json').then(function (r) { return r.json(); }).then(function (j) { beats = j; build(); show(0); }).catch(function () { beats = null; });
    v.addEventListener('loadedmetadata', build);
    v.addEventListener('timeupdate', function () {
      if (!beats || !v.duration) return;
      var t = v.currentTime, i = 0;
      // Soften the picture loop: the last and first moments fade through the frame colour.
      if (!reduce) v.classList.toggle('fadeout', v.duration - t < 0.45 || t < 0.12);
      beats.forEach(function (b, k) { if (t >= b.t) i = k; });
      show(i);
      segsEl.forEach(function (el, k) {
        var s = beats[k].t, e = k + 1 < beats.length ? beats[k + 1].t : v.duration;
        el.style.setProperty('--p', Math.max(0, Math.min(1, (t - s) / (e - s))).toFixed(3));
      });
    });

    if (reduce || !('IntersectionObserver' in window)) { v.controls = true; return; }
    // A film plays only while it is on screen, so only the film in view is heard.
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        o.visible = e.isIntersecting;
        if (e.isIntersecting) {
          if (v.preload !== 'auto') v.preload = 'auto';
          if (!userPaused) startFilm(o);
        } else { clearInterval(o.fx); v.pause(); }
      });
    }, { threshold: 0.5 }).observe(v);
  });
})();
