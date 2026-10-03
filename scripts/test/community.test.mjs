import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  extractCredit, stripCredits, cleanCaption, firstSentence, mediaBaseName, mp4Duration, isoDuration,
  communitySitemapExtra, shortcodeOf, shortcodeDate, embedUrl, trackToken, tokenStatus, addDays, daysBetween
} from '../lib/community.mjs';

test('crédit : marqueurs usuels dans une légende', () => {
  assert.equal(extractCredit('Super partie ! 📸 @Julie.Games'), 'julie.games');
  assert.equal(extractCredit('Crédit : @toto_42 #kyran'), 'toto_42');
  assert.equal(extractCredit('credits @a.b.'), 'a.b');
  assert.equal(extractCredit('Merci à @lea pour la vidéo'), 'lea');
  assert.equal(extractCredit('Repost @soiree.jeux'), 'soiree.jeux');
  assert.equal(extractCredit('🎥 via @club_ludique'), 'club_ludique');
});

test('crédit : ignoré sans marqueur ou vers @kyran.jeu', () => {
  assert.equal(extractCredit('Nouvelle boîte, suivez @kyran.jeu'), null);
  assert.equal(extractCredit('📸 @kyran.jeu'), null);
  assert.equal(extractCredit('Partie avec @lea et @tom'), null);
  assert.equal(extractCredit('contact@kyran-jeu.fr'), null);
  assert.equal(extractCredit(''), null);
  assert.equal(extractCredit(undefined), null);
  assert.equal(extractCredit('📸 @kyran.jeu · photo de @lea'), 'lea');
});

test('légende : crédits et hashtags retirés, longueur bornée', () => {
  assert.equal(stripCredits('Partie de folie. Merci à @toto !'), 'Partie de folie.');
  assert.equal(stripCredits('📸 @julie.games'), '');
  assert.equal(cleanCaption('Belle soirée\n\n#kyran #jeudecartes #apero'), 'Belle soirée');
  assert.equal(cleanCaption('Belle soirée #kyran #apero'), 'Belle soirée');
  assert.equal(cleanCaption('Une #kyran soirée'), 'Une #kyran soirée');
  assert.ok(cleanCaption('mot '.repeat(200), 50).length <= 51);
  assert.equal(firstSentence('Première phrase. Seconde phrase.'), 'Première phrase.');
});

test('nom de fichier stable et descriptif', () => {
  const post = { id: '17890000000123456', date: '2026-02-03T18:22:10+00:00', credit: 'Julie.Games' };
  assert.equal(mediaBaseName(post, 0, 1), 'kyran-2026-02-03-julie-games-123456');
  assert.equal(mediaBaseName(post, 1, 3), 'kyran-2026-02-03-julie-games-123456-2');
});

test('durée MP4 (boîte mvhd v0) et format ISO 8601', () => {
  const buf = Buffer.alloc(40);
  buf.write('mvhd', 4, 'ascii');
  buf.writeUInt8(0, 8); // version
  buf.writeUInt32BE(1000, 8 + 12); // timescale
  buf.writeUInt32BE(83500, 8 + 16); // durée
  assert.equal(mp4Duration(buf), 84);
  assert.equal(mp4Duration(Buffer.from('rien')), null);
  assert.equal(isoDuration(84), 'PT1M24S');
  assert.equal(isoDuration(42), 'PT42S');
  assert.equal(isoDuration(120), 'PT2M');
});

test('sitemap : image:image et video:video échappés', () => {
  const xml = communitySitemapExtra([{
    id: '1', credit: 'a&b', caption: 'Soirée <top>', date: '2026-02-03T18:22:10+00:00',
    media: [
      { type: 'image', src: '/communaute/x.jpg' },
      { type: 'video', src: '/communaute/y.mp4', poster: '/communaute/y-poster.jpg', duration: 30 }
    ]
  }]);
  assert.match(xml, /<image:loc>https:\/\/kyran-jeu\.fr\/communaute\/x\.jpg<\/image:loc>/);
  assert.match(xml, /<video:content_loc>https:\/\/kyran-jeu\.fr\/communaute\/y\.mp4<\/video:content_loc>/);
  assert.match(xml, /<video:duration>30<\/video:duration>/);
  assert.ok(!xml.includes('<top>'));
  assert.ok(xml.includes('@a&amp;b'));
});

test('lien de publication : code court, date encodée, intégration', () => {
  assert.equal(shortcodeOf('https://www.instagram.com/p/DZc1cg_gsGK/'), 'DZc1cg_gsGK');
  assert.equal(shortcodeOf('https://www.instagram.com/reel/DWQe0vPjI1P/?igsh=abc'), 'DWQe0vPjI1P');
  assert.equal(shortcodeOf('https://instagram.com/kyran.jeu/p/DVSOYIvjmpk'), 'DVSOYIvjmpk');
  assert.equal(shortcodeOf('https://www.instagram.com/kyran.jeu/'), null);
  assert.equal(shortcodeOf('https://evil.example/p/DZc1cg_gsGK/'), null);
  assert.equal(shortcodeOf('javascript:alert(1)//instagram.com/p/x/'), null);
  // Reel du Pirate Ludique : publié le 16 mars 2026
  assert.equal(shortcodeDate('DV9BYIsjJgU'), '2026-03-16T17:19:41+00:00');
  assert.equal(shortcodeDate('DZc1cg_gsGK').slice(0, 10), '2026-06-11');
  assert.equal(shortcodeDate(null), null);
  assert.equal(embedUrl('DWQe0vPjI1P'), 'https://www.instagram.com/p/DWQe0vPjI1P/embed/');
});

test('jeton : empreinte adoptée, remplacement détecté, échéances', () => {
  // État initial commité : date connue, empreinte inconnue → adoptée sans changer la date
  let r = trackToken({ empreinte: '', enregistreLe: '2026-10-03' }, 'aaaa', '2026-10-05');
  assert.deepEqual(r.state, { empreinte: 'aaaa', enregistreLe: '2026-10-03' });
  assert.equal(r.replaced, false);
  // Même jeton : rien ne change
  r = trackToken(r.state, 'aaaa', '2026-10-20');
  assert.equal(r.changed, false);
  // Secret remplacé à la main : la date repart du jour
  r = trackToken(r.state, 'bbbb', '2026-11-25');
  assert.deepEqual(r.state, { empreinte: 'bbbb', enregistreLe: '2026-11-25' });
  assert.equal(r.replaced, true);

  assert.equal(addDays('2026-10-03', 60), '2026-12-02');
  assert.equal(daysBetween('2026-10-03', '2026-12-02'), 60);
  let st = tokenStatus({ enregistreLe: '2026-10-03' }, '2026-10-04');
  assert.deepEqual(st, { expiresOn: '2026-12-02', age: 1, daysLeft: 59, rotateDue: false, alert: false });
  st = tokenStatus({ enregistreLe: '2026-10-03' }, '2026-11-02');
  assert.equal(st.rotateDue, true);
  assert.equal(st.alert, false);
  st = tokenStatus({ enregistreLe: '2026-10-03' }, '2026-11-22');
  assert.equal(st.daysLeft, 10);
  assert.equal(st.alert, true);
});
