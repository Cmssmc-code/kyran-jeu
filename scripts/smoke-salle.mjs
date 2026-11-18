// Smoke des parties entre amis : 3 clients, une salle, lancement, vue sans fuite.
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
let refus = false;
try { await post('/salle/lancer', { jeton: b.jeton, options: {} }); } catch (e) { refus = true; }
verifie(refus, 'un non-hôte ne peut pas lancer');
console.log('Smoke salle : tout est vert.');
