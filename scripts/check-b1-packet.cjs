const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true },
}).outputText, filename);
const { b1Packet, b1Lessons, packetFlow, packetTaskIds } = require('../src/data/b1Course.ts');
const { b1Exams, b1PlacementTest } = require('../src/data/b1Exam.ts');
const { assessPacketAnswer: assess } = require('../src/utils/packetAnswer.ts');
assert.deepEqual(b1Packet.map(l => l.cards.length), [13,18,20,20,21,19,15]);
assert.equal(b1Lessons.length, 7);
assert.ok(b1Lessons.every(l => l.id.startsWith('a1_en_b1_v2_')), 'new curriculum never inherits old completions');
let checked = 0;
for (const lesson of b1Packet) {
  const flow = packetFlow(lesson); const ids = flow.map(c => c.id);
  assert.equal(new Set(ids).size, ids.length);
  const expected = packetTaskIds(lesson);
  assert.ok(expected.required.length);
  assert.ok(expected.optional.every(id => !expected.required.includes(id)));
  for (const c of flow) {
    assert.ok(!/HAZIRLAYAN|Gözlənilən cavab|Yoxlamadan sonra:/.test(c.body), `author-only text leaked: ${c.id}`);
    if (c.kind === 'task' || c.kind === 'voice') assert.ok(c.review, `missing review ${c.id}`);
    for (const card of [c, c.review].filter(Boolean)) {
      const rule = card.rule || card.turns?.[0].rule;
      if (!rule) continue;
      checked++;
      const verdict = assess(rule.answers[0], rule);
      assert.equal(verdict.status, 'correct', `${card.id}: ${rule.answers[0]}`);
      assert.ok(verdict.criteria.every(c => c.passed), `${card.id}: model cannot contradict role facts`);
      if (card.options) assert.ok(card.options.includes(rule.answers[0]), `option mapping ${card.id}`);
    }
  }
}
for (const exam of b1Exams) {
  assert.equal(exam.cards.length, 17); assert.equal(exam.cards.filter(c => c.kind === 'voice').length, 6);
  assert.equal(exam.cards[0].options.length, 3);
  for (const card of exam.cards) {
    const v=assess(card.rule.answers[0],card.rule);
    assert.equal(v.status,'correct'); assert.ok(v.criteria.every(c=>c.passed)); checked++;
  }
}
assert.equal(b1Exams[0].cards[0].audio, 'Hi.'); assert.equal(b1Exams[1].cards[0].audio, 'Goodbye.');
assert.equal(b1PlacementTest.requiredQuestionIds.length, 13);
const r = goals => ({ answers: [], goals });
for (const input of ['Hello. I’m Əli. What’s your name?', 'Hi! My name is Murad. What is your name?']) assert.equal(assess(input,r(['greet','introduce','askName'])).status,'correct');
assert.equal(assess('I am Murad', {...r(['introduce']),roleName:'Leyla'}).status,'partial');
assert.equal(assess('Hello goodbye',r(['greet'])).status,'wrong');
assert.equal(assess('Good morning',r(['greet'])).status,'correct');
assert.notEqual(assess('Good morning',r(['fine'])).status,'correct');
assert.notEqual(assess('I am a teacher',r(['introduce'])).status,'correct');
assert.equal(assess('I’m not very well. And you?',r(['feeling','askFeeling'])).status,'correct');
assert.equal(assess('I’m not very well',r(['fine'])).status,'partial');
assert.equal(assess('I’m fine',r(['fine','askFeeling'])).status,'partial');
assert.equal(assess('I’m fine',r(['introduce'])).status,'partial');
assert.equal(assess('My name am Ali',r(['introduce'])).status,'wrong');
assert.equal(assess('I don’t understand. Could you say that again, please?',r(['dontUnderstand','repeat'])).status,'correct');
assert.equal(assess('More slowly please',r(['repeat','slow'])).status,'partial');
assert.equal(assess('Can you repeat that more slowly please',r(['repeat','slow'])).status,'correct');
assert.equal(assess('Buy',r(['farewell']),true).status,'correct');
assert.equal(assess('Buy',r(['farewell']),false).status,'wrong');
assert.equal(assess('The weather looks beautiful',r(['greet'])).status,'wrong');
assert.equal(assess('Hello',{answers:['Hi'],exact:true}).status,'wrong','dictation differs from free greetings');
for (const text of ['helllh', 'helllo', 'asdfgh', '12345']) {
  assert.equal(assess(text, {answers:['Hello!','Hi!'],goals:['greet']}).status, 'wrong', 'submitted typo/irrelevant writing must count as incorrect');
}
assert.equal(assess('helllh', r(['greet']), true).status, 'unknown', 'uncertain speech is not a language mistake');
assert.equal(assess('   ', r(['greet'])).status, 'unknown', 'blank input is not a submitted answer');
for (const text of ['Hello', 'HI!', 'hello.', 'Good morning']) assert.equal(assess(text, {answers:['Hello!','Hi!'],goals:['greet']}).status, 'correct');
console.log(`PASS: ${checked} original/review/exam rules, card order, no author-note leakage, fresh progress IDs, compound criteria, role facts, contractions, homophones and unknown answers.`);
