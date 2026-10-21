# Mission : routine « Santé quotidienne de KYRAN » → renvoi exécutable

**Depuis le 2026-10-21 cette routine exécute la mission Surveillance & réparation : lis et exécute en entier
[`_notes/surveillance-reparation-routine-mission.md`](surveillance-reparation-routine-mission.md) sur
`origin/main` ; ses livrables (rapport e-mail quotidien, [`_notes/suivi-surveillance.md`](suivi-surveillance.md),
`docs/rapports/surveillance/`) remplacent ceux annoncés par la consigne de la routine (`suivi-sante.md` n'est plus
tenu).**

Concrètement : `git fetch origin main`, puis `git show origin/main:_notes/surveillance-reparation-routine-mission.md`
et suivre ce fichier de bout en bout (A recherche, B réparation, C garde-fous, D rapport). Ne pas écrire dans
`_notes/suivi-sante.md` ni dans `docs/rapports/sante/` : le journal est `_notes/suivi-surveillance.md`, le rapport
`docs/rapports/surveillance/AAAA-MM-JJ.md`, et le rapport part par e-mail à kyran.jeu@gmail.com.

Cette consigne reprend tous les contrôles de l'ancienne routine santé de minuit et la réparation des incidents de
production (ancien pipeline GitHub Actions « Hourly Auto-Heal », désormais manuel). Historique des anciens runs :
[`suivi-sante.md`](suivi-sante.md) et `docs/rapports/sante/`.
