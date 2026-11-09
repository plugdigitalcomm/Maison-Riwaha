/* ==========================================================================
   MAISON RIWAHA – NDAKARU · Catalogue et réglages du site
   --------------------------------------------------------------------------
   C'est le seul fichier à modifier pour changer les produits, les prix,
   les photos, le numéro WhatsApp, les réseaux sociaux et les avis.
   Les prix sont en FCFA, sans espace : 35000 s'affiche « 35 000 FCFA ».
   ========================================================================== */

window.RIWAHA = {

  /* ---------- Réglages ---------- */
  config: {
    // Numéro WhatsApp au format international, sans « + » ni espaces.
    whatsapp: "221710110894",
    whatsappAffiche: "+221 71 011 08 94",

    // Message par défaut des boutons WhatsApp généraux
    message: "Bonjour Maison Riwaha, je souhaite commander un parfum.",

    // Réseaux sociaux (adresse complète). Laissez vide pour masquer l'icône.
    instagram: "https://instagram.com/maison_riwaha_ndakaru",
    instagramAffiche: "@maison_riwaha_ndakaru",
    tiktok: "",
    facebook: "",

    // Vidéo de la section « Le rituel » (format .mp4, jouée en boucle sans le son).
    // Laissez vide ("") pour afficher l'illustration dessinée à la place.
    videoRituel: "assets/video/bois-d-oud.mp4",
    // Seconde où la boucle repart au début, pour couper une fin indésirable
    // (par ex. un écran « Envoyer / Regarder à nouveau »). 0 = lire la vidéo jusqu'au bout.
    videoRituelFin: 0
  },

  /* ---------- La boutique ----------
     cat    : "homme", "femme", "mixte", "oriental", "huiles-maison"
              (les parfums « mixte » apparaissent aussi dans Homme et Femme)
     marque : la maison qui fabrique le parfum (sert à la recherche et à « Notre sélection »)
     image  : chemin de la photo dans assets/img/
              Nom en minuscules, sans espaces ni accents (ex. "assets/img/reef-33.jpg").
              Si la photo est absente, un flacon dessiné s'affiche à sa place.
     clair  : true pour une photo sur fond blanc (elle est assombrie pour l'ambiance)
     pos    : cadrage de la photo si besoin (ex. "center top")
     signature : les parfums mis en avant dans « La signature de la maison »   */
  products: [
    { name: "Reef 33", size: "100 ml", price: 35000, cat: ["homme"],
      desc: "Frais, boisé et élégant. Pour le travail, les rendez-vous pro et les soirées habillées.",
      tags: ["Boisé", "Homme", "Frais"], image: "assets/img/reef-33.jpg", clair: true,
      signature: { famille: "Boisé frais", accroche: "Frais, boisé et élégant.", accords: ["Boisé", "Frais"] } },

    { name: "Afnan Supremacy", marque: "Afnan", size: "50 ml", price: 55000, cat: ["homme"],
      desc: "Fruité, frais et légèrement fumé. Une présence affirmée qui suit du bureau jusqu'aux soirées.",
      tags: ["Fruité", "Homme", "Polyvalent"], image: "assets/img/afnan-supremacy.jpg", clair: true },

    { name: "Hawas BOA", size: "50 ml", price: 35000, cat: ["homme"],
      desc: "Aquatique et fruité, très rafraîchissant. Le parfum idéal sous la chaleur de Dakar.",
      tags: ["Aquatique", "Homme", "Été"], image: "assets/img/hawas-boa.jpg", clair: true },

    { name: "Club de Nuit Intense", size: "50 ml", price: 35000, cat: ["homme"],
      desc: "Agrumes, ananas et bouleau fumé. Puissant et tenace, un incontournable des sorties du soir.",
      tags: ["Fumé", "Homme", "Soirée"], image: "assets/img/club-de-nuit-intense.jpg" },

    { name: "Extrait Bleu de Chanel", marque: "Chanel", type: "Extrait", size: "20 ml", price: 35000, cat: ["homme"],
      desc: "La version la plus concentrée de Bleu de Chanel, en petit format à glisser dans la poche.",
      tags: ["Extrait", "Homme", "Format voyage"], image: "assets/img/bleu-de-chanel.jpg" },

    { name: "Oud Al Malik", size: "50 ml", price: 18000, cat: ["homme", "oriental"],
      desc: "Oud profond et résineux, au sillage royal. Pour les grandes occasions et les cérémonies.",
      tags: ["Oud", "Homme", "Oriental"], image: "assets/img/oud-al-malik.jpg",
      visual: { shape: "facet", liquid: "oud", cap: "gold" },
      signature: { famille: "Oud oriental", accroche: "Un oud profond, au sillage royal.", accords: ["Oud", "Résine"] } },

    { name: "Bleu de Chanel", marque: "Chanel", size: "100 ml", price: 170000, cat: ["homme"],
      desc: "Agrumes, encens et bois de cèdre. Le grand classique masculin, à l'aise du bureau aux soirées habillées.",
      tags: ["Boisé", "Homme", "Classique"], image: "assets/img/bleu-de-chanel.jpg" },

    { name: "Creed", marque: "Creed", size: "50 ml", price: 25000, cat: ["homme"],
      desc: "Parfum de caractère, classe et puissant. Pour marquer les esprits lors des grands événements.",
      tags: ["Luxe", "Homme", "Occasion"], image: "assets/img/creed.jpg" },

    { name: "Hugo Boss", marque: "Hugo Boss", size: "50 ml", price: 50000, cat: ["homme"],
      desc: "Moderne, propre et accessible. Pour le bureau, les sorties entre amis et le quotidien.",
      tags: ["Moderne", "Homme", "Quotidien"], image: "assets/img/hugo-boss.jpg" },

    { name: "Maison Massimo", size: "100 ml", price: 70000, cat: ["homme"],
      desc: "Élégant et affirmé, une signature de maison pour les grandes occasions.",
      tags: ["Élégant", "Homme", "Soirée"], image: "assets/img/maison-massimo.jpg", clair: true },

    { name: "Lattafa His Confession", marque: "Lattafa", size: "50 ml", price: 30000, cat: ["homme", "oriental"],
      desc: "Sillage charismatique et chaleureux, pensé pour marquer les esprits.",
      tags: ["Charismatique", "Homme", "Soirée"], image: "assets/img/lattafa-his-confession.jpg", clair: true },

    { name: "Madawi Gold", size: "50 ml", price: 150000, cat: ["mixte", "oriental"],
      desc: "Luxueux et enveloppant, une touche dorée pour les moments qui comptent.",
      tags: ["Luxueux", "Mixte", "Soirée"], image: "assets/img/madawi-gold.jpg",
      visual: { shape: "round", liquid: "or", cap: "gold" },
      signature: { famille: "Oriental doré", accroche: "Une touche dorée pour les moments qui comptent.", accords: ["Luxueux", "Doré"] } },

    { name: "Al Fareed", marque: "Arabian Oud", size: "100 ml", price: 140000, cat: ["mixte", "oriental"],
      desc: "Le oud oriental dans toute sa noblesse, boisé et profond.",
      tags: ["Oud", "Mixte", "Oriental"], image: "assets/img/al-fareed.jpg", clair: true },

    { name: "Oud Maracuja", size: "50 ml", price: 20000, cat: ["mixte", "oriental"],
      desc: "Oud velouté relevé d'une note fruitée et solaire de fruit de la passion.",
      tags: ["Oud", "Fruité", "Mixte"], image: "assets/img/oud-maracuja.jpg", clair: true },

    { name: "Amouage Purpose", marque: "Amouage", size: "50 ml", price: 280000, cat: ["mixte"],
      desc: "Parfumerie de niche, riche et raffinée, pour une présence inoubliable.",
      tags: ["Niche", "Mixte", "Prestige"], image: "assets/img/amouage-purpose.jpg", clair: true },

    { name: "Stronger With You", size: "100 ml", price: 90000, cat: ["homme"],
      desc: "Doux, épicé et gourmand. Un classique moderne, séduisant au quotidien.",
      tags: ["Gourmand", "Homme", "Quotidien"], image: "assets/img/stronger-with-you.jpg", clair: true },

    { name: "Vanilla Voyage", size: "50 ml", price: 30000, cat: ["mixte"],
      desc: "Vanille chaude et réconfortante, un voyage sensoriel tout en douceur.",
      tags: ["Vanille", "Mixte", "Doux"], image: "assets/img/vanilla-voyage.jpg", clair: true,
      visual: { shape: "square", liquid: "ambre", cap: "gold" },
      signature: { famille: "Vanille gourmande", accroche: "Un voyage sensoriel tout en douceur.", accords: ["Vanille", "Doux"] } },

    { name: "Amouage Guidance", marque: "Amouage", size: "100 ml", price: 280000, cat: ["mixte"],
      desc: "Opulent et sophistiqué, une création signature à l'élégance orientale.",
      tags: ["Niche", "Mixte", "Prestige"], image: "assets/img/amouage-guidance.jpg", clair: true },

    { name: "Tom Ford Oud Wood", marque: "Tom Ford", size: "50 ml", price: 50000, cat: ["homme"],
      desc: "Sophistiqué et audacieux, le luxe à l'américaine pour les soirées chic.",
      tags: ["Luxe", "Homme", "Soirée"], image: "assets/img/tom-ford-oud-wood.jpg", clair: true },

    { name: "Musamam", size: "100 ml", price: 25000, cat: ["mixte", "oriental"],
      desc: "Intense et addictif, un oriental puissant au sillage généreux.",
      tags: ["Oriental", "Mixte", "Intense"], image: "assets/img/musamam.jpg", clair: true },

    { name: "Callisto Iris Gourmand", size: "100 ml", price: 95000, cat: ["mixte"],
      desc: "Iris poudré et élégant, une fragrance délicate et distinguée.",
      tags: ["Iris", "Mixte", "Élégant"], image: "assets/img/callisto-iris-gourmand.jpg", clair: true },

    { name: "Asad Bourbon", marque: "Lattafa", size: "100 ml", price: 20000, cat: ["homme"],
      desc: "Notes chaudes et boisées rappelant le bourbon, pour un style affirmé.",
      tags: ["Boisé", "Homme", "Chaleureux"], image: "assets/img/asad-bourbon.jpg", clair: true },

    { name: "Amber Oud", size: "100 ml", price: 90000, cat: ["mixte", "oriental"],
      desc: "Ambre et oud réunis, un sillage riche, chaud et très présent.",
      tags: ["Ambre", "Oud", "Mixte"], image: "assets/img/amber-oud.jpg", clair: true },

    { name: "Liquid Brun", size: "100 ml", price: 30000, cat: ["homme"],
      desc: "Gourmand et sombre, un profil intense qui ne passe pas inaperçu.",
      tags: ["Gourmand", "Homme", "Intense"], image: "assets/img/liquid-brun.jpg", clair: true },

    { name: "Prada Milano", marque: "Prada", size: "50 ml", price: 57000, cat: ["mixte"],
      desc: "Sophistiqué, avec un sillage propre et chic. Pour les amateurs de fragrances raffinées.",
      tags: ["Chic", "Mixte", "Raffiné"], image: "assets/img/prada-milano.jpg" },

    { name: "Sauvage Dior", marque: "Dior", size: "50 ml", price: 45000, cat: ["homme"],
      desc: "Fraîcheur intense et notes épicées. Un classique pour les fans de parfums masculins modernes.",
      tags: ["Best-seller", "Homme", "Intense"], image: "assets/img/sauvage-dior.jpg" },

    { name: "Valentino", marque: "Valentino", size: "50 ml", price: 75000, cat: ["mixte"],
      desc: "Élégant avec une touche gourmande. Pour les soirées et les occasions spéciales.",
      tags: ["Luxe", "Mixte", "Soirée"], image: "assets/img/valentino.jpg" },

    { name: "Khamrah", size: "100 ml", price: 18000, cat: ["mixte", "oriental"],
      desc: "Oriental, chaud et gourmand. Notes sucrées, vanillées et épicées.",
      tags: ["Oriental", "Mixte", "Hiver"], image: "assets/img/khamrah.jpg", clair: true },

    { name: "Khamrah Dukhan", size: "100 ml", price: 20000, cat: ["mixte", "oriental"],
      desc: "Version fumée de Khamrah, avec un côté encens et oud plus marqué.",
      tags: ["Oud", "Fumé", "Intense"], image: "assets/img/khamrah-dukhan.jpg", clair: true },

    { name: "Lattafa", marque: "Lattafa", size: "100 ml", price: 19000, cat: ["mixte", "oriental"],
      desc: "Parfum arabe aux notes riches, pour ceux qui aiment les odeurs orientales marquées.",
      tags: ["Arabe", "Oriental", "Mixte"], image: "assets/img/lattafa.jpg" },

    { name: "Moussuf", size: "100 ml", price: 17000, cat: ["mixte", "oriental"],
      desc: "Boisé et ambré, apprécié pour son sillage long et chaleureux.",
      tags: ["Boisé", "Ambré", "Longue tenue"], image: "assets/img/moussuf.jpg", clair: true },

    { name: "Xaxati Exotic", size: "50 ml", price: 14000, cat: ["femme"],
      desc: "Fragrance colorée et exotique, pour celles qui aiment se démarquer.",
      tags: ["Féminin", "Exotique", "Coloré"], image: "assets/img/xaxati-exotic.jpg", clair: true },

    { name: "Hayaati", size: "100 ml", price: 16000, cat: ["mixte", "oriental"],
      desc: "Doux et moderne, pour le quotidien et les sorties détendues.",
      tags: ["Quotidien", "Mixte", "Moderne"], image: "assets/img/hayaati.jpg", clair: true },

    { name: "Rifaqaat", type: "Huile de parfum", size: "12 ml", price: 18000, cat: ["huiles-maison"],
      desc: "Huile concentrée, pour ceux qui aiment les parfums qui tiennent longtemps sur la peau.",
      tags: ["Huile", "Concentrée", "Longue tenue"], image: "assets/img/rifaaqat.jpg", clair: true },

    { name: "Huile de parfum concentrée", type: "Huile de parfum", size: "10 ml", price: 2000, cat: ["huiles-maison", "mixte"],
      desc: "Huile douce à appliquer par petites touches. Pour la prière, le travail ou la maison.",
      tags: ["Huile", "Mixte", "Discrète"], image: "assets/img/huile-parfum.jpg", pos: "82% center" },

    { name: "Diffuseur de parfum", type: "Diffuseur", size: "1 pièce", price: 10000, cat: ["huiles-maison"],
      desc: "Diffuseur élégant pour parfumer la maison ou le bureau en continu.",
      tags: ["Maison", "Ambiance", "Décoration"], image: "assets/img/diffuseur.jpg", pos: "center 20%", clair: true }
  ],

  /* ---------- Collection Privée (Paris) : prix unique ---------- */
  privee: {
    price: 10000,
    size: "50 ml",
    items: [
      { name: "Coco", image: "assets/img/cp/coco.jpg" },
      { name: "L'Interdit", image: "assets/img/cp/linterdit.jpg" },
      { name: "Sauvage", image: "assets/img/cp/sauvage.jpg" },
      { name: "Bleu Azur", image: "assets/img/cp/bleu-azur.jpg" },
      { name: "J'Adore", image: "assets/img/cp/jadore.jpg" },
      { name: "Opium", image: "assets/img/cp/opium.jpg" },
      { name: "Khamrah", image: "assets/img/cp/khamrah.jpg" },
      { name: "Yara", image: "assets/img/cp/yara.jpg" },
      { name: "Homme Intense", image: "assets/img/cp/homme-intense.jpg" },
      { name: "Kirke", image: "assets/img/cp/kirke.jpg" },
      { name: "Gris", image: "assets/img/cp/gris.jpg" },
      { name: "Madawi", image: "assets/img/cp/madawi.jpg" },
      { name: "Mula", image: "assets/img/cp/mula.jpg" },
      { name: "Erba", image: "assets/img/cp/erba.jpg" },
      { name: "Chronic", image: "assets/img/cp/chronic.jpg" },
      { name: "Beauté", image: "assets/img/cp/beaute.jpg" },
      { name: "Blue Magic", image: "assets/img/cp/blue-magic.jpg" },
      { name: "Alien", image: "assets/img/cp/alien.jpg" },
      { name: "Million", image: "assets/img/cp/million.jpg" },
      { name: "Solid", image: "assets/img/cp/solid.jpg" },
      { name: "Coco Vanille", image: "assets/img/cp/coco-vanille.jpg" },
      { name: "Krypto", image: "assets/img/cp/krypto.jpg" },
      { name: "Musc Blanc", image: "assets/img/cp/musc-blanc.jpg" },
      { name: "Aisha", image: "assets/img/cp/aisha.jpg" },
      { name: "Myla", image: "assets/img/cp/myla.jpg" }
    ]
  },

  /* ---------- Notre sélection : les maisons revendues ----------
     Le nombre de parfums est compté à partir du champ « marque » des produits.  */
  selection: [
    { name: "Chanel", origine: "Maison française" },
    { name: "Dior", origine: "Maison française" },
    { name: "Creed", origine: "Maison de niche" },
    { name: "Amouage", origine: "Maison omanaise" },
    { name: "Tom Ford", origine: "Maison américaine" },
    { name: "Prada", origine: "Maison italienne" },
    { name: "Valentino", origine: "Maison italienne" },
    { name: "Hugo Boss", origine: "Maison allemande" },
    { name: "Lattafa", origine: "Parfumerie orientale" },
    { name: "Afnan", origine: "Parfumerie orientale" },
    { name: "Arabian Oud", origine: "Parfumerie orientale" },
    { name: "Collection Privée", origine: "Paris · prix unique", lien: "#collection" }
  ],

  /* ---------- Section Tarifs ----------
     {min} et {max} sont remplacés par les prix réels des flacons de cette contenance,
     {n} par le nombre de modèles de la Collection Privée. */
  formats: [
    {
      titre: "Collection Privée", size: "50 ml", prixFixe: 10000, prefixe: "Prix unique",
      points: ["Le même prix pour les {n} modèles", "Tous en stock à Dakar", "Pour essayer une nouvelle signature sans se ruiner"],
      bouton: "Voir la collection", lien: "#collection"
    },
    {
      titre: "Le flacon 50 ml", size: "50 ml", vedette: true,
      points: ["Le format standard", "Plusieurs semaines d'usage quotidien", "De {min} à {max} FCFA selon le parfum"],
      bouton: "Voir les 50 ml", recherche: "50 ml"
    },
    {
      titre: "Le flacon 100 ml", size: "100 ml",
      points: ["Le format économique", "Quand vous avez trouvé votre signature", "De {min} à {max} FCFA selon le parfum"],
      bouton: "Voir les 100 ml", recherche: "100 ml"
    }
  ],

  /* ---------- Avis clients ----------
     N'affichez que de VRAIS avis, avec l'accord du client.
     Les trois avis ci-dessous viennent de l'ancienne version du site.
     S'ils sont réels, retirez les « // » devant chaque ligne pour les afficher.  */
  reviews: [
    // { texte: "Bleu de Chanel acheté chez Maison Riwaha, qualité au top et livraison rapide.", prenom: "Moustapha", quartier: "Dakar", parfum: "Bleu de Chanel" },
    // { texte: "J'ai pris Khamrah et une huile, parfait pour l'hiver, ça tient toute la journée.", prenom: "Aïssatou", quartier: "Rufisque", parfum: "Khamrah" },
    // { texte: "Service sérieux, bons conseils sur les parfums arabes comme Lattafa et Moussuf.", prenom: "Khadim", quartier: "Pikine" },
  ]
};
