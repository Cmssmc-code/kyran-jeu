/**
 * Minuteries des salles (étape 2). Une seule fonction `tick()` appelée une fois par seconde :
 * elle fait jouer les ordinateurs, applique les délais, remplace les absents, passe l'hôte
 * et ferme les salles périmées. Tout est piloté par l'horloge injectée : les tests avancent
 * le temps sans attendre.
 *
 * Chaque salle est traitée dans son propre try/catch : une erreur est signalée (`onErreur`)
 * et la salle est fermée, sans jamais toucher aux autres ni au processus.
 */
export const DELAIS = Object.freeze({
  coupMs: 60_000, // un humain a 60 s par coup, puis l'ordinateur joue pour lui
  penseeOrdiMs: 1_200, // pause avant la décision d'un ordinateur (pour que le tour se lise)
  suivantMs: 20_000, // « Révéler » / « Suivant » joués d'office après 20 s
  suivantRapideMs: 1_500, // idem quand plus aucun humain n'est aux commandes
  decoRemplaceMs: 45_000, // humain déconnecté depuis 45 s : l'ordinateur le remplace
  hoteMs: 60_000, // hôte absent du salon depuis 60 s : l'hôte passe au suivant
  attenteMs: 30 * 60_000, // salon abandonné
  finieMs: 10 * 60_000, // partie finie : la salle disparaît
  sansHumainMs: 10 * 60_000, // partie sans aucun humain connecté
  absolueMs: 3 * 60 * 60_000 // plafond de vie d'une salle
});

export function createTemps({ salles, now = Date.now, onChange = () => {}, onClose = () => {}, onErreur = () => {}, delais = DELAIS } = {}) {
  const { salles: map } = salles._interne;

  const humainsConnectes = salle => salle.sieges.filter(s => s.humain && s.flux > 0).length;

  function traiter(salle) {
    const t = now();
    const code = salle.code;
    if (t - salle.creee > delais.absolueMs) return fermerSalle(code, 'duree');
    if (salle.statut === 'attente') {
      if (t - salle.activite > delais.attenteMs) return fermerSalle(code, 'abandon');
      const hote = salle.sieges[salle.hote];
      if (hote && hote.flux === 0 && hote.decoDepuis != null && t - hote.decoDepuis > delais.hoteMs) {
        const suivant = salle.sieges.find(s => s.humain && s.flux > 0);
        if (suivant) {
          salle.hote = suivant.pid;
          onChange(code);
        }
      }
      return;
    }
    if (salle.statut === 'finie') {
      if (t - (salle.dernierCoup || salle.activite) > delais.finieMs) fermerSalle(code, 'finie');
      return;
    }
    // statut « jeu »
    let change = false;
    for (const sg of salle.sieges) {
      if (sg.humain && !sg.remplace && sg.flux === 0 && sg.decoDepuis != null && t - sg.decoDepuis > delais.decoRemplaceMs) {
        sg.remplace = true;
        change = true;
      }
    }
    const connectes = humainsConnectes(salle);
    if (connectes === 0) {
      const dernier = Math.max(salle.dernierCoup || 0, ...salle.sieges.map(s => s.decoDepuis || 0));
      if (t - dernier > delais.sansHumainMs) return fermerSalle(code, 'sans-humain');
    }
    const pend = salle.state.pending;
    if (pend) {
      const attente = t - salle.dernierCoup;
      const sg = pend.pid != null ? salle.sieges[pend.pid] : null;
      const siegeOrdi = sg && (!sg.humain || sg.remplace);
      let evenements = null;
      if (pend.type === 'reveal' || pend.type === 'next') {
        const seuil = connectes === 0 ? delais.suivantRapideMs : delais.suivantMs;
        if (attente >= seuil) evenements = salles.avancer(code);
      } else if (siegeOrdi) {
        if (attente >= delais.penseeOrdiMs) evenements = salles.avancer(code);
      } else if (attente >= delais.coupMs) {
        evenements = salles.avancer(code, { force: true });
      }
      if (evenements) change = true;
    }
    if (change) onChange(code);
  }

  function fermerSalle(code, raison) {
    salles.fermer(code);
    onClose(code, raison);
  }

  /** À appeler chaque seconde. Renvoie le nombre de salles encore ouvertes. */
  function tick() {
    for (const salle of [...map.values()]) {
      try {
        traiter(salle);
      } catch (err) {
        try {
          onErreur(err, salle.code);
        } finally {
          fermerSalle(salle.code, 'erreur');
        }
      }
    }
    return map.size;
  }

  return { tick };
}
