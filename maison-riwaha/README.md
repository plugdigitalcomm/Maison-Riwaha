# Maison Riwaha – Ndakaru · site e-commerce

Site statique (HTML, CSS, JavaScript), sans base de données ni compilation, avec un
**espace admin** sur **https://maisonriwaha.com/admin** pour gérer les parfums, les photos et le stock.

```
maison-riwaha/
├── index.html              la page
├── admin/                  l'espace admin :
│   ├── index.html + config.yml   admin complet (Decap CMS), pour ordinateur
│   └── mobile.html               gestion rapide, pour téléphone
├── data/                   ⟵ LE catalogue, modifié depuis l'admin :
│   ├── parfums.js              parfums : prix, photos, stock, signature…
│   ├── collection-privee.js    Collection Privée : prix unique, modèles, stock
│   ├── reglages.js             WhatsApp, réseaux sociaux, vidéo du rituel
│   ├── selection.js            « Notre sélection » (marques)
│   ├── tarifs.js               section Tarifs
│   └── avis.js                 avis clients
├── assets/css/style.css    l'identité visuelle (couleurs, typographies, animations)
├── assets/js/app.js        affichage du catalogue, stock, panier, commande WhatsApp, menu
├── assets/js/visuals.js    les flacons dessinés (affichés quand une photo manque)
├── assets/js/fil.js        le fil doré qui descend de la barre de navigation et se dessine au défilement
├── assets/img/             les photos (et cp/ pour la Collection Privée)
├── assets/video/           la vidéo de la section « Le rituel »
├── netlify.toml            réglages Netlify
├── robots.txt, sitemap.xml pour Google
└── favicon.*, apple-touch-icon.png   l'icône du site
```

## Sur téléphone : la gestion rapide

Ouvrez **maisonriwaha.com/admin** sur votre téléphone : vous arrivez directement sur la
**gestion rapide** (`/admin/mobile.html`), pensée pour l'écran tactile.
Astuce : ajoutez-la à l'écran d'accueil (menu du navigateur → « Ajouter à l'écran d'accueil »).

- **Connexion** : « Se connecter avec GitHub » (la même connexion que l'admin complet).
- **Stock** : boutons − et + sur chaque parfum. Champ vide (∞) = non suivi, 0 = rupture.
  Les filtres montrent d'un coup les parfums **en rupture** ou en **stock faible** (1 à 3).
- **Modifier** : touchez un parfum → fiche plein écran (photo, nom, marque, contenance, prix,
  stock, catégories, description, étiquettes) → **Valider**. On peut aussi y supprimer un parfum.
- **Ajouter un parfum** : bouton **+ Ajouter un parfum** → prenez la photo avec l'appareil ou
  choisissez-la dans la galerie. Elle est **réduite automatiquement** (moins de 300 Ko environ).
- **Collection Privée** : deuxième onglet, même principe (nom, photo, stock).
- Vos changements s'accumulent : la barre du bas indique « Modifications non enregistrées ».
  Touchez **Enregistrer** : le site est à jour **en environ 1 minute**. **Annuler** revient à la
  dernière version enregistrée.

Les avis, réglages (WhatsApp, vidéo…), marques et tarifs se modifient dans l'admin complet,
plus confortable sur ordinateur. Pour l'ouvrir quand même sur téléphone : `maisonriwaha.com/admin/?complet`.

## L'espace admin complet (ordinateur)

Allez sur **maisonriwaha.com/admin** → **Se connecter avec GitHub**.
Chaque fois que vous cliquez sur **Publier → Publier maintenant**, la modification est enregistrée
sur GitHub et Netlify remet le site à jour tout seul : **comptez environ 1 minute**, puis rechargez
le site pour la voir.

### Ajouter un parfum

**Boutique → Parfums** → **Ajouter parfum** (en haut de la liste), remplissez la fiche :

- **Nom, marque, contenance** (« 50 ml », « 100 ml »…), **prix** en chiffres (35000).
- **Catégories** : Homme, Femme, Mixte (apparaît aussi dans Homme et Femme), Oriental, Huiles et maison.
- **Description** : 2 ou 3 phrases courtes. **Étiquettes** : 3 mots (Boisé, Homme, Soirée).
- **Photo** : cliquez pour l'envoyer depuis votre téléphone ou ordinateur.
  - JPG, PNG ou WebP. **Pas de HEIC** (format par défaut des iPhone) : dans les réglages de
    l'appareil photo, choisissez « Le plus compatible », ou faites une capture d'écran.
  - **Idéalement moins de 300 Ko** : une photo de téléphone pèse souvent 3 à 5 Mo et ralentit le
    site. Réduisez-la avant (par exemple sur squoosh.app, gratuit).
  - Nom de fichier simple, sans espaces ni accents : `khamrah.jpg`.
  - **Photo sur fond blanc** : cochez la case, elle sera assombrie pour l'ambiance du site.
- **Signature de la maison** (facultatif) : remplissez famille et accroche pour mettre le parfum
  en avant dans « La signature de la maison » (4 conseillés).

Puis **Publier → Publier maintenant**.

### Gérer le stock

Dans chaque fiche, le champ **Stock (nombre de flacons)** :

| Valeur | Sur le site |
|---|---|
| vide | stock non suivi : toujours disponible |
| 4 et plus | disponible |
| 1 à 3 | pastille « Plus que 2 » ; le panier est limité à ce nombre |
| 0 | « Rupture de stock » : le parfum reste visible (en fin de liste), ne peut plus être commandé, et le bouton devient « Me prévenir » (message WhatsApp prêt) |

Les commandes passant par WhatsApp, **le site ne peut pas décompter les ventes tout seul** :
après chaque vente, baissez le stock dans l'admin. Même chose pour la Collection Privée
(**Boutique → Collection Privée**, un stock par modèle).

### Le reste

- **Avis clients** : uniquement de vrais avis, avec l'accord du client. Tant que la liste est vide,
  la section invite à envoyer un avis sur WhatsApp. (Les trois avis de l'ancien site, Moustapha,
  Aïssatou et Khadim, sont dans `ancien-catalogue.js`, à côté du dossier du site.)
- **Réglages du site → Contact, réseaux et vidéo** : numéro WhatsApp, Instagram, TikTok, Facebook,
  vidéo du rituel et seconde où sa boucle repart (0 = jusqu'au bout).
- **Réglages du site → Notre sélection** : les marques. Écrivez-les exactement comme le champ
  « Marque » des parfums : leur nombre est compté tout seul.
- **Réglages du site → Tarifs** : les trois formats. Dans les points, `{min}` et `{max}` deviennent
  les prix mini et maxi de la contenance, `{n}` le nombre de modèles de la Collection Privée.

**Le carrousel de l'accueil** présente les parfums « Signature de la maison » (coups de cœur)
qui sont en stock, en commençant par Oud Al Malik : pour y ajouter un parfum, remplissez sa
signature dans l'admin. Il défile tout seul toutes les 3 secondes (réglage `DELAI` dans
`assets/js/app.js`), s'arrête au survol de la souris, et se pilote avec les flèches, les points,
le balayage du doigt ou les touches ← →. Le bouton ❚❚ sous les points l'arrête ; il ne défile pas
tout seul pour les visiteurs qui ont demandé moins d'animations à leur téléphone ou ordinateur.

Se met à jour tout seul : filtres, recherche, tri, pagination (12 parfums par page), prix
« à partir de », nombre de modèles, comptage des marques. Pour changer le nombre de parfums par
page : `PER_PAGE` dans `assets/js/app.js`.

## Mettre en place l'espace admin (une seule fois)

L'admin enregistre ses modifications dans un **dépôt GitHub** (gratuit), que Netlify publie.
Faites-le **après** avoir acheté et branché maisonriwaha.com (voir plus bas).

### 1. Mettre le site sur GitHub

1. Créez un compte sur **github.com** (gratuit).
2. **New repository** → nom : `maison-riwaha` → **Private** → **Create repository**.
3. Sur la page du dépôt : **uploading an existing file** (ou Add file → Upload files).
   Ouvrez le dossier `maison-riwaha` sur votre ordinateur, sélectionnez **tout son contenu**
   (pas le dossier lui-même : `index.html`, `admin`, `assets`, `data`…) et glissez-le dans la page.
   Cliquez **Commit changes**. (Plus de 100 fichiers ? Envoyez-les en deux fois.)
4. Dans le dépôt, ouvrez `admin/config.yml` → icône crayon, et remplacez
   `VOTRE-COMPTE-GITHUB/maison-riwaha` par votre nom d'utilisateur GitHub suivi de `/maison-riwaha`
   (par exemple `riwaha-dakar/maison-riwaha`). **Commit changes**.

### 2. Relier Netlify à GitHub

1. app.netlify.com → votre site → **Site configuration** → **Build & deploy** →
   **Link repository** (« Link site to Git ») → GitHub → autorisez → choisissez `maison-riwaha`.
2. Laissez **Build command** vide et **Publish directory** sur `.` (le fichier `netlify.toml`
   le précise déjà) → **Deploy**.
3. À partir de là, **ne glissez plus le dossier dans Netlify** : chaque modification passe par
   l'admin (ou par GitHub), et Netlify publie tout seul.

### 3. Autoriser la connexion à l'admin (GitHub OAuth)

1. Sur GitHub : photo de profil → **Settings** → **Developer settings** → **OAuth Apps** →
   **New OAuth App** :
   - Application name : `Maison Riwaha Admin`
   - Homepage URL : `https://maisonriwaha.com`
   - Authorization callback URL : `https://api.netlify.com/auth/done`
   → **Register application**. Notez le **Client ID**, puis **Generate a new client secret**
   et copiez-le (il ne s'affiche qu'une fois).
2. Sur Netlify : votre site → **Site configuration** → **Access & security** → **OAuth** →
   **Install provider** → **GitHub** → collez le Client ID et le Client secret → **Install**.

### 4. Première connexion

Allez sur **maisonriwaha.com/admin** → **Se connecter avec GitHub** → autorisez. C'est prêt,
sur ordinateur comme sur téléphone (la gestion rapide utilise la même connexion).
Seules les personnes ayant accès à votre dépôt GitHub peuvent modifier le site : pour qu'un
associé gère le stock, invitez son compte GitHub dans le dépôt (Settings → Collaborators).

## Voir le site en local

Double-cliquez sur `index.html` : le site s'ouvre dans votre navigateur, photos et panier compris.
Il affiche le catalogue **de ce dossier** : les modifications faites dans l'admin sont sur GitHub
et en ligne, pas sur votre ordinateur. Pour voir la dernière version, regardez le site en ligne.

Les fichiers `data/*.js` sont du JSON entouré de deux lignes, pour que le navigateur les accepte
même en double-clic. Modifiez-les plutôt depuis l'admin ; à la main, ne touchez qu'à la partie
entre `{` et `}` et gardez les deux premières lignes et la dernière `);`.
Les chemins de photos peuvent commencer par `/` (c'est ce qu'écrit l'admin) : le site les adapte.

## Nom de domaine et référencement (Google)

Le site est préparé pour l'adresse **https://maisonriwaha.com** : adresse officielle (canonical),
aperçu de partage WhatsApp/Facebook, fiche boutique pour Google, `robots.txt` et `sitemap.xml`.
L'admin (`/admin/`) est exclu de Google.

### 1. Acheter et brancher maisonriwaha.com

1. app.netlify.com → votre site → **Domain management** → **Add a domain**.
2. Tapez `maisonriwaha.com` et achetez-le (paiement par carte Visa ou Mastercard, une quinzaine
   de dollars par an ; le prix exact s'affiche avant de payer).
3. Netlify relie le domaine et active le cadenas HTTPS tout seul (gratuit, quelques minutes à
   quelques heures). Vérifiez que `maisonriwaha.com` est le **Primary domain** : l'ancienne
   adresse en netlify.app redirigera automatiquement vers la nouvelle.
4. Activez le **renouvellement automatique** : un domaine expiré, c'est un site hors ligne.

Vous pouvez aussi l'acheter ailleurs (Namecheap, OVH, Porkbun…) puis suivre, dans Netlify,
les instructions « Add a domain you already own » pour le relier.

### 2. Google Search Console : apparaître dans Google

1. search.google.com/search-console → **Ajouter une propriété** → **Domaine** → `maisonriwaha.com`.
2. Google affiche un enregistrement **TXT** : ajoutez-le dans Netlify
   (Domain management → DNS settings → Add new record → type TXT), puis cliquez « Valider ».
3. Menu **Sitemaps** → saisissez `sitemap.xml` → **Envoyer**.
4. **Inspection de l'URL** → `https://maisonriwaha.com/` → **Demander l'indexation**.

Comptez de quelques jours à quelques semaines avant d'apparaître dans les résultats.

### 3. Fiche Google Business Profile : le plus efficace pour « parfum Dakar »

C'est elle qui apparaît sur Google Maps et en haut des recherches locales.
business.google.com → créez la fiche « Maison Riwaha – Ndakaru », catégorie **Parfumerie**,
zone desservie **Dakar** (pas besoin d'afficher une adresse si vous livrez), téléphone WhatsApp,
lien vers maisonriwaha.com, photos des flacons. Ensuite, demandez à chaque client satisfait
de laisser un avis Google : c'est ce qui fait monter la fiche.

### 4. Faire connaître l'adresse

Mettez `maisonriwaha.com` dans la bio Instagram, le profil WhatsApp Business, vos statuts,
et sur vos sacs ou cartes. Chaque lien vers le site aide Google à lui faire confiance.

### Si l'adresse, le téléphone ou Instagram changent

Le domaine est écrit dans `index.html` (canonical, og:url, og:image et la fiche boutique en
bas de l'en-tête), `robots.txt`, `sitemap.xml` et `admin/config.yml`. Le téléphone et Instagram
se changent dans l'admin (Réglages du site), et aussi dans la fiche boutique de `index.html`.

## Comment fonctionne la commande

Le panier est gardé dans le navigateur du client. « Valider la commande sur WhatsApp » ouvre une
conversation avec le +221 71 011 08 94 et ce message déjà rempli :

```
Bonjour Maison Riwaha, je souhaite commander :

• 1 × Oud Al Malik · 50 ml : 18 000 FCFA
• 1 × Coco (Collection Privée) · 50 ml : 10 000 FCFA

Total : 28 000 FCFA (hors livraison)

Nom :
Quartier / adresse de livraison :
Paiement : Wave / Orange Money / espèces à la livraison

Jërëjëf !
```
