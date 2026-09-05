/**
 * Script de gestion et d'envoi de pitchs presse / blogueurs pour KYRAN
 * Usage:
 *   node scripts/send-press-pitch.mjs --list
 *   node scripts/send-press-pitch.mjs --target ludovox --dry-run
 *   node scripts/send-press-pitch.mjs --target ludovox --send
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendMail } from './send-mail-ovh.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const targets = JSON.parse(fs.readFileSync(path.join(__dirname, 'presse-outreach.json'), 'utf8'));

const args = process.argv.slice(2);
const isList = args.includes('--list');
const isDryRun = args.includes('--dry-run') || (!args.includes('--send') && !isList);
const targetIndex = args.indexOf('--target');
const targetId = targetIndex !== -1 ? args[targetIndex + 1] : null;

if (isList || !targetId) {
  console.log('\n=== LISTE DES 15 MÉDIAS & BLOGUEURS CIBLES (NETLINKING JEUX DE SOCIÉTÉ) ===\n');
  targets.forEach((t, i) => {
    console.log(`[${i + 1}] ID: ${t.id} | Nom: ${t.name} (${t.type})`);
    console.log(`    Contact: ${t.contact} | Site: ${t.website}`);
    console.log(`    Angle: ${t.hook}\n`);
  });
  console.log('Utilisation : node scripts/send-press-pitch.mjs --target <id> [--dry-run | --send]\n');
  process.exit(0);
}

const target = targets.find(t => t.id === targetId);
if (!target) {
  console.error(`❌ Média "${targetId}" non trouvé dans scripts/presse-outreach.json`);
  process.exit(1);
}

const subject = `Proposition de boîte test : KYRAN — Jeu de cartes français (plis, paris & pouvoirs)`;

const textBody = `Bonjour l'équipe de ${target.name},

Je suis Corentin Sence, auteur et créateur de KYRAN, un jeu de cartes indépendant français commercialisé en 2026.

Je suis votre travail avec attention sur ${target.website} et je pense que KYRAN pourrait particulièrement plaire à vos lecteurs : ${target.hook}.

En quelques mots :
- Principe : un jeu de plis et de contrat pour 3 à 6 joueurs où l'on parie son nombre exact de levées (inspiré du Tarot Africain et du Whist 22).
- Le twist : la somme des paris ne peut jamais égaler le total des plis, garantissant l'échec d'au moins un joueur à chaque tour.
- Les nouveautés : 4 cartes Pouvoir, des vies physiques sur table, et la "manche Mystique" jouée à l'aveugle.
- Format : 30 minutes, boîte cloche compacte et cartes toilées Dark & Gold (illustrations Floh).

Je serais ravi de vous envoyer gracieusement un exemplaire officiel du jeu pour que vous puissiez le tester en équipe ou en famille. Si le jeu vous plaît, une chronique ou un partage serait un immense coup de pouce pour ce projet indépendant.

Si vous êtes partants, il vous suffit de me répondre avec votre adresse postale d'expédition préférée.

Dossier de presse et règles complètes : https://kyran-jeu.fr/dossier-presse.html
Vidéo explicative (5 min) : https://kyran-jeu.fr/regle.html

Bien amicalement,

Corentin Sence
Auteur de KYRAN
contact@kyran-jeu.fr
https://kyran-jeu.fr
`;

const htmlBody = `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222; max-width: 600px; margin: 0 auto; padding: 20px;">
  <p>Bonjour l'équipe de <strong>${target.name}</strong>,</p>

  <p>Je suis Corentin Sence, auteur et créateur de <strong>KYRAN</strong>, un jeu de cartes indépendant français commercialisé en 2026.</p>

  <p>Je suis votre travail avec attention sur <a href="${target.website}" style="color: #c8a85d;">${target.name}</a> et je pense que KYRAN pourrait particulièrement plaire à vos lecteurs : <em>${target.hook}</em>.</p>

  <div style="background: #faf8f3; border-left: 4px solid #c8a85d; padding: 14px 18px; margin: 18px 0; border-radius: 6px;">
    <strong>En résumé :</strong>
    <ul style="margin: 8px 0 0 18px; padding: 0;">
      <li><strong>Mécanique :</strong> Jeu de plis et de contrat (3 à 6 joueurs) où l'on parie son nombre exact de levées (revisite du Tarot Africain / Whist 22).</li>
      <li><strong>Règle signature :</strong> La somme des paris ne peut jamais égaler le total des plis — tension permanente.</li>
      <li><strong>Twists modernes :</strong> 4 cartes Pouvoir, 5 vies physiques, et la manche Mystique jouée à l'aveugle.</li>
      <li><strong>Édition :</strong> 55 cartes toilées Dark & Gold (illustrations Floh), parties de 30 min.</li>
    </ul>
  </div>

  <p>Je serais ravi de vous expédier gracieusement un <strong>exemplaire officiel</strong> pour vos tests et chroniques. Si le jeu vous séduit, un article ou un mot sur votre média nous apporterait un soutien précieux.</p>

  <p>Si vous êtes partants, répondez simplement à ce mail avec votre adresse d'expédition postale.</p>

  <p style="margin-top: 24px;">
    👉 <a href="https://kyran-jeu.fr/dossier-presse.html" style="color: #1a1a1a; font-weight: bold;">Consulter l'espace presse officiel</a><br />
    👉 <a href="https://kyran-jeu.fr/regle.html" style="color: #1a1a1a; font-weight: bold;">Voir la vidéo de règles (5 minutes)</a>
  </p>

  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
  <p style="font-size: 0.9rem; color: #666;">
    <strong>Corentin Sence</strong><br />
    Auteur de KYRAN<br />
    <a href="mailto:contact@kyran-jeu.fr" style="color: #666;">contact@kyran-jeu.fr</a> — <a href="https://kyran-jeu.fr" style="color: #666;">kyran-jeu.fr</a>
  </p>
</div>
`;

console.log(`\n=== PITCH POUR : ${target.name} (${target.contact}) ===\n`);
console.log(`Sujet : ${subject}\n`);

if (isDryRun) {
  console.log('--- APERÇU TEXTE DU MESSAGE ---');
  console.log(textBody);
  console.log('\n[MODE DRY-RUN] Aucun email envoyé. Pour envoyer réellement, ajoutez l\'option --send.');
} else {
  // Envoi réel via SMTP
  const pass = process.env.OVH_SMTP_PASSWORD || process.env.SMTP_PASS;
  if (!pass) {
    console.error('❌ Mot de passe SMTP OVH manquant. Définissez OVH_SMTP_PASSWORD dans .env');
    process.exit(1);
  }

  console.log(`Envoi en cours à ${target.contact}...`);
  sendMail({
    to: target.contact,
    subject,
    text: textBody,
    html: htmlBody,
    pass
  })
    .then(() => console.log(`✅ Pitch envoyé avec succès à ${target.name} (${target.contact}) !`))
    .catch(err => console.error(`❌ Erreur d'envoi :`, err.message));
}
