/**
 * Lecture « fins de ligne LF » pour les empreintes ?v= : un fichier extrait en CRLF (Windows,
 * core.autocrlf=true) doit donner la même empreinte que sur la CI Linux. Sans cela, un build
 * lancé sous Windows réécrit les ?v= de presque toutes les pages (leçons du 2026-11-02 et du
 * 2026-11-10). Pour un fichier déjà en LF, l'empreinte est identique à celle des octets bruts.
 */
import fs from 'fs';

export const toLf = text => text.replace(/\r\n/g, '\n');
export const readLf = file => toLf(fs.readFileSync(file, 'utf8'));
