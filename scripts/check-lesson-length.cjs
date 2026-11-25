// Lesson length (26 Nov 2026, user): a lesson is 10–12 screens, and the lengths vary — never three lessons in a row
// with the same count. At most 3 Yeni söz cards (a pair “A · B” is one card). Practice that was taken out lives in
// `lesson.pool` and comes back in the daily review. Section talks (Dərs 8) and exams keep their own length.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true },
}).outputText, filename);

const L = require('../src/utils/designLesson.ts');
const { designLessons } = require('../src/data/designLessons.ts');

const problems = [];
const regular = designLessons.filter(l => !l.exam && l.cards.some(c => c.type === 'word'));
const counts = [];
for (const l of regular) {
  const screens = l.cards.filter(c => c.type !== 'intro').length;
  const words = l.cards.filter(c => c.type === 'word').length;
  counts.push([l.id, screens]);
  if (screens < 10 || screens > 12) problems.push(`${l.id} (${l.title}): ${screens} ekran — 10–12 olmalıdır`);
  if (words > 3) problems.push(`${l.id} (${l.title}): ${words} Yeni söz kartı — ən çox 3`);
}
for (let i = 2; i < counts.length; i++) {
  if (counts[i][1] === counts[i - 1][1] && counts[i][1] === counts[i - 2][1]) problems.push(`${counts[i - 2][0]}, ${counts[i - 1][0]}, ${counts[i][0]}: üçü də ${counts[i][1]} ekran — uzunluq dəyişməlidir`);
}

// Pool: real tasks with an explanation, ids not shared with the lesson; every result goal points at a task in the lesson.
for (const l of designLessons) {
  const flowIds = new Set(L.lessonFlow(l).filter(L.isTask).flatMap(t => [t.id, ...(t.type === 'two' ? t.fields.map(f => f.id) : [])]));
  const poolIds = new Set();
  for (const t of l.pool ?? []) {
    if (!L.isTask(t)) { problems.push(`${l.id}: pool-da tapşırıq olmayan kart (${t.id})`); continue; }
    if (flowIds.has(t.id) || poolIds.has(t.id)) problems.push(`${l.id}: pool tapşırığı ${t.id} təkrarlanır`);
    poolIds.add(t.id);
    if (!(t.variants && t.variants.length) && t.type !== 'voice') problems.push(`${l.id}: pool tapşırığı ${t.id} izahsızdır`);
    if (!L.reviewTask(l, t.id)) problems.push(`${l.id}: pool tapşırığı ${t.id} təkrarda açılmır`);
  }
  for (const g of l.result.goals) for (const id of g.tasks) if (!flowIds.has(id)) problems.push(`${l.id}: nəticə hədəfi “${g.text.slice(0, 40)}” dərsdə olmayan ${id}-ə baxır`);
}

if (problems.length) {
  console.log(`check-lesson-length: ${problems.length} yer yoxlanmalıdır:`);
  for (const p of problems) console.log(`- ${p}`);
  process.exit(1);
}
assert.ok(regular.length > 0);
console.log(`PASS: check-lesson-length — ${regular.length} dərs 10–12 ekran, uzunluq dəyişir, ≤3 Yeni söz, pool tapşırıqları təkrarda açılır.`);
