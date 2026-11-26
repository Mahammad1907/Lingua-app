// Lesson parts (26 Nov 2026, after the split into parts — findings of an outside review):
// A. A part after the first must not point the learner to “the start / the first card of this lesson” — that is in
//    an earlier part now. Say “1-ci hissədə …” instead.
// B. Every phrase taught on a Yeni söz card is used by at least one task of the same part (the lesson itself, not the
//    review version), so nothing is taught and then left unpractised.
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true },
}).outputText, filename);
const { designLessons } = require('../src/data/designLessons.ts');

const problems = [];
const STALE = /bu dərsin (əvvəl|ilk)|dərsin əvvəlində|bu dərsdəki|bu dərsin başında/i;
const texts = (v, out = []) => {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach(x => texts(x, out));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) if (k !== 'id' && k !== 'scenes') texts(x, out);
  return out;
};
const isTask = c => !['intro', 'word', 'teach', 'explain'].includes(c.type);

for (const l of designLessons) {
  if ((l.part ?? 1) > 1) for (const c of l.cards) for (const t of texts(c)) if (STALE.test(t)) problems.push(`A ${l.id} ${c.id}: “${t.slice(0, 70)}” — 1-ci hissəyə işarə et`);
  if (l.exam || !l.cards.some(c => c.type === 'word')) continue;
  const taskText = l.cards.filter(isTask).map(c => { const { review, ...main } = c; return texts(main).join(' \n '); }).join(' \n ').toLowerCase();
  // Letters are practised only where they are part of the right answer or of what is heard/shown in English —
  // not as a distractor tile and not as a stray letter in an Azerbaijani explanation (Z and P slipped through, 26 Nov).
  const answerText = l.cards.filter(isTask).map(c => texts([c.answer, c.audio, c.rule?.answers, c.rule?.exact, c.rows, c.gap, c.lines, c.thread, c.fields?.map(f => [f.answer, f.rule?.answers])]).join(' \n ')).join(' \n ');
  for (const w of l.cards.filter(c => c.type === 'word')) {
    // Pieces: each “A · B” half, each letter of a letter card, each sentence of a two-sentence card. A spelled example
    // (“It's B-A-K-U”) is practised by any spelling; a title with a name (“Mr. Guliyev”) by the title itself.
    const pieces = String(w.word).split('·').flatMap(p => /^[A-Z](, [A-Z])+$/.test(p.trim()) ? p.split(',') : p.split(/(?<=[.!?])\s+/))
      .map(p => p.replace(/\[[^\]]*\]/g, ' ').replace(/^(Mr|Ms|Mrs)\.?\s+[A-ZƏ]\w+.*$/, '$1').replace(/[.!?]/g, ' ').replace(/\s+/g, ' ').trim()).filter(Boolean);
    for (const p of pieces) {
      if (/[A-Z]-[A-Z]/.test(p)) { if (!/\b[a-z](-[a-z])+\b/i.test(taskText)) problems.push(`B ${l.id} ${w.id}: hərf-hərf yazılış məşq olunmur`); continue; }
      const esc = p.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/'/g, "['’]");
      const letter = p.length === 1;
      const re = letter ? new RegExp(`(^|[^A-Za-z])${p}|${p}(?=[A-Z])|(?<=[A-Z])${p}`) : new RegExp(`(^|[^a-z])${esc}`, 'i');
      if (!re.test(letter ? answerText : taskText)) problems.push(`B ${l.id} ${w.id}: “${p}” öyrədilir, amma bu hissənin heç bir tapşırığında işlənmir`);
    }
  }
}

if (problems.length) {
  console.log(`check-parts: ${problems.length} yer:`);
  for (const p of problems) console.log(`- ${p}`);
  process.exit(1);
}
console.log('PASS: check-parts — sonrakı hissələrdə köhnə “bu dərsin əvvəli” işarəsi yoxdur; hər söz kartı öz hissəsində məşq olunur.');
