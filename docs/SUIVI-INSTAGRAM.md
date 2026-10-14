# Suivi des contacts Instagram (influenceurs, bars à jeux)

Tableur de suivi des DM envoyés depuis @kyran.jeu : qui a été contacté, qui a répondu, à qui un jeu a été
envoyé, qui a publié. Les données sont privées : elles vivent dans `_outreach/`, ignoré par git (le site est
servi tel quel par GitHub Pages, tout fichier commité serait public).

| Fichier | Rôle |
| --- | --- |
| `scripts/outreach/creer-suivi.py` | Crée le modèle vierge `_outreach/KYRAN-suivi-influenceurs.xlsx` (onglets Tableau de bord, Suivi DM, Mode d'emploi, Listes) |
| `scripts/outreach/remplir-suivi.py contacts.json` | Ajoute ou complète les contacts dans « Suivi DM » ; le tableau de bord se recalcule à l'ouverture |

Le statut (DM sans réponse / Réponse, pas d'envoi / Jeu envoyé / Jeu envoyé + publié) est une formule : il
découle des colonnes « A répondu ? », « Jeu envoyé ? » et « Publication faite ? ».

## Remplissage automatique depuis les DM (Claude Code + Chrome)

Instagram exige une session connectée : le relevé se fait sur le poste local, pas dans une session cloud.

1. Installer l'extension Claude in Chrome, ouvrir Chrome connecté au compte @kyran.jeu.
2. Dans le dossier du repo : `claude --chrome` (ou `/chrome` dans une session déjà ouverte).
3. Coller le prompt ci-dessous.

```text
Relève mes conversations Instagram de @kyran.jeu et remplis le tableur de suivi (docs/SUIVI-INSTAGRAM.md).

Lecture seule sur Instagram : n'envoie aucun message, ne réagis à rien, n'accepte ni ne supprime aucune
demande. Ne recopie ni adresse postale ni numéro de téléphone.

1. Si _outreach/KYRAN-suivi-influenceurs.xlsx n'existe pas : python scripts/outreach/creer-suivi.py
2. Dans Chrome, ouvre https://www.instagram.com/direct/inbox/ et parcours jusqu'en bas les onglets
   Principale, Générale et Demandes. Garde seulement les conversations liées à la promotion du jeu
   (influenceurs, bars à jeux, boutiques, ludothèques, médias, associations).
3. Pour chacune : remonte au premier message, puis ouvre le profil (abonnés, lien en bio, ville si indiquée,
   publications mentionnant KYRAN).
4. Toutes les 10 conversations, écris _outreach/contacts.json (liste d'objets, clés ci-dessous) et lance
   python scripts/outreach/remplir-suivi.py _outreach/contacts.json — les doublons sont fusionnés.
5. À la fin, donne le bilan : contactés, réponses, jeux envoyés, publications, et les cas douteux.

Clés (toutes facultatives sauf nom ou compte) :
nom, type (Influenceur | Bar à jeux | Boutique de jeux | Ludothèque | Média / blog | Association | Autre),
compte (@pseudo), url_instagram, abonnes (nombre ou « 12,5 k »), ville, date_premier_dm (JJ/MM/AAAA),
a_repondu (Oui | Non), date_reponse, resume_reponse (une phrase), jeu_envoye (Oui | Non), nb_jeux,
date_envoi, retour_jeu (Très positif | Positif | Neutre | Négatif | Pas encore joué),
publication (Oui | Non | Prévue | Refus), date_publication, lien_publication, site_web (site ou fiche
Google Maps du bar), contact (email), prochaine_action, notes.

Règles : jeu_envoye = Oui seulement si la conversation le prouve (adresse reçue puis envoi confirmé, numéro
de suivi, « bien reçu »). Au moindre doute : Non, et le doute dans notes. Case inconnue = clé absente.
N'invente rien.
```

Relancer le même prompt plus tard met le tableur à jour : les cases déjà remplies sont conservées
(`--ecraser` pour les remplacer).
