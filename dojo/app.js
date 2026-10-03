/*
 * Dojo KYRAN — interface (parcours des ceintures, partie libre, Sensei, animations).
 * Les règles vivent dans engine.js, les adversaires et conseils dans ai.js, les leçons dans
 * lessons.js. Ce fichier ne fait qu'afficher l'état et transmettre les choix du joueur.
 */
import * as E from './engine.js?v=617bc536b5';
import * as AI from './ai.js?v=20cbd41c06';
import { LESSONS, BELT_COLORS } from './lessons.js?v=600cf92b76';

const ROOT = document.getElementById('dojo');

// ── Préférences et progression (stockage local, facultatif) ────────────────

const STORE_KEY = 'kyran-dojo-v2';
const DEFAULT_STORE = {
  belts: {},
  stats: { games: 0, wins: 0, bets: 0, exact: 0, streak: 0, bestStreak: 0 },
  settings: { speed: 'normal', sound: false, hints: true, opponents: 3, level: 'adepte', length: 'rapide', rules: 'completes' }
};
let store = loadStore();

function loadStore() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (raw && typeof raw === 'object') {
      return {
        belts: { ...raw.belts },
        stats: { ...DEFAULT_STORE.stats, ...raw.stats },
        settings: { ...DEFAULT_STORE.settings, ...raw.settings }
      };
    }
  } catch (e) { /* stockage indisponible : valeurs par défaut */ }
  return JSON.parse(JSON.stringify(DEFAULT_STORE));
}

function saveStore() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) { /* navigation privée */ }
}

function track(name, params) {
  try { if (typeof window.gtag === 'function') window.gtag('event', name, params || {}); } catch (e) { /* analytique facultative */ }
}

// ── Outils DOM ─────────────────────────────────────────────────────────────

function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'style' && typeof v === 'object') {
        for (const [prop, val] of Object.entries(v)) {
          if (prop.startsWith('--')) el.style.setProperty(prop, val);
          else el.style[prop] = val;
        }
      }
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return el;
}

const $ = (sel, ctx = ROOT) => ctx.querySelector(sel);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reduceMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const SPEED = { lent: 1.6, normal: 1, rapide: 0.5 };
const speed = () => SPEED[store.settings.speed] || 1;
const plural = (n, w) => `${n} ${w}${n > 1 ? 's' : ''}`;

const PERSONA_COLORS = { oraculus: '#a78bfa', titan: '#f59e0b', viper: '#22c55e', loki: '#ec4899', gaia: '#2dd4bf' };

// Sur le site, card-3/11/20/27.jpg montrent les cartes Pouvoir de même valeur : ces quatre
// cartes Nombre sont donc dessinées en CSS, aux couleurs de leur famille.
const DRAWN = { 3: '#4e4ca8', 11: '#2f9fd9', 20: '#f2ad2f', 27: '#f0802b' };

function cardImage(card) {
  if (card.kind === 'mystique') return '/card-37.jpg';
  if (card.kind === 'power') return `/carte-pouvoir-${card.power}-${card.value}.webp`;
  return `/card-${card.value}.jpg`;
}

function cardName(card) {
  if (card.kind === 'mystique') return 'carte Mystique';
  if (card.kind === 'power') return `${E.POWERS[card.power].name}, valeur ${card.value}`;
  return `carte ${card.value}`;
}

/** Élément carte. opts : back, button, small, value (valeur effective affichée). */
function cardEl(card, opts = {}) {
  const tag = opts.button ? 'button' : 'div';
  const el = h(tag, {
    class: 'dj-card' + (opts.back ? ' is-back' : '') + (card && !opts.back ? ' is-' + card.kind : ''),
    type: opts.button ? 'button' : null,
    'data-id': card && !opts.back ? card.id : null,
    'aria-label': opts.back ? 'carte face cachée' : cardName(card),
    role: opts.button ? null : 'img'
  });
  if (!opts.back && card.kind === 'number' && DRAWN[card.value]) {
    el.classList.add('is-drawn');
    el.style.setProperty('--fam', DRAWN[card.value]);
    el.appendChild(h('span', { class: 'dj-drawn', 'aria-hidden': 'true' }, h('span', { class: 'dj-drawn-num', text: String(card.value) }), h('span', { class: 'dj-drawn-foot', text: 'NOMBRE' })));
    return el;
  }
  const img = h('img', { src: opts.back ? '/back.jpg' : cardImage(card), alt: '', width: 304, height: 452, decoding: 'async', draggable: 'false' });
  img.addEventListener('error', () => el.classList.add('no-img'));
  el.appendChild(img);
  if (!opts.back && card) {
    el.appendChild(h('span', { class: 'dj-card-fallback', 'aria-hidden': 'true', text: card.kind === 'mystique' ? 'M' : String(card.value) }));
  }
  return el;
}

function setValueBadge(el, value, original) {
  let b = el.querySelector('.dj-val');
  if (value == null) { if (b) b.remove(); return; }
  if (!b) { b = h('span', { class: 'dj-val' }); el.appendChild(b); }
  b.textContent = value === original ? String(value) : '= ' + value;
  b.classList.toggle('is-changed', value !== original);
}

// ── Son (désactivé par défaut) ─────────────────────────────────────────────

let audioCtx = null;
function sound(kind) {
  if (!store.settings.sound) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const notes = { card: [[520, 0.04]], win: [[660, 0.08], [880, 0.12]], lose: [[300, 0.12], [220, 0.18]], good: [[523, 0.1], [659, 0.1], [784, 0.18]], bet: [[440, 0.05]] }[kind] || [];
    let t = audioCtx.currentTime;
    for (const [f, d] of notes) {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = kind === 'card' ? 'triangle' : 'sine';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.12, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g).connect(audioCtx.destination);
      o.start(t);
      o.stop(t + d + 0.02);
      t += d * 0.9;
    }
  } catch (e) { /* audio indisponible */ }
}

// ── Session de jeu ─────────────────────────────────────────────────────────

let S = null; // session en cours
let sessionSeq = 0;

class Aborted extends Error {}

function wait(ms, sess) {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      // Partie en pause (fenêtre « Quitter ? ») : on attend la reprise
      while (sess && sess === S && sess.pause) await sess.pause.promise;
      if (sess && sess !== S) reject(new Aborted());
      else resolve();
    }, Math.round(ms * speed()));
  });
}

// Écouteurs clavier des fenêtres et du bouton « Continuer » : retirés à chaque changement
// d'écran, même si la fenêtre n'a pas été fermée normalement.
const uiCleanups = new Set();
function onDocKey(fn) {
  document.addEventListener('keydown', fn);
  const off = () => {
    document.removeEventListener('keydown', fn);
    uiCleanups.delete(off);
  };
  uiCleanups.add(off);
  return off;
}
function resetUi() {
  for (const off of [...uiCleanups]) off();
}

function guard(sess) {
  if (sess !== S) throw new Aborted();
}

function freeGameSetup() {
  const st = store.settings;
  const personas = AI.PERSONAS.slice().sort(() => Math.random() - 0.5).slice(0, st.opponents);
  const players = [{ name: 'Toi', human: true }].concat(personas.map(p => ({ name: p.name, persona: p.key, level: st.level })));
  const quick = st.length === 'rapide';
  const initiation = st.rules === 'initiation';
  return {
    players,
    rounds: quick ? [4, 3, 2, 1] : E.DEFAULT_ROUNDS,
    cycles: quick ? 1 : Infinity,
    powers: !initiation,
    mystique: !initiation
  };
}

function startSession(lesson) {
  const setup = lesson ? { ...lesson.setup } : freeGameSetup();
  const state = E.createGame(setup);
  S = {
    id: ++sessionSeq,
    state,
    lesson: lesson || null,
    fired: new Set(),
    gate: null,
    selected: null,
    resolveHuman: null,
    advice: null,
    log: []
  };
  renderGame();
  if (!ROOT.classList.contains('is-immersive')) {
    const top = ROOT.getBoundingClientRect().top;
    if (top < 0 || top > 120) window.scrollTo({ top: window.scrollY + top - 70, behavior: reduceMotion() ? 'auto' : 'smooth' });
  }
  const sess = S;
  track(lesson ? 'dojo_lesson_start' : 'dojo_game_start', lesson ? { lesson: lesson.id } : { opponents: setup.players.length - 1, level: store.settings.level });
  run(sess);
}

async function run(sess) {
  try {
    await apply(sess, { type: 'start' });
    while (sess === S) {
      const st = sess.state;
      const pend = st.pending;
      if (!pend) break;
      if (pend.type === 'next') {
        if (pend.gameOver) {
          await finish(sess);
          return;
        }
        await roundSummary(sess);
        guard(sess);
        await apply(sess, { type: 'next' });
        continue;
      }
      const human = pend.type === 'reveal' || pend.pid === 0;
      if (human) {
        const action = await humanTurn(sess, pend);
        guard(sess);
        await apply(sess, action);
      } else {
        await aiTurn(sess, pend);
      }
    }
  } catch (err) {
    if (err instanceof Aborted) return;
    if (sess === S) showCrash();
    // Remonte l'erreur au rapporteur (pipeline Auto-Heal) sans bloquer l'interface
    setTimeout(() => { throw err; });
  }
}

async function apply(sess, action) {
  const events = E.act(sess.state, action);
  for (const ev of events) {
    guard(sess);
    await onEvent(sess, ev);
  }
  guard(sess);
  renderStatus();
}

// ── Tour des adversaires ───────────────────────────────────────────────────

async function aiTurn(sess, pend) {
  const st = sess.state;
  const pid = pend.pid;
  const L = sess.lesson;
  setThinking(pid, true);
  await wait(pend.type === 'bet' ? 650 + Math.random() * 600 : pend.type === 'play' ? 550 + Math.random() * 500 : 700, sess);
  // Laisse le navigateur peindre avant les calculs de l'IA
  await new Promise(r => setTimeout(r, 16));
  guard(sess);
  let action = null;
  if (L && pend.type === 'bet' && L.aiBets && L.aiBets[pid] != null && E.legalBets(st, pid).includes(L.aiBets[pid])) {
    action = { type: 'bet', pid, value: L.aiBets[pid] };
  } else if (L && pend.type === 'play' && L.aiPlays && L.aiPlays[pid]) {
    const hand = st.players[pid].hand;
    const id = L.aiPlays[pid].find(cid => hand.some(c => c.id === cid));
    if (id) {
      const p = st.players[pid];
      action = { type: 'play', pid, cardId: id, mysticValue: id === 'm' ? (p.bet - p.tricks > 0 ? 37 : 0) : undefined };
    }
  }
  if (!action) action = AI.decide(st);
  setThinking(pid, false);
  await apply(sess, action);
}

// ── Tour du joueur ─────────────────────────────────────────────────────────

function coachStep(sess, on, ev) {
  const L = sess.lesson;
  if (!L || !L.coach) return null;
  const st = sess.state;
  const trickNo = ev && ev.trickNo != null ? ev.trickNo : st.trick ? st.trick.no : 0;
  for (let i = 0; i < L.coach.length; i++) {
    const step = L.coach[i];
    if (sess.fired.has(i) || step.on !== on) continue;
    if (step.trick != null && step.trick !== trickNo) continue;
    if (step.when && !step.when(st, ev)) continue;
    sess.fired.add(i);
    return { ...step, text: typeof step.say === 'function' ? step.say(st, ev) : step.say };
  }
  return null;
}

function humanTurn(sess, pend) {
  const st = sess.state;
  const L = sess.lesson;
  const step = coachStep(sess, pend.type);
  sess.gate = step ? { bets: step.allowBets, cards: step.allowCards, targets: step.allowTargets, values: step.allowValues } : null;
  sess.selected = null;
  sess.advice = null;
  if (step) coachSay(step.text, { tone: 'lesson' });
  else coachSay(defaultTip(sess, pend), { tone: 'tip' });

  if (pend.type === 'bet' && L && L.humanBet != null) {
    return wait(900, sess).then(() => {
      const legal = E.legalBets(st, 0);
      const value = legal.includes(L.humanBet) ? L.humanBet : legal[0];
      return { type: 'bet', pid: 0, value };
    });
  }

  return new Promise(resolve => {
    sess.resolveHuman = action => {
      sess.resolveHuman = null;
      sess.gate = null;
      sess.selected = null;
      clearActions();
      resolve(action);
    };
    renderActions(sess, pend);
    renderHand();
    setCoachHint(pend.type !== 'reveal');
  });
}

function defaultTip(sess, pend) {
  const st = sess.state;
  const r = st.round;
  const me = st.players[0];
  if (pend.type === 'bet') {
    if (r.mystic) return 'Manche Mystique : ta carte est cachée, regarde celles des autres. Gagneras-tu le pli (1) ou non (0) ?';
    const forb = E.forbiddenBet(st, 0);
    let t = `À toi d’annoncer : combien de plis vas-tu gagner sur ${r.cards} ?`;
    if (forb != null) t += ` Tu parles en dernier : la règle d’or t’interdit <b>${forb}</b>.`;
    return t;
  }
  if (pend.type === 'play') {
    const need = me.bet - me.tricks;
    if (need > 0) return `À toi de jouer. Il te faut encore <b>${plural(need, 'pli')}</b> sur ${plural(me.hand.length, 'carte')}.`;
    if (need === 0) return 'À toi de jouer. Ton compte est bon : <b>évite de gagner</b> d’autres plis.';
    return `Tu as ${plural(-need, 'pli')} de trop : limite la casse en jouant petit.`;
  }
  if (pend.type === 'mysticValue') return 'Choisis la valeur de ta Mystique : <b>37</b> pour gagner le pli, <b>0</b> pour le perdre.';
  if (pend.type === 'target') return E.POWERS[pend.power].name + ' : ' + E.POWERS[pend.power].text;
  if (pend.type === 'reveal') return 'Tous les paris sont faits : abattez vos cartes en même temps !';
  return '';
}

function act0(action) {
  if (!S || !S.resolveHuman) return;
  if (action.type !== 'play' && S.panelAt && performance.now() - S.panelAt < 300) return;
  S.resolveHuman(action);
}

// ── Événements (animations, journal, Sensei) ───────────────────────────────

async function onEvent(sess, ev) {
  const st = sess.state;
  const name = id => st.players[id].name;
  switch (ev.type) {
    case 'roundStart': {
      renderTable();
      renderSeats();
      renderHand({ deal: true });
      const r = st.round;
      const label = ev.tiebreak ? 'Départage : manche Mystique' : r.mystic ? 'Manche Mystique' : `Manche à ${plural(r.cards, 'carte')}`;
      log(`${label}. ${name(ev.dealer)} distribue.`);
      announce(label);
      await wait(r.cards * 70 + 450, sess);
      if (r.mystic) {
        renderSeats();
        await wait(300, sess);
      }
      const step = coachStep(sess, 'start', ev);
      if (step) await coachSay(step.text, { ack: true, tone: 'lesson', sess });
      break;
    }
    case 'bet': {
      sound('bet');
      const txt = st.round.mystic ? (ev.value ? 'Je gagne !' : 'Je perds.') : `Pari : ${ev.value}`;
      renderSeats();
      renderStatus();
      if (ev.pid !== 0) bubble(ev.pid, txt);
      log(`${name(ev.pid)} annonce ${ev.value}.`);
      if (ev.pid !== 0) await wait(450, sess);
      break;
    }
    case 'betsDone': {
      const r = st.round;
      const sum = r.participants.reduce((s, id) => s + st.players[id].bet, 0);
      log(`Total des annonces : ${sum} pour ${plural(r.cards, 'pli')}.`);
      break;
    }
    case 'trickStart':
      renderTrick();
      setActive(st.trick.order[0]);
      break;
    case 'play': {
      sound('card');
      const slot = slotFor(ev.pid);
      const el = cardEl(ev.card);
      if (ev.forced) el.classList.add('is-forced');
      if (ev.value != null && ev.card.kind !== 'number') setValueBadge(el, ev.value, ev.card.value);
      if (ev.card.kind === 'mystique') setValueBadge(el, '?', '?');
      const from = ev.pid === 0 ? handCardRect(ev.card.id) : seatRect(ev.pid);
      if (slot) {
        slot.innerHTML = '';
        slot.appendChild(el);
        slot.classList.add('is-filled');
        fly(el, from);
      }
      if (ev.pid === 0) renderHand();
      renderSeats();
      log(`${name(ev.pid)} ${ev.forced ? 'est forcé de jouer' : 'joue'} ${E.cardLabel(ev.card)}.`);
      announce(`${name(ev.pid)} : ${cardName(ev.card)}`);
      await wait(ev.pid === 0 ? 300 : 420, sess);
      break;
    }
    case 'mysticValue': {
      const el = slotFor(ev.pid) && slotFor(ev.pid).querySelector('.dj-card');
      if (el) setValueBadge(el, ev.value, 37);
      log(`${name(ev.pid)} donne la valeur ${ev.value} à la Mystique.`);
      toast(ev.pid, ev.value === 37 ? 'Mystique : 37' : 'Mystique : 0');
      await wait(500, sess);
      break;
    }
    case 'powerCancelled': {
      const why = ev.reason === 'last' ? 'joué en dernier' : 'joué en premier';
      log(`${E.POWERS[ev.power].name} de ${name(ev.pid)} : effet annulé (${why}).`);
      toast(ev.pid, `Effet annulé (${why})`);
      await wait(800, sess);
      break;
    }
    case 'powerNoTarget':
      log(`${E.POWERS[ev.power].name} de ${name(ev.pid)} : aucune cible possible.`);
      toast(ev.pid, 'Aucune cible');
      await wait(700, sess);
      break;
    case 'peek': {
      if (ev.pid === 0) {
        log(`Tu regardes la meilleure carte de ${name(ev.target)} : ${E.cardLabel(ev.card)}.`);
        const step = coachStep(sess, 'peek', ev);
        await modal({
          title: 'Clairvoyance Antique',
          body: h('div', { class: 'dj-peek' }, cardEl(ev.card), h('p', { html: `La meilleure carte de <b>${esc(name(ev.target))}</b> est ${esc(E.cardLabel(ev.card))}. Toi seul le sais.` })),
          buttons: [{ label: 'Compris', value: true, primary: true }],
          sess
        });
        if (step) await coachSay(step.text, { ack: true, tone: 'lesson', sess });
      } else {
        const who = ev.target === 0 ? 'ta' : `la`;
        log(`${name(ev.pid)} regarde secrètement ${who} meilleure carte${ev.target === 0 ? '' : ' de ' + name(ev.target)}.`);
        toast(ev.pid, ev.target === 0 ? 'regarde ta meilleure carte' : `espionne ${name(ev.target)}`);
        await wait(900, sess);
      }
      break;
    }
    case 'force': {
      const what = ev.power === 'sceau' ? 'une carte tirée au hasard' : 'sa carte la plus faible';
      log(`${E.POWERS[ev.power].name} : ${name(ev.target)} doit jouer ${what}.`);
      toast(ev.pid, `${E.POWERS[ev.power].name.split(' ')[0]} → ${name(ev.target)}`);
      await wait(700, sess);
      break;
    }
    case 'swap': {
      const a = slotFor(ev.pid) && slotFor(ev.pid).querySelector('.dj-card');
      const b = slotFor(ev.target) && slotFor(ev.target).querySelector('.dj-card');
      // Lire les cartes dans l'événement : le moteur a pu passer au pli suivant entre-temps
      if (a) { setValueBadge(a, ev.mine, ev.mineCard.kind === 'mystique' ? null : ev.mineCard.value); a.classList.add('is-swapped'); }
      if (b) { setValueBadge(b, ev.theirs, ev.theirsCard.kind === 'mystique' ? null : ev.theirsCard.value); b.classList.add('is-swapped'); }
      log(`Voile du Néant : ${name(ev.pid)} échange sa valeur avec ${name(ev.target)} (${ev.mine} contre ${ev.theirs}).`);
      toast(ev.pid, `Échange : ${ev.mine}`);
      await wait(900, sess);
      break;
    }
    case 'powerDeclined':
      log(`${name(ev.pid)} n’utilise pas son Voile du Néant.`);
      break;
    case 'reveal': {
      renderTrick(ev.plays.map(p => p.pid));
      for (const p of ev.plays) {
        const slot = slotFor(p.pid);
        if (!slot) continue;
        const el = cardEl(p.card);
        if (p.card.kind === 'mystique') setValueBadge(el, p.value, 37);
        slot.innerHTML = '';
        slot.appendChild(el);
        slot.classList.add('is-filled');
        if (!reduceMotion()) el.animate([{ transform: 'rotateY(90deg) scale(.8)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 450 * speed(), easing: 'ease-out' });
      }
      renderSeats();
      renderHand();
      sound('card');
      log('Les cartes sont révélées : ' + ev.plays.map(p => `${name(p.pid)} ${p.card.kind === 'mystique' ? 'Mystique (' + p.value + ')' : p.value}`).join(', ') + '.');
      await wait(900, sess);
      break;
    }
    case 'trickWon': {
      setActive(null);
      await wait(350, sess);
      const slot = slotFor(ev.pid);
      if (slot) slot.classList.add('is-winner');
      const p = st.players[ev.pid];
      log(`${p.name === 'Toi' ? 'Tu remportes' : p.name + ' remporte'} le pli avec ${ev.card.kind === 'mystique' ? 'la Mystique' : ev.value}.`);
      announce(`${p.name === 'Toi' ? 'Tu gagnes' : p.name + ' gagne'} le pli`);
      renderSeats();
      renderStatus();
      if (ev.pid === 0) {
        sound('win');
        bubbleMe(p.bet - p.tricks >= 0 ? 'Pli gagné' : 'Pli de trop !');
      } else bubble(ev.pid, '+1 pli');
      await wait(1100, sess);
      const step = coachStep(sess, 'trickWon', ev);
      if (step) await coachSay(step.text, { ack: true, tone: 'lesson', sess });
      collectTrick(ev.pid);
      await wait(380, sess);
      break;
    }
    case 'roundEnd': {
      for (const r of ev.results) {
        if (r.lost) {
          shakeLives(r.pid);
          log(`${name(r.pid)} : pari ${r.bet}, ${plural(r.tricks, 'pli')} → ${r.lost === 1 ? '1 Vie perdue' : r.lost + ' Vies perdues'}.`);
        } else log(`${name(r.pid)} : pari ${r.bet} réussi.`);
      }
      const mine = ev.results.find(r => r.pid === 0);
      if (mine) sound(mine.diff === 0 ? 'good' : 'lose');
      renderSeats();
      renderStatus();
      await wait(700, sess);
      const step = coachStep(sess, 'roundEnd', ev);
      if (step) await coachSay(step.text, { ack: true, tone: 'lesson', sess });
      break;
    }
    case 'tiebreak':
      log(`Égalité de Vies entre ${ev.players.map(name).join(' et ')} : une manche Mystique les départage.`);
      break;
    default:
      break;
  }
}

// ── Rendu : écran de jeu ───────────────────────────────────────────────────

function iconBtn(label, icon, onclick, extra = {}) {
  return h('button', { type: 'button', class: 'dj-icon-btn', 'aria-label': label, title: label, onclick, ...extra }, h('span', { 'aria-hidden': 'true', html: icon }));
}

const ICONS = {
  log: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
  soundOn: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>',
  soundOff: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="m23 9-6 6M17 9l6 6"/></svg>',
  full: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/></svg>',
  close: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  speed: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 19 22 12 13 5v14zM2 19l9-7-9-7v14z"/></svg>'
};

function renderGame() {
  const sess = S;
  const L = sess.lesson;
  resetUi();
  ROOT.innerHTML = '';
  setModalOpen(false);
  ROOT.classList.add('is-playing');
  const title = L ? L.title : 'Partie libre';
  const speedLabel = { lent: 'Lent', normal: 'Normal', rapide: 'Rapide' };
  const game = h('div', { class: 'dj-game' },
    h('header', { class: 'dj-top' },
      h('div', { class: 'dj-top-title' },
        L ? h('span', { class: 'dj-belt-dot', style: { background: BELT_COLORS[L.belt] }, title: L.beltName }) : null,
        h('strong', { text: title }),
        h('span', { class: 'dj-round', id: 'dj-round' })
      ),
      h('div', { class: 'dj-top-actions' },
        h('button', { type: 'button', class: 'dj-chip-btn', id: 'dj-speed', title: 'Vitesse du jeu', onclick: cycleSpeed }, h('span', { 'aria-hidden': 'true', html: ICONS.speed }), h('span', { text: speedLabel[store.settings.speed] })),
        iconBtn('Journal de la partie', ICONS.log, toggleLog, { id: 'dj-log-btn', 'aria-expanded': 'false', 'aria-controls': 'dj-log' }),
        iconBtn(store.settings.sound ? 'Couper le son' : 'Activer le son', store.settings.sound ? ICONS.soundOn : ICONS.soundOff, toggleSound, { id: 'dj-sound' }),
        iconBtn('Plein écran', ICONS.full, toggleImmersive, { id: 'dj-full' }),
        iconBtn('Quitter la partie', ICONS.close, confirmQuit)
      )
    ),
    h('div', { class: 'dj-seats', id: 'dj-seats', role: 'region', 'aria-label': 'Adversaires' }),
    h('div', { class: 'dj-table', role: 'region', 'aria-label': 'Table de jeu' },
      h('div', { class: 'dj-trick', id: 'dj-trick' }),
      h('p', { class: 'dj-table-info', id: 'dj-table-info' })
    ),
    h('div', { class: 'dj-coach', id: 'dj-coach', role: 'region', 'aria-label': 'Sensei' },
      h('div', { class: 'dj-sensei', 'aria-hidden': 'true' }),
      h('div', { class: 'dj-coach-body' },
        h('p', { class: 'dj-coach-text', id: 'dj-coach-text' }),
        h('div', { class: 'dj-coach-actions', id: 'dj-coach-actions' })
      )
    ),
    h('div', { class: 'dj-me', role: 'region', 'aria-label': 'Ton jeu' },
      h('div', { class: 'dj-me-bar', id: 'dj-me-bar' }),
      h('div', { class: 'dj-hand', id: 'dj-hand' }),
      h('div', { class: 'dj-actions', id: 'dj-actions' })
    ),
    h('aside', { class: 'dj-log', id: 'dj-log', hidden: true, 'aria-label': 'Journal de la partie' },
      h('div', { class: 'dj-log-head' }, h('strong', { text: 'Journal' }), iconBtn('Fermer le journal', ICONS.close, toggleLog)),
      h('ol', { id: 'dj-log-list' })
    ),
    h('div', { class: 'dj-live', id: 'dj-live', 'aria-live': 'polite', 'aria-atomic': 'true' }),
    h('div', { class: 'dj-modal-layer', id: 'dj-modal-layer' })
  );
  ROOT.appendChild(game);
}

function renderStatus() {
  if (!S) return;
  const st = S.state;
  const r = st.round;
  const roundEl = $('#dj-round');
  if (roundEl && r) {
    let txt;
    if (r.tiebreak) txt = 'Départage';
    else if (r.mystic) txt = 'Manche Mystique';
    else txt = `${plural(r.cards, 'carte')}`;
    if (Number.isFinite(st.opts.cycles) && st.opts.rounds.length > 1 && !r.tiebreak) txt = `Manche ${r.no + 1}/${st.opts.rounds.length} · ` + txt;
    else if (!Number.isFinite(st.opts.cycles)) txt = `Manche ${r.no + 1} · ` + txt;
    roundEl.textContent = txt;
  }
  const info = $('#dj-table-info');
  if (info && r) {
    const bets = r.participants.filter(id => st.players[id].bet != null);
    const sum = bets.reduce((s, id) => s + st.players[id].bet, 0);
    let txt = '';
    if (st.phase === 'bet') txt = `Annonces : ${sum} / ${plural(r.cards, 'pli')}`;
    else if (st.trick && !r.mystic) txt = `Pli ${st.trick.no} / ${r.cards} · Annonces : ${sum}`;
    else if (r.mystic) txt = `Annonces : ${sum} · 1 pli`;
    info.textContent = txt;
  }
  renderMeBar();
}

function livesEl(p, total) {
  const wrap = h('span', { class: 'dj-lives', 'aria-label': plural(p.lives, 'Vie') });
  const max = Math.max(total, p.lives);
  for (let i = 0; i < max; i++) wrap.appendChild(h('span', { class: 'dj-life' + (i < p.lives ? ' is-on' : ''), 'aria-hidden': 'true', text: '★' }));
  return wrap;
}

function personaOf(p) {
  return AI.PERSONAS.find(x => x.key === p.persona) || null;
}

function renderSeats() {
  const st = S.state;
  const wrap = $('#dj-seats');
  if (!wrap) return;
  const r = st.round;
  const active = wrap.querySelector('.is-active');
  const activePid = active ? Number(active.dataset.pid) : null;
  wrap.innerHTML = '';
  const n = st.players.length;
  wrap.style.setProperty('--seats', n - 1);
  for (let k = 1; k < n; k++) {
    const p = st.players[k];
    const persona = personaOf(p);
    const inRound = r && r.participants.includes(p.id);
    const need = p.bet != null ? p.bet - p.tricks : null;
    const seat = h('div', {
      class: 'dj-seat' + (inRound ? '' : ' is-out') + (activePid === p.id ? ' is-active' : ''),
      'data-pid': p.id,
      'aria-label': `${p.name}, ${plural(p.lives, 'Vie')}${p.bet != null ? `, pari ${p.bet}, ${plural(p.tricks, 'pli')}` : ''}`
    },
    h('div', { class: 'dj-bubble', 'aria-hidden': 'true' }),
    h('div', { class: 'dj-avatar', style: { '--c': PERSONA_COLORS[p.persona] || '#94a3b8' }, 'aria-hidden': 'true' },
      h('span', { text: persona ? persona.emoji : '🙂' }),
      r && r.dealer === p.id ? h('span', { class: 'dj-dealer', title: 'Donneur', text: 'D' }) : null,
      h('span', { class: 'dj-think' }, h('i'), h('i'), h('i'))
    ),
    h('div', { class: 'dj-seat-name', text: p.name }),
    livesEl(p, st.opts.lives),
    h('div', { class: 'dj-seat-score' + (need === 0 ? ' is-ok' : need < 0 ? ' is-over' : '') },
      p.bet != null ? h('span', { html: `<b>${p.tricks}</b>/${p.bet}` }) : h('span', { class: 'dj-muted', text: inRound ? '…' : '—' })
    ),
    r && r.mystic && inRound && p.hand.length ? h('div', { class: 'dj-front' }, cardEl(p.hand[0])) : null,
    r && !r.mystic && inRound ? h('div', { class: 'dj-seat-cards', 'aria-hidden': 'true' }, ...p.hand.map(() => h('i'))) : null
    );
    wrap.appendChild(seat);
  }
}

function setActive(pid) {
  ROOT.querySelectorAll('.dj-seat.is-active').forEach(s => s.classList.remove('is-active'));
  const me = $('.dj-me');
  if (me) me.classList.toggle('is-active', pid === 0);
  if (pid != null && pid !== 0) {
    const s = ROOT.querySelector(`.dj-seat[data-pid="${pid}"]`);
    if (s) s.classList.add('is-active');
  }
}

function setThinking(pid, on) {
  const s = ROOT.querySelector(`.dj-seat[data-pid="${pid}"]`);
  if (s) s.classList.toggle('is-thinking', on);
  if (on) setActive(pid);
}

function bubble(pid, text) {
  const s = ROOT.querySelector(`.dj-seat[data-pid="${pid}"] .dj-bubble`);
  if (!s) return;
  s.textContent = text;
  s.classList.remove('is-on');
  void s.offsetWidth;
  s.classList.add('is-on');
}

function bubbleMe(text) {
  const bar = $('#dj-me-bar');
  if (!bar) return;
  const b = h('span', { class: 'dj-me-pop', text });
  bar.appendChild(b);
  setTimeout(() => b.remove(), 1600);
}

function toast(pid, text) {
  const slot = slotFor(pid);
  const host = slot || $('#dj-trick');
  if (!host) return;
  const t = h('span', { class: 'dj-toast', text });
  host.appendChild(t);
  setTimeout(() => t.remove(), 2200 * speed());
}

function shakeLives(pid) {
  const el = pid === 0 ? $('#dj-me-bar .dj-lives') : ROOT.querySelector(`.dj-seat[data-pid="${pid}"] .dj-lives`);
  if (el && !reduceMotion()) el.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }], { duration: 360, iterations: 2 });
}

function renderMeBar() {
  const bar = $('#dj-me-bar');
  if (!bar || !S) return;
  const st = S.state;
  const me = st.players[0];
  const r = st.round;
  const pops = [...bar.querySelectorAll('.dj-me-pop')];
  bar.innerHTML = '';
  let status = '';
  let cls = '';
  if (me.bet != null && r && !r.mystic) {
    const need = me.bet - me.tricks;
    if (need > 0) { status = `encore ${plural(need, 'pli')}`; cls = 'is-need'; }
    else if (need === 0) { status = 'compte bon'; cls = 'is-ok'; }
    else { status = `${plural(-need, 'pli')} de trop`; cls = 'is-over'; }
  }
  bar.append(
    h('span', { class: 'dj-me-name' }, 'Toi', r && r.dealer === 0 ? h('span', { class: 'dj-dealer', title: 'Donneur', text: 'D' }) : null),
    livesEl(me, st.opts.lives),
    h('span', { class: 'dj-me-score' }, h('span', { class: 'dj-muted', text: 'Pari ' }), h('b', { text: me.bet == null ? '–' : String(me.bet) }), h('span', { class: 'dj-muted', text: ' · Plis ' }), h('b', { text: String(me.tricks) })),
    ...(status ? [h('span', { class: 'dj-me-status ' + cls, text: status })] : []),
    ...pops
  );
}

function renderTable() {
  renderTrick();
  renderStatus();
}

function renderTrick(orderOverride) {
  const st = S.state;
  const wrap = $('#dj-trick');
  if (!wrap) return;
  wrap.innerHTML = '';
  const r = st.round;
  if (!r) return;
  const order = orderOverride || (st.trick ? st.trick.order : r.betOrder);
  wrap.style.setProperty('--slots', order.length);
  for (const pid of order) {
    const p = st.players[pid];
    const persona = personaOf(p);
    const play = st.trick && !orderOverride ? st.trick.plays.find(x => x.pid === pid) : null;
    const slot = h('div', { class: 'dj-slot' + (pid === 0 ? ' is-me' : ''), 'data-pid': pid });
    if (play) {
      const el = cardEl(play.card);
      if (play.forced) el.classList.add('is-forced');
      if (play.card.kind !== 'number' || play.value !== play.card.value) setValueBadge(el, play.value == null ? '?' : play.value, play.card.kind === 'mystique' ? null : play.card.value);
      slot.appendChild(el);
      slot.classList.add('is-filled');
    }
    const cell = h('div', { class: 'dj-slot-wrap' }, slot, h('span', { class: 'dj-slot-label', html: `${persona ? persona.emoji + ' ' : ''}${esc(p.name)}` }));
    wrap.appendChild(cell);
  }
}

function slotFor(pid) {
  return ROOT.querySelector(`.dj-slot[data-pid="${pid}"]`);
}

function seatRect(pid) {
  const s = ROOT.querySelector(`.dj-seat[data-pid="${pid}"] .dj-avatar`);
  return s ? s.getBoundingClientRect() : null;
}

function handCardRect(id) {
  const c = ROOT.querySelector(`#dj-hand .dj-card[data-id="${id}"]`);
  return c ? c.getBoundingClientRect() : null;
}

function fly(el, from) {
  if (!from || reduceMotion()) return;
  const to = el.getBoundingClientRect();
  if (!to.width) return;
  const dx = from.left + from.width / 2 - (to.left + to.width / 2);
  const dy = from.top + from.height / 2 - (to.top + to.height / 2);
  el.animate([
    { transform: `translate(${dx}px, ${dy}px) scale(0.55) rotate(-8deg)`, opacity: 0.4 },
    { transform: 'translate(0, 0) scale(1) rotate(0)', opacity: 1 }
  ], { duration: 420 * speed(), easing: 'cubic-bezier(.2,.8,.2,1)' });
}

function collectTrick(pid) {
  const target = pid === 0 ? $('#dj-me-bar') : ROOT.querySelector(`.dj-seat[data-pid="${pid}"] .dj-avatar`);
  const cards = ROOT.querySelectorAll('#dj-trick .dj-card');
  if (!target || reduceMotion()) {
    cards.forEach(c => c.remove());
    return;
  }
  const to = target.getBoundingClientRect();
  cards.forEach(c => {
    const from = c.getBoundingClientRect();
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const a = c.animate([{ transform: 'none', opacity: 1 }, { transform: `translate(${dx}px, ${dy}px) scale(.3)`, opacity: 0 }], { duration: 360 * speed(), easing: 'ease-in', fill: 'forwards' });
    a.onfinish = () => c.remove();
  });
}

// ── Main du joueur ─────────────────────────────────────────────────────────

function renderHand(opts = {}) {
  const sess = S;
  const st = sess.state;
  const wrap = $('#dj-hand');
  if (!wrap) return;
  const me = st.players[0];
  const r = st.round;
  wrap.innerHTML = '';
  if (!r || !r.participants.includes(0)) return;
  const pend = st.pending;
  const canPlay = pend && pend.type === 'play' && pend.pid === 0 && sess.resolveHuman;
  const advice = sess.advice && sess.advice.kind === 'play' ? sess.advice.cardId : null;
  if (r.mystic) {
    if (me.hand.length) {
      const back = cardEl(null, { back: true });
      back.classList.add('is-forehead');
      wrap.appendChild(h('div', { class: 'dj-forehead' }, back, h('span', { text: 'Ta carte (invisible pour toi)' })));
    }
    return;
  }
  me.hand.forEach((card, i) => {
    const allowed = !sess.gate || !sess.gate.cards || sess.gate.cards.includes(card.id);
    const el = cardEl(card, { button: true });
    el.style.setProperty('--i', i);
    if (opts.deal && !reduceMotion()) el.classList.add('is-dealt');
    // Hors de ton tour, les cartes restent lisibles (évaluation de la main) mais inactives
    if (!canPlay) el.classList.add('is-idle');
    else if (!allowed) el.classList.add('is-disabled');
    if (!canPlay || !allowed) el.setAttribute('aria-disabled', 'true');
    if (canPlay && !allowed) el.title = 'Le Sensei te demande une autre carte';
    if (sess.selected === card.id) el.classList.add('is-selected');
    if (advice === card.id) el.classList.add('is-advised');
    if (canPlay && sess.gate && sess.gate.cards && allowed) el.classList.add('is-advised');
    el.addEventListener('click', () => onCardClick(card));
    el.addEventListener('dblclick', () => { if (canPlay && allowed) playCard(card); });
    wrap.appendChild(el);
  });
  layoutHand();
}

function layoutHand() {
  const wrap = $('#dj-hand');
  if (!wrap) return;
  const cards = wrap.querySelectorAll('.dj-card');
  if (!cards.length) return;
  const w = cards[0].getBoundingClientRect().width || 70;
  const avail = wrap.clientWidth - 8;
  const n = cards.length;
  const gap = n > 1 ? Math.min(8, (avail - n * w) / (n - 1)) : 0;
  wrap.style.setProperty('--ov', gap.toFixed(1) + 'px');
}

function onCardClick(card) {
  const sess = S;
  if (!sess || !sess.resolveHuman) return;
  const pend = sess.state.pending;
  if (!pend || pend.type !== 'play') return;
  if (sess.gate && sess.gate.cards && !sess.gate.cards.includes(card.id)) {
    coachSay('Pas tout de suite : suis la consigne du Sensei pour cette leçon.', { tone: 'warn' });
    return;
  }
  if (sess.selected === card.id) return playCard(card);
  sess.selected = card.id;
  renderHand();
  renderPlayBar(card);
  const btn = ROOT.querySelector(`#dj-hand .dj-card[data-id="${card.id}"]`);
  if (btn) btn.focus({ preventScroll: true });
}

function playCard(card) {
  act0({ type: 'play', pid: 0, cardId: card.id });
}

// ── Panneaux d'action ──────────────────────────────────────────────────────

function clearActions() {
  const a = $('#dj-actions');
  if (a) a.innerHTML = '';
  setCoachHint(false);
}

function renderActions(sess, pend) {
  const a = $('#dj-actions');
  if (!a) return;
  a.innerHTML = '';
  const st = sess.state;
  setActive(pend.type === 'reveal' ? null : 0);
  if (pend.type === 'bet') a.appendChild(betPanel(sess));
  else if (pend.type === 'play') a.appendChild(h('p', { class: 'dj-hint-line', text: 'Touche une carte pour la choisir, puis touche-la encore (ou « Jouer ») pour la poser.' }));
  else if (pend.type === 'mysticValue') a.appendChild(mysticPanel(sess));
  else if (pend.type === 'target') a.appendChild(targetPanel(sess, pend));
  else if (pend.type === 'reveal') {
    a.appendChild(h('div', { class: 'dj-panel' },
      h('button', { type: 'button', class: 'dj-btn dj-btn-primary dj-btn-lg', onclick: () => act0({ type: 'reveal' }) }, 'Révéler les cartes')
    ));
  }
  // Pas de focus automatique sur un bouton (un double clic ou une touche Entrée de trop
  // validerait un choix) : le focus va au panneau, et les choix des 300 premières
  // millisecondes sont ignorés.
  sess.panelAt = performance.now();
  const panel = a.firstElementChild;
  if (panel && pend.type !== 'play') {
    panel.setAttribute('tabindex', '-1');
    panel.focus({ preventScroll: true });
  }
  void st;
}

function renderPlayBar(card) {
  const a = $('#dj-actions');
  if (!a) return;
  a.innerHTML = '';
  const st = S.state;
  const tip = card.kind === 'power' ? AI.powerTip(st, 0, card.power) : '';
  a.appendChild(h('div', { class: 'dj-playbar' },
    h('button', { type: 'button', class: 'dj-btn dj-btn-primary', onclick: () => playCard(card) }, `Jouer ${card.kind === 'mystique' ? 'la Mystique' : card.kind === 'power' ? E.POWERS[card.power].name.split(' ')[0] + ' ' + card.value : 'le ' + card.value}`),
    h('button', { type: 'button', class: 'dj-btn dj-btn-ghost', onclick: () => { S.selected = null; renderHand(); renderActions(S, S.state.pending); } }, 'Annuler'),
    tip ? h('p', { class: 'dj-playbar-tip', text: tip }) : null
  ));
}

function betPanel(sess) {
  const st = sess.state;
  const r = st.round;
  const legal = E.legalBets(st, 0);
  const gate = sess.gate && sess.gate.bets;
  const advised = sess.advice && sess.advice.kind === 'bet' ? sess.advice.bet : null;
  const chips = h('div', { class: 'dj-bet-chips', role: 'group', 'aria-label': 'Ton pari' });
  for (let b = 0; b <= r.cards; b++) {
    const ok = legal.includes(b);
    const allowed = ok && (!gate || gate.includes(b));
    const label = r.mystic ? (b ? '1 · je gagne' : '0 · je perds') : String(b);
    chips.appendChild(h('button', {
      type: 'button',
      class: 'dj-bet' + (ok ? '' : ' is-forbidden') + (advised === b || (gate && allowed) ? ' is-advised' : '') + (r.mystic ? ' is-wide' : ''),
      disabled: !allowed,
      title: ok ? (allowed ? `Parier ${b}` : 'Le Sensei te conseille un autre pari') : 'Interdit par la règle d’or',
      'aria-label': ok ? `Parier ${b}` : `${b} : interdit par la règle d’or`,
      onclick: () => act0({ type: 'bet', pid: 0, value: b })
    }, label));
  }
  const forb = E.forbiddenBet(st, 0);
  const others = r.betOrder.filter(id => id !== 0 && st.players[id].bet != null);
  const sum = others.reduce((s, id) => s + st.players[id].bet, 0);
  const note = forb != null
    ? `Annonces des autres : ${sum}. Règle d’or : la somme ne doit pas faire ${r.cards}, donc ${forb} est interdit.`
    : others.length ? `Annonces des autres : ${sum} sur ${plural(r.cards, 'pli')}.` : 'Tu parles en premier.';
  return h('div', { class: 'dj-panel dj-panel-bet' },
    h('p', { class: 'dj-panel-title', html: r.mystic ? 'Ton pari à l’aveugle' : `Ton pari <span>combien de plis sur ${r.cards} ?</span>` }),
    chips,
    h('p', { class: 'dj-panel-note', text: note })
  );
}

function mysticPanel(sess) {
  const gate = sess.gate && sess.gate.values;
  const advised = sess.advice && sess.advice.kind === 'mystic' ? sess.advice.value : null;
  const mk = (v, txt) => h('button', {
    type: 'button',
    class: 'dj-btn dj-mystic-btn' + (v === 37 ? ' is-high' : '') + (advised === v || (gate && gate.includes(v)) ? ' is-advised' : ''),
    disabled: gate && !gate.includes(v),
    onclick: () => act0({ type: 'mysticValue', pid: 0, value: v })
  }, h('b', { text: String(v) }), h('span', { text: txt }));
  return h('div', { class: 'dj-panel' },
    h('p', { class: 'dj-panel-title', text: 'Valeur de la Mystique' }),
    h('div', { class: 'dj-mystic-choice' }, mk(0, 'perd le pli'), mk(37, 'gagne le pli'))
  );
}

function targetPanel(sess, pend) {
  const st = sess.state;
  const def = E.POWERS[pend.power];
  const gate = sess.gate && sess.gate.targets;
  const advised = sess.advice && sess.advice.kind === 'target' ? sess.advice.target : undefined;
  const list = h('div', { class: 'dj-targets' });
  for (const id of pend.options) {
    const p = st.players[id];
    const persona = personaOf(p);
    const play = pend.power === 'voile' ? st.trick.plays.find(x => x.pid === id) : null;
    list.appendChild(h('button', {
      type: 'button',
      class: 'dj-target' + (advised === id || (gate && gate.includes(id)) ? ' is-advised' : ''),
      disabled: gate && !gate.includes(id),
      onclick: () => act0({ type: 'target', pid: 0, target: id })
    }, h('span', { class: 'dj-target-emoji', text: persona ? persona.emoji : '🙂' }), h('span', { text: p.name }), play ? h('b', { text: String(play.value) }) : null));
  }
  if (pend.optional) {
    list.appendChild(h('button', { type: 'button', class: 'dj-target is-none' + (advised === null ? ' is-advised' : ''), disabled: !!gate, onclick: () => act0({ type: 'target', pid: 0, target: null }) }, 'Ne pas échanger'));
  }
  return h('div', { class: 'dj-panel' },
    h('p', { class: 'dj-panel-title', html: `${esc(def.name)} <span>${esc(def.text)}</span>` }),
    list
  );
}

// ── Sensei ─────────────────────────────────────────────────────────────────

function coachSay(html, opts = {}) {
  const text = $('#dj-coach-text');
  const box = $('#dj-coach');
  const actions = $('#dj-coach-actions');
  if (!text) return Promise.resolve();
  text.innerHTML = html;
  box.dataset.tone = opts.tone || 'tip';
  if (!reduceMotion()) box.animate([{ opacity: 0.4, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 260 });
  if (opts.tone === 'lesson' || opts.ack) announce(text.textContent);
  [...actions.querySelectorAll('.dj-ack')].forEach(b => b.remove());
  if (!opts.ack) return Promise.resolve();
  if (S) S.coachHold = true;
  return new Promise((resolve, reject) => {
    const sess = opts.sess;
    const btn = h('button', { type: 'button', class: 'dj-btn dj-btn-primary dj-btn-sm dj-ack' }, 'Continuer');
    let off = null;
    const done = () => {
      btn.remove();
      if (S) S.coachHold = false;
      if (off) off();
      if (sess && sess !== S) reject(new Aborted());
      else resolve();
    };
    const onKey = e => { if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('input,textarea') && !$('#dj-modal-layer .dj-modal')) { e.preventDefault(); done(); } };
    btn.addEventListener('click', done);
    actions.prepend(btn);
    off = onDocKey(onKey);
    btn.focus({ preventScroll: true });
  });
}

function setCoachHint(on) {
  const actions = $('#dj-coach-actions');
  if (!actions) return;
  const old = actions.querySelector('.dj-hint-btn');
  if (old) old.remove();
  if (!on) return;
  actions.appendChild(h('button', { type: 'button', class: 'dj-btn dj-btn-ghost dj-btn-sm dj-hint-btn', onclick: showAdvice }, h('span', { 'aria-hidden': 'true', text: '💡 ' }), 'Conseil'));
}

function showAdvice() {
  const sess = S;
  if (!sess || !sess.resolveHuman) return;
  const st = sess.state;
  const pend = st.pending;
  let adv;
  if (pend.type === 'bet') {
    adv = AI.adviseBet(st, 0);
    sess.advice = { kind: 'bet', bet: adv.bet };
    coachSay(adv.text, { tone: 'advice' });
    renderActions(sess, pend);
  } else if (pend.type === 'play') {
    adv = AI.advisePlay(st, 0);
    sess.advice = { kind: 'play', cardId: adv.cardId };
    coachSay(adv.text, { tone: 'advice' });
    const card = st.players[0].hand.find(c => c.id === adv.cardId);
    sess.selected = null;
    renderHand();
    if (card && (!sess.gate || !sess.gate.cards || sess.gate.cards.includes(card.id))) {
      sess.selected = card.id;
      renderHand();
      renderPlayBar(card);
    }
  } else if (pend.type === 'mysticValue') {
    adv = AI.adviseMystic(st, 0);
    sess.advice = { kind: 'mystic', value: adv.value };
    coachSay(adv.text, { tone: 'advice' });
    renderActions(sess, pend);
  } else if (pend.type === 'target') {
    adv = AI.chooseTarget(st, 0, pend);
    sess.advice = { kind: 'target', target: adv.target };
    coachSay(adv.why, { tone: 'advice' });
    renderActions(sess, pend);
  }
  setCoachHint(true);
}

// ── Journal et annonces ────────────────────────────────────────────────────

function log(text) {
  if (!S) return;
  S.log.push(text);
  // Hors des tours du joueur, le Sensei commente la partie en direct
  const box = $('#dj-coach');
  if (box && !S.resolveHuman && !S.coachHold) {
    box.dataset.tone = 'log';
    $('#dj-coach-text').textContent = text;
  }
  const list = $('#dj-log-list');
  if (list) {
    list.appendChild(h('li', { text }));
    list.scrollTop = list.scrollHeight;
  }
}

function announce(text) {
  const live = $('#dj-live');
  if (live) live.textContent = text.replace(/<[^>]+>/g, '');
}

function toggleLog() {
  const panel = $('#dj-log');
  const btn = $('#dj-log-btn');
  if (!panel) return;
  panel.hidden = !panel.hidden;
  if (btn) btn.setAttribute('aria-expanded', String(!panel.hidden));
  if (!panel.hidden) {
    const list = $('#dj-log-list');
    list.scrollTop = list.scrollHeight;
  }
}

function toggleSound() {
  store.settings.sound = !store.settings.sound;
  saveStore();
  const btn = $('#dj-sound');
  if (btn) {
    btn.innerHTML = '';
    btn.appendChild(h('span', { 'aria-hidden': 'true', html: store.settings.sound ? ICONS.soundOn : ICONS.soundOff }));
    btn.setAttribute('aria-label', store.settings.sound ? 'Couper le son' : 'Activer le son');
    btn.title = btn.getAttribute('aria-label');
  }
  sound('bet');
}

function cycleSpeed() {
  const order = ['lent', 'normal', 'rapide'];
  store.settings.speed = order[(order.indexOf(store.settings.speed) + 1) % order.length];
  saveStore();
  const btn = $('#dj-speed span:last-child');
  if (btn) btn.textContent = { lent: 'Lent', normal: 'Normal', rapide: 'Rapide' }[store.settings.speed];
}

function toggleImmersive() {
  const on = !ROOT.classList.contains('is-immersive');
  ROOT.classList.toggle('is-immersive', on);
  document.documentElement.classList.toggle('dj-lock', on);
  try {
    if (on && ROOT.requestFullscreen && !document.fullscreenElement) ROOT.requestFullscreen().catch(() => {});
    else if (!on && document.fullscreenElement) document.exitFullscreen().catch(() => {});
  } catch (e) { /* plein écran indisponible : le mode immersif CSS suffit */ }
  setTimeout(layoutHand, 60);
}

document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && ROOT && ROOT.classList.contains('is-immersive')) {
    ROOT.classList.remove('is-immersive');
    document.documentElement.classList.remove('dj-lock');
    setTimeout(layoutHand, 60);
  }
});

async function confirmQuit() {
  const sess = S;
  if (!sess || sess.pause) return;
  let release;
  sess.pause = { promise: new Promise(r => { release = r; }) };
  const ok = await modal({
    title: 'Quitter la partie ?',
    body: h('p', { text: 'La partie en cours sera perdue.' }),
    buttons: [{ label: 'Continuer à jouer', value: false }, { label: 'Quitter', value: true, primary: true }]
  });
  sess.pause = null;
  release();
  if (ok && sess === S) exitToLobby();
}

function exitToLobby() {
  S = null;
  setModalOpen(false);
  if (ROOT.classList.contains('is-immersive')) toggleImmersive();
  renderLobby();
}

// ── Fenêtres modales ───────────────────────────────────────────────────────

/** Fenêtre ouverte : le Dojo passe au-dessus de l'en-tête et de la barre mobile du site. */
function setModalOpen(on) {
  ROOT.classList.toggle('has-modal', on);
  document.documentElement.classList.toggle('dj-modal-open', on);
}

function modal({ title, body, buttons, className, sess, dismissible }) {
  const layer = $('#dj-modal-layer') || ROOT;
  return new Promise((resolve, reject) => {
    const prev = document.activeElement;
    const box = h('div', { class: 'dj-modal ' + (className || ''), role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'dj-modal-title' });
    let off = null;
    const close = value => {
      box.remove();
      if (!ROOT.querySelector('.dj-modal')) setModalOpen(false);
      if (off) off();
      if (prev && prev.focus && document.contains(prev)) prev.focus({ preventScroll: true });
      if (sess && sess !== S) reject(new Aborted());
      else resolve(value);
    };
    const onKey = e => {
      if (e.key === 'Escape' && dismissible !== false) { const def = (buttons || []).find(b => !b.primary); if (def) close(def.value); }
      if (e.key === 'Tab') {
        const f = [...box.querySelectorAll('button, a[href]')];
        if (!f.length) return;
        const i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    };
    const inner = h('div', { class: 'dj-modal-card' },
      title ? h('h3', { class: 'dj-modal-title', id: 'dj-modal-title', html: title }) : null,
      h('div', { class: 'dj-modal-body' }, body),
      buttons && buttons.length ? h('div', { class: 'dj-modal-actions' }, ...buttons.map(b => {
        if (b.href) return h('a', { class: 'dj-btn ' + (b.primary ? 'dj-btn-primary' : 'dj-btn-ghost'), href: b.href, onclick: b.onclick }, b.label);
        return h('button', { type: 'button', class: 'dj-btn ' + (b.primary ? 'dj-btn-primary' : 'dj-btn-ghost'), onclick: () => close(b.value) }, b.label);
      })) : null
    );
    box.appendChild(inner);
    layer.appendChild(box);
    setModalOpen(true);
    off = onDocKey(onKey);
    const focusEl = box.querySelector('.dj-btn-primary') || box.querySelector('button, a[href]');
    if (focusEl) focusEl.focus({ preventScroll: true });
  });
}

function resultsTable(st, results) {
  const rows = results.slice().map(r => {
    const p = st.players[r.pid];
    return h('tr', { class: r.pid === 0 ? 'is-me' : '' },
      h('th', { scope: 'row', text: p.name }),
      h('td', { text: String(r.bet) }),
      h('td', { text: String(r.tricks) }),
      h('td', { class: r.lost ? 'is-bad' : 'is-good', text: r.lost ? '−' + r.lost : '✓' }),
      h('td', {}, livesEl(p, st.opts.lives))
    );
  });
  return h('table', { class: 'dj-results' },
    h('thead', {}, h('tr', {}, h('th', { scope: 'col', text: 'Joueur' }), h('th', { scope: 'col', text: 'Pari' }), h('th', { scope: 'col', text: 'Plis' }), h('th', { scope: 'col', text: 'Écart' }), h('th', { scope: 'col', text: 'Vies' }))),
    h('tbody', {}, rows)
  );
}

async function roundSummary(sess) {
  const st = sess.state;
  const last = st.history[st.history.length - 1];
  const mine = last.results.find(r => r.pid === 0);
  let title = 'Manche terminée';
  if (mine) title = mine.diff === 0 ? 'Pari réussi !' : mine.lost ? `Pari raté : −${plural(mine.lost, 'Vie')}` : 'Pari raté';
  const nextCards = st.tiebreak ? 1 : E.cardsForRound(st.opts, st.roundNo + 1);
  const pend = st.pending;
  const nextLabel = pend.tiebreak ? 'Manche de départage' : nextCards === 1 ? 'Manche Mystique' : `Manche à ${nextCards} cartes`;
  const body = h('div', {},
    resultsTable(st, last.results),
    pend.tiebreak ? h('p', { class: 'dj-note', text: 'Égalité en tête : une ultime manche Mystique départage les ex æquo.' }) : null
  );
  setActive(null);
  await modal({ title, body, buttons: [{ label: nextLabel + ' →', value: true, primary: true }], sess, className: mine && mine.diff === 0 ? 'is-good' : 'is-bad', dismissible: false });
}

async function finish(sess) {
  const st = sess.state;
  const L = sess.lesson;
  const win = (st.winners || []).includes(0);
  const me = st.players[0];
  const last = st.history[st.history.length - 1];
  if (!L || L.free) {
    store.stats.games++;
    if (win) { store.stats.wins++; store.stats.streak++; store.stats.bestStreak = Math.max(store.stats.bestStreak, store.stats.streak); }
    else store.stats.streak = 0;
  }
  store.stats.bets += me.stats.bets;
  store.stats.exact += me.stats.exact;
  saveStore();
  if (L) return lessonResult(sess);
  track('dojo_game_end', { win, rounds: st.history.length });
  if (win) celebrate();
  const ranking = st.players.slice().sort((a, b) => b.lives - a.lives || (st.winners.includes(b.id) ? 1 : 0) - (st.winners.includes(a.id) ? 1 : 0));
  const list = h('ol', { class: 'dj-ranking' }, ranking.map((p, i) => {
    const persona = personaOf(p);
    return h('li', { class: p.id === 0 ? 'is-me' : '' },
      h('span', { class: 'dj-rank', text: st.winners.includes(p.id) ? '👑' : String(i + 1) }),
      h('span', { text: `${persona ? persona.emoji + ' ' : ''}${p.name}` }),
      livesEl(p, st.opts.lives),
      h('span', { class: 'dj-muted', text: `${p.stats.exact}/${p.stats.bets} paris` })
    );
  }));
  const title = win ? (st.winners.length > 1 ? 'Victoire partagée !' : 'Tu es Maître des Mystiques !') : 'Fin de la partie';
  const body = h('div', {},
    last ? resultsTable(st, last.results) : null,
    h('h4', { class: 'dj-subtitle', text: 'Classement' }),
    list,
    h('p', { class: 'dj-note', text: `Tes paris exacts : ${me.stats.exact} sur ${me.stats.bets}. ${win ? 'Prêt à défier tes amis autour d’une vraie table ?' : 'Une revanche, ici ou autour d’une vraie table ?'}` }),
    ctaBox(win)
  );
  const again = await modal({
    title,
    body,
    className: win ? 'is-good' : '',
    sess,
    dismissible: false,
    buttons: [{ label: 'Retour au Dojo', value: 'lobby' }, { label: 'Rejouer', value: 'again', primary: true }]
  });
  if (again === 'again') startSession(null);
  else exitToLobby();
}

function ctaBox(win) {
  return h('a', { class: 'dj-cta', href: '/commander.html', onclick: () => track('dojo_cta_click', { win }) },
    h('img', { src: '/boite-recto-kyran-740.webp', alt: 'Boîte du jeu KYRAN', width: 64, height: 64, loading: 'lazy' }),
    h('span', { class: 'dj-cta-text' },
      h('b', { text: win ? 'Rejoue ta victoire en vrai' : 'Prends ta revanche en vrai' }),
      h('span', { text: '3 à 6 joueurs, 30 minutes, la manche Mystique carte sur le front.' })
    ),
    h('span', { class: 'dj-cta-price', text: '9,99 €' })
  );
}

async function lessonResult(sess) {
  const st = sess.state;
  const L = sess.lesson;
  const res = L.success(st);
  const idx = LESSONS.indexOf(L);
  const nextL = LESSONS[idx + 1];
  const first = res.ok && !store.belts[L.id];
  if (res.ok) {
    store.belts[L.id] = true;
    saveStore();
    track('dojo_lesson_complete', { lesson: L.id });
    celebrate();
    sound('good');
  }
  const last = st.history[st.history.length - 1];
  const body = h('div', {},
    res.ok ? h('div', { class: 'dj-belt-award' }, beltIcon(L.belt, true), h('span', { text: first ? `${L.beltName} obtenue !` : L.beltName })) : null,
    h('p', { class: 'dj-lead', text: res.text }),
    last && !L.noTable ? resultsTable(st, last.results) : null,
    res.ok && L.belt === 'noire' ? ctaBox(true) : null
  );
  const buttons = res.ok
    ? [{ label: 'Retour au Dojo', value: 'lobby' }, nextL ? { label: `Leçon suivante : ${nextL.title}`, value: 'next', primary: true } : { label: 'Partie libre', value: 'free', primary: true }]
    : [{ label: 'Retour au Dojo', value: 'lobby' }, { label: 'Réessayer', value: 'retry', primary: true }];
  const choice = await modal({ title: res.ok ? 'Leçon réussie' : 'Pas tout à fait…', body, buttons, className: res.ok ? 'is-good' : 'is-bad', sess, dismissible: false });
  if (choice === 'next') openLesson(nextL);
  else if (choice === 'retry') openLesson(L, true);
  else if (choice === 'free') startSession(null);
  else exitToLobby();
}

let confettiFn = null;
let confettiCanvas = null;
function celebrate() {
  if (reduceMotion() || !window.confetti || typeof window.confetti.create !== 'function') return;
  try {
    // Sans worker : la CSP du site interdit les workers créés depuis un blob:
    // Toile placée dans le Dojo pour rester visible en plein écran ; recréée après chaque rendu
    if (!confettiFn || !confettiCanvas.isConnected) {
      confettiCanvas = h('canvas', { class: 'dj-confetti', 'aria-hidden': 'true' });
      ROOT.appendChild(confettiCanvas);
      confettiFn = window.confetti.create(confettiCanvas, { resize: true, useWorker: false });
    }
    confettiFn({ particleCount: 110, spread: 75, origin: { y: 0.55 }, colors: ['#f59e0b', '#d97706', '#fde68a', '#ffffff', '#ef4444'], disableForReducedMotion: true });
  } catch (e) { /* décoratif */ }
}

function showCrash() {
  const layer = $('#dj-modal-layer') || ROOT;
  setModalOpen(true);
  layer.appendChild(h('div', { class: 'dj-modal', role: 'alertdialog' }, h('div', { class: 'dj-modal-card' },
    h('h3', { class: 'dj-modal-title', text: 'Oups, la partie s’est interrompue' }),
    h('p', { text: 'Un incident inattendu est survenu. Il nous a été signalé automatiquement.' }),
    h('div', { class: 'dj-modal-actions' }, h('button', { type: 'button', class: 'dj-btn dj-btn-primary', onclick: exitToLobby }, 'Retour au Dojo'))
  )));
}

// ── Accueil du Dojo ────────────────────────────────────────────────────────

function beltIcon(belt, big) {
  return h('span', { class: 'dj-belt' + (big ? ' is-big' : ''), style: { '--belt': BELT_COLORS[belt] }, 'aria-hidden': 'true' }, h('i'));
}

function openLesson(L, retry) {
  if (retry) {
    startSession(L);
    return;
  }
  // L'accueil reste affiché sous la fenêtre de présentation de la leçon
  renderLobby();
  const body = h('div', { class: 'dj-intro' },
    h('div', { class: 'dj-intro-head' }, beltIcon(L.belt, true), h('span', { class: 'dj-kicker', text: L.beltName })),
    h('ul', { class: 'dj-intro-list' }, L.intro.map(t => h('li', { html: t }))),
    L.showCards ? h('div', { class: 'dj-intro-cards' }, L.showCards.map(id => cardEl(E.cardById(id)))) : null
  );
  modal({
    title: L.title,
    body,
    buttons: [{ label: 'Retour', value: false }, { label: 'Commencer', value: true, primary: true }]
  }).then(ok => {
    if (ok) startSession(L);
    else renderLobby();
  });
}

function nextLesson() {
  return LESSONS.find(L => !store.belts[L.id]) || null;
}

function segmented(label, key, options) {
  const group = h('div', { class: 'dj-seg', role: 'radiogroup', 'aria-label': label });
  for (const [value, text] of options) {
    const on = String(store.settings[key]) === String(value);
    group.appendChild(h('button', {
      type: 'button',
      role: 'radio',
      'aria-checked': String(on),
      class: on ? 'is-on' : '',
      onclick: () => {
        store.settings[key] = typeof store.settings[key] === 'number' ? Number(value) : value;
        saveStore();
        renderLobby(true);
      }
    }, text));
  }
  return h('div', { class: 'dj-field' }, h('span', { class: 'dj-field-label', text: label }), group);
}

function renderLobby(keepFocus) {
  const focusedText = keepFocus && document.activeElement && ROOT.contains(document.activeElement) ? document.activeElement.textContent : null;
  const focusedGroup = focusedText && document.activeElement.closest('.dj-seg') ? document.activeElement.closest('.dj-seg').getAttribute('aria-label') : null;
  S = null;
  resetUi();
  ROOT.innerHTML = '';
  ROOT.classList.remove('is-playing');
  setModalOpen(false);
  const earned = LESSONS.filter(L => store.belts[L.id]).length;
  const nl = nextLesson();
  const st = store.stats;
  const pctExact = st.bets ? Math.round((st.exact / st.bets) * 100) : null;

  const hero = h('div', { class: 'dj-hero' },
    h('div', { class: 'dj-sensei is-big', 'aria-hidden': 'true' }),
    h('div', { class: 'dj-hero-text' },
      h('p', { class: 'dj-kicker', text: 'Le Dojo KYRAN' }),
      h('h2', { class: 'dj-hero-title', text: earned === LESSONS.length ? 'Salut, Maître des Mystiques.' : earned ? 'Bon retour, élève.' : 'Deviens Maître des Mystiques' }),
      h('p', { class: 'dj-hero-sub', text: earned ? `${earned} ceinture${earned > 1 ? 's' : ''} sur ${LESSONS.length}. ${nl ? 'Prochaine étape : ' + nl.title.charAt(0).toLowerCase() + nl.title.slice(1) + '.' : 'Le parcours est terminé : défie les Maîtres en partie libre.'}` : 'Sept leçons guidées par le Sensei, puis des parties contre l’ordinateur. Aucune inscription, rien à installer.' }),
      h('div', { class: 'dj-belt-track', 'aria-label': `${earned} ceintures obtenues sur ${LESSONS.length}` }, LESSONS.map(L => h('span', { class: 'dj-belt-pip' + (store.belts[L.id] ? ' is-on' : ''), style: { '--belt': BELT_COLORS[L.belt] }, title: L.beltName }))),
      h('div', { class: 'dj-hero-cta' },
        nl ? h('button', { type: 'button', class: 'dj-btn dj-btn-primary dj-btn-lg', onclick: () => openLesson(nl) }, earned ? `Continuer : ${nl.title}` : 'Commencer la leçon 1') : null,
        h('button', { type: 'button', class: 'dj-btn ' + (nl ? 'dj-btn-ghost' : 'dj-btn-primary') + ' dj-btn-lg', onclick: () => startSession(null) }, earned ? 'Partie libre' : 'Je connais les règles : jouer')
      )
    )
  );

  const path = h('div', { class: 'dj-path', role: 'region', 'aria-labelledby': 'dj-path-title' },
    h('h3', { id: 'dj-path-title', class: 'dj-h3', text: 'Le parcours des ceintures' }),
    h('ol', { class: 'dj-lessons' }, LESSONS.map((L, i) => {
      const done = !!store.belts[L.id];
      const isNext = nl === L;
      return h('li', {},
        h('button', { type: 'button', class: 'dj-lesson' + (done ? ' is-done' : '') + (isNext ? ' is-next' : ''), onclick: () => openLesson(L) },
          beltIcon(L.belt),
          h('span', { class: 'dj-lesson-text' },
            h('span', { class: 'dj-lesson-kicker', text: `${i + 1}. ${L.beltName}` }),
            h('b', { text: L.title }),
            h('span', { class: 'dj-lesson-sum', text: L.summary })
          ),
          h('span', { class: 'dj-lesson-state', text: done ? '✓' : isNext ? 'À faire' : '' })
        )
      );
    }))
  );

  const free = h('div', { class: 'dj-free', role: 'region', 'aria-labelledby': 'dj-free-title' },
    h('h3', { id: 'dj-free-title', class: 'dj-h3', text: 'Partie libre' }),
    h('p', { class: 'dj-free-sub', text: 'Toutes les règles de la boîte, contre l’ordinateur. Le Sensei reste disponible avec le bouton Conseil.' }),
    segmented('Adversaires', 'opponents', [[2, '2'], [3, '3'], [4, '4'], [5, '5']]),
    segmented('Niveau', 'level', [['novice', 'Novice'], ['adepte', 'Adepte'], ['maitre', 'Maître']]),
    segmented('Durée', 'length', [['rapide', 'Rapide · 4 manches'], ['complete', 'Complète']]),
    segmented('Règles', 'rules', [['completes', 'Toutes'], ['initiation', 'Initiation']]),
    h('p', { class: 'dj-field-help', text: settingsHelp() }),
    h('button', { type: 'button', class: 'dj-btn dj-btn-primary dj-btn-block', onclick: () => startSession(null) }, 'Lancer la partie'),
    st.games || st.bets ? h('dl', { class: 'dj-stats' },
      h('div', {}, h('dt', { text: 'Parties' }), h('dd', { text: String(st.games) })),
      h('div', {}, h('dt', { text: 'Victoires' }), h('dd', { text: String(st.wins) })),
      h('div', {}, h('dt', { text: 'Paris exacts' }), h('dd', { text: pctExact == null ? '–' : pctExact + ' %' })),
      h('div', {}, h('dt', { text: 'Meilleure série' }), h('dd', { text: String(st.bestStreak) }))
    ) : null
  );

  ROOT.appendChild(h('div', { class: 'dj-lobby' }, hero, h('div', { class: 'dj-cols' }, path, free)));
  ROOT.appendChild(h('div', { class: 'dj-modal-layer', id: 'dj-modal-layer' }));
  if (focusedGroup) {
    const btn = [...ROOT.querySelectorAll(`.dj-seg[aria-label="${focusedGroup}"] button`)].find(b => b.textContent === focusedText);
    if (btn) btn.focus({ preventScroll: true });
  }
}

function settingsHelp() {
  const s = store.settings;
  const n = s.opponents + 1;
  const len = s.length === 'rapide' ? 'manches de 4, 3, 2 cartes puis la manche Mystique' : 'cycles de 7 à 2 cartes puis la manche Mystique, jusqu’à la première élimination';
  const rules = s.rules === 'initiation' ? 'sans carte Pouvoir ni Mystique (variante d’initiation)' : `avec la Mystique et ${n >= 5 ? 'les 8 cartes Pouvoir' : 'les 4 cartes Pouvoir'}`;
  return `${n} joueurs, ${len}, ${rules}.`;
}

// ── Démarrage ──────────────────────────────────────────────────────────────

function init() {
  ROOT.classList.add('dj');
  ROOT.removeAttribute('aria-busy');
  renderLobby();
  let t;
  window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(layoutHand, 120); });
  document.addEventListener('keydown', e => {
    if (!S || !S.resolveHuman || e.target.closest('input,textarea,select')) return;
    if ($('#dj-modal-layer .dj-modal')) return;
    const pend = S.state.pending;
    if (pend && pend.type === 'bet' && /^[0-9]$/.test(e.key)) {
      const b = Number(e.key);
      if (E.legalBets(S.state, 0).includes(b) && (!S.gate || !S.gate.bets || S.gate.bets.includes(b))) act0({ type: 'bet', pid: 0, value: b });
    }
  });
  // Préchargement discret des images de cartes (fluidité des premières donnes)
  const preload = () => {
    for (let v = 1; v <= 37; v++) { if (!DRAWN[v]) { const i = new Image(); i.src = `/card-${v}.jpg`; } }
  };
  if ('requestIdleCallback' in window) window.requestIdleCallback(preload, { timeout: 4000 });
  else setTimeout(preload, 2500);
}

if (ROOT) init();
