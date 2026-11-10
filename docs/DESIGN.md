# Lease Auto — Direction artistique v2

Site jeune, net, fluide. Deux ambiances qui alternent :

- **Nuit** (`bg-night`, #070B14) : scènes immersives, héros de page, bandeaux forts, footer. Texte blanc, secondaire `text-white/65`.
- **Papier** (`bg-paper`, #F4F3EF) ou blanc : contenu, formulaires, listes. Texte `text-night`, secondaire `text-slate-600`.

Le rouge et le marine viennent du logo. Rien d'autre comme couleur de marque.

## Tokens

| Rôle | Classe Tailwind | Valeur |
|---|---|---|
| Rouge marque (boutons, accents) | `brand-primary` | #C41E20 |
| Rouge survol | `brand-primary-dark` | #A3181A |
| Rouge sur fond nuit (texte, petits accents) | `brand-primary-bright` | #F0343B |
| Fond rouge très clair | `brand-primary-soft` | #FBEAEA |
| Marine logo | `brand-ink` | #06325E |
| Marine profond | `brand-ink-deep` | #031F3C |
| Nuit | `night` | #070B14 |
| Papier | `paper` | #F4F3EF |
| Gris | `slate-*` uniquement | — |

Interdits : hex en dur dans les composants, `gray-*` / `neutral-*` / `zinc-*`, couleurs d'accent hors palette (ambre, violet, cyan…), dégradés rouge→rouge, ombres colorées « glow ». États : `emerald-600` (succès), `amber-600` (alerte), `red-500` (erreur de champ) seulement.

## Typographie

- Titres : **Bricolage Grotesque** (`font-display`), serrés. Corps : **Inter** (`font-sans`, défaut).
- Classes prêtes : `display-xl` (héros), `display-lg` (titre de section / h1 de page), `display-md` (sous-section), `lead` (chapô), `eyebrow` (sur-titre à pastille rouge ; ajouter `eyebrow-dark` sur fond nuit), `num` (chiffres tabulaires).
- Titres de carte : `font-display text-xl font-semibold`. Corps : `text-sm` ou `text-base`, `leading-relaxed`.
- Pas de `font-black`, pas de texte en dégradé (`bg-clip-text`), pas de capitales sur des phrases entières (réservé à `eyebrow`).

## Formes et surfaces

- Cartes : `surface` (blanc, bord fin, rayon 28 px), `surface-night`, `surface-glass` (sur image ou nuit). Rayon intérieur des médias : `rounded-[20px]`.
- Ombres : presque aucune. Au survol d'une carte cliquable : `hover:-translate-y-1` + `hover:border-slate-300`, c'est tout.
- Boutons : toujours `btn` + une variante (`btn-primary`, `btn-dark`, `btn-light`, `btn-ghost`, `btn-ghost-dark`) + taille optionnelle (`btn-sm`, `btn-lg`). Icône lucide à droite (souvent `ArrowUpRight` ou `ArrowRight`).
- Puces : `chip` / `chip-dark`. Champs : `field` (ou les composants shadcn, dont les variables sont alignées sur la DA).
- Mise en page : `container-x` (largeur max 1320 px + gouttières), `section` (padding vertical standard). Grilles « bento » bienvenues : cartes de tailles différentes sur 12 colonnes.

## Composants partagés (à réutiliser, ne pas recréer)

- `@/components/ui/PageHero` : en-tête nuit des pages intérieures, contient le `<h1>`. Toute page publique hors accueil commence par lui (il remonte tout seul sous le header flottant).
- `@/components/ui/SectionHeading` : sur-titre + titre + sous-titre + action, `tone="light" | "dark"`.
- `@/components/ui/Reveal` : apparition standard au scroll (une fois).
- `@/components/ui/Marquee` : bandeau défilant CSS.
- `@/components/sections/FooterSection` : pied de page, à placer en bas de chaque page publique.

## Mouvement

- Apparitions simples : `Reveal` ou `fadeUp` / `viewportOnce` / `stagger` de `@/lib/motion` (framer-motion). Une seule fois, jamais en boucle.
- Scènes liées au scroll (épinglage, défilement horizontal, parallaxe, scrub) : **GSAP ScrollTrigger**, importé depuis `@/lib/gsap` (`gsap`, `ScrollTrigger`, `useGSAP`, `MQ`). Toujours dans `useGSAP(() => { … }, { scope: ref })` avec `gsap.matchMedia()` : la scène n'existe que sous `MQ.motion` (et `MQ.desktop` si elle épingle) ; sinon rendu statique lisible.
- N'animer que `transform` et `opacity`. Pas de `scale` au survol au-delà de 1.02, pas de rotation gadget.
- Lenis gère l'inertie sur desktop ; ne jamais écrire `scroll-behavior: smooth`. Pour défiler vers une ancre : `getLenis()` de `@/lib/lenis`.

## Ton

Vouvoiement, phrases courtes, concrètes. Pas de superlatifs (« premium », « exceptionnel », « VIP »). Ne jamais inventer de chiffre, d'avis, de marque ou de service : réutiliser les textes et données déjà présents dans le code.

## Accessibilité

Un seul `<h1>` par page. Contraste AA (sur nuit, pas de texte en `brand-primary` : utiliser `brand-primary-bright` ou blanc). Cibles tactiles ≥ 44 px. Tout élément décoratif en `aria-hidden`. Le site reste entièrement lisible avec `prefers-reduced-motion`.
