"""Génère le dossier de presse PDF et le kit presse ZIP de KYRAN.

Usage (depuis la racine du dépôt) : python scripts/presse/build_kit.py
Sorties : presse/kyran-dossier-de-presse.pdf et presse/kyran-kit-presse.zip
Besoins : Pillow, Google Chrome (impression PDF sans fenêtre).
"""
import datetime
import io
import os
import shutil
import subprocess
import sys
import tempfile
import time
import zipfile

from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SRC = os.path.join(ROOT, 'scripts', 'presse')
OUT = os.path.join(ROOT, 'presse')
MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août',
        'septembre', 'octobre', 'novembre', 'décembre']
CHROME = [
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    r'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
]

# (fichier du dépôt, chemin dans le zip) ; un .webp est converti au format du nom cible.
FICHIERS = [
    ('presse/visuels/kyran-logo.png', '02-logos/kyran-logo-complet.png'),
    ('presse/visuels/kyran-embleme.png', '02-logos/kyran-embleme-rond.png'),
    ('presse/visuels/kyran-singe.png', '02-logos/kyran-singe.png'),
    ('boite-recto-kyran.png', '03-boite/kyran-boite-recto.png'),
    ('boite-verso-kyran.webp', '03-boite/kyran-boite-verso.png'),
] + [(f'presse/visuels/cartes/{nom}', f'04-cartes/{nom}') for nom in (
    'kyran-carte-mystique.jpg',
    'kyran-pouvoir-sceau-du-destin-4.jpg', 'kyran-pouvoir-sceau-du-destin-27.jpg',
    'kyran-pouvoir-clairvoyance-antique-11.jpg', 'kyran-pouvoir-clairvoyance-antique-23.jpg',
    'kyran-pouvoir-benediction-des-ancetres-9.jpg', 'kyran-pouvoir-benediction-des-ancetres-20.jpg',
    'kyran-pouvoir-voile-du-neant-3.jpg', 'kyran-pouvoir-voile-du-neant-34.jpg',
    'kyran-carte-nombre-4.jpg', 'kyran-carte-nombre-10.jpg', 'kyran-carte-nombre-16.jpg',
    'kyran-carte-nombre-22.jpg', 'kyran-carte-nombre-28.jpg', 'kyran-carte-nombre-34.jpg',
    'kyran-carte-vie.jpg', 'kyran-dos-de-carte.jpg',
)] + [
    ('kyran-cartes-table.jpg', '05-photos/kyran-partie-sur-table.jpg'),
    ('kyran-cartes-pouvoirs.jpg', '05-photos/kyran-visuel-cartes-pouvoir.jpg'),
    ('jeu-kyran-ami.webp', '05-photos/kyran-partie-entre-amis.jpg'),
    ('regle-kyran.pdf', '06-regles/kyran-regles.pdf'),
    ('video/kyran-en-60-secondes.mp4', '07-video/kyran-en-60-secondes.mp4'),
    ('video/kyran-en-60-secondes-vertical.mp4', '07-video/kyran-en-60-secondes-vertical.mp4'),
]


def date_fr(d):
    return f'{d.day} {MOIS[d.month - 1]} {d.year}'


def chrome():
    for path in CHROME:
        if os.path.exists(path):
            return path
    found = shutil.which('chrome') or shutil.which('google-chrome') or shutil.which('chromium')
    if not found:
        sys.exit('Chrome introuvable : il sert à imprimer le dossier en PDF. Installez Google Chrome ou Chromium.')
    return found


def pdf(date):
    html = open(os.path.join(SRC, 'dossier.html'), encoding='utf-8').read().replace('{{DATE}}', date)
    # Le gabarit pointe vers ../../ (racine du dépôt) : la copie reste dans scripts/presse.
    tmp = os.path.join(SRC, '_dossier.tmp.html')
    cible = os.path.join(OUT, 'kyran-dossier-de-presse.pdf')
    open(tmp, 'w', encoding='utf-8').write(html)
    if os.path.exists(cible):
        os.remove(cible)
    profil = tempfile.mkdtemp(prefix='kyran-pdf-')
    proc = subprocess.Popen([
        chrome(), '--headless=new', '--disable-gpu', '--no-first-run', '--disable-extensions',
        f'--user-data-dir={profil}', '--no-pdf-header-footer',
        f'--print-to-pdf={cible}', 'file:///' + tmp.replace('\\', '/'),
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    # Sous Windows, Chrome écrit le PDF puis reste parfois ouvert : on attend un fichier stable.
    taille, fin = -1, time.time() + 120
    try:
        while time.time() < fin and proc.poll() is None:
            time.sleep(1)
            if os.path.exists(cible) and os.path.getsize(cible) == taille > 0:
                break
            taille = os.path.getsize(cible) if os.path.exists(cible) else -1
    finally:
        if proc.poll() is None:
            proc.kill()
            proc.wait()
        os.remove(tmp)
        shutil.rmtree(profil, ignore_errors=True)
    if not os.path.exists(cible) or os.path.getsize(cible) == 0:
        sys.exit(f'Impression PDF échouée : aucun fichier écrit en 120 s par {chrome()} (code {proc.returncode}).')
    try:
        import pymupdf  # facultatif : Chrome garde les images sans perte, on les repasse en JPEG
    except ImportError:
        print("pymupdf absent : PDF laissé tel quel (pip install pymupdf pour l alléger)")
        return cible
    doc = pymupdf.open(cible)
    doc.rewrite_images(dpi_threshold=300, dpi_target=250, quality=82)
    leger = cible + '.tmp'
    doc.save(leger, garbage=4, deflate=True)
    doc.close()
    os.replace(leger, cible)
    return cible


def ajouter(z, src, dst):
    chemin = os.path.join(ROOT, src)
    if not os.path.exists(chemin):
        sys.exit(f'Fichier du kit absent du dépôt : {src}')
    if src.endswith('.webp'):
        im = Image.open(chemin)
        buf = io.BytesIO()
        if dst.endswith('.jpg'):
            im.convert('RGB').save(buf, 'JPEG', quality=90, optimize=True)
        else:
            im.save(buf, 'PNG', optimize=True)
        z.writestr(dst, buf.getvalue(), compress_type=zipfile.ZIP_DEFLATED)
    else:
        deja = dst.endswith(('.png', '.jpg', '.mp4', '.pdf'))
        z.write(chemin, dst, compress_type=zipfile.ZIP_STORED if deja else zipfile.ZIP_DEFLATED)


def main():
    os.makedirs(OUT, exist_ok=True)
    date = date_fr(datetime.date.today())
    cible_pdf = pdf(date)
    zip_path = os.path.join(OUT, 'kyran-kit-presse.zip')
    base = 'kyran-kit-presse/'
    with zipfile.ZipFile(zip_path, 'w') as z:
        for nom, dst in (('LISEZ-MOI.txt', 'LISEZ-MOI.txt'),
                         ('communique.txt', '01-dossier-de-presse/kyran-communique.txt')):
            texte = open(os.path.join(SRC, nom), encoding='utf-8').read().replace('{{DATE}}', date)
            z.writestr(base + dst, texte.replace('\n', '\r\n').encode('utf-8-sig'), compress_type=zipfile.ZIP_DEFLATED)
        z.write(cible_pdf, base + '01-dossier-de-presse/kyran-dossier-de-presse.pdf', compress_type=zipfile.ZIP_DEFLATED)
        for src, dst in FICHIERS:
            ajouter(z, src, base + dst)
    print(f'PDF : {os.path.getsize(cible_pdf) // 1024} Ko · ZIP : {os.path.getsize(zip_path) // 1024} Ko ({len(FICHIERS) + 3} fichiers)')


if __name__ == '__main__':
    main()
