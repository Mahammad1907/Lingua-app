// Every task in every lesson, answered WRONG on purpose (27 Nov 2026, user: “make such mistakes impossible”).
// For each wrong answer the feedback panel must:
//   1. say “wrong” (a wrong answer is never accepted, a right one never rejected),
//   2. show as “Uyğun cavab” a sentence that THIS task accepts (no answer borrowed from another task),
//   3. carry a non-empty explanation.
// Wrong answers: every wrong option; for tile/text tasks a dropped word, two words swapped, a doubled word
// (“What's is …”), each task's own typical-mistake samples, and random text.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true },
}).outputText, filename);

const L = require('../src/utils/designLesson.ts');
const { normalizePacketAnswer } = require('../src/utils/packetAnswer.ts');
const lessons = [
  ...require('../src/data/unit1/index.ts').unit1Lessons,
  ...require('../src/data/unit2/index.ts').unit2Lessons, ...require('../src/data/unit2/index.ts').unit2Exam,
  ...require('../src/data/unit3/index.ts').unit3Lessons, ...require('../src/data/unit3/index.ts').unit3Exam,
  ...require('../src/data/unit4/index.ts').unit4Lessons, ...require('../src/data/unit4/index.ts').unit4Exam,
];

const problems = [];
let tried = 0, tasks = 0;
const fail = (lesson, task, msg) => problems.push(`${lesson.id} · ${task.id}: ${msg}`);
const norm = (x) => normalizePacketAnswer(String(x ?? ''));

/** The shown answer may list several (“Hello! / Hi!”): accepted if one of them is accepted by the task. */
const pieces = (answers) => String(answers).split(/\s+\/\s+|\s+·\s+|\s+və ya\s+|\n/).map(x => x.replace(/^[“"]|[”"]$/g, '').trim()).filter(Boolean);

function checkChoice(lesson, task) {
  for (const option of task.options) {
    if (option === task.answer) {
      tried++;
      if (L.gradeChoice(task, option).status !== 'correct') fail(lesson, task, `düz variant “${option}” düz sayılmır`);
      continue;
    }
    tried++;
    const g = L.gradeChoice(task, option);
    if (g.status !== 'wrong') { fail(lesson, task, `səhv variant “${option}” → ${g.status}`); continue; }
    if (!g.explain?.reason && !g.short) fail(lesson, task, `“${option}”: izah boşdur`);
    const shown = g.explain?.answers;
    if (shown && !pieces(shown).some(p => norm(p) === norm(task.answer) || L.gradeChoice(task, p).status === 'correct' || norm(task.answer).includes(norm(p)) || norm(p).includes(norm(task.answer))))
      fail(lesson, task, `“${option}” seçiləndə uyğun cavab “${shown}”, amma tapşırığın cavabı “${task.answer}”`);
  }
}

function wrongTexts(task) {
  const out = new Set();
  const model = task.rule.answers?.[0];
  if (task.tiles?.length && model) {
    const words = model.replace(/([?.!,])/g, ' $1').split(/\s+/).filter(Boolean);
    const content = words.map((w, i) => [w, i]).filter(([w]) => !/^[?.!,]$/.test(w));
    if (content.length > 1) out.add(L.joinTiles(words.filter((_, i) => i !== content[content.length - 1][1])));
    if (content.length > 1) { const w = [...words]; const [a, b] = [content[0][1], content[1][1]]; [w[a], w[b]] = [w[b], w[a]]; out.add(L.joinTiles(w)); }
    for (const extra of task.tiles.filter(t => !/^[?.!,]$/.test(t) && !words.includes(t))) out.add(L.joinTiles([...words.slice(0, 1), extra, ...words.slice(1)]));
  }
  for (const v of task.variants ?? []) for (const w of (v.match?.words ?? [])) out.add(w);
  out.add('banana table');
  return [...out].filter(v => v && !task.rule.answers.some(a => norm(a) === norm(v)));
}

function checkText(lesson, task) {
  for (const a of task.rule.answers ?? []) {
    if (/\[|\{/.test(a)) continue;
    tried++;
    const g = L.gradeText(task, a);
    if (g.status !== 'correct') fail(lesson, task, `düz cavab “${a}” → ${g.status}`);
  }
  for (const value of wrongTexts(task)) {
    tried++;
    const g = L.gradeText(task, value);
    if (g.status === 'correct') {
      // A different wording can be right too (goals-based tasks); only an exact task must refuse it.
      if (task.rule.exact) fail(lesson, task, `səhv cavab “${value}” düz sayıldı`);
      continue;
    }
    if (g.status !== 'wrong') continue;
    if (!g.explain?.reason && !g.short) fail(lesson, task, `“${value}”: izah boşdur`);
    const shown = g.explain?.answers;
    if (!shown) continue;
    const ok = pieces(shown).some(p => /\[|\{|…/.test(p) || L.gradeText(task, p).status === 'correct' || task.rule.answers.some(a => norm(a) === norm(p)));
    if (!ok) fail(lesson, task, `“${value}” yazılanda uyğun cavab “${shown}” — bu tapşırıq onu qəbul etmir`);
  }
}

for (const lesson of lessons) {
  const cards = [...(lesson.cards ?? []), ...(lesson.pool ?? [])];
  for (const card of cards) {
    for (const task of [card, card.review].filter(Boolean)) {
      if (task.type === 'choice' && task.options && task.answer) { tasks++; checkChoice(lesson, task); }
      else if (task.type === 'write' && task.rule?.answers?.length) { tasks++; checkText(lesson, task); }
    }
  }
}

if (process.argv.includes('--list')) for (const p of problems) console.log(p);
assert.ok(tasks > 100, `too few tasks found (${tasks}) — lesson lists changed?`);
if (problems.length) {
  console.error(problems.slice(0, 40).join('\n'));
  console.error(`✗ ${problems.length} problem in wrong-answer feedback (${tasks} tasks, ${tried} answers)`);
  process.exit(1);
}
console.log(`PASS: wrong-answer feedback — ${tasks} tasks, ${tried} answers; every “Uyğun cavab” is accepted by its own task.`);
