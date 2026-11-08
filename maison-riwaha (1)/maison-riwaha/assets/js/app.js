/* ==========================================================================
   MAISON RIWAHA – Interactions du site
   Catalogue, panier, commande WhatsApp, menu mobile, animations.
   ========================================================================== */
(function () {
  'use strict';

  const D = window.RIWAHA;
  const V = window.RiwahaVisuals;
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
  const ICON_PLUS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  const ICON_WA = '<svg class="i-wa" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-wa"/></svg>';

  /* ---------- Données ---------- */
  const products = (D.products || []).map((p) => {
    const type = p.type || 'Parfum';
    return Object.assign({ tags: [], cat: [] }, p, {
      id: p.id || slug(p.name),
      type,
      format: `${type} · ${nb(p.size)}`
    });
  });
  const P = D.privee || { items: [] };
  const privee = (P.items || []).map((i) => Object.assign({ tags: [] }, i, {
    id: 'cp-' + slug(i.name),
    price: P.price,
    size: P.size,
    type: 'Collection Privée',
    format: `Collection Privée · ${nb(P.size)}`,
    displayName: `${i.name} (Collection Privée)`,
    visual: { shape: 'tall', cap: 'black', liquid: 'tabac' }
  }));
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
    return `<img class="${cls}" src="${esc(encodeURI(p.image))}" alt="${esc(nameOf(p))}"${eager ? '' : ' loading="lazy"'} decoding="async" data-fb="${key}"${style}>`;
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
  const hero = byId['oud-al-malik'] || products[0];
  const heroVisual = $('[data-hero-visual]');
  if (heroVisual && hero) {
    heroVisual.innerHTML = visual(hero, { zoom: 1.3, cy: 334, props: ['chips', 'beads', 'smoke'], haloOpacity: 0.26 }, true);
    const set = (sel, txt) => { const el = $(sel); if (el) el.textContent = txt; };
    set('[data-hero-price]', money(hero.price));
    set('[data-hero-name]', hero.name);
    set('[data-hero-meta]', `Coup de cœur · ${hero.size}`);
    const add = $('[data-hero-add]');
    if (add) { add.setAttribute('data-add', hero.id); add.setAttribute('aria-label', `Ajouter ${hero.name} au panier`); }
  }
  const ritualVisual = $('[data-ritual-visual]');
  if (ritualVisual) ritualVisual.innerHTML = V.ritual();

  /* ==========================================================================
     CATALOGUE
     ========================================================================== */
  const grid = $('[data-grid]');
  const countEl = $('[data-shop-count]');
  const emptyEl = $('[data-shop-empty]');
  const searchInput = $('[data-search-input]');
  const sortSelect = $('[data-sort]');
  const state = { filter: 'tout', q: '', sort: 'default' };
  let firstRender = true;

  const inFilter = (p, f) => {
    if (f === 'tout') return true;
    if (f === 'homme' || f === 'femme') return p.cat.includes(f) || p.cat.includes('mixte');
    return p.cat.includes(f);
  };

  function productCard(p, i) {
    const anim = firstRender ? `reveal" style="--d:${(i % 4) * 0.08}s` : `product--enter" style="--i:${Math.min(i, 12)}`;
    return `<article class="product ${anim}">
      <div class="product__media media">
        <div class="media__inner">${visual(p, { zoom: 1.2 })}</div>
        <span class="product__size">${esc(p.size)}</span>
        ${p.signature ? '<span class="product__flag">Coup de cœur</span>' : ''}
      </div>
      <div class="product__body">
        <p class="product__type">${esc(p.marque || p.type)}</p>
        <h3 class="product__name">${esc(p.name)}</h3>
        <p class="product__desc">${esc(p.desc)}</p>
        <ul class="notes" aria-label="Caractère">${p.tags.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
        <div class="product__foot"><span class="price">${money(p.price)}</span></div>
        <button class="btn btn--line" type="button" data-add="${esc(p.id)}">Ajouter au panier</button>
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

    grid.innerHTML = list.map(productCard).join('');
    if (countEl) countEl.textContent = list.length === 0 ? '' : `${list.length} ${list.length > 1 ? 'parfums' : 'parfum'}`;
    if (emptyEl) emptyEl.hidden = list.length > 0;
    if (firstRender) observe(grid);
    firstRender = false;
  }

  $$('[data-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.filter = btn.dataset.filter;
      $$('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      renderGrid();
    });
  });
  if (searchInput) {
    let t;
    searchInput.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => { state.q = searchInput.value; renderGrid(); }, 120);
    });
  }
  if (sortSelect) sortSelect.addEventListener('change', () => { state.sort = sortSelect.value; renderGrid(); });

  function applySearch(q) {
    state.q = q;
    state.filter = 'tout';
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
              <button class="btn btn--gold" type="button" data-add="${esc(p.id)}">Ajouter au panier</button>
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
  const pWrap = $('[data-privee]');
  const PRIVEE_VISIBLE = 8;
  if (pWrap) {
    pWrap.innerHTML = privee.map((p, i) => `<article class="cp reveal${i >= PRIVEE_VISIBLE ? ' cp--more' : ''}" style="--d:${(i % 4) * 0.07}s">
      <div class="cp__media media"><div class="media__inner">${visual(p, { zoom: 1.5, cy: 280 })}</div></div>
      <div class="cp__body">
        <span class="cp__num">N°${String(i + 1).padStart(2, '0')}</span>
        <h3 class="cp__name">${esc(p.name)}</h3>
        <div class="cp__foot">
          <span class="stock"><i aria-hidden="true"></i>En stock à Dakar</span>
          <button class="add-round add-round--sm" type="button" data-add="${esc(p.id)}" aria-label="Ajouter ${esc(nameOf(p))} au panier">${ICON_PLUS}</button>
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
      const value = f.prixFixe != null ? f.prixFixe : min;
      const label = f.prixFixe != null ? (f.prefixe || 'Prix') : 'À partir de';
      const points = (f.points || [])
        .filter((pt) => !/\{(min|max)\}/.test(pt) || min != null)
        .map((pt) => pt.replace('{min}', num(min)).replace('{max}', num(max)));
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
     AVIS (uniquement de vrais avis, renseignés dans catalogue.js)
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
    if (Array.isArray(raw)) cart = raw.filter((l) => l && byId[l.id] && l.qty > 0).map((l) => ({ id: l.id, qty: Math.min(20, Math.floor(l.qty)) }));
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
            <p class="line-item__name">${esc(p.name)}</p>
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
    const line = cart.find((l) => l.id === id);
    if (line) line.qty = Math.min(20, line.qty + 1);
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
    line.qty = Math.max(0, Math.min(20, q));
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
