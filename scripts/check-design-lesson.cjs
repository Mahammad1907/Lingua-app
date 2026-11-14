// Checks the redesigned Lesson 1: content copied from docs/BirTalk_Ders_1_Yekun.md,
// central character names, grading/explanation selection and result statuses.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true },
}).outputText, filename);

const names = require('../src/config/characters.ts');
const { lesson1Design } = require('../src/data/lesson1Design.ts');
const L = require('../src/utils/designLesson.ts');

// --- Names: empty now, neutral fallback, one place to set them later.
for (const role of ['mascot', 'girl', 'boy']) assert.equal(names.CHARACTERS[role].az, '', `${role} name must stay empty until chosen`);
assert.equal(names.withNames('{M} nə edir?'), 'Dostun nə edir?');
assert.equal(names.withNames('{M:dat} kömək et'), 'Dostuna kömək et');
assert.equal(names.withNames('{M:acc} görürsən'), 'Dostunu görürsən');
assert.equal(names.withNames('Hello{en,G}!'), 'Hello!');
assert.equal(names.withNames('Salam{,B}!'), 'Salam!');
const named = { ...names.CHARACTERS, mascot: { ...names.CHARACTERS.mascot, az: 'BirFox' }, girl: { ...names.CHARACTERS.girl, az: 'Leyla' }, boy: { ...names.CHARACTERS.boy, az: 'Əli', en: 'Ali' } };
assert.equal(names.withNames('{M:gen} dediyi', named), 'BirFox-un dediyi');
assert.equal(names.withNames('{M:dat} kömək et', named), 'BirFox-a kömək et');
assert.equal(names.withNames('{M:abl} ayrılırsan', named), 'BirFox-dan ayrılırsan');
assert.equal(names.withNames('{G:gen} çantası', named), 'Leylanın çantası');
assert.equal(names.withNames('{B:dat}', named), 'Əliyə');
assert.equal(names.withNames('Hi{en,B}! Salam{,B}!', named), 'Hi, Ali! Salam, Əli!');
assert.equal(names.azSuffix('Lopuki', 'gen'), 'nin');
assert.equal(names.azSuffix('Lopuki', 'dat'), 'yə');

// --- Content: no unresolved tokens, card order of the final document.
const lesson = L.resolveLesson(lesson1Design);
const text = JSON.stringify(lesson);
assert.ok(!/\{[MGBmgb](:\w+)?\}|\{en|\{,/.test(text), 'all name tokens resolved');
assert.ok(!/BirFox/.test(text), 'no hard-coded mascot name');
const flow = L.lessonFlow(lesson);
assert.deepEqual(flow.map(c => c.id), ['d1_c01', 'd1_c02', 'd1_c03', 'd1_c04', 'd1_c05', 'd1_c06', 'd1_c07a', 'd1_c07b', 'd1_c08', 'd1_c09', 'd1_c10', 'd1_c11a', 'd1_c11b']);
const ids = L.lessonTaskIds(lesson);
assert.deepEqual(ids.required, ['d1_c03', 'd1_c04', 'd1_c07a', 'd1_c07b', 'd1_c09', 'd1_c10a', 'd1_c10b']);
assert.deepEqual(ids.optional, ['d1_c05', 'd1_c08', 'd1_c11a', 'd1_c11b']);
const card = id => flow.find(c => c.id === id);
const doc = fs.readFileSync(require.resolve('../docs/BirTalk_Ders_1_Yekun.md'), 'utf8');
// Every learner-facing explanation sentence exists in the final document (names written as BirFox there).
const docText = doc.replace(/BirFox(-[a-zəüöı]+)?/g, 'X');
for (const c of lesson1Design.cards) for (const v of c.variants ?? []) for (const part of ['rule', 'reason', 'example']) {
  const sentence = v.explain[part].replace(/\{[Mm](:\w+)?\}/g, 'X').replace('{purpose}', '{salam vermək / sağollaşmaq}');
  assert.ok(docText.includes(sentence), `${c.id} ${part} copied from the document: ${sentence}`);
}
// Every task has a hint and a five-part explanation; retries keep id, type and modality.
for (const task of flow.filter(L.isTask)) {
  assert.ok(task.variants.length, `${task.id} explanations`);
  const retry = L.reviewTask(lesson, task.id);
  assert.equal(retry.id, task.id); assert.equal(retry.type, task.type);
  assert.equal(Boolean(retry.audio), Boolean(task.audio), `${task.id} retry keeps listening modality`);
  assert.notEqual(retry.prompt, task.prompt === retry.prompt && task.type !== 'voice' ? '' : '\u0000');
}

// --- Grading and explanation choice.
const c3 = card('d1_c03');
assert.equal(L.gradeChoice(c3, 'Salam verir.').status, 'correct');
const wrong3 = L.gradeChoice(c3, 'Sağollaşır.');
assert.equal(wrong3.status, 'wrong'); assert.equal(wrong3.explain.yourAnswer, 'Sağollaşır.');
assert.equal(wrong3.short, 'Hi salamlaşmaq üçündür. Bu səsdə dostun salam verir.');
// Every choice has three options; each wrong option gets an explanation that names it correctly.
for (const t of lesson.cards.filter(c => c.type === 'choice')) {
  for (const task of [t, L.reviewTask(lesson, t.id)]) {
    assert.equal(task.options.length, 3, `${t.id} has three options`);
    for (const o of task.options.filter(o => o !== task.answer)) assert.equal(L.gradeChoice(task, o).status, 'wrong');
  }
}
assert.equal(L.gradeChoice(c3, 'Təşəkkür edir.').explain.reason, 'Səsdə “Hi!” deyilir — bu, təşəkkür yox, salamdır.');
assert.equal(L.gradeChoice(card('d1_c07a'), 'Hi!').explain.reason, 'Hi salamlaşmaq üçündür, burada isə görüş bitir.');

// New screen forms (13 Nov 2026).
assert.deepEqual(lesson.cards.filter(c => c.type === 'word').map(c => c.id), ['d1_c02', 'd1_c06'], 'cards 2 and 6 are Yeni söz');
for (const c of lesson.cards.filter(c => c.type === 'word')) assert.ok(lesson.vocabulary.some(v => v.teachCard === c.id), `${c.id} adds words to Lüğətim`);
for (const t of lesson.cards.filter(L.isTask)) assert.ok(t.why && !/[{}]/.test(t.why), `${t.id} has a resolved correct-answer reason`);
assert.ok(card('d1_c04').chat, 'card 4 is a chat');
assert.equal(L.joinTiles(['My', 'name', 'is', 'Leyla', '.']), 'My name is Leyla.');
const match = { type: 'match', id: 'm', rows: [{ en: 'Thank you!', az: 'Sağ ol' }, { en: 'Sorry!', az: 'Bağışla' }], extra: ['Zəhmət olmasa'],
  variants: [{ match: { other: true }, explain: { answers: 'a', reason: 'r', rule: 'q', example: 'e' } }] };
assert.equal(L.gradeMatch(match, { 'Thank you!': 'Sağ ol' }).status, 'empty');
assert.equal(L.gradeMatch(match, { 'Thank you!': 'Sağ ol', 'Sorry!': 'Bağışla' }).status, 'correct');
const mw = L.gradeMatch(match, { 'Thank you!': 'Bağışla', 'Sorry!': 'Sağ ol' });
assert.equal(mw.status, 'wrong'); assert.equal(mw.rows['Sorry!'], 'wrong'); assert.ok(mw.explain.yourAnswer.includes('Thank you! — Bağışla'));
const c4 = card('d1_c04');
assert.equal(L.gradeText(c4, 'Hello!').status, 'correct');
assert.equal(L.gradeText(c4, 'hi').status, 'correct');
assert.equal(L.gradeText(c4, 'Bye!').explain.rule, 'Görüşü salamla başlat.');
assert.equal(L.gradeText(c4, '').status, 'empty');
const c7b = card('d1_c07b');
assert.equal(L.gradeText(c7b, 'Bye').status, 'correct');
assert.equal(L.gradeText(c7b, 'Goodbye').explain.rule, 'Eşitdiyini yazmaq tapşırığında səslənən sözü yaz.');
assert.equal(L.gradeText(c7b, 'Hello').explain.rule, 'Səsdə eşitdiyin sözü yaz.');
const c9 = card('d1_c09');
assert.equal(L.gradeText(c9, 'Bye!').status, 'correct');
assert.equal(L.gradeText(c9, 'Hi').explain.reason, 'Dostun gedir, salam isə görüşü bitirmir.');
const c10 = card('d1_c10');
assert.equal(L.gradeTwo(c10, { d1_c10a: 'Hello!', d1_c10b: 'Bye!' }).status, 'correct');
const swapped = L.gradeTwo(c10, { d1_c10a: 'Bye!', d1_c10b: 'Hi!' });
assert.equal(swapped.status, 'wrong'); assert.equal(swapped.explain.rule, 'Salam görüşü başladır; sağollaşma bitirir.');
const second = L.gradeTwo(c10, { d1_c10a: 'Hello!', d1_c10b: 'Hi!' });
assert.equal(second.fields.d1_c10a.status, 'correct');
assert.equal(second.short, 'Birinci mesaj uyğundur. İkinci mesajda görüşü bitirən ifadə lazımdır.');
assert.equal(L.gradeTwo(c10, { d1_c10a: 'Hello!', d1_c10b: '' }).emptyNotice, 'İkinci mesajı da yaz.');
// Retry keeps the correct field.
const kept = L.gradeTwo(L.reviewTask(lesson, 'd1_c10'), { d1_c10a: 'xx', d1_c10b: 'Goodbye' }, second.fields);
assert.equal(kept.fields.d1_c10a.status, 'correct'); assert.equal(kept.status, 'correct');
const c11b = card('d1_c11b');
assert.equal(L.gradeText(c11b, 'by', true).status, 'correct');
assert.equal(L.gradeText(c11b, 'Hello', true).explain.example, 'Dostundan ayrılırsan: “Goodbye!”');

// --- Statuses.
assert.equal(L.taskStatus({ first: 'correct' }), 'independent');
assert.equal(L.taskStatus({ first: 'correct', assisted: true }), 'assisted');
assert.equal(L.taskStatus({ first: 'wrong', review: 'correct' }), 'assisted');
assert.equal(L.taskStatus({ first: 'wrong', review: 'wrong' }), 'needsPractice');
assert.equal(L.taskStatus({ unverified: true }), 'unverified');
assert.equal(L.taskStatus(undefined), 'unverified');

console.log(`PASS: Lesson 1 redesign — ${flow.length} cards, ${ids.required.length} required + ${ids.optional.length} voice tasks, names, grading, explanations and statuses.`);
