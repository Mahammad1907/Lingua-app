// Runs every check-*.cjs in this folder and prints one short summary (user, 25 Nov 2026).
//   node scripts/check-all.cjs          — all current checks
//   node scripts/check-all.cjs --old    — also the old checks of screens that are no longer shown
// A check that needs a package which is not installed here (e.g. react-test-renderer, zustand) is reported
// separately as “paket yoxdur” — it is not a failure of the lessons; run it where `npm install` was done.
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

// Checks of screens that the app no longer shows. Kept for reference; the user decides whether to delete them.
const OLD = {
  'check-chapter-journey.cjs': 'köhnə bölmə xəritəsi (ChapterJourney) — heç bir ekranda yoxdur; ana səhifə IslandHome-dur',
  'check-lesson-voice.cjs': 'köhnə PacketLesson ekranı — Bölmə 1 dərsləri DesignLesson-da açılır; izah overlay qaydası 2 Nov 2026-da dəyişib',
};

const dir = __dirname;
const withOld = process.argv.includes('--old');
const files = fs.readdirSync(dir).filter(f => /^check-.*\.cjs$/.test(f) && f !== 'check-all.cjs').sort();
const rows = { pass: [], fail: [], pkg: [], old: [] };
for (const file of files) {
  if (OLD[file] && !withOld) { rows.old.push(`${file} — ${OLD[file]}`); continue; }
  const run = spawnSync(process.execPath, [path.join(dir, file)], { encoding: 'utf8', timeout: 300000, cwd: path.join(dir, '..') });
  const out = `${run.stdout || ''}${run.stderr || ''}`;
  const missing = out.match(/Cannot find module '([^.'/][^']*)'/);
  if (run.status === 0) rows.pass.push(file);
  else if (missing) rows.pkg.push(`${file} — ${missing[1]}`);
  else {
    const reason = out.split('\n').find(l => /AssertionError|Error:|yoxlanmalıdır|FAIL/.test(l)) || `exit ${run.status ?? 'timeout'}`;
    rows.fail.push(`${file} — ${reason.trim().slice(0, 160)}`);
  }
}
const list = (title, items) => items.length && console.log(`\n${title} (${items.length}):\n  ${items.join('\n  ')}`);
console.log(`check-all: ${rows.pass.length} keçdi, ${rows.fail.length} səhv, ${rows.pkg.length} paket yoxdur, ${rows.old.length} köhnə (işlədilmədi)`);
list('SƏHV', rows.fail);
list('Paket yoxdur (npm install olan kompüterdə işlət)', rows.pkg);
list('Köhnə — işlədilmədi (--old ilə işlədilir)', rows.old);
list('Keçdi', rows.pass);
process.exit(rows.fail.length ? 1 : 0);
