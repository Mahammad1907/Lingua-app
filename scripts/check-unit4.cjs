// Checks Bölmə 4 lessons (src/data/unit4) and the Bölmə 4 exam on the new screens (copy of check-unit2.cjs):
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
const { unit4Lessons, unit4Exam } = require('../src/data/unit4/index.ts');

const NAME = 'Aysu';
const filled = text => text.replace(/…|\[[^\]]*\]/g, NAME);
const kind = t => t.type === 'two' && t.form ? 'form' : t.type === 'write' ? (t.keypad ? 'keypad' : t.letters ? 'letters' : t.tiles ? 'tiles' : t.chat ? 'chat' : 'write') : t.type === 'choice' ? (t.gap ? 'gap' : t.map ? 'map' : t.spots ? 'scene' : 'choice') : t.type === 'voice' ? (t.repeat ? 'repeat' : 'voice') : t.type === 'match' ? (t.mode || 'match') : t.type;
const ids = new Set(designLessons.flatMap(l => l.cards.map(c => c.id)).filter((id, i, all) => all.indexOf(id) !== i));
assert.equal(ids.size, 0, `duplicate card ids: ${[...ids]}`);
const lessonIds = designLessons.map(l => l.id);
assert.equal(new Set(lessonIds).size, lessonIds.length, 'duplicate lesson ids');
const orders = designLessons.map(l => l.order);
assert.equal(new Set(orders).size, orders.length, 'duplicate lesson orders');

// ONLY=a1_en_b4_d4,a1_en_b4_d5a checks just those lessons (while other parts are still being written).
const only = process.env.ONLY ? process.env.ONLY.split(',') : null;
const all = [...unit4Lessons, ...unit4Exam].filter(l => !only || only.includes(l.id));
assert.equal(unit4Lessons.length, 9, `Bölmə 4 has 9 lesson parts (8 map lessons; 2 in two parts): ${unit4Lessons.length}`);
assert.equal(unit4Exam.length, 1, 'Bölmə 4 exam');
const numbers = unit4Lessons.map(l => `${l.number}${l.part ?? ''}`);
assert.deepEqual(numbers, ['1', '21', '22', '3', '4', '5', '6', '7', '8'], `map numbers/parts: ${numbers}`);
// Rule 20 (user, 15 Nov 2026): “Azeri” is never shown, taught or accepted. Answer patterns are not shown; everything else is checked.
const shown = (v, k = '') => typeof v === 'string' ? (k === 'pattern' ? [] : [v]) : Array.isArray(v) ? v.flatMap(x => shown(x)) : v && typeof v === 'object' ? Object.entries(v).flatMap(([kk, x]) => shown(x, kk)) : [];
for (const l of all) for (const t of shown(l)) assert.ok(!/\bazeri\b/i.test(t), `${l.id}: “Azeri” must not appear: “${t}”`);
// New words per part (map): 4–6 Yeni söz cards in every lesson part except the section talk (8) and the exam.
for (const l of all) if (!l.exam && l.number !== 8) { const n = l.cards.filter(c => c.type === 'word').length; assert.ok(n >= 4 && n <= 6, `${l.id}: 4–6 new units (${n})`); }

for (const raw of all) {
  const lesson = L.resolveLesson(raw);
  const tag = `${lesson.id}`;
  const exam = Boolean(lesson.exam);
  assert.ok(!JSON.stringify(lesson).match(/\{[MGBmgb,]|\{en/), `${tag}: unresolved name token`);
  assert.equal(raw.unit, 4, `${tag}: unit set`);
  const tasks = lesson.cards.filter(L.isTask);
  // Müəllim izahı cards come on top (user, 21 Nov 2026): at most 14 other cards, 16 in all.
  const others = lesson.cards.filter(c => c.type !== 'explain').length;
  assert.ok(others <= (exam ? 16 : 14), `${tag}: at most ${exam ? 16 : 14} cards besides Müəllim izahı (${others})`);
  const max = 16;
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
// One file per lesson part: scripts/unit4-mistakes/*.cjs, each `module.exports = (rejects, find, rejectsField) => { … }`.
const { assessPacketAnswer } = require('../src/utils/packetAnswer.ts');
const rejectsField = (cardId, fieldId, value) => {
  const field = find(cardId).fields.find(f => f.id === fieldId);
  assert.notEqual(assessPacketAnswer(value, field.rule).status, 'correct', `${fieldId}: “${value}” must not be accepted`);
};
const dir = require('node:path').join(__dirname, 'unit4-mistakes');
for (const f of fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.cjs') && (!only || only.some(id => id.endsWith(`_${f.replace('.cjs', '')}`)))).sort() : []) require(`${dir}/${f}`)(rejects, find, rejectsField);

console.log(`PASS: Bölmə 4 (${unit4Lessons.length} lesson parts) and its exam — structure, new screens, options, explanations, model answers, reviews, vocabulary, typical mistakes, no “Azeri”.`);
