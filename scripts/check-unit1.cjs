// Checks every Bölmə 1 lesson written for the new screens (lessons 2–8):
// structure, unique ids, three options, explanations for every wrong option, model answers accepted,
// typical wrong answers rejected, reviews present, vocabulary linked to Yeni söz cards, variety of screens.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true },
}).outputText, filename);

const L = require('../src/utils/designLesson.ts');
const { unit1Lessons } = require('../src/data/unit1/index.ts');

const NAME = 'Aysu';
const filled = text => text.replace(/…/g, NAME);
const kind = t => t.type === 'write' ? (t.tiles ? 'tiles' : t.chat ? 'chat' : 'write') : t.type === 'choice' ? (t.gap ? 'gap' : t.spots ? 'scene' : 'choice') : t.type === 'voice' ? (t.repeat ? 'repeat' : 'voice') : t.type;
const ids = new Set();

for (const raw of unit1Lessons) {
  const lesson = L.resolveLesson(raw);
  const tag = `Dərs ${lesson.order}`;
  assert.ok(!JSON.stringify(lesson).match(/\{[MGBmgb,]|\{en/), `${tag}: unresolved name token`);
  const tasks = lesson.cards.filter(L.isTask);
  assert.ok(lesson.cards.length >= 9 && lesson.cards.length <= 14, `${tag}: 9–14 cards (${lesson.cards.length})`);
  assert.equal(lesson.cards[0].type, 'intro', `${tag}: starts with the goals`);
  const kinds = new Set(tasks.map(kind));
  assert.ok(kinds.size >= 5, `${tag}: at least 5 kinds of task (${[...kinds]})`);
  for (const card of lesson.cards) { assert.ok(!ids.has(card.id), `duplicate id ${card.id}`); ids.add(card.id); }

  for (const card of tasks) {
    for (const [label, t] of [['main', card], ['review', L.reviewTask(lesson, card.id)]]) {
      const where = `${tag} ${card.id} ${label}`;
      assert.ok(card.review, `${where}: has a review in a new situation`);
      assert.ok(t.why, `${where}: has a correct-answer reason`);
      assert.ok(t.variants.length, `${where}: has an explanation`);
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
      if (t.type === 'two') for (const f of t.fields) assert.equal(L.gradeTwo(t, { [f.id]: filled(f.rule.answers[0]) }).status, 'empty', where);
    }
  }
  for (const w of lesson.cards.filter(c => c.type === 'word')) assert.ok(lesson.vocabulary.some(v => v.teachCard === w.id), `${tag} ${w.id}: words go to Lüğətim`);
  for (const v of lesson.vocabulary) assert.ok(lesson.cards.some(c => c.id === v.teachCard), `${tag}: ${v.word} is taught on a card`);
  for (const g of lesson.result.goals) for (const id of g.tasks) assert.ok(tasks.some(t => t.id === id || (t.type === 'two' && t.fields.some(f => f.id === id))), `${tag}: result goal task ${id}`);
}

// Typical learner mistakes (docs/AZ_OYRENEN_SEHVLERI.md) are not accepted.
const find = id => { for (const l of unit1Lessons) { const r = L.resolveLesson(l); const c = r.cards.find(c => c.id === id); if (c) return c; } };
const rejects = (id, value, voice = false) => assert.notEqual(L.gradeText(find(id), value, voice).status, 'correct', `${id}: “${value}” must not be accepted`);
rejects('d2_c07', 'Hello! My name Aysu.');
rejects('d2_c07', 'Bye! I am Aysu.');
rejects('d3_c04', "What's you name?");
rejects('d3_c04', "What's is your name?");
rejects('d3_c09', "What's your name?");
rejects('d4_c09', 'And you?');
rejects('d5_c10', "You're welcome.");
rejects('d5_c11', 'Please.', true);
rejects('d6_c10', 'Sorry!');
rejects('d6_c12', 'Excuse me.', true);
rejects('d7_c10', 'Thank you!');
rejects('d8_c12', 'Hello!', true);

console.log(`PASS: Bölmə 1 lessons ${unit1Lessons.map(l => l.order).join(', ')} — structure, three options, explanations, model answers, tiles, matches, reviews, vocabulary and typical mistakes.`);
