# Images d'en-tête du blog : sources vectorielles

Chaque fichier `<slug>.svg` est la source d'une image d'en-tête de `blog/images/<slug>.jpg` (illustration vectorielle dans la direction artistique de KYRAN : gravure colorée, motifs africains, safran, terracotta, crème, noir encre). Dessinées en code, sans logo, sans texte, sans reprise d'une marque ou d'une illustration existante.

- `kyran_art.py` : petites fonctions de dessin partagées (palette, zigzags, cartes, éventails, filtre de bords irréguliers).
- `render.js` : exporte un SVG en PNG 1920 × 1080 avec Chromium (`node scripts/hero-art/render.js <slug>.svg <slug>.png`, nécessite `playwright`).
- Pour modifier une image : éditer le SVG, exporter en PNG, réduire à 1200 × 675 en JPEG (qualité 82) dans `blog/images/<slug>.jpg`, puis `node scripts/optimize-images.mjs` et annuler les autres WebP régénérés (`git ls-files -m | grep '\.webp$' | xargs git checkout --`).

Les neuf premières illustrations (Spiel des Jahres, As d'Or, jeux à 3 et 4 joueurs, cartes pour adultes, week-end en gîte, jeux comme Skyjo, grands groupes, article sur les études) ont été générées par IA : leur légende le dit, et elles n'ont pas de source SVG ici.
