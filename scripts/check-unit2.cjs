// Checks Bölmə 2 lessons (src/data/unit2) and both section exams (Bölmə 1 and 2) on the new screens:
// structure, unique ids, three options, explanations for every wrong option, model answers accepted,
// new screens (keypad, letters, form) well-formed, reviews present (not in exams), vocabulary linked, exam rules.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true },
}).outputText, filename);

const L = require('../src/utils/designLesson.ts');
const { designLessons } = require('../src/data/designLessons.ts');
const { unit2Lessons, unit2Exam } = require('../src/data/unit2/index.ts');
const { unit1Exam } = require('../src/data/unit1/exam.ts');

const NAME = 'Aysu';
const filled = text => text.replace(/…/g, NAME);
const kind = t => t.type === 'two' && t.form ? 'form' : t.type === 'write' ? (t.keypad ? 'keypad' : t.letters ? 'letters' : t.tiles ? 'tiles' : t.chat ? 'chat' : 'write') : t.type === 'choice' ? (t.gap ? 'gap' : t.spots ? 'scene' : 'choice') : t.type === 'voice' ? (t.repeat ? 'repeat' : 'voice') : t.type === 'match' ? (t.mode || 'match') : t.type;
const ids = new Set(designLessons.flatMap(l => l.cards.map(c => c.id)).filter((id, i, all) => all.indexOf(id) !== i));
assert.equal(ids.size, 0, `duplicate card ids: ${[...ids]}`);
const lessonIds = designLessons.map(l => l.id);
assert.equal(new Set(lessonIds).size, lessonIds.length, 'duplicate lesson ids');
const orders = designLessons.map(l => l.order);
assert.equal(new Set(orders).size, orders.length, 'duplicate lesson orders');

const all = [...unit2Lessons, ...unit1Exam, ...unit2Exam];
assert.ok(unit2Lessons.length === 11, `Bölmə 2 has 11 lesson parts (8 map lessons, 1/3/7 in two parts): ${unit2Lessons.length}`);
assert.equal(unit1Exam.length, 1, 'Bölmə 1 exam');
assert.equal(unit2Exam.length, 1, 'Bölmə 2 exam');
const numbers = unit2Lessons.map(l => `${l.number}${l.part ?? ''}`);
assert.deepEqual(numbers, ['11', '12', '2', '31', '32', '4', '5', '6', '71', '72', '8'], `map numbers/parts: ${numbers}`);

for (const raw of all) {
  const lesson = L.resolveLesson(raw);
  const tag = `${lesson.id}`;
  const exam = Boolean(lesson.exam);
  assert.ok(!JSON.stringify(lesson).match(/\{[MGBmgb,]|\{en/), `${tag}: unresolved name token`);
  assert.ok(raw.unit === 1 || raw.unit === 2, `${tag}: unit set`);
  const tasks = lesson.cards.filter(L.isTask);
  const max = exam ? 16 : 14;
  assert.ok(lesson.cards.length >= 9 && lesson.cards.length <= max, `${tag}: 9–${max} cards (${lesson.cards.length})`);
  assert.equal(lesson.cards[0].type, 'intro', `${tag}: starts with the goals`);
  const kinds = new Set(tasks.map(kind));
  assert.ok(kinds.size >= 5, `${tag}: at least 5 kinds of task (${[...kinds]})`);
  if (exam) {
    assert.ok(tasks.length >= 12 && tasks.length <= 15, `${tag}: exam has 12–15 tasks (${tasks.length})`);
    assert.ok(!lesson.cards.some(c => c.type === 'word' || c.type === 'teach'), `${tag}: an exam teaches nothing new`);
  }
  for (const card of tasks) {
    const views = exam ? [['main', card]] : [['main', card], ['review', L.reviewTask(lesson, card.id)]];
    if (!exam) assert.ok(card.review, `${tag} ${card.id}: has a review in a new situation`);
    for (const [label, t] of views) {
      const where = `${tag} ${card.id} ${label}`;
      assert.ok(t.why, `${where}: has a correct-answer reason`);
      assert.ok(t.variants.length, `${where}: has an explanation`);
      if (!exam && t.type !== 'match') assert.ok(t.hint, `${where}: has a hint`);
      if (t.type === 'choice') {
        assert.equal(t.options.length, 3, `${where}: three options`);
        assert.ok(t.options.includes(t.answer), `${where}: answer is an option`);
        assert.equal(L.gradeChoice(t, t.answer).status, 'correct', where);
        for (const o of t.options.filter(o => o !== t.answer)) {
          const g = L.gradeChoice(t, o);
          assert.equal(g.status, 'wrong', `${where}: ${o} is wrong`);
          assert.ok(g.explain && g.explain.reason, `${where}: ${o} has an explanation`);
        }
      }
      if (t.type === 'write' || t.type === 'voice') {
        const voice = t.type === 'voice';
        for (const a of t.rule.answers) assert.equal(L.gradeText(t, filled(a), voice).status, 'correct', `${where}: model answer “${filled(a)}” accepted`);
        if (t.type === 'write' && t.keypad) for (const a of t.rule.answers) assert.ok(/^[0-9 +]+$/.test(a), `${where}: keypad answers are digits (${a})`);
        if (t.type === 'write' && t.letters) {
          assert.ok(t.letters.every(x => /^[A-Z@.]$/.test(x)), `${where}: letter tiles are single capitals`);
          const word = t.rule.answers[0];
          const pool = [...t.letters];
          for (const ch of word) { const i = pool.indexOf(ch); assert.ok(i >= 0, `${where}: tile “${ch}” exists for “${word}”`); pool.splice(i, 1); }
          assert.equal(L.gradeText(t, word, false).status, 'correct', `${where}: letters build the answer`);
        }
        if (t.tiles) {
          const words = t.rule.answers[0].replace(/([?.!])$/, ' $1').split(' ');
          for (const w of words) assert.ok(t.tiles.includes(w), `${where}: tile “${w}” exists`);
          assert.equal(L.gradeText(t, L.joinTiles(words), false).status, 'correct', `${where}: tiles build the answer`);
        }
      }
      if (t.type === 'match') {
        const right = Object.fromEntries(t.rows.map(r => [r.en, r.az]));
        assert.equal(L.gradeMatch(t, right).status, 'correct', where);
        const swapped = { ...right, [t.rows[0].en]: t.rows[1].az, [t.rows[1].en]: t.rows[0].az };
        assert.equal(L.gradeMatch(t, swapped).status, 'wrong', where);
      }
      if (t.type === 'two') {
        const values = Object.fromEntries(t.fields.map(f => [f.id, filled(f.rule.answers[0])]));
        assert.equal(L.gradeTwo(t, values).status, 'correct', `${where}: model answers fill every field`);
        for (const f of t.fields) assert.equal(L.gradeTwo(t, { [f.id]: filled(f.rule.answers[0]) }).status, 'empty', where);
      }
    }
  }
  for (const w of lesson.cards.filter(c => c.type === 'word')) assert.ok(lesson.vocabulary.some(v => v.teachCard === w.id), `${tag} ${w.id}: words go to Lüğətim`);
  for (const v of lesson.vocabulary) assert.ok(lesson.cards.some(c => c.id === v.teachCard), `${tag}: ${v.word} is taught on a card`);
  for (const g of lesson.result.goals) for (const id of g.tasks) assert.ok(tasks.some(t => t.id === id || (t.type === 'two' && t.fields.some(f => f.id === id))), `${tag}: result goal task ${id}`);
}

// Typical learner mistakes are not accepted (filled in with the lessons).
const find = id => { for (const l of all) { const r = L.resolveLesson(l); const c = r.cards.find(c => c.id === id); if (c) return c; } };
const rejects = (id, value, voice = false) => assert.notEqual(L.gradeText(find(id), value, voice).status, 'correct', `${id}: “${value}” must not be accepted`);
module.exports = { rejects };
const extra = require('./check-unit2-mistakes.cjs');
extra(rejects, find);

console.log(`PASS: Bölmə 2 (${unit2Lessons.length} lesson parts) and both section exams — structure, new screens, options, explanations, model answers, reviews, vocabulary, typical mistakes.`);
