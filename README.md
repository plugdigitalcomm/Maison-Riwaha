# Maison Riwaha – Ndakaru · site e-commerce

Site statique (HTML, CSS, JavaScript), sans base de données ni compilation.
Ouvrez `index.html` dans un navigateur pour le voir.

```
maison-riwaha/
├── index.html              la page
├── assets/css/style.css    l'identité visuelle (couleurs, typographies, animations)
├── assets/js/catalogue.js  ⟵ LE fichier à modifier : produits, prix, photos, WhatsApp, avis
├── assets/js/visuals.js    les flacons dessinés (affichés quand une photo manque)
├── assets/js/app.js        panier, filtres, commande WhatsApp, menu mobile
└── assets/img/             les photos des produits (et cp/ pour la Collection Privée)
```

## Photos à ajouter

Ces 20 photos sont utilisées par votre site actuel mais n'étaient pas dans le zip.
Copiez-les dans `assets/img/` avec **exactement** ces noms (majuscules et espaces compris) :

```
Reef 33.jpg              Afnan Supremacy.jpg      Hawas BOA.jpg
Club de Nuit Intense.jpg Oud al Malik.jpg         Maison Massimo.jpg
Lattafa His Confession.jpg  Madawi Gold.jpg       Arabian Oud.jpg
Oud maracuja.jpg         Amouage.jpg              Stronger With You.jpg
Vanilla voyage.jpg       amouage Guidance.jpg     Tom Ford.jpg
Musamam.jpg              Callisto Iris.jpg        Asas Bourbon.jpg
Amber Oud.jpg            LIQUID BRUN.jpg
```

Le plus simple : copiez tout le dossier `assets/img` de votre site actuel par-dessus celui-ci.
Tant qu'une photo manque, un flacon dessiné s'affiche à sa place, sans image cassée.

## Modifier le catalogue

Tout se fait dans `assets/js/catalogue.js` :

- **Prix, descriptions, catégories** : un bloc `{ … }` par produit.
  Catégories possibles : `homme`, `femme`, `mixte`, `oriental`, `huiles-maison`.
  Les parfums `mixte` apparaissent aussi dans les filtres Homme et Femme.
- **Photo sur fond blanc** : ajoutez `clair: true`, elle sera assombrie pour l'ambiance du site.
- **Marque** (`marque: "Lattafa"`) : sert à la recherche et à la section « Notre sélection ».
- **La signature de la maison** : les produits qui ont un champ `signature`.
- **Collection Privée** : le prix unique (`privee.price`) et la liste des 25 modèles.
- **WhatsApp et Instagram** : en haut du fichier, dans `config`.

Les filtres, la recherche, le tri, le panier et les prix « à partir de » se mettent à jour tout seuls.

## Avis clients

Les trois avis de l'ancienne version du site (Moustapha, Aïssatou, Khadim) sont dans `reviews`,
désactivés par des `//`. S'il s'agit de vrais clients, retirez les `//` pour les afficher.
Tant que la liste est vide, la section invite les clients à envoyer leur avis sur WhatsApp.

## Voir le site en local

Double-cliquez sur `index.html`, ou lancez un petit serveur dans ce dossier :

```
node serve.js        (votre script, puis ouvrez http://localhost:5178)
```

## Mettre en ligne

Glissez le dossier sur app.netlify.com/drop, ou remplacez les fichiers de votre site Netlify actuel.

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
