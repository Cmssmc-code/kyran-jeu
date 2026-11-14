// Analyse calculée : répartition des 150 cartes de Skyjo (valeurs et effectifs relevés sur Wikipédia
// FR/DE, qui citent les règles de Magilano) et probabilités exactes qui en découlent.
// Usage : node scripts/analyses/skyjo-cartes.mjs
const effectifs = { '-2': 5, '-1': 10, 0: 15 };
for (let v = 1; v <= 12; v++) effectifs[v] = 10;

const total = Object.values(effectifs).reduce((a, b) => a + b, 0);
const somme = Object.entries(effectifs).reduce((a, [v, n]) => a + Number(v) * n, 0);
const C = (n, k) => { let r = 1; for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1); return r; };

const tripletIdentique = Object.values(effectifs).reduce((a, n) => a + C(n, 3), 0) / C(total, 3);
const pasDeNegatif = Object.entries(effectifs).filter(([v]) => Number(v) < 0).reduce((a, [, n]) => a + n, 0) / total;
const nonPositif = Object.entries(effectifs).filter(([v]) => Number(v) <= 0).reduce((a, [, n]) => a + n, 0) / total;

console.log({
  total, somme,
  moyenne: somme / total,
  grilleDe12: (12 * somme) / total,
  probTroisCartesIdentiques: tripletIdentique,
  unSurN: 1 / tripletIdentique,
  probCarteNegative: pasDeNegatif,
  probCarteNulleOuNegative: nonPositif,
  probMoinsDeux: 5 / total,
  cartesAHuitJoueurs: 8 * 12 + 1,
});
