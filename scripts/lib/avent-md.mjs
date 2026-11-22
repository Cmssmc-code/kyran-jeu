/**
 * Lecture de _notes/avent/defis.md (défis du calendrier de l'Avent écrits par le game designer).
 *
 * Format attendu pour chaque jour (voir le fichier) :
 *   ## Jour N
 *   - Niveau : …
 *   - Joueurs : 4
 *   - Cartes : 3
 *   - Donneur : toi | joueur 2 (…)
 *   - Mains :
 *     - Joueur 0 (toi) : m, n36, n2 (commentaire facultatif)
 *     - Joueur 1 : …
 *   - Question : Combien de plis fais-tu ?
 *   - Réponse : 1
 *   - Explication : …
 *   - Contrôle : …
 */
export function lireDefisMd(md) {
  const defis = [];
  const blocs = md.split(/^## Jour\s+/m).slice(1);
  for (const bloc of blocs) {
    const jour = Number(bloc.match(/^(\d+)/)[1]);
    const champ = nom => {
      const m = bloc.match(new RegExp('^- ' + nom + '\\s*:\\s*(.+)$', 'mi'));
      return m ? m[1].trim() : null;
    };
    const donneurTxt = (champ('Donneur') || '').toLowerCase();
    const donneur = donneurTxt.startsWith('toi') ? 0 : Number((donneurTxt.match(/joueur\s+(\d+)/) || [])[1]);
    const mains = {};
    for (const m of bloc.matchAll(/^\s+- Joueur (\d+)[^:]*:\s*(.+)$/gm)) {
      const liste = m[2].replace(/\s*\([^)]*\)\s*$/, '');
      mains[Number(m[1])] = liste.split(',').map(s => s.trim()).filter(Boolean);
    }
    defis.push({
      jour,
      niveau: champ('Niveau'),
      joueurs: Number(champ('Joueurs')),
      cartes: Number(champ('Cartes')),
      donneur,
      mains,
      reponse: Number(champ('Réponse')),
      explication: champ('Explication'),
      controle: champ('Contrôle')
    });
  }
  return defis;
}
