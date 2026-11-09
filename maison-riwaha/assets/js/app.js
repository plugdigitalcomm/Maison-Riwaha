/* ==========================================================================
   MAISON RIWAHA – Interactions du site
   Catalogue, panier, commande WhatsApp, menu mobile, animations.

   Le catalogue est rangé dans data/*.js (chargés par index.html avant ce
   fichier). On le modifie depuis l'espace admin (/admin) : chaque
   enregistrement met le site en ligne à jour en ~1 minute.
   ========================================================================== */

/* Assemble le catalogue déposé par les fichiers data/*.js dans window.RIWAHA_DATA */
function loadCatalogue() {
  const R = window.RIWAHA_DATA;
  if (!R || !Array.isArray(R.parfums)) {
    const grid = document.querySelector('[data-grid]');
    if (grid) grid.innerHTML = '<p class="shop-empty">Le catalogue n’a pas pu être chargé. Rechargez la page, ou écrivez-nous sur WhatsApp.</p>';
    return null;
  }
  const config = {};
  ['whatsapp', 'whatsappAffiche', 'message', 'instagram', 'instagramAffiche', 'tiktok', 'facebook', 'videoRituel', 'videoRituelFin']
    .forEach((k) => { if (R[k] !== undefined) config[k] = R[k]; });
  return {
    config,
    products: R.parfums,
    privee: { price: R.priveePrix, size: R.priveeContenance, items: R.priveeModeles || [] },
    selection: R.maisons || [],
    formats: R.formats || [],
    reviews: R.avis || []
  };
}

(function () {
  'use strict';

  const V = window.RiwahaVisuals;
  const D = loadCatalogue();
  if (!D || !V) return;

  const C = D.config || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const nf = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });
  const num = (n) => nf.format(n).replace(/[\s ]/g, ' ');
  const money = (n) => num(n) + ' FCFA';
  const plain = (s) => String(s).replace(/[  ]/g, ' ');
  const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const slug = (s) => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const nb = (s) => String(s || '').replace(/ /g, ' ');
  const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Chemin d'une photo ou vidéo, relatif à la page : « /assets/img/x.jpg » → « assets/img/x.jpg ».
  // Fonctionne en ligne, dans un sous-dossier et en ouvrant index.html par double-clic.
  const asset = (p) => (/^(https?:)?\/\//.test(String(p)) ? String(p) : encodeURI(String(p || '').replace(/^\/+/, '')));

  /* Nombre en toutes lettres (jusqu'à 69, sinon en chiffres) : « Quatre parfums » */
  const UNITS = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize'];
  const TENS = { 2: 'vingt', 3: 'trente', 4: 'quarante', 5: 'cinquante', 6: 'soixante' };
  function words(n) {
    if (n < 17) return UNITS[n];
    if (n < 20) return 'dix-' + UNITS[n - 10];
    if (n >= 70) return String(n);
    const u = n % 10;
    return TENS[Math.floor(n / 10)] + (u === 1 ? ' et un' : u ? '-' + UNITS[u] : '');
  }
  const counted = (n, noun) => {
    const w = words(n);
    return w.charAt(0).toUpperCase() + w.slice(1) + ' ' + noun + (n > 1 ? 's' : '');
  };
  const ICON_PLUS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  const ICON_WA = '<svg class="i-wa" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-wa"/></svg>';

  /* ---------- Données ---------- */
  // Stock : vide = non suivi (toujours disponible) ; 0 = rupture ; sinon nombre de flacons
  const readStock = (v) => {
    if (v === '' || v == null) return null;
    const n = parseInt(v, 10);
    return Number.isNaN(n) ? null : Math.max(0, n);
  };
  const asList = (v) => (Array.isArray(v) ? v.filter((x) => x !== '' && x != null) : []);
  const products = (D.products || []).filter((p) => p && p.name).map((p) => {
    const type = p.type || 'Parfum';
    // La marque précède le nom quand il ne la contient pas déjà : « Lattafa Asad Bourbon »
    const fullName = p.marque && !norm(p.name).includes(norm(p.marque)) ? `${p.marque} ${p.name}` : p.name;
    const stock = readStock(p.stock);
    const sig = p.signature && (p.signature.accroche || p.signature.famille) ? p.signature : null;
    return Object.assign({}, p, {
      id: p.id || slug(p.name),
      type,
      price: Number(p.price) || 0,
      cat: asList(p.cat),
      tags: asList(p.tags),
      signature: sig,
      stock,
      dispo: stock === null || stock > 0,
      format: `${type} · ${nb(p.size)}`,
      fullName,
      displayName: fullName
    });
  });
  const P = D.privee || { items: [] };
  const privee = (P.items || []).filter((i) => i && i.name).map((i) => {
    const stock = readStock(i.stock);
    return Object.assign({ tags: [] }, i, {
      id: 'cp-' + slug(i.name),
      price: Number(P.price) || 0,
      size: P.size,
      stock,
      dispo: stock === null || stock > 0,
      type: 'Collection Privée',
      format: `Collection Privée · ${nb(P.size)}`,
      fullName: i.name,
      displayName: `${i.name} (Collection Privée)`,
      visual: { shape: 'tall', cap: 'black', liquid: 'tabac' }
    });
  });
  // Quantité maximale dans le panier : le stock s'il est suivi, sinon 20
  const maxQty = (p) => (p.stock === null ? 20 : Math.min(20, p.stock));
  const notifyMsg = (p) => `Bonjour Maison Riwaha, pouvez-vous me prévenir quand ${nameOf(p)} sera de nouveau disponible ?`;
  const byId = {};
  products.concat(privee).forEach((p) => { byId[p.id] = p; });
  const nameOf = (p) => p.displayName || p.name;

  /* ---------- Visuels : vraie photo, sinon flacon dessiné ---------- */
  const SHAPES = ['square', 'round', 'tall', 'facet'];
  const CAPS = ['gold', 'black', 'gold', 'wood'];
  const hash = (s) => { let h = 7; for (const ch of String(s)) h = (h * 31 + ch.charCodeAt(0)) | 0; return Math.abs(h); };
  function autoVisual(p) {
    const t = norm([p.name].concat(p.tags || []).join(' '));
    let liquid = 'tabac';
    if (/oud|fume|encens/.test(t)) liquid = 'oud';
    else if (/vanill|gourmand|ambr|hiver/.test(t)) liquid = 'ambre';
    else if (/aquat|frais|iris|ete\b/.test(t)) liquid = 'champagne';
    else if (/fruit|dore|luxe/.test(t)) liquid = 'or';
    else if (/bois/.test(t)) liquid = 'santal';
    else if (/femin|exot|rose/.test(t)) liquid = 'rose';
    else if (/musc|discret/.test(t)) liquid = 'musc';
    const h = hash(p.name);
    let shape = SHAPES[h % 4];
    const ty = norm(p.type || '');
    if (/huile/.test(ty)) shape = 'roll';
    if (/diffuseur/.test(ty)) shape = 'diffuser';
    return { shape, liquid, cap: CAPS[(h >> 3) % 4], props: liquid === 'oud' ? ['chips'] : [] };
  }

  const FALLBACK = new Map();
  let fbN = 0;
  function drawn(p, extra) {
    return V.scene(Object.assign({}, autoVisual(p), p.visual || {}, {
      name: p.name, sub: '', alt: `Flacon ${nameOf(p)}`
    }, extra || {}));
  }
  function visual(p, extra, eager) {
    if (!p.image) return drawn(p, extra);
    const key = 'f' + (++fbN);
    FALLBACK.set(key, () => drawn(p, extra));
    const cls = 'ph' + (p.clair ? ' ph--clair' : '');
    const style = p.pos ? ` style="object-position:${esc(p.pos)}"` : '';
    return `<img class="${cls}" src="${esc(asset(p.image))}" alt="${esc(nameOf(p))}"${eager ? '' : ' loading="lazy"'} decoding="async" data-fb="${key}"${style}>`;
  }
  // Photo introuvable : on la remplace par le flacon dessiné
  document.addEventListener('error', (e) => {
    const img = e.target;
    if (!img || img.tagName !== 'IMG' || !img.dataset || !img.dataset.fb) return;
    const make = FALLBACK.get(img.dataset.fb);
    FALLBACK.delete(img.dataset.fb);
    if (make) img.outerHTML = make();
  }, true);
  document.addEventListener('load', (e) => {
    const img = e.target;
    if (img && img.tagName === 'IMG' && img.dataset && img.dataset.fb) FALLBACK.delete(img.dataset.fb);
  }, true);

  /* ---------- WhatsApp ---------- */
  function waLink(text) {
    const number = String(C.whatsapp || '').replace(/\D/g, '');
    return (number ? `https://wa.me/${number}` : 'https://wa.me/') + '?text=' + encodeURIComponent(plain(text));
  }
  function bindWa(root) {
    $$('[data-wa]', root || document).forEach((a) => {
      const msg = a.getAttribute('data-wa') || C.message || 'Bonjour Maison Riwaha.';
      a.href = waLink(msg);
      a.target = '_blank';
      a.rel = 'noopener';
    });
  }

  /* ---------- Apparition au défilement ---------- */
  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })
    : null;
  function observe(root) {
    $$('.reveal:not(.is-in)', root || document).forEach((el) => (io ? io.observe(el) : el.classList.add('is-in')));
  }

  /* ==========================================================================
     HÉROS ET RITUEL
     ========================================================================== */
  const heroRoot = $('[data-hero-carousel]');
  if (heroRoot) heroCarousel(heroRoot);

  /* Carrousel des coups de cœur : le parfum du centre en grand, les voisins
     sur les côtés en 3D. Défilement automatique toutes les 3 s, mis en pause
     au survol, au clavier, hors de l'écran ou avec le bouton pause.
     Flèches, points, balayage tactile et touches ← → du clavier. */
  function heroCarousel(root) {
    const DELAI = 3000;
    const stage = $('[data-hc-stage]', root);
    // Les coups de cœur (champ « signature ») en stock, en commençant par Oud Al Malik
    let slides = products.filter((p) => p.signature && p.dispo);
    if (slides.length < 2) slides = products.filter((p) => p.dispo).slice(0, 5);
    if (!slides.length) return;
    const first = Math.max(0, slides.findIndex((p) => p.id === 'oud-al-malik'));
    slides = slides.slice(first).concat(slides.slice(0, first));
    const n = slides.length;

    stage.innerHTML = slides.map((p, i) => `<div class="hc__slide" data-hc-slide="${i}" role="group" aria-roledescription="diapositive" aria-label="${i + 1} sur ${n} : ${esc(nameOf(p))}">
        <div class="hero-card media">
          <div class="media__inner">${visual(p, { zoom: 1.3, cy: 334, props: ['chips', 'beads', 'smoke'], haloOpacity: 0.26 }, true)}</div>
          <div class="hero-card__cap">
            <div class="hero-card__txt">
              <p class="hero-card__meta">${p.signature ? 'Coup de cœur' : 'Sélection'} · ${esc(nb(p.size))}</p>
              <p class="hero-card__name">${esc(nameOf(p))}</p>
              <span class="price">${money(p.price)}</span>
            </div>
            <button class="add-round" type="button" data-add="${esc(p.id)}" aria-label="Ajouter ${esc(nameOf(p))} au panier">${ICON_PLUS}</button>
          </div>
        </div>
      </div>`).join('');
    const els = $$('[data-hc-slide]', stage);
    const notes = $$('[data-hc-note]', root.parentElement);
    const status = $('[data-hc-status]', root);
    let cur = 0, dir = 1, timer = null;

    // Notes flottantes : les accords et étiquettes du parfum affiché
    function notesFor(p) {
      const out = [];
      (((p.signature && p.signature.accords) || []).concat(p.tags)).forEach((t) => {
        if (t && !/^(homme|femme|mixte)$/i.test(t) && !out.some((x) => norm(x) === norm(t))) out.push(t);
      });
      return out;
    }
    function layout() {
      els.forEach((el, i) => {
        let off = ((i - cur) % n + n) % n;
        if (off > n / 2) off -= n;
        let pos;
        if (off === 0) pos = '0';
        else if (n % 2 === 0 && Math.abs(off) === n / 2) pos = dir > 0 ? '-2' : '2'; // le parfum opposé sort du côté d'où il vient
        else pos = Math.abs(off) <= 2 ? String(off) : 'far';
        el.setAttribute('data-pos', pos);
        if (off === 0) { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); }
        else { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); }
      });
      $$('[data-hc-dot]', root).forEach((d, i) => d.setAttribute('aria-current', String(i === cur)));
      const p = slides[cur];
      const tags = notesFor(p);
      notes.forEach((el, k) => {
        const t = tags[k] || '';
        const shown = el._next !== undefined ? el._next : el.textContent;
        if (shown === t && (t || el.classList.contains('is-empty'))) return;
        el._next = t;
        clearTimeout(el._t);
        el.classList.add('is-swap');
        el._t = setTimeout(() => {
          el.textContent = t;
          el.classList.toggle('is-empty', !t);
          el.classList.remove('is-swap');
          el._next = undefined;
        }, 260);
      });
      if (status) status.textContent = `${nameOf(p)}, ${money(p.price)}`;
    }

    if (n < 2) { layout(); root.classList.add('is-ready'); return; }

    $('[data-hc-dots]', root).innerHTML = slides.map((p, i) => `<button class="hc__dot" type="button" data-hc-dot="${i}" aria-label="Afficher ${esc(nameOf(p))}"></button>`).join('');
    $('[data-hc-nav]', root).hidden = false;
    $$('[data-hc-prev], [data-hc-next]', root).forEach((b) => { b.hidden = false; });

    // Raisons de mettre le défilement en pause
    const why = { hover: false, focus: false, user: reduceMotion(), hidden: document.hidden, offscreen: false, touch: false };
    const paused = () => Object.keys(why).some((k) => why[k]);
    const pauseBtn = $('[data-hc-pause]', root);
    function restart() {
      clearTimeout(timer);
      const p = paused();
      root.classList.toggle('is-paused', p);
      if (status) status.setAttribute('aria-live', p ? 'polite' : 'off');
      pauseBtn.setAttribute('aria-label', why.user ? 'Reprendre le défilement' : 'Mettre en pause le défilement');
      pauseBtn.classList.toggle('is-play', why.user);
      if (!p) timer = setTimeout(() => go(cur + 1, 1), DELAI);
    }
    const setWhy = (k, v) => { if (why[k] !== v) { why[k] = v; restart(); } };
    function go(i, d) {
      const target = ((i % n) + n) % n;
      if (target === cur) { restart(); return; }
      dir = d || 1;
      cur = target;
      layout();
      restart();
    }
    const next = () => go(cur + 1, 1);
    const prev = () => go(cur - 1, -1);

    $('[data-hc-next]', root).addEventListener('click', next);
    $('[data-hc-prev]', root).addEventListener('click', prev);
    root.addEventListener('click', (e) => {
      const dot = e.target.closest('[data-hc-dot]');
      if (dot) {
        const i = Number(dot.getAttribute('data-hc-dot'));
        let d = i - cur;
        if (Math.abs(d) > n / 2) d -= Math.sign(d) * n;
        go(i, d >= 0 ? 1 : -1);
      }
      if (e.target.closest('[data-hc-pause]')) { why.user = !why.user; restart(); }
    });
    // Un clic sur un parfum de côté l'amène au centre
    let swiped = false;
    stage.addEventListener('click', (e) => {
      if (swiped) { swiped = false; e.preventDefault(); e.stopPropagation(); return; }
      const active = els[cur].getBoundingClientRect();
      if (e.clientX < active.left) prev();
      else if (e.clientX > active.right) next();
    }, true);
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    });

    // Pause au survol de la souris, reprise en quittant la zone
    root.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') setWhy('hover', true); });
    root.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') setWhy('hover', false); });
    // Pause tant que le clavier navigue dans le carrousel
    root.addEventListener('focusin', (e) => { if (e.target.matches(':focus-visible')) setWhy('focus', true); });
    root.addEventListener('focusout', (e) => { if (!root.contains(e.relatedTarget)) setWhy('focus', false); });
    document.addEventListener('visibilitychange', () => setWhy('hidden', document.hidden));
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => entries.forEach((en) => setWhy('offscreen', !en.isIntersecting)), { threshold: 0.2 }).observe(root);
    }

    // Balayage tactile (et glisser à la souris)
    let sx = 0, sy = 0, tracking = false;
    stage.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      tracking = true; swiped = false; sx = e.clientX; sy = e.clientY;
      if (e.pointerType !== 'mouse') setWhy('touch', true);
    });
    const endSwipe = (e) => {
      if (!tracking) return;
      tracking = false;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (e.type === 'pointerup' && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) { swiped = true; if (dx < 0) next(); else prev(); }
      if (e.pointerType !== 'mouse') setWhy('touch', false);
    };
    stage.addEventListener('pointerup', endSwipe);
    stage.addEventListener('pointercancel', endSwipe);
    stage.addEventListener('dragstart', (e) => e.preventDefault());

    layout();
    restart();
    // Pas d'animation au premier affichage
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-ready')));
  }

  const ritualVisual = $('[data-ritual-visual]');
  if (ritualVisual) {
    ritualVisual.innerHTML = V.ritual();
    ritualVideo(ritualVisual, C.videoRituel, Number(C.videoRituelFin) || 0);
  }

  /* Vidéo du rituel, posée par-dessus l'illustration dessinée.
     Chargée seulement à l'approche de la section (8 Mo : on épargne les forfaits mobiles),
     jouée sans le son et mise en pause hors de l'écran. L'illustration reste visible
     tant que la vidéo n'est pas prête, si elle ne charge pas, si le visiteur préfère
     moins d'animations ou a activé l'économiseur de données. */
  function ritualVideo(wrap, src, fin) {
    const saveData = navigator.connection && navigator.connection.saveData;
    if (!src || reduceMotion() || saveData || !('IntersectionObserver' in window)) return;
    const v = document.createElement('video');
    v.className = 'media__video';
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.preload = 'none';
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('aria-hidden', 'true');
    v.addEventListener('playing', () => v.classList.add('is-on'), { once: true });
    v.addEventListener('error', () => v.remove());
    // Boucle raccourcie : on repart au début avant la seconde « fin ».
    // Vérifié à chaque image de la vidéo, plus « timeupdate » pour les navigateurs plus anciens.
    if (fin > 0) {
      const check = () => { if (v.currentTime >= fin) v.currentTime = 0; };
      if ('requestVideoFrameCallback' in v) {
        const onFrame = () => { check(); v.requestVideoFrameCallback(onFrame); };
        v.requestVideoFrameCallback(onFrame);
      }
      v.addEventListener('timeupdate', check);
    }
    wrap.appendChild(v);
    new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          if (!v.getAttribute('src')) v.src = asset(src);
          const p = v.play();
          if (p && p.catch) p.catch(() => { /* lecture refusée : l'illustration reste */ });
        } else if (v.getAttribute('src')) v.pause();
      });
    }, { rootMargin: '300px 0px' }).observe(wrap);
  }

  /* ==========================================================================
     CATALOGUE
     ========================================================================== */
  const grid = $('[data-grid]');
  const countEl = $('[data-shop-count]');
  const emptyEl = $('[data-shop-empty]');
  const searchInput = $('[data-search-input]');
  const sortSelect = $('[data-sort]');
  const pager = $('[data-pager]');
  const PER_PAGE = 12; // parfums par page (tombe juste sur 4, 3 et 2 colonnes)
  const state = { filter: 'tout', q: '', sort: 'default', page: 1 };
  let firstRender = true;
  const ICON_PREV = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';
  const ICON_NEXT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';

  const inFilter = (p, f) => {
    if (f === 'tout') return true;
    if (f === 'homme' || f === 'femme') return p.cat.includes(f) || p.cat.includes('mixte');
    return p.cat.includes(f);
  };

  function productCard(p, i, off) {
    const k = Math.max(0, i);
    const anim = firstRender ? `reveal" style="--d:${(k % 4) * 0.08}s` : `product--enter" style="--i:${Math.min(k, 12)}`;
    const stockTag = !p.dispo ? '<span class="product__stock product__stock--off">Rupture de stock</span>'
      : p.stock !== null && p.stock <= 3 ? `<span class="product__stock">Plus que ${p.stock}</span>` : '';
    const action = p.dispo
      ? `<button class="btn btn--line" type="button" data-add="${esc(p.id)}">Ajouter au panier</button>`
      : `<a class="btn btn--line btn--notify" data-wa="${esc(notifyMsg(p))}">${ICON_WA}Me prévenir</a>`;
    return `<article class="product${p.dispo ? '' : ' product--off'} ${anim}"${off ? ' hidden' : ''}>
      <div class="product__media media">
        <div class="media__inner">${visual(p, { zoom: 1.2 })}</div>
        ${stockTag}
        ${p.signature ? '<span class="product__flag">Coup de cœur</span>' : ''}
      </div>
      <div class="product__body">
        <h3 class="product__name">${esc(p.fullName)}</h3>
        <p class="product__desc">${esc(p.desc)}</p>
        <div class="product__foot">
          <p class="product__price"><span class="product__ml">${esc(nb(p.size))}</span><span class="product__sep" aria-hidden="true"> · </span><span class="price">${money(p.price)}</span></p>
          <ul class="notes" aria-label="Caractère">${p.tags.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
          ${action}
        </div>
      </div>
    </article>`;
  }

  function renderGrid() {
    if (!grid) return;
    let list = products.filter((p) => inFilter(p, state.filter));
    if (state.q) {
      const q = norm(state.q.trim());
      list = list.filter((p) => norm([p.name, p.marque, p.desc, p.type, p.size].concat(p.tags, p.cat).join(' ')).includes(q));
    }
    if (state.sort === 'asc') list = list.slice().sort((a, b) => a.price - b.price);
    if (state.sort === 'desc') list = list.slice().sort((a, b) => b.price - a.price);
    // Les parfums en rupture passent en fin de liste
    list = list.slice().sort((a, b) => Number(b.dispo) - Number(a.dispo));

    const n = list.length;
    const pages = Math.max(1, Math.ceil(n / PER_PAGE));
    state.page = Math.min(Math.max(1, state.page), pages);
    const start = (state.page - 1) * PER_PAGE;
    const end = Math.min(start + PER_PAGE, n);
    // Tous les parfums restent dans la page (Google les voit tous) ;
    // seuls ceux de la page en cours sont affichés.
    grid.innerHTML = list.map((p, i) => productCard(p, i - start, i < start || i >= end)).join('');
    if (countEl) {
      countEl.textContent = n === 0 ? ''
        : pages > 1 ? `${start + 1} à ${end} sur ${n} parfums`
        : `${n} ${n > 1 ? 'parfums' : 'parfum'}`;
    }
    if (emptyEl) emptyEl.hidden = n > 0;
    renderPager(pages);
    fitNotes();
    bindWa(grid);
    if (firstRender) observe(grid);
    firstRender = false;
  }

  /* Étiquettes des cartes : une seule ligne, on masque celles qui débordent */
  function fitNotes() {
    if (!grid) return;
    $$('.product:not([hidden]) .notes', grid).forEach((ul) => {
      const items = Array.from(ul.children);
      items.forEach((li) => { li.hidden = false; });
      const max = ul.clientWidth;
      if (!max) return;
      items.forEach((li) => { if (li.offsetLeft - ul.offsetLeft + li.offsetWidth > max + 1) li.hidden = true; });
    });
  }
  let fitT;
  addEventListener('resize', () => { cancelAnimationFrame(fitT); fitT = requestAnimationFrame(fitNotes); }, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitNotes);

  /* Pagination : Précédent · 1 2 3 · Suivant (avec « … » au-delà de 7 pages) */
  function pageList(cur, total) {
    if (total <= 7) return Array.from({ length: total }, (_, k) => k + 1);
    const out = [1];
    const from = Math.max(2, cur - 1);
    const to = Math.min(total - 1, cur + 1);
    if (from > 2) out.push('…');
    for (let k = from; k <= to; k++) out.push(k);
    if (to < total - 1) out.push('…');
    out.push(total);
    return out;
  }
  function renderPager(pages) {
    if (!pager) return;
    pager.hidden = pages <= 1;
    if (pages <= 1) { pager.innerHTML = ''; return; }
    const cur = state.page;
    const items = pageList(cur, pages).map((k) => (k === '…'
      ? '<li class="pager__gap" aria-hidden="true">…</li>'
      : `<li><button class="pager__page" type="button" data-page="${k}"${k === cur ? ' aria-current="page"' : ''}><span class="sr-only">Page </span>${k}</button></li>`)).join('');
    pager.innerHTML =
      `<button class="pager__nav" type="button" data-page="${cur - 1}"${cur === 1 ? ' disabled' : ''}>${ICON_PREV}<span class="pager__label">Précédent</span></button>` +
      `<ul class="pager__pages">${items}</ul>` +
      `<button class="pager__nav" type="button" data-page="${cur + 1}"${cur === pages ? ' disabled' : ''}><span class="pager__label">Suivant</span>${ICON_NEXT}</button>`;
  }
  if (pager) {
    pager.addEventListener('click', (e) => {
      const b = e.target.closest('[data-page]');
      if (!b || b.disabled) return;
      const k = parseInt(b.getAttribute('data-page'), 10);
      if (!k || k === state.page) return;
      state.page = k;
      renderGrid();
      // On remonte en haut de la boutique, et le focus suit (lecteurs d'écran, clavier)
      const top = $('.shop-tools') || grid;
      top.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
      if (countEl) countEl.focus({ preventScroll: true });
    });
  }

  $$('[data-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.filter = btn.dataset.filter;
      state.page = 1;
      $$('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      renderGrid();
    });
  });
  if (searchInput) {
    let t;
    searchInput.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => { state.q = searchInput.value; state.page = 1; renderGrid(); }, 120);
    });
  }
  if (sortSelect) sortSelect.addEventListener('change', () => { state.sort = sortSelect.value; state.page = 1; renderGrid(); });

  function applySearch(q) {
    state.q = q;
    state.filter = 'tout';
    state.page = 1;
    if (searchInput) searchInput.value = q;
    $$('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === 'tout')));
    renderGrid();
    const target = $('#parfums');
    if (target) target.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth' });
  }

  renderGrid();

  /* ==========================================================================
     LA SIGNATURE DE LA MAISON
     ========================================================================== */
  const sigWrap = $('[data-signatures]');
  if (sigWrap) {
    const pour = (p) => (p.cat.includes('mixte') ? 'Mixte' : p.cat.includes('femme') ? 'Femme' : p.cat.includes('homme') ? 'Homme' : 'Tous');
    const sigs = products.filter((p) => p.signature);
    const sigCount = $('[data-sig-count]');
    if (sigCount) sigCount.textContent = counted(sigs.length, 'parfum');
    sigWrap.innerHTML = sigs.map((p, i) => {
      const s = p.signature;
      const words = p.name.split(' ');
      const last = words.pop();
      const title = words.length ? `${esc(words.join(' '))} <em>${esc(last)}</em>` : `<em>${esc(last)}</em>`;
      const tags = (s.accords || []).slice(0, 2).map((a, k) => `<span class="note-tag note-tag--s${k + 1}">${esc(a)}</span>`).join('');
      const caractere = p.tags.filter((t) => !/^(homme|femme|mixte)$/i.test(t)).join(', ');
      return `<article class="sig-row">
        <div class="sig-row__media reveal">
          <div class="media"><div class="media__inner">${visual(p, Object.assign({ zoom: 1.24, props: ['chips', 'smoke'] }, s.scene || {}))}</div></div>
          ${tags}
        </div>
        <div class="sig-row__text">
          <p class="eyebrow reveal">Signature ${String(i + 1).padStart(2, '0')} · ${esc(s.famille || '')}</p>
          <h3 class="sig-row__title reveal" style="--d:.06s">${title}</h3>
          <p class="sig-row__tagline reveal" style="--d:.12s">${esc(s.accroche || '')}</p>
          <p class="sig-row__story reveal" style="--d:.16s">${esc(p.desc)}</p>
          <dl class="pyramid reveal" style="--d:.2s">
            <div><dt>Format</dt><dd>${esc(p.size)}</dd></div>
            <div><dt>Pour</dt><dd>${esc(pour(p))}</dd></div>
            <div><dt>Caractère</dt><dd>${esc(caractere)}</dd></div>
          </dl>
          <div class="sig-row__buy reveal" style="--d:.24s">
            <div class="sig-row__price"><span class="mono-label">${esc(p.format)}</span><span class="price">${money(p.price)}</span></div>
            <div class="sig-row__ctas">
              ${p.dispo
                ? `<button class="btn btn--gold" type="button" data-add="${esc(p.id)}">Ajouter au panier</button>`
                : `<a class="btn btn--ghost" data-wa="${esc(notifyMsg(p))}">Rupture : me prévenir</a>`}
              <a class="btn btn--ghost" data-wa="Bonjour Maison Riwaha, j'aimerais en savoir plus sur ${esc(p.name)}.">Poser une question</a>
            </div>
          </div>
        </div>
      </article>`;
    }).join('');
  }

  /* ==========================================================================
     COLLECTION PRIVÉE
     ========================================================================== */
  const amount = $('[data-privee-amount]');
  if (amount) amount.textContent = num(P.price || 0);
  const pmeta = $('[data-privee-meta]');
  if (pmeta) pmeta.textContent = `Le flacon de ${P.size || ''} · les ${privee.length} modèles`;
  const pCount = $('[data-privee-count]');
  if (pCount) pCount.textContent = counted(privee.length, 'flacon');
  const pWrap = $('[data-privee]');
  const PRIVEE_VISIBLE = 8;
  if (pWrap) {
    pWrap.innerHTML = privee.map((p, i) => `<article class="cp reveal${i >= PRIVEE_VISIBLE ? ' cp--more' : ''}" style="--d:${(i % 4) * 0.07}s">
      <div class="cp__media media"><div class="media__inner">${visual(p, { zoom: 1.5, cy: 280 })}</div></div>
      <div class="cp__body">
        <span class="cp__num">N°${String(i + 1).padStart(2, '0')}</span>
        <h3 class="cp__name">${esc(p.name)}</h3>
        <div class="cp__foot">
          ${p.dispo
            ? `<span class="stock"><i aria-hidden="true"></i>${p.stock !== null && p.stock <= 3 ? `Plus que ${p.stock}` : 'En stock à Dakar'}</span>
          <button class="add-round add-round--sm" type="button" data-add="${esc(p.id)}" aria-label="Ajouter ${esc(nameOf(p))} au panier">${ICON_PLUS}</button>`
            : `<span class="stock stock--off"><i aria-hidden="true"></i>Rupture</span>
          <a class="add-round add-round--sm add-round--off" data-wa="${esc(notifyMsg(p))}" aria-label="${esc(nameOf(p))} en rupture : me prévenir sur WhatsApp">${ICON_WA}</a>`}
        </div>
      </div>
    </article>`).join('');
    const more = $('[data-privee-more]');
    if (more) {
      if (privee.length <= PRIVEE_VISIBLE) more.hidden = true;
      more.textContent = `Afficher les ${privee.length} modèles`;
      more.addEventListener('click', () => {
        const open = pWrap.classList.toggle('is-open');
        $$('.cp--more', pWrap).forEach((el) => el.classList.add('is-in'));
        more.textContent = open ? 'Réduire la collection' : `Afficher les ${privee.length} modèles`;
        more.setAttribute('aria-expanded', String(open));
        if (!open) $('#collection').scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth' });
      });
    }
  }

  /* ==========================================================================
     NOTRE SÉLECTION (maisons revendues)
     ========================================================================== */
  const brands = $('[data-brands]');
  if (brands) {
    brands.innerHTML = (D.selection || []).map((b, i) => {
      const n = b.lien === '#collection' ? privee.length : products.filter((p) => p.marque === b.name).length;
      const label = n > 1 ? `${n} parfums` : n === 1 ? '1 parfum' : 'Sur demande';
      let cta;
      if (b.lien) cta = `<a class="brand-card__cta" href="${esc(b.lien)}">Voir la collection</a>`;
      else if (n) cta = `<a class="brand-card__cta" href="#parfums" data-search="${esc(b.name)}">${n > 1 ? `Voir les ${n} parfums` : 'Voir le parfum'}</a>`;
      else cta = `<a class="brand-card__cta" data-wa="Bonjour Maison Riwaha, avez-vous des parfums ${esc(b.name)} disponibles ?">Demander</a>`;
      return `<article class="brand-card reveal" style="--d:${(i % 4) * 0.06}s">
        <p class="brand-card__tag">${esc(label)}</p>
        <h3 class="brand-card__name">${esc(b.name)}</h3>
        <p class="brand-card__origin">${esc(b.origine || '')}</p>
        ${cta}
      </article>`;
    }).join('');
  }

  /* ==========================================================================
     TARIFS
     ========================================================================== */
  const pricing = $('[data-pricing]');
  if (pricing) {
    pricing.innerHTML = (D.formats || []).map((f, i) => {
      const prices = products.filter((p) => p.size === f.size).map((p) => p.price);
      const min = prices.length ? Math.min.apply(null, prices) : null;
      const max = prices.length ? Math.max.apply(null, prices) : null;
      const fixe = f.prixFixe === '' || f.prixFixe == null ? null : Number(f.prixFixe);
      const value = fixe != null ? fixe : min;
      const label = fixe != null ? (f.prefixe || 'Prix') : 'À partir de';
      const points = (f.points || [])
        .filter((pt) => pt && (!/\{(min|max)\}/.test(pt) || min != null))
        .map((pt) => pt.replace('{min}', num(min)).replace('{max}', num(max)).replace('{n}', privee.length));
      const cta = f.lien
        ? `<a class="btn ${f.vedette ? 'btn--gold' : 'btn--ghost'}" href="${esc(f.lien)}">${esc(f.bouton || 'Voir')}</a>`
        : `<a class="btn ${f.vedette ? 'btn--gold' : 'btn--ghost'}" href="#parfums" data-search="${esc(f.recherche || f.size)}">${esc(f.bouton || 'Voir')}</a>`;
      return `<article class="plan${f.vedette ? ' plan--featured' : ''} reveal" style="--d:${i * 0.08}s">
        ${f.vedette ? '<span class="plan__badge">Le plus pris</span>' : ''}
        <p class="plan__size">${esc(f.size)}</p>
        <h3 class="plan__title">${esc(f.titre)}</h3>
        ${value != null ? `<p class="plan__from">${esc(label)}</p><p class="plan__price">${num(value)}<small>FCFA</small></p>` : ''}
        <ul class="plan__list">${points.map((pt) => `<li>${esc(pt)}</li>`).join('')}</ul>
        ${cta}
      </article>`;
    }).join('');
  }
  const pNote = $('[data-pricing-note]');
  if (pNote) {
    const oils = products.filter((p) => /huile/i.test(p.type));
    if (oils.length) {
      const sizes = oils.map((p) => parseInt(p.size, 10)).filter((n) => !isNaN(n));
      const lo = Math.min.apply(null, sizes), hi = Math.max.apply(null, sizes);
      const range = lo === hi ? `${lo} ml` : `${lo} à ${hi} ml`;
      pNote.textContent = `Huiles concentrées de ${range} dès ${money(Math.min.apply(null, oils.map((p) => p.price)))}. Le prix exact de chaque flacon est indiqué dans la boutique. Demandez les promotions du moment sur WhatsApp.`;
    } else pNote.hidden = true;
  }

  /* ==========================================================================
     AVIS (uniquement de vrais avis, saisis dans l'espace admin)
     ========================================================================== */
  const revWrap = $('[data-reviews]');
  if (revWrap) {
    const list = (D.reviews || []).filter((r) => r && r.texte && r.prenom);
    if (list.length) {
      revWrap.innerHTML = `<div class="reviews">${list.map((r, i) => `<figure class="review reveal" style="--d:${(i % 3) * 0.08}s">
          <span class="review__mark" aria-hidden="true">“</span>
          <blockquote class="review__text">${esc(r.texte)}</blockquote>
          <figcaption class="review__who">${esc(r.prenom)}${r.quartier ? ` <span>· ${esc(r.quartier)}</span>` : ''}${r.parfum ? `<span class="review__product">${esc(r.parfum)}</span>` : ''}</figcaption>
        </figure>`).join('')}</div>`;
    } else {
      revWrap.innerHTML = `<div class="reviews-empty reveal">
          <span class="review__mark" aria-hidden="true">“</span>
          <p class="reviews-empty__title gold-em">Votre avis sera <em>le premier</em> ici.</p>
          <p>Nous ne publions que de vrais avis, avec le prénom et le quartier de nos clients. Vous avez commandé chez nous ? Racontez-nous votre parfum sur WhatsApp.</p>
          <a class="btn btn--ghost" data-wa="Bonjour Maison Riwaha, voici mon avis sur mon parfum : ">${ICON_WA}Envoyer mon avis</a>
        </div>`;
    }
  }

  /* ==========================================================================
     COORDONNÉES ET RÉSEAUX SOCIAUX
     ========================================================================== */
  $$('[data-cfg-text]').forEach((el) => {
    const v = C[el.getAttribute('data-cfg-text')];
    if (v) el.textContent = v; else { const row = el.closest('[data-cfg-row]'); if (row) row.hidden = true; }
  });
  $$('[data-cfg-href]').forEach((el) => {
    const v = C[el.getAttribute('data-cfg-href')];
    if (v) { el.href = v; el.target = '_blank'; el.rel = 'noopener'; }
  });

  const socials = $('[data-socials]');
  if (socials) {
    const nets = [
      ['Instagram', C.instagram, '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".9" fill="currentColor" stroke="none"/></svg>'],
      ['TikTok', C.tiktok, '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M14 3.5v11.2a3.8 3.8 0 1 1-3.3-3.8"/><path d="M14 3.5c.4 2.6 2.2 4.4 5 4.6"/></svg>'],
      ['Facebook', C.facebook, '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M14.5 8H16V4.6h-2.3A3.6 3.6 0 0 0 10 8.2V10H8v3.4h2V20h3.4v-6.6H16l.5-3.4h-3.1V8.6c0-.4.3-.6.6-.6Z"/></svg>']
    ].filter((n) => n[1]);
    socials.innerHTML = nets.map(([n, url, icon]) => `<a href="${esc(url)}" aria-label="${n}" target="_blank" rel="noopener">${icon}</a>`).join('');
    if (!nets.length) $$('[data-socials-block]').forEach((el) => { el.hidden = true; });
  }

  /* ==========================================================================
     PANIER
     ========================================================================== */
  const KEY = 'riwaha-panier-v2';
  let cart = [];
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    // On ne garde que les parfums encore disponibles, dans la limite du stock
    if (Array.isArray(raw)) cart = raw.filter((l) => l && byId[l.id] && byId[l.id].dispo && l.qty > 0).map((l) => ({ id: l.id, qty: Math.min(maxQty(byId[l.id]), Math.floor(l.qty)) }));
  } catch (e) { cart = []; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) { /* stockage indisponible */ } };

  const countEls = $$('[data-cart-count]');
  const itemsEl = $('[data-cart-items]');
  const footEl = $('[data-cart-foot]');
  const subEl = $('[data-cart-subtotal]');
  const totalEl = $('[data-cart-total]');
  const checkout = $('[data-checkout]');
  const drawer = $('[data-drawer]');

  const count = () => cart.reduce((s, l) => s + l.qty, 0);
  const total = () => cart.reduce((s, l) => s + byId[l.id].price * l.qty, 0);

  function orderMessage() {
    const lines = cart.map((l) => {
      const p = byId[l.id];
      return `• ${l.qty} × ${nameOf(p)} · ${p.size} : ${money(p.price * l.qty)}`;
    });
    return [
      'Bonjour Maison Riwaha, je souhaite commander :',
      '',
      ...lines,
      '',
      `Total : ${money(total())} (hors livraison)`,
      '',
      'Nom : ',
      'Quartier / adresse de livraison : ',
      'Paiement : Wave / Orange Money / espèces à la livraison',
      '',
      'Jërëjëf !'
    ].join('\n');
  }

  function renderCart() {
    const c = count();
    countEls.forEach((el) => { el.textContent = c; });
    const cartBtn = $('.cart-btn');
    if (cartBtn) cartBtn.setAttribute('aria-label', `Ouvrir le panier, ${c} article${c > 1 ? 's' : ''}`);
    if (!itemsEl) return;

    if (!cart.length) {
      itemsEl.innerHTML = `<div class="cart-empty">
          <p class="cart-empty__title">Votre panier est vide.</p>
          <p lang="wo">Dalal ak jàmm.</p>
          <p>Prenez le temps de choisir, et demandez-nous conseil sur WhatsApp si besoin.</p>
          <a class="btn btn--ghost" href="#parfums" data-cart-close>Voir les parfums</a>
        </div>`;
      footEl.hidden = true;
      return;
    }
    footEl.hidden = false;
    itemsEl.innerHTML = cart.map((l) => {
      const p = byId[l.id];
      return `<div class="line-item">
          <div class="line-item__thumb">${visual(p, { zoom: 1.7, cy: 300, props: [], reflection: false })}</div>
          <div>
            <p class="line-item__name">${esc(p.fullName || p.name)}</p>
            <p class="line-item__meta">${esc(p.format)}</p>
            <div class="line-item__row">
              <div class="qty">
                <button type="button" data-dec="${esc(p.id)}" aria-label="Retirer un ${esc(nameOf(p))}">−</button>
                <span aria-live="polite">${l.qty}</span>
                <button type="button" data-inc="${esc(p.id)}" aria-label="Ajouter un ${esc(nameOf(p))}">+</button>
              </div>
            </div>
          </div>
          <div class="line-item__side">
            <span class="price">${money(p.price * l.qty)}</span>
            <button class="remove" type="button" data-remove="${esc(p.id)}">Retirer</button>
          </div>
        </div>`;
    }).join('');
    subEl.textContent = money(total());
    totalEl.textContent = money(total());
    checkout.href = waLink(orderMessage());
  }

  function bump() {
    countEls.forEach((el) => {
      el.classList.remove('bump');
      void el.offsetWidth;
      el.classList.add('bump');
    });
  }

  function add(id, source) {
    const p = byId[id];
    if (!p) return;
    if (!p.dispo) {
      toast(`<span><b>Rupture de stock</b> · ${esc(nameOf(p))}</span><a data-wa="${esc(notifyMsg(p))}">Me prévenir</a>`);
      bindWa(toastEl);
      return;
    }
    const line = cart.find((l) => l.id === id);
    if (line && line.qty >= maxQty(p)) {
      toast(`<span>Plus que <b>${maxQty(p)}</b> en stock · ${esc(nameOf(p))}</span><button type="button" data-cart-open>Voir le panier</button>`);
      return;
    }
    if (line) line.qty += 1;
    else cart.push({ id, qty: 1 });
    save();
    renderCart();
    bump();
    toast(`<span><b>Ajouté</b> · ${esc(nameOf(p))}</span><button type="button" data-cart-open>Voir le panier</button>`);
    if (source && source.classList.contains('btn')) {
      if (!source.dataset.label) source.dataset.label = source.textContent.trim();
      source.classList.add('is-added');
      source.textContent = 'Ajouté ✓';
      clearTimeout(source._t);
      source._t = setTimeout(() => {
        source.classList.remove('is-added');
        source.textContent = source.dataset.label;
      }, 1600);
    } else if (source) {
      source.classList.add('is-added');
      setTimeout(() => source.classList.remove('is-added'), 400);
    }
  }
  function setQty(id, q) {
    const line = cart.find((l) => l.id === id);
    if (!line) return;
    const p = byId[id];
    if (p && q > maxQty(p)) toast(`<span>Plus que <b>${maxQty(p)}</b> en stock · ${esc(nameOf(p))}</span>`);
    line.qty = Math.max(0, Math.min(p ? maxQty(p) : 20, q));
    if (!line.qty) cart = cart.filter((l) => l.id !== id);
    save();
    renderCart();
  }

  /* Ouverture / fermeture du tiroir */
  let lastFocus = null;
  function openCart() {
    setMenu(false);
    lastFocus = document.activeElement;
    document.documentElement.classList.add('cart-open', 'no-scroll');
    drawer.removeAttribute('inert');
    setTimeout(() => { const b = $('[data-cart-close].icon-btn'); if (b) b.focus({ preventScroll: true }); }, 60);
  }
  function closeCart() {
    if (!document.documentElement.classList.contains('cart-open')) return;
    document.documentElement.classList.remove('cart-open', 'no-scroll');
    drawer.setAttribute('inert', '');
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  /* Toast */
  const toastEl = $('[data-toast]');
  let toastT;
  function toast(html) {
    if (!toastEl) return;
    toastEl.innerHTML = html;
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('is-on'), 3200);
  }

  /* ==========================================================================
     MENU MOBILE
     ========================================================================== */
  const menu = $('#menu');
  const menuBtn = $('[data-menu-toggle]');
  function setMenu(open) {
    if (!menu || !menuBtn) return;
    const isOpen = document.documentElement.classList.contains('menu-open');
    if (open === isOpen) return;
    document.documentElement.classList.toggle('menu-open', open);
    document.documentElement.classList.toggle('no-scroll', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    if (open) menu.removeAttribute('inert'); else menu.setAttribute('inert', '');
  }
  if (menuBtn) menuBtn.addEventListener('click', () => setMenu(!document.documentElement.classList.contains('menu-open')));
  if (menu) $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  addEventListener('resize', () => { if (innerWidth >= 1024) setMenu(false); }, { passive: true });

  /* ==========================================================================
     ÉVÉNEMENTS GLOBAUX
     ========================================================================== */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-add],[data-cart-open],[data-cart-close],[data-inc],[data-dec],[data-remove],[data-search]');
    if (!t) return;
    if (t.hasAttribute('data-add')) { add(t.getAttribute('data-add'), t); return; }
    if (t.hasAttribute('data-cart-open')) { e.preventDefault(); if (toastEl) toastEl.classList.remove('is-on'); openCart(); return; }
    if (t.hasAttribute('data-cart-close')) { closeCart(); return; }
    if (t.hasAttribute('data-inc')) { const id = t.getAttribute('data-inc'); const l = cart.find((x) => x.id === id); setQty(id, (l ? l.qty : 0) + 1); return; }
    if (t.hasAttribute('data-dec')) { const id = t.getAttribute('data-dec'); const l = cart.find((x) => x.id === id); setQty(id, (l ? l.qty : 0) - 1); return; }
    if (t.hasAttribute('data-remove')) { setQty(t.getAttribute('data-remove'), 0); return; }
    if (t.hasAttribute('data-search')) { e.preventDefault(); applySearch(t.getAttribute('data-search')); }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeCart(); setMenu(false); }
    if (e.key === 'Tab' && document.documentElement.classList.contains('cart-open')) {
      const f = $$('a[href], button:not([disabled]), input, select', drawer).filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* En-tête : transparent, puis fixe et flouté au défilement */
  const header = $('[data-header]');
  const onScroll = () => { if (header) header.classList.toggle('is-scrolled', scrollY > 30); };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Lien de navigation actif */
  const navLinks = $$('.nav a');
  if ('IntersectionObserver' in window && navLinks.length) {
    const map = {};
    navLinks.forEach((a) => { map[a.getAttribute('href').slice(1)] = a; });
    const navIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          navLinks.forEach((a) => a.classList.remove('is-active'));
          const a = map[en.target.id];
          if (a) a.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main > section[id]').forEach((s) => navIO.observe(s));
  }

  /* Année du pied de page */
  const y = $('[data-year]');
  if (y) y.textContent = new Date().getFullYear();

  bindWa();
  renderCart();
  /* Le héros apparaît dès le chargement, sans attendre le défilement */
  requestAnimationFrame(() => $$('.hero .reveal').forEach((el) => el.classList.add('is-in')));
  observe();
})();
