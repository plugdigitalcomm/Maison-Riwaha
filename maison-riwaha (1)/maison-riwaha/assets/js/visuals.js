/* ==========================================================================
   MAISON RIWAHA – Flacons dessinés (SVG) en clair-obscur
   Utilisés tant qu'aucune photo n'est renseignée dans catalogue.js.
   ========================================================================== */
(function () {
  'use strict';

  let uid = 0;
  const nid = (p) => p + (++uid).toString(36);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const stops = (arr) => arr.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ''}/>`).join('');
  const rr = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
  const circ = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
  const BLUR = (id, sd) => `<filter id="${id}" filterUnits="userSpaceOnUse" x="-300" y="-300" width="1200" height="1300"><feGaussianBlur stdDeviation="${sd}"/></filter>`;

  /* Couleurs du jus : clair, moyen, sombre */
  const LIQ = {
    oud:       ['#a8591f', '#4d1f0b', '#150702'],
    ambre:     ['#eaa54f', '#9c5519', '#3a1c08'],
    rose:      ['#cf6a5d', '#7c2429', '#290a0e'],
    musc:      ['#f7efdf', '#d3c09c', '#7b6749'],
    or:        ['#f8dc8e', '#c99238', '#583710'],
    vetiver:   ['#c4b56a', '#6d6327', '#221f0a'],
    santal:    ['#e8b676', '#a66f36', '#4a2b11'],
    champagne: ['#f6e9c9', '#cfb078', '#6b5431'],
    tabac:     ['#cc8443', '#713b17', '#261206'],
    nuit:      ['#dfb163', '#7d4b1c', '#21100a'],
    ceramic:   ['#5d4735', '#1d140d', '#050302']
  };

  /* Bouchons */
  const CAPS = {
    gold:  [[0, '#3a250e'], [0.16, '#8a6228'], [0.38, '#f6dc9c'], [0.5, '#e2b86a'], [0.72, '#9c7230'], [1, '#2a1a09']],
    black: [[0, '#040302'], [0.3, '#221b15'], [0.45, '#51443a'], [0.6, '#1d1712'], [1, '#030202']],
    wood:  [[0, '#1c0f06'], [0.35, '#5a361b'], [0.5, '#8d5a31'], [0.66, '#4a2a13'], [1, '#160b04']],
    ivory: [[0, '#5e5545'], [0.35, '#d9ccb3'], [0.5, '#f6efe1'], [0.7, '#b9ab90'], [1, '#4e4637']]
  };

  /* Formes de flacons, dessinées dans un cadre 400 × 500 (sol à y = 400) */
  const SHAPES = {
    square: {
      outer: rr(125, 214, 150, 186, 16), inner: rr(136, 232, 128, 146, 8),
      base: [125, 378, 150, 22], neck: [181, 194, 38, 22], ring: [176, 189, 48, 8],
      cap: '<rect x="156" y="110" width="88" height="82" rx="5"/>',
      label: [148, 282, 104, 58], hl: ['r', 131, 226, 7, 150], rim: ['r', 265, 226, 4, 150], shadow: 108
    },
    round: {
      outer: circ(200, 306, 94), inner: circ(200, 310, 80),
      base: [100, 384, 200, 16], neck: [184, 190, 32, 24], ring: [180, 186, 40, 7],
      cap: '<rect x="168" y="122" width="64" height="66" rx="6"/>',
      label: [160, 292, 80, 38], hl: ['p', 'M126 280 A80 80 0 0 1 166 234'], rim: ['p', 'M276 280 A80 80 0 0 1 268 346'], shadow: 92
    },
    tall: {
      outer: rr(150, 166, 100, 234, 10), inner: rr(159, 182, 82, 198, 5),
      base: [150, 380, 100, 20], neck: [183, 148, 34, 20], ring: [179, 144, 42, 7],
      cap: '<rect x="163" y="64" width="74" height="82" rx="4"/>',
      label: [161, 256, 78, 74], hl: ['r', 155, 180, 6, 196], rim: ['r', 241, 180, 4, 196], shadow: 72
    },
    facet: {
      outer: 'M130 240 L152 214 H248 L270 240 V384 L254 400 H146 L130 384 Z',
      inner: 'M141 246 L159 228 H241 L259 246 V372 L247 382 H153 L141 372 Z',
      facets: 'M152 216 V398 M248 216 V398',
      base: [130, 380, 140, 20], neck: [182, 194, 36, 22],
      cap: '<rect x="172" y="178" width="56" height="18" rx="2"/><path d="M164 180 V150 C164 108 236 108 236 150 V180 Z"/><rect x="196" y="110" width="8" height="10"/><circle cx="200" cy="104" r="9"/>',
      label: [160, 282, 80, 62], hl: ['r', 136, 248, 6, 128], rim: ['r', 260, 248, 4, 128], shadow: 106
    },
    roll: {
      outer: rr(163, 250, 74, 150, 14), inner: rr(171, 262, 58, 124, 9),
      base: [163, 384, 74, 16], neck: [181, 236, 38, 16],
      cap: '<rect x="170" y="146" width="60" height="92" rx="12"/>', ribs: [176, 226, 152, 232],
      label: [169, 298, 62, 44], hl: ['r', 168, 262, 5, 120], rim: ['r', 229, 262, 3, 120], shadow: 52
    },
    drop: {
      outer: 'M200 236 C278 268 274 370 240 400 L160 400 C126 370 122 268 200 236 Z',
      inner: 'M200 254 C262 282 258 364 232 386 L168 386 C142 364 138 282 200 254 Z',
      base: [120, 386, 160, 14], neck: [189, 208, 22, 32],
      cap: '<path d="M200 80 C228 116 230 166 213 206 H187 C170 166 172 116 200 80 Z"/><rect x="183" y="200" width="34" height="12" rx="3"/>',
      medal: [200, 322, 19], hl: ['p', 'M150 340 C148 304 160 282 182 266'], rim: ['p', 'M252 320 C254 350 248 372 236 388'], shadow: 80
    },
    diffuser: {
      outer: rr(140, 262, 120, 138, 20), inner: rr(150, 286, 100, 100, 12),
      base: [140, 386, 120, 14], neck: [178, 242, 44, 22], ring: [172, 236, 56, 14],
      reeds: [[136, 56], [166, 42], [198, 34], [230, 46], [264, 64]],
      cap: '', label: [158, 312, 84, 46], hl: ['r', 146, 280, 6, 104], rim: ['r', 251, 280, 4, 104], shadow: 86
    },
    jar: {
      opaque: true,
      outer: rr(122, 316, 156, 84, 24),
      cap: '<path d="M114 324 C114 268 286 268 286 324 Z"/><rect x="186" y="264" width="28" height="20" rx="9"/>',
      label: [128, 342, 144, 30], hl: ['r', 130, 328, 6, 62], rim: ['r', 268, 328, 4, 62], shadow: 114
    }
  };

  function stripe(spec, fill, w) {
    if (!spec) return '';
    if (spec[0] === 'r') return `<rect x="${spec[1]}" y="${spec[2]}" width="${spec[3]}" height="${spec[4]}" rx="${spec[3] / 2}" fill="${fill}"/>`;
    return `<path d="${spec[1]}" fill="none" stroke="${fill}" stroke-width="${w}" stroke-linecap="round"/>`;
  }

  function label([x, y, w, h], name, sub) {
    const up = String(name).toUpperCase();
    const words = up.split(' ');
    let lines = [up];
    if (up.length > 9 && words.length > 1) {
      let best = null;
      for (let i = 1; i < words.length; i++) {
        const a = words.slice(0, i).join(' ');
        const b = words.slice(i).join(' ');
        const d = Math.abs(a.length - b.length);
        if (!best || d < best.d) best = { a, b, d };
      }
      lines = [best.a, best.b];
    }
    const maxLen = Math.max(...lines.map((l) => l.length));
    const subH = sub ? Math.max(8, h * 0.2) : 0;
    const fs = Math.min((h - subH) / (lines.length * 1.25 + 0.3), (w - 14) / (maxLen * 0.8));
    const lh = fs * 1.12;
    const first = y + (h - subH - lines.length * lh) / 2 + fs * 0.82;
    let t = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="#0e0a07" fill-opacity=".8" stroke="#E2B86A" stroke-opacity=".75" stroke-width=".8"/>`;
    t += `<rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" rx="1" fill="none" stroke="#E2B86A" stroke-opacity=".28" stroke-width=".5"/>`;
    lines.forEach((l, i) => {
      t += `<text x="${x + w / 2}" y="${(first + i * lh).toFixed(2)}" text-anchor="middle" font-family="Cormorant Garamond, EB Garamond, Georgia, serif" font-weight="600" font-size="${fs.toFixed(2)}" letter-spacing="${(fs * 0.1).toFixed(2)}" fill="#E2B86A">${esc(l)}</text>`;
    });
    if (sub) {
      const ss = Math.min(4.6, (w - 10) / (sub.length * 0.95));
      t += `<text x="${x + w / 2}" y="${y + h - 5.5}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="${ss.toFixed(2)}" letter-spacing="${(ss * 0.28).toFixed(2)}" fill="#CFC3B2" fill-opacity=".75">${esc(sub)}</text>`;
    }
    return t;
  }

  /* Un flacon complet (défs + corps) en coordonnées locales */
  function bottle(o, id) {
    const S = SHAPES[o.shape] || SHAPES.square;
    const L = LIQ[o.liquid] || LIQ.oud;
    const C = CAPS[o.cap] || CAPS.gold;
    const defs =
      `<linearGradient id="${id}l" x1="0" y1="0" x2=".9" y2="1">${stops([[0, L[0]], [0.45, L[1]], [1, L[2]]])}</linearGradient>` +
      `<radialGradient id="${id}lg" cx=".28" cy=".22" r=".75">${stops([[0, '#fff6e2', 0.42], [0.45, '#fff6e2', 0.08], [1, '#fff6e2', 0]])}</radialGradient>` +
      `<linearGradient id="${id}sd" x1="0" y1="0" x2="1" y2="0">${stops([[0, '#000', 0], [0.55, '#000', 0], [1, '#000', 0.5]])}</linearGradient>` +
      `<linearGradient id="${id}c" x1="0" y1="0" x2="1" y2="0">${stops(C)}</linearGradient>` +
      `<linearGradient id="${id}cs" x1="0" y1="0" x2="0" y2="1">${stops([[0, '#fff', 0.3], [0.22, '#fff', 0], [0.7, '#000', 0], [1, '#000', 0.4]])}</linearGradient>` +
      `<linearGradient id="${id}h" x1="0" y1="0" x2="0" y2="1">${stops([[0, '#fffaf0', 0.8], [0.5, '#fffaf0', 0.14], [1, '#fffaf0', 0.42]])}</linearGradient>` +
      `<linearGradient id="${id}r" x1="0" y1="0" x2="0" y2="1">${stops([[0, '#E2B86A', 0.15], [0.4, '#f6dc9c', 0.95], [1, '#E2B86A', 0.25]])}</linearGradient>` +
      `<clipPath id="${id}cl"><path d="${S.outer}"/></clipPath>` +
      BLUR(`${id}f`, 1.4);

    let g = '';
    if (S.reeds) {
      S.reeds.forEach(([x, y]) => {
        g += `<line x1="200" y1="246" x2="${x}" y2="${y}" stroke="#2b1c10" stroke-width="3.6" stroke-linecap="round"/>`;
        g += `<line x1="199" y1="246" x2="${x - 1}" y2="${y}" stroke="#E2B86A" stroke-opacity=".35" stroke-width=".9" stroke-linecap="round"/>`;
      });
    }
    if (S.neck) g += `<rect x="${S.neck[0]}" y="${S.neck[1]}" width="${S.neck[2]}" height="${S.neck[3]}" fill="#fff0d7" fill-opacity=".1" stroke="#F3E9DA" stroke-opacity=".28"/>`;
    if (S.opaque) {
      g += `<path d="${S.outer}" fill="url(#${id}l)"/><path d="${S.outer}" fill="url(#${id}lg)" opacity=".55"/>`;
      g += `<path d="${S.outer}" fill="url(#${id}sd)"/><path d="${S.outer}" fill="none" stroke="#F3E9DA" stroke-opacity=".18"/>`;
    } else {
      g += `<path d="${S.outer}" fill="#fff0d7" fill-opacity=".07"/>`;
      g += `<path d="${S.inner}" fill="url(#${id}l)"/><path d="${S.inner}" fill="url(#${id}lg)"/>`;
      g += `<g clip-path="url(#${id}cl)"><rect x="${S.base[0]}" y="${S.base[1]}" width="${S.base[2]}" height="${S.base[3]}" fill="#ffecc8" fill-opacity=".12"/><rect x="${S.base[0]}" y="${S.base[1]}" width="${S.base[2]}" height="1" fill="#E2B86A" fill-opacity=".4"/></g>`;
      g += `<path d="${S.outer}" fill="url(#${id}sd)"/><path d="${S.outer}" fill="none" stroke="#F3E9DA" stroke-opacity=".32" stroke-width="1.2"/>`;
    }
    if (S.facets) g += `<path d="${S.facets}" stroke="#fff0d7" stroke-opacity=".14" fill="none"/>`;
    g += `<g clip-path="url(#${id}cl)"><g filter="url(#${id}f)">${stripe(S.hl, `url(#${id}h)`, 7)}${stripe(S.rim, `url(#${id}r)`, 4)}</g></g>`;
    if (S.label && o.name) g += label(S.label, o.name, o.sub);
    if (S.medal) {
      const [mx, my, mr] = S.medal;
      g += `<circle cx="${mx}" cy="${my}" r="${mr}" fill="#0e0a07" fill-opacity=".75" stroke="#E2B86A" stroke-opacity=".8" stroke-width=".8"/>`;
      g += `<text x="${mx}" y="${my + mr * 0.36}" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-size="${mr}" font-style="italic" fill="#E2B86A">R</text>`;
    }
    if (S.ring) g += `<rect x="${S.ring[0]}" y="${S.ring[1]}" width="${S.ring[2]}" height="${S.ring[3]}" rx="2" fill="url(#${id}c)"/><rect x="${S.ring[0]}" y="${S.ring[1]}" width="${S.ring[2]}" height="${S.ring[3]}" rx="2" fill="url(#${id}cs)"/>`;
    if (S.cap) g += `<g fill="url(#${id}c)">${S.cap}</g><g fill="url(#${id}cs)">${S.cap}</g>`;
    if (S.ribs) {
      const [x1, x2, y1, y2] = S.ribs;
      let d = '';
      for (let x = x1; x <= x2; x += 6) d += `M${x} ${y1}V${y2}`;
      g += `<path d="${d}" stroke="#000" stroke-opacity=".22" stroke-width="1"/>`;
    }
    return { defs, body: g, S };
  }

  /* Accessoires posés au sol (coordonnées de la scène 600 × 600, sol à y = 450) */
  const CHIPS = [[168, 476, 1, -12], [206, 494, 0.8, 20], [420, 472, 1.1, 8], [454, 490, 0.7, -25], [376, 504, 0.9, 35], [122, 500, 0.75, 10], [486, 468, 0.6, 60]];
  function chips(id) {
    return CHIPS.map(([x, y, s, r]) =>
      `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><ellipse cx="0" cy="6" rx="16" ry="3" fill="#000" opacity=".5"/><path d="M-15 -3 L-4 -9 L13 -5 L17 2 L4 7 L-13 5 Z" fill="url(#${id}wd)"/><path d="M-15 -3 L-4 -9 L13 -5" fill="none" stroke="#E2B86A" stroke-opacity=".45" stroke-width=".8"/></g>`
    ).join('');
  }
  function beads(id) {
    const P0 = [350, 514], P1 = [438, 446], P2 = [548, 486];
    const n = 15;
    let path = `<path d="M${P0} Q${P1} ${P2}" fill="none" stroke="#E2B86A" stroke-opacity=".35" stroke-width=".8"/>`;
    let b = '';
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const x = (1 - t) ** 2 * P0[0] + 2 * (1 - t) * t * P1[0] + t * t * P2[0];
      const y = (1 - t) ** 2 * P0[1] + 2 * (1 - t) * t * P1[1] + t * t * P2[1];
      b += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="url(#${id}bd)"/>`;
    }
    return `<g>${path}${b}</g>`;
  }
  const PETALS = [[178, 480, -20, 1], [214, 502, 30, 0.85], [404, 474, 15, 1.1], [446, 496, -35, 0.9], [146, 508, 50, 0.8]];
  function petals(id) {
    return PETALS.map(([x, y, r, s]) =>
      `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><ellipse rx="15" ry="7" fill="url(#${id}pt)"/><path d="M-11 0 Q0 -2 12 0" stroke="#F3E9DA" stroke-opacity=".18" fill="none" stroke-width=".7"/></g>`
    ).join('');
  }
  function smoke(id) {
    return `<g class="rw-smoke" filter="url(#${id}bm5)" opacity=".85">` +
      `<path d="M262 448 C246 400 284 360 266 312 S226 236 258 186 S300 110 268 40" stroke="url(#${id}sm)" stroke-width="14" fill="none" stroke-linecap="round"/>` +
      `<path d="M278 448 C294 406 266 366 288 322 S322 246 298 194 S258 120 292 50" stroke="url(#${id}sm)" stroke-width="8" fill="none" stroke-linecap="round"/>` +
      `</g>`;
  }
  function dune(id) {
    return `<path d="M0 420 C110 396 210 414 300 404 S500 374 600 394 V452 H0 Z" fill="url(#${id}dn)"/>` +
      `<path d="M0 420 C110 396 210 414 300 404 S500 374 600 394" fill="none" stroke="#E2B86A" stroke-opacity=".14"/>`;
  }

  /* Scène complète : fond, halo doré, sol, reflet, flacon, accessoires */
  function scene(opts) {
    const o = Object.assign({
      shape: 'square', liquid: 'oud', cap: 'gold', name: '', sub: 'MAISON RIWAHA',
      props: [], zoom: 1.12, cy: 300, halo: '#E2B86A', haloOpacity: 0.2, alt: '', reflection: true
    }, opts || {});
    const id = nid('rw');
    const B = bottle(o, id);
    const props = o.props || [];
    const vb = 600 / o.zoom;
    const vx = 300 - vb / 2;
    const vy = Math.max(0, Math.min(600 - vb, o.cy - vb / 2));

    const defs =
      `<radialGradient id="${id}bg" cx=".5" cy=".42" r=".7">${stops([[0, '#3f2b18'], [0.32, '#251910'], [0.68, '#140e0a'], [1, '#0a0705']])}</radialGradient>` +
      `<linearGradient id="${id}fl" x1="0" y1="0" x2="0" y2="1">${stops([[0, '#22180f'], [0.35, '#120c08'], [1, '#080504']])}</linearGradient>` +
      `<linearGradient id="${id}bm" x1="0" y1="0" x2="1" y2="1">${stops([[0, '#f6dc9c', 0.16], [0.6, '#E2B86A', 0.03], [1, '#E2B86A', 0]])}</linearGradient>` +
      `<radialGradient id="${id}vg" cx=".5" cy=".46" r=".72">${stops([[0.55, '#000', 0], [1, '#000', 0.62]])}</radialGradient>` +
      `<linearGradient id="${id}fd" gradientUnits="userSpaceOnUse" x1="0" y1="450" x2="0" y2="570">${stops([[0, '#fff', 0.55], [1, '#fff', 0]])}</linearGradient>` +
      `<mask id="${id}m" maskUnits="userSpaceOnUse" x="0" y="450" width="600" height="150"><rect x="0" y="450" width="600" height="150" fill="url(#${id}fd)"/></mask>` +
      BLUR(`${id}bz`, 42) + BLUR(`${id}bs`, 6) + BLUR(`${id}bm5`, 5) +
      `<linearGradient id="${id}wd" x1="0" y1="0" x2="1" y2="1">${stops([[0, '#6a3f1e'], [0.5, '#341c0c'], [1, '#140904']])}</linearGradient>` +
      `<radialGradient id="${id}bd" cx=".35" cy=".3" r=".75">${stops([[0, '#ffe6a8'], [0.3, '#d48d36'], [0.75, '#6a3410'], [1, '#2a1206']])}</radialGradient>` +
      `<radialGradient id="${id}pt" cx=".4" cy=".35" r=".8">${stops([[0, '#c85a55'], [0.6, '#7c2429'], [1, '#3a0e12']])}</radialGradient>` +
      `<linearGradient id="${id}sm" x1="0" y1="1" x2="0" y2="0">${stops([[0, '#F3E9DA', 0.32], [0.55, '#F3E9DA', 0.12], [1, '#F3E9DA', 0]])}</linearGradient>` +
      `<linearGradient id="${id}dn" x1="0" y1="0" x2="0" y2="1">${stops([[0, '#3d2a17', 0.6], [1, '#1a120c', 0.2]])}</linearGradient>` +
      B.defs;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx.toFixed(1)} ${vy.toFixed(1)} ${vb.toFixed(1)} ${vb.toFixed(1)}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(o.alt || o.name)}" focusable="false">` +
      `<defs>${defs}</defs>` +
      `<rect width="600" height="600" fill="url(#${id}bg)"/>` +
      `<circle cx="600" cy="0" r="230" fill="#2A1512" opacity=".75" filter="url(#${id}bz)"/>` +
      `<circle cx="0" cy="620" r="200" fill="#2A1512" opacity=".55" filter="url(#${id}bz)"/>` +
      `<ellipse cx="318" cy="285" rx="150" ry="185" fill="${o.halo}" opacity="${o.haloOpacity}" filter="url(#${id}bz)"/>` +
      `<polygon points="30,0 190,0 430,452 270,452" fill="url(#${id}bm)"/>` +
      (props.includes('dune') ? dune(id) : '') +
      `<rect x="0" y="450" width="600" height="150" fill="url(#${id}fl)"/>` +
      `<rect x="0" y="449.4" width="600" height="1.2" fill="#E2B86A" opacity=".14"/>` +
      `<ellipse cx="300" cy="456" rx="230" ry="16" fill="#E2B86A" opacity=".07" filter="url(#${id}bs)"/>` +
      (props.includes('smoke') ? smoke(id) : '') +
      (o.reflection ? `<g mask="url(#${id}m)" opacity=".42"><g transform="translate(0 900) scale(1 -1)"><use href="#${id}bt"/></g></g>` : '') +
      `<ellipse cx="300" cy="451" rx="${B.S.shadow}" ry="7" fill="#000" opacity=".75" filter="url(#${id}bs)"/>` +
      `<g id="${id}bt" transform="translate(100 50)">${B.body}</g>` +
      (props.includes('chips') ? chips(id) : '') +
      (props.includes('petals') ? petals(id) : '') +
      (props.includes('beads') ? beads(id) : '') +
      `<rect width="600" height="600" fill="url(#${id}vg)"/>` +
      `</svg>`;
  }

  /* Photo d'ambiance du rituel : brûle-parfum, fumée, bois, flacon dans l'ombre */
  function ritual() {
    const id = nid('rt');
    const B = bottle({ shape: 'facet', liquid: 'oud', cap: 'gold', name: 'Oud Al Malick', sub: 'MAISON RIWAHA' }, id + 'b');
    const brass = [[0, '#3a250e'], [0.2, '#8a6228'], [0.42, '#f6dc9c'], [0.55, '#d9ad5c'], [0.78, '#8a6228'], [1, '#24170a']];
    const tableChips = [[110, 606, 1.1, 14], [160, 628, 0.8, -30], [372, 616, 1, 40], [420, 640, 0.7, -10], [520, 604, 0.9, 22], [300, 652, 0.85, 5]];
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 720" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Bakhour qui fume dans un brûle-parfum en laiton, copeaux de bois et flacon dans la pénombre" focusable="false">` +
      `<defs>` +
      `<radialGradient id="${id}bg" cx=".42" cy=".6" r=".8">${stops([[0, '#3d2816'], [0.4, '#1d140d'], [0.75, '#0e0a07'], [1, '#070504']])}</radialGradient>` +
      `<linearGradient id="${id}wd" x1="0" y1="0" x2="0" y2="1">${stops([[0, '#5e381b'], [0.25, '#3a2010'], [1, '#150b04']])}</linearGradient>` +
      `<linearGradient id="${id}br" x1="0" y1="0" x2="1" y2="0">${stops(brass)}</linearGradient>` +
      `<linearGradient id="${id}bv" x1="0" y1="0" x2="0" y2="1">${stops([[0, '#fff', 0.22], [0.3, '#fff', 0], [0.6, '#000', 0], [1, '#000', 0.5]])}</linearGradient>` +
      `<radialGradient id="${id}co" cx=".5" cy=".5" r=".5">${stops([[0, '#fff4cf'], [0.25, '#ffc160'], [0.55, '#e0702a'], [0.85, '#7a2a0c'], [1, '#3a1206']])}</radialGradient>` +
      `<linearGradient id="${id}sm" gradientUnits="userSpaceOnUse" x1="0" y1="440" x2="0" y2="0">${stops([[0, '#F3E9DA', 0.5], [0.5, '#F3E9DA', 0.2], [1, '#F3E9DA', 0]])}</linearGradient>` +
      `<linearGradient id="${id}ch" x1="0" y1="0" x2="1" y2="1">${stops([[0, '#6a3f1e'], [0.5, '#341c0c'], [1, '#140904']])}</linearGradient>` +
      `<radialGradient id="${id}vg" cx=".45" cy=".55" r=".75">${stops([[0.5, '#000', 0], [1, '#000', 0.65]])}</radialGradient>` +
      BLUR(`${id}bz`, 50) + BLUR(`${id}b8`, 8) + BLUR(`${id}b5`, 5) + BLUR(`${id}b3`, 3) + BLUR(`${id}b2`, 2) +
      B.defs +
      `</defs>` +
      `<rect width="600" height="720" fill="url(#${id}bg)"/>` +
      `<circle cx="600" cy="0" r="260" fill="#2A1512" opacity=".8" filter="url(#${id}bz)"/>` +
      `<circle cx="0" cy="740" r="220" fill="#2A1512" opacity=".6" filter="url(#${id}bz)"/>` +
      `<ellipse cx="250" cy="430" rx="230" ry="260" fill="#E2B86A" opacity=".15" filter="url(#${id}bz)"/>` +
      `<ellipse cx="250" cy="440" rx="90" ry="44" fill="#ff9a3c" opacity=".38" filter="url(#${id}bz)"/>` +
      `<g class="rw-smoke rw-smoke--big">` +
      `<path d="M250 432 C236 396 270 366 252 326 S214 246 246 196 S300 118 260 54 S226 -10 254 -60" stroke="url(#${id}sm)" stroke-width="18" fill="none" stroke-linecap="round" filter="url(#${id}b8)"/>` +
      `<path d="M262 432 C280 400 256 364 276 322 S318 240 290 182 S240 102 282 30" stroke="url(#${id}sm)" stroke-width="10" fill="none" stroke-linecap="round" filter="url(#${id}b5)"/>` +
      `<path d="M240 432 C222 404 236 372 220 340 S190 270 212 222 S252 150 222 86" stroke="url(#${id}sm)" stroke-width="6" fill="none" stroke-linecap="round" filter="url(#${id}b3)"/>` +
      `</g>` +
      `<ellipse cx="454" cy="548" rx="68" ry="6" fill="#000" opacity=".8" filter="url(#${id}b5)"/>` +
      `<g transform="translate(330 298) scale(.62)" opacity=".92">${B.body}</g>` +
      `<path d="M0 562 L600 542 L600 720 L0 720 Z" fill="url(#${id}wd)"/>` +
      `<path d="M0 640 L600 628 L600 720 L0 720 Z" fill="#000" opacity=".38"/>` +
      `<path d="M0 562 L600 542" stroke="#f6dc9c" stroke-opacity=".3" stroke-width="1.2"/>` +
      `<g fill="none" stroke-width="1">` +
      `<path d="M0 578 C140 570 300 584 600 560" stroke="#000" stroke-opacity=".3"/>` +
      `<path d="M0 596 C180 586 340 600 600 578" stroke="#c98a4a" stroke-opacity=".12"/>` +
      `<path d="M0 614 C120 606 360 618 600 598" stroke="#000" stroke-opacity=".25"/>` +
      `<path d="M60 588 C160 582 220 592 320 586" stroke="#c98a4a" stroke-opacity=".1"/>` +
      `</g>` +
      `<ellipse cx="250" cy="560" rx="190" ry="22" fill="#E2B86A" opacity=".14" filter="url(#${id}b8)"/>` +
      `<ellipse cx="250" cy="556" rx="74" ry="8" fill="#000" opacity=".7" filter="url(#${id}b3)"/>` +
      `<g>` +
      `<path d="M196 556 L304 556 L290 528 L210 528 Z" fill="url(#${id}br)"/><path d="M196 556 L304 556 L290 528 L210 528 Z" fill="url(#${id}bv)"/>` +
      `<ellipse cx="250" cy="528" rx="40" ry="5" fill="url(#${id}br)"/>` +
      `<path d="M232 528 C236 510 238 498 236 484 L264 484 C262 498 264 510 268 528 Z" fill="url(#${id}br)"/><path d="M232 528 C236 510 238 498 236 484 L264 484 C262 498 264 510 268 528 Z" fill="url(#${id}bv)"/>` +
      `<path d="M176 436 L324 436 C320 462 300 482 250 486 C200 482 180 462 176 436 Z" fill="url(#${id}br)"/><path d="M176 436 L324 436 C320 462 300 482 250 486 C200 482 180 462 176 436 Z" fill="url(#${id}bv)"/>` +
      `<path d="M190 452 Q250 470 310 452" stroke="#2a1a08" stroke-opacity=".5" fill="none"/>` +
      `<path d="M198 464 Q250 478 302 464" stroke="#2a1a08" stroke-opacity=".35" fill="none" stroke-dasharray="2 5"/>` +
      `<ellipse cx="250" cy="436" rx="74" ry="11" fill="url(#${id}br)"/>` +
      `<ellipse cx="250" cy="436" rx="64" ry="8" fill="#1a0d05"/>` +
      `<ellipse cx="250" cy="435" rx="56" ry="6" fill="url(#${id}co)" filter="url(#${id}b2)"/>` +
      `<ellipse cx="250" cy="434" rx="40" ry="4" fill="#ffd27a" opacity=".55" filter="url(#${id}b5)"/>` +
      `<path d="M226 433 l6 -4 l7 2 l-2 4 Z M256 434 l7 -5 l8 3 l-4 4 Z M240 437 l5 -3 l6 2 l-3 3 Z" fill="#2a1406" stroke="#ffb35a" stroke-opacity=".7" stroke-width=".6"/>` +
      `<path d="M186 446 C188 462 200 474 214 480" stroke="#fff6e0" stroke-opacity=".45" stroke-width="3" fill="none" stroke-linecap="round" filter="url(#${id}b2)"/>` +
      `</g>` +
      tableChips.map(([x, y, s, r]) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><ellipse cx="0" cy="7" rx="17" ry="3" fill="#000" opacity=".5"/><path d="M-15 -3 L-4 -9 L13 -5 L17 2 L4 7 L-13 5 Z" fill="url(#${id}ch)"/><path d="M-15 -3 L-4 -9 L13 -5" fill="none" stroke="#E2B86A" stroke-opacity=".4" stroke-width=".8"/></g>`).join('') +
      `<rect width="600" height="720" fill="url(#${id}vg)"/>` +
      `</svg>`;
  }

  window.RiwahaVisuals = { scene, ritual };
})();
