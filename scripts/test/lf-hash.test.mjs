import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import crypto from 'crypto';
import { readLf, toLf } from '../lib/lf.mjs';

const sha1 = s => crypto.createHash('sha1').update(s).digest('hex');

test('toLf : CRLF ramené en LF, LF inchangé', () => {
  assert.equal(toLf('a\r\nb\r\n'), 'a\nb\n');
  assert.equal(toLf('a\nb\n'), 'a\nb\n');
});

test('readLf : même empreinte pour un fichier extrait en CRLF (Windows) ou en LF (CI)', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lf-'));
  const text = "body { color: #222; }\n/* « accent » é */\n";
  fs.writeFileSync(path.join(dir, 'lf.css'), text);
  fs.writeFileSync(path.join(dir, 'crlf.css'), text.replace(/\n/g, '\r\n'));
  assert.equal(sha1(readLf(path.join(dir, 'crlf.css'))), sha1(readLf(path.join(dir, 'lf.css'))));
  // Pour un fichier en LF, l'empreinte reste celle des octets bruts : aucun ?v= ne change sur la CI.
  assert.equal(sha1(readLf(path.join(dir, 'lf.css'))), sha1(fs.readFileSync(path.join(dir, 'lf.css'))));
  fs.rmSync(dir, { recursive: true, force: true });
});
