/**
 * Rapport Auto-Heal 24 h (email), envoyé UNIQUEMENT si le système a agi :
 * correctif déployé ou incident abandonné après 3 tentatives. Les fausses alertes
 * écartées sont listées en bas sans déclencher d'envoi à elles seules.
 */
import { escapeHtml } from './templates.js';
import { MAX_DAILY_AUTO_FIXES } from './incidents.js';

const GITHUB_REPO = 'Cmssmc-code/kyran-jeu';

const PARIS_DATE = new Intl.DateTimeFormat('fr-FR', {
  timeZone: 'Europe/Paris', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
});

function formatDate(iso) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '-' : PARIS_DATE.format(d).replace(' ', ' à ');
}

function whenLabel(inc) {
  const first = formatDate(inc.first_seen_at);
  const last = formatDate(inc.last_seen_at);
  return first === last ? `${inc.occurrences} fois, le ${first}` : `${inc.occurrences} fois, du ${first} au ${last}`;
}

function sourceLabel(source) {
  return source === 'client' ? 'Navigateur d\'un visiteur (site kyran-jeu.fr)' : 'Serveur (webhook Stripe / emails, Railway)';
}

function autoHealOf(inc) {
  const r = inc.details?.autoHeal;
  return r && typeof r === 'object' ? r : {};
}

function fallbackExplanation(inc) {
  const where = inc.source === 'client' ? 'Une erreur s\'est produite dans le navigateur' : 'Une requête au serveur a échoué';
  return `${where} sur ${inc.path || '-'}${inc.http_status ? ` (HTTP ${inc.http_status})` : ''}, ${inc.occurrences} fois.`;
}

function section(title, html) {
  return `<p style="margin:14px 0 4px;font-size:12px;font-weight:bold;letter-spacing:.04em;text-transform:uppercase;color:#6b7280;">${escapeHtml(title)}</p>
<div style="font-size:14px;color:#1f2937;line-height:1.5;">${html}</div>`;
}

function codeBox(text) {
  return `<pre style="margin:4px 0 0;padding:10px 12px;background:#f3f4f6;border-radius:6px;font-family:Menlo,Consolas,monospace;font-size:12px;color:#374151;white-space:pre-wrap;word-break:break-word;">${escapeHtml(text)}</pre>`;
}

function card(inc, kind) {
  const report = autoHealOf(inc);
  const accent = kind === 'fixed' ? '#047857' : '#b91c1c';
  const badge = kind === 'fixed' ? 'Corrigé et déployé' : 'Non corrigé — à regarder';
  const title = kind === 'fixed' && inc.resolution_summary ? inc.resolution_summary : (inc.message || inc.display_code);
  const parts = [section('Ce qui s\'est passé', escapeHtml(report.explanation || fallbackExplanation(inc)))];
  if (report.analysis) parts.push(section('Pourquoi', escapeHtml(report.analysis)));
  if (kind === 'fixed') {
    const changed = [];
    if (report.files?.length) changed.push(`Fichiers modifiés : ${report.files.map(f => `<code>${escapeHtml(f)}</code>`).join(', ')}`);
    if (inc.commit_sha) {
      const url = `https://github.com/${GITHUB_REPO}/commit/${encodeURIComponent(inc.commit_sha)}`;
      changed.push(`<a href="${escapeHtml(url)}" style="color:${accent};">Voir le changement sur GitHub (commit ${escapeHtml(inc.commit_sha.slice(0, 8))})</a>`);
    }
    if (changed.length) parts.push(section('Ce que l\'agent a changé', changed.join('<br>')));
  } else {
    parts.push(section('Pourquoi ce n\'est pas corrigé', escapeHtml(
      `L'agent a essayé ${inc.resolution_attempts} fois sans trouver de correctif sûr. Dernier blocage : ${inc.resolution_summary || '-'}`
    )));
  }
  const facts = [
    ['Quand', whenLabel(inc)],
    ['Où', sourceLabel(inc.source)],
    ['Page(s)', (inc.pages || [inc.path]).join(', ')],
    ['Navigateur', inc.details?.browser],
    ['Référence', inc.display_code],
    ['Incident', inc.id]
  ].filter(([, v]) => v).map(([k, v]) =>
    `<tr><td style="padding:4px 10px 4px 0;color:#6b7280;font-size:13px;vertical-align:top;white-space:nowrap;">${escapeHtml(k)}</td><td style="padding:4px 0;color:#111827;font-size:13px;word-break:break-word;">${escapeHtml(v)}</td></tr>`
  ).join('');
  const raw = inc.message ? section('Message d\'erreur brut', codeBox(String(inc.message).slice(0, 600))) : '';
  return `<div style="margin:16px 0;padding:16px 18px;border:1px solid #e5e7eb;border-left:4px solid ${accent};border-radius:8px;background:#fff;">
<span style="display:inline-block;padding:2px 8px;border-radius:999px;background:${accent};color:#fff;font-size:11px;font-weight:bold;">${badge}</span>
<span style="margin-left:6px;font-family:Menlo,Consolas,monospace;font-size:12px;color:#6b7280;">${escapeHtml(inc.display_code)}</span>
<h4 style="margin:8px 0 0;font-size:16px;color:#111827;">${escapeHtml(String(title).slice(0, 200))}</h4>
${parts.join('')}
<table style="width:100%;border-collapse:collapse;margin-top:12px;">${facts}</table>
${raw}
</div>`;
}

function textBlock(inc, kind) {
  const report = autoHealOf(inc);
  return [
    `[${kind === 'fixed' ? 'CORRIGÉ' : 'À REGARDER'}] ${inc.display_code} — ${inc.path || '-'}`,
    `Ce qui s'est passé : ${report.explanation || fallbackExplanation(inc)}`,
    report.analysis ? `Pourquoi : ${report.analysis}` : null,
    kind === 'fixed'
      ? `Correctif : ${inc.resolution_summary || '-'}${report.files?.length ? ` (${report.files.join(', ')})` : ''}`
      : `Bloqué après ${inc.resolution_attempts} tentative(s) : ${inc.resolution_summary || '-'}`,
    kind === 'fixed' && inc.commit_sha ? `Commit : https://github.com/${GITHUB_REPO}/commit/${inc.commit_sha}` : null,
    `Quand : ${whenLabel(inc)}`,
    inc.message ? `Message : ${String(inc.message).slice(0, 300)}` : null
  ].filter(Boolean).join('\n');
}

/** null si rien à signaler, sinon { subject, html, text }. */
export function renderDailyReport({ fixed, failed, ignored }) {
  if (!fixed.length && !failed.length) return null;
  const total = [...fixed, ...failed].reduce((s, inc) => s + (inc.occurrences || 0), 0);
  const ignoredHtml = ignored.length
    ? `<h3 style="margin:28px 0 4px;color:#111827;">Fausses alertes écartées (${ignored.length})</h3>
<p style="margin:0 0 8px;font-size:13px;color:#6b7280;">Pas de bug dans le code : robot, extension de navigateur, panne externe… Rien n'a été modifié.</p>
<ul style="padding-left:18px;font-size:13px;color:#374151;">${ignored.map(inc =>
  `<li style="margin-bottom:6px;"><strong>${escapeHtml(inc.display_code)}</strong> sur <code>${escapeHtml(inc.path || '-')}</code> (${inc.occurrences} fois) — ${escapeHtml(String(autoHealOf(inc).explanation || inc.resolution_summary || '-').slice(0, 300))}</li>`
).join('')}</ul>`
    : '';
  const html = `<!doctype html><html lang="fr"><body style="margin:0;padding:24px;background:#f8fafc;">
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:680px;margin:0 auto;color:#1f2937;">
<h2 style="color:#d97706;margin-bottom:8px;">Rapport Auto-Heal 24h — KYRAN</h2>
<p style="color:#4b5563;font-size:15px;">Sur les dernières 24 heures : <strong>${fixed.length} incident(s) corrigé(s)</strong> et déployé(s) automatiquement,
<strong>${failed.length} incident(s)</strong> que l'agent n'a pas pu corriger${ignored.length ? `, ${ignored.length} fausse(s) alerte(s) écartée(s)` : ''}.
Ces erreurs ont été vues <strong>${total} fois</strong> au total.</p>
<p style="font-size:14px;color:#166534;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px 16px;">Quota journalier utilisé : <strong>${fixed.length} / ${MAX_DAILY_AUTO_FIXES}</strong> auto-fixes.</p>
${failed.length ? `<h3 style="margin:28px 0 4px;color:#b91c1c;">À regarder : non corrigés après 3 tentatives (${failed.length})</h3>${failed.map(inc => card(inc, 'failed')).join('')}` : ''}
${fixed.length ? `<h3 style="margin:28px 0 4px;color:#047857;">Corrigés et déployés automatiquement (${fixed.length})</h3>
<p style="margin:0;font-size:13px;color:#6b7280;">Correctif vérifié (build + tests du site) puis poussé sur main : en ligne en quelques minutes (GitHub Pages / Railway).</p>${fixed.map(inc => card(inc, 'fixed')).join('')}` : ''}
${ignoredHtml}
<p style="font-size:13px;color:#6b7280;margin-top:24px;">Ce rapport n'est envoyé que les jours où le système a agi. Historique : workflow « Hourly Auto-Heal » sur GitHub Actions et journal <code>_notes/lecon.md</code>.</p>
</div></body></html>`;
  const parts = [`${fixed.length} corrigé(s)`];
  if (failed.length) parts.push(`${failed.length} à regarder`);
  return {
    subject: `[KYRAN Auto-Heal] Rapport 24h : ${parts.join(', ')}`,
    html,
    text: [
      `Rapport Auto-Heal 24h : ${fixed.length} corrigé(s), ${failed.length} non corrigé(s), ${ignored.length} fausse(s) alerte(s) écartée(s). Quota : ${fixed.length}/${MAX_DAILY_AUTO_FIXES}`,
      ...failed.map(inc => textBlock(inc, 'failed')),
      ...fixed.map(inc => textBlock(inc, 'fixed'))
    ].join('\n\n')
  };
}
