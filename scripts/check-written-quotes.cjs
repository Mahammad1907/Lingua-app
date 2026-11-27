// A quote that someone WRITES (“Qız mesajda yazır: “…””) is a message (27 Nov 2026, rule 6): the lesson screen shows it
// as a chat, so such a task must not also carry sound (audio) — and a character never writes the placeholder “[ad]”
// for their own name (it is the learner's slot); they write their own name ({NE:G}, {NE:B}).
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true },
}).outputText, filename);
const lessons = ['1', '2', '3', '4'].flatMap(u => { const m = require(`../src/data/unit${u}/index.ts`); return [...(m[`unit${u}Lessons`] ?? []), ...(m[`unit${u}Exam`] ?? [])]; });
const problems = []; let n = 0;
for (const lesson of lessons) for (const card of [...(lesson.cards ?? []), ...(lesson.pool ?? [])]) for (const t of [card, card.review].filter(Boolean)) {
  // The mascot teaches; it never speaks a line in “Kim nə dedi?” (27 Nov 2026, user) — the people do.
  for (const r of t.rows ?? []) if (r.from === 'M') problems.push(`${lesson.id} · ${t.id}: “${r.en}” maskotun dilindədir — personaj olmalıdır`);
  if (typeof t.prompt !== 'string') continue;
  const line = t.prompt.split('\n').find(l => /“[^”]+”/.test(l) && /(deyir|yazır|soruşur|edir)\s*:/.test(l));
  if (!line || !/(mesaj|yazır|yazıb|yazdı)/i.test(line)) continue;
  n++;
  const quote = line.match(/“([^”]+)”/)[1];
  if (t.audio) problems.push(`${lesson.id} · ${t.id}: yazılı mesajın səsi (audio) var`);
  if (/^(Qız|Oğlan)/.test(line) && /\[ad\]/.test(quote) && /(I’m|I'm|name is)\s*\[ad\]/.test(quote)) problems.push(`${lesson.id} · ${t.id}: personaj öz adı yerinə “[ad]” yazır`);
}
if (problems.length) { console.error(problems.join('\n')); console.error(`✗ ${problems.length} yazılı mesaj problemi`); process.exit(1); }
console.log(`PASS: written quotes — ${n} message tasks shown as chat, no sound, characters write their own names.`);
