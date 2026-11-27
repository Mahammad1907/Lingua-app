// Lesson length (26 Nov 2026, user): nothing is removed from the course — a lesson longer than 12 screens is split into
// parts (“1-ci hissə”, “2-ci hissə” in the same map circle). Every lesson part is 8–12 screens (the intro is not a screen),
// and the lengths vary — never three parts in a row with the same count. Section talks (Dərs 8) and exams keep their length.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true },
}).outputText, filename);

const L = require('../src/utils/designLesson.ts');
const { designLessons } = require('../src/data/designLessons.ts');

const problems = [];
// 27 Nov 2026 (user): Bölmə 1 lessons stay whole (no parts, no 8–12 rule); splitting starts from Bölmə 2.
const regular = designLessons.filter(l => !l.exam && l.cards.some(c => c.type === 'word') && !/^a1_en_b1_v2_d/.test(l.id));
const counts = [];
for (const l of regular) {
  const screens = l.cards.filter(c => c.type !== 'intro').length;
  const words = l.cards.filter(c => c.type === 'word').length;
  counts.push([l.id, screens]);
  if (screens < 8 || screens > 12) problems.push(`${l.id} (${l.title}): ${screens} ekran — 8–12 olmalıdır`);
  if (words > 6) problems.push(`${l.id} (${l.title}): ${words} Yeni söz kartı — ən çox 6`);
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
console.log(`PASS: check-lesson-length — ${regular.length} dərs/hissə 8–12 ekran, uzunluq dəyişir.`);
