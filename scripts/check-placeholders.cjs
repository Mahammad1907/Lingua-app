// No bare "…" placeholder in learner-visible lesson text. Use [ad], [ölkə], [şəhər], [millət], [yaş], [nömrə] or a concrete example.
// Allowed: a word directly followed by "…" (a sequence or a trailing-off number: "Twelve…", "L… A…", "It's oh five oh…").
const fs = require('fs'), path = require('path');
const roots = ['src/data', 'src/utils/lessonGuide.ts', 'src/utils/designLesson.ts'];
const files = [];
const walk = p => { if (fs.statSync(p).isDirectory()) fs.readdirSync(p).forEach(n => walk(path.join(p, n))); else if (p.endsWith('.ts')) files.push(p); };
roots.forEach(walk);
let bad = 0;
for (const f of files) fs.readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
  const s = line.trim(); if (s.startsWith('//') || s.startsWith('*') || s.startsWith('/*')) return;
  if (/(^|[\s,(“"'])…|…-|…\?/.test(line.replace(/[A-Za-z0-9]…/g, ''))) { bad++; console.log(`${f}:${i + 1}: ${s.slice(0, 120)}`); }
});
if (bad) { console.error(`✗ ${bad} bare "…" placeholder(s)`); process.exit(1); }
console.log('✓ no bare "…" placeholders');
