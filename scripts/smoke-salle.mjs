// Smoke des parties entre amis : 3 clients, une salle, lancement, vue sans fuite, flux temps réel, un coup.
// Une seule salle et un seul coup : léger pour la production, à lancer jeu allumé (voir _notes/partie-test-25-11.md).
// Usage : node scripts/smoke-salle.mjs [url]   (défaut : serveur Railway ; MULTI_ACTIF=1 requis côté serveur)
const API = (process.argv[2] || 'https://kyran-webhook-production.up.railway.app').replace(/\/$/, '');
const post = async (chemin, corps) => {
  const r = await fetch(API + chemin, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corps) });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`${chemin} → ${r.status} ${data.error || ''}`);
  return data;
};
const verifie = (ok, msg) => { if (!ok) throw new Error('ÉCHEC : ' + msg); console.log('ok  ' + msg); };

const statut = await fetch(API + '/salle/statut');
if (statut.status === 503) { console.log('Parties entre amis éteintes (MULTI_ACTIF absent) : rien à tester.'); process.exit(0); }
verifie(statut.ok, 'statut actif');

const a = await post('/salle/creer', { pseudo: 'SmokeA' });
const b = await post('/salle/rejoindre', { code: a.code, pseudo: 'SmokeB' });
const c = await post('/salle/rejoindre', { code: a.code, pseudo: 'SmokeC' });
verifie(new Set([a.jeton, b.jeton, c.jeton]).size === 3, '3 jetons distincts');
await post('/salle/lancer', { jeton: a.jeton, options: { vies: 3, niveau: 'novice' } });

const etats = await Promise.all([a, b, c].map(x => post('/salle/etat', { jeton: x.jeton })));
verifie(etats.every(e => e.statut === 'jeu'), 'partie lancée pour les 3');
etats.forEach((e, i) => {
  const mains = e.vue.players.filter(p => p.hand);
  const autres = e.vue.players.filter(p => p.id !== e.moi && p.hand && !e.vue.round.mystic);
  verifie(autres.length === 0, `client ${i} : aucune main adverse visible hors manche Mystique`);
  verifie(!JSON.stringify(e.vue).includes('"seed"') && !JSON.stringify(e.vue).includes('deck'), `client ${i} : pas de graine ni de pioche dans la vue (${mains.length} main)`);
});
// Flux temps réel : chaque client ouvre son flux, reçoit son état, puis voit le coup d'un autre.
const ouvrir = async x => {
  const { billet } = await post('/salle/billet', { jeton: x.jeton });
  const ctl = new AbortController();
  const rep = await fetch(`${API}/salle/flux?billet=${billet}`, { signal: ctl.signal });
  verifie(rep.status === 200, `client ${x.pid} : flux ouvert`);
  const f = { ctl, brut: '', etats: [] };
  const dec = new TextDecoder();
  (async () => {
    try {
      const lecteur = rep.body.getReader();
      for (;;) {
        const { value, done } = await lecteur.read();
        if (done) break;
        f.brut += dec.decode(value);
        f.etats = [...f.brut.matchAll(/event: etat\ndata: (.*)\n\n/g)].map(m => JSON.parse(m[1]));
      }
    } catch { /* flux fermé en fin de smoke */ }
  })();
  return f;
};
const attendre = async (cond, quoi) => {
  const fin = Date.now() + 8000;
  while (!cond() && Date.now() < fin) await new Promise(r => setTimeout(r, 50));
  verifie(cond(), quoi);
};
const clients = [a, b, c];
const flux = await Promise.all(clients.map(ouvrir));
await attendre(() => flux.every(f => f.etats.length > 0), 'les 3 clients reçoivent leur état par le flux');
flux.forEach((f, i) => {
  const e = f.etats[f.etats.length - 1];
  verifie(e.moi === clients[i].pid, `flux ${i} : état du siège ${clients[i].pid}`);
  verifie(!clients.some(x => f.brut.includes(x.jeton)), `flux ${i} : aucun jeton dans le flux`);
  verifie(!e.vue.players.some(p => p.id !== e.moi && p.hand && !e.vue.round.mystic), `flux ${i} : aucune main adverse dans le flux`);
});
// Un coup : le joueur dont c'est le tour parie 0 (ou 1 si 0 est interdit) ; les 3 flux reçoivent un état plus récent.
const tour = etats[0].vue.pending;
if (tour && tour.type === 'bet') {
  const seqAvant = flux.map(f => f.etats[f.etats.length - 1].seq);
  let coup;
  for (const value of [0, 1]) {
    try { coup = await post('/salle/action', { jeton: clients[tour.pid].jeton, action: { type: 'bet', value } }); break; } catch (e) { /* pari interdit : on essaie l'autre */ }
  }
  verifie(!!coup, 'un pari accepté par le serveur');
  await attendre(() => flux.every((f, i) => f.etats[f.etats.length - 1].seq > seqAvant[i]), 'les 3 clients voient le coup dans leur flux');
} else {
  console.log('ok  (début de manche sans pari : coup non joué, flux déjà vérifiés)');
}
flux.forEach(f => f.ctl.abort());
let refus = false;
try { await post('/salle/lancer', { jeton: b.jeton, options: {} }); } catch (e) { refus = true; }
verifie(refus, 'un non-hôte ne peut pas lancer');
console.log('Smoke salle : tout est vert.');
