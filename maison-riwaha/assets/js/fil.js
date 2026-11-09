/* ==========================================================================
   MAISON RIWAHA – Fil doré
   Un fil part de la ligne dorée de la barre de navigation et descend le long
   du bord gauche, en ondulant doucement (courbes de Bézier, ±25 px tous les
   600 px). Le tracé complet reste visible en fantôme ; par-dessus, un tracé
   plein se dessine pendant le défilement et s'arrête toujours à environ 25 %
   de la hauteur de l'écran, où brille un point doré.
   Aucune bibliothèque : SVG + JavaScript.
   ========================================================================== */
(function () {
  'use strict';

  var svg = document.querySelector('[data-fil]');
  if (!svg || !window.SVGPathElement || !SVGPathElement.prototype.getPointAtLength) return;

  var fantome = svg.querySelector('.fil__fantome');
  var trace = svg.querySelector('.fil__trace');
  var point = svg.querySelector('.fil__point');
  var halo = svg.querySelector('.fil__halo');
  var root = document.documentElement;

  var PAS = 600;           // une ondulation tous les 600 px
  var REPERE = 0.25;       // l'extrémité du tracé reste à 25 % de la hauteur de l'écran
  var longueur = 0, debutY = 0, derniere = -1;
  var attenteDefil = false, attenteMesure = false;

  /* Construit le chemin sur toute la hauteur du document */
  function mesurer() {
    attenteMesure = false;
    // Hauteur du document sans compter le fil lui-même
    svg.style.height = '0px';
    var H = Math.max(document.body.scrollHeight, root.scrollHeight);
    var mobile = root.clientWidth < 600;

    // Position du fil : à 100 px du bord si la place le permet, jamais sur le texte
    var x, amp;
    if (mobile) {
      x = 14; amp = 7;
    } else {
      var bloc = document.querySelector('main .container');
      var gauche = 100;
      if (bloc) gauche = bloc.getBoundingClientRect().left + parseFloat(getComputedStyle(bloc).paddingLeft);
      amp = 25;
      x = Math.max(34, Math.min(100, gauche - 50));
    }

    // Départ : la ligne dorée sous la barre de navigation
    var hauteurBarre = parseFloat(getComputedStyle(root).getPropertyValue('--header-h')) || 88;
    debutY = hauteurBarre;

    // Courbes de Bézier alternées à gauche et à droite.
    // Points de contrôle à amp / 0,75 : la courbe s'écarte alors d'exactement « amp ».
    var k = amp / 0.75;
    var d = 'M' + x + ' ' + debutY;
    var y = debutY, cote = 1;
    while (y < H - 1) {
      var h = Math.min(PAS, H - y);
      var cx = (x + cote * k * (h / PAS)).toFixed(1);
      d += ' C' + cx + ' ' + (y + h / 3).toFixed(1) + ',' + cx + ' ' + (y + 2 * h / 3).toFixed(1) + ',' + x + ' ' + (y + h).toFixed(1);
      y += h;
      cote = -cote;
    }

    svg.setAttribute('width', Math.ceil(x + amp + 40));
    svg.setAttribute('height', Math.ceil(H));
    svg.style.width = Math.ceil(x + amp + 40) + 'px';
    svg.style.height = Math.ceil(H) + 'px';
    fantome.setAttribute('d', d);
    trace.setAttribute('d', d);
    longueur = trace.getTotalLength();
    trace.style.strokeDasharray = longueur + ' ' + longueur;
    derniere = -1;
    dessiner();
  }

  /* Longueur du chemin à laquelle il atteint la hauteur « cible »
     (recherche dichotomique : le fil descend toujours, y croît avec la longueur) */
  function longueurA(cible) {
    if (cible <= debutY) return 0;
    var bas = 0, haut = longueur;
    for (var i = 0; i < 24 && haut - bas > 0.5; i++) {
      var milieu = (bas + haut) / 2;
      if (trace.getPointAtLength(milieu).y < cible) bas = milieu; else haut = milieu;
    }
    return (bas + haut) / 2;
  }

  /* Dessine le tracé jusqu'au repère et place le point lumineux */
  function dessiner() {
    attenteDefil = false;
    if (!longueur) return;
    var l = longueurA(window.pageYOffset + window.innerHeight * REPERE);
    if (Math.abs(l - derniere) < 0.4) return;
    derniere = l;
    trace.style.strokeDashoffset = String(longueur - l);
    var p = trace.getPointAtLength(l);
    point.setAttribute('cx', p.x.toFixed(1));
    point.setAttribute('cy', p.y.toFixed(1));
    halo.setAttribute('cx', p.x.toFixed(1));
    halo.setAttribute('cy', p.y.toFixed(1));
  }

  window.addEventListener('scroll', function () {
    if (!attenteDefil) { attenteDefil = true; requestAnimationFrame(dessiner); }
  }, { passive: true });

  function demanderMesure() {
    if (!attenteMesure) { attenteMesure = true; requestAnimationFrame(mesurer); }
  }
  window.addEventListener('resize', demanderMesure, { passive: true });
  // La hauteur de la page change aussi quand les photos se chargent,
  // quand on change de page dans la boutique ou qu'on déplie la Collection Privée
  if ('ResizeObserver' in window) new ResizeObserver(demanderMesure).observe(document.body);
  window.addEventListener('load', demanderMesure);

  mesurer();
})();
