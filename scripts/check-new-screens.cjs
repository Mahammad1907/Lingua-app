// Self-test for the three new task screens (21 Nov 2026): “Ailə ağacı” (tree), “Söz sürüklə” (drag), “Profil kartı” (profile).
// One sample card per type: isTask, resolveLesson ({F} token), reviewTask (new situation), grading right/wrong/empty,
// result-goal ids, and a TypeScript check of the samples + the Bölmə 4 lesson files against the card union.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true },
}).outputText, filename);
const L = require('../src/utils/designLesson.ts');

const SAMPLES = `
export const tree: TaskWithReview = {
  type: 'tree', id: 'x_tree', number: 1, title: 'Ailə ağacı', prompt: 'Şəkildə kimdir?', hint: 'Xəttə bax: o, sənin valideynindir.', why: 'Mother = ana.',
  nodes: [{ id: 'mom', x: 20, y: 0 }, { id: 'dad', label: 'father', x: 80, y: 0 }, { id: 'me', label: 'sən', x: 50, y: 100 }],
  links: [['mom', 'dad'], ['mom', 'me']], target: 'mom', options: ['mother', 'sister', 'father'], answer: 'mother',
  variants: [{ match: { option: 'sister' }, explain: { answers: 'mother', reason: 'Bacı səninlə eyni sırada olur.', rule: 'Yuxarı sıra — valideynlər.', example: 'mother' } },
    { match: { other: true }, explain: { answers: 'mother', reason: 'Father kişidir.', rule: 'Yuxarı sıra — valideynlər.', example: 'mother' } }],
  review: { title: 'Ailə ağacı', prompt: 'Şəkildə kimdir?', hint: 'Kişidir.', why: 'Father = ata.', nodes: [{ id: 'mom', label: 'mother', x: 20, y: 0 }, { id: 'dad', x: 80, y: 0 }, { id: 'me', label: 'sən', x: 50, y: 100 }],
    links: [['mom', 'dad'], ['dad', 'me']], target: 'dad', options: ['brother', 'father', 'mother'], answer: 'father',
    variants: [{ match: { other: true }, explain: { answers: 'father', reason: 'Yuxarı sırada kişi atadır.', rule: 'Yuxarı sıra — valideynlər.', example: 'father' } }] },
};
export const drag: TaskWithReview = {
  type: 'drag', id: 'x_drag', number: 2, title: 'Söz sürüklə', prompt: 'Dinlə və hər adamın altına sözü qoy.', hint: 'Sözü adamın altına sürüklə.', why: 'Hər söz öz yerindədir.',
  audio: '{F}: This is my mother and this is my brother.', people: [{ id: 'p1' }, { id: 'p2' }], chips: ['mother', 'brother', 'sister'], answers: { p1: 'mother', p2: 'brother' },
  variants: [{ match: { option: 'sister' }, explain: { answers: 'brother', reason: 'Səsdə sister yox, brother deyilir.', rule: 'Eşitdiyin sözü qoy.', example: 'brother' } },
    { match: { other: true }, explain: { answers: 'mother; brother', reason: 'Sözlərin yeri dəyişib.', rule: 'Eşitdiyin sırada qoy.', example: 'mother' } }],
  review: { title: 'Söz sürüklə', prompt: 'Dinlə və hər adamın altına sözü qoy.', hint: 'Sözü adamın altına sürüklə.', why: 'Hər söz öz yerindədir.',
    audio: '{F}: This is my sister.', people: [{ id: 'p1' }], chips: ['sister', 'mother'], answers: { p1: 'sister' },
    variants: [{ match: { other: true }, explain: { answers: 'sister', reason: 'Səsdə sister deyilir.', rule: 'Eşitdiyin sözü qoy.', example: 'sister' } }] },
};
export const profile: TaskWithReview = {
  type: 'profile', id: 'x_profile', number: 3, title: 'Profil kartı', prompt: 'Dinlə və kartı doldur.', hint: 'Hər sətrə bir cavab.', why: 'Kart tamdır.',
  audio: '{F}: I am a teacher. I am 30.',
  rows: [{ id: 'who', label: 'Kim', options: ['{F}', 'Yeni tanış'], answer: '{F}' }, { id: 'age', label: 'Yaş', number: true, answer: '30' },
    { id: 'job', label: 'Peşə', options: ['teacher', 'doctor', 'student'], answer: 'teacher' }],
  variants: [{ field: 'age', match: { other: true }, explain: { answers: '30', reason: 'Səsdə thirty deyilir.', rule: 'Rəqəmi dinlə.', example: '30' } },
    { field: 'job', match: { option: 'doctor' }, explain: { answers: 'teacher', reason: 'Səsdə doctor yox, teacher deyilir.', rule: 'Peşəni dinlə.', example: 'teacher' } },
    { match: { other: true }, explain: { answers: 'teacher', reason: 'Səsə yenidən qulaq as.', rule: 'Peşəni dinlə.', example: 'teacher' } }],
  review: { title: 'Profil kartı', prompt: 'Dinlə və kartı doldur.', hint: 'Hər sətrə bir cavab.', why: 'Kart tamdır.', audio: '{F}: I am a doctor. I am 41.',
    rows: [{ id: 'who', label: 'Kim', options: ['{F}', 'Yeni tanış'], answer: '{F}' }, { id: 'age', label: 'Yaş', number: true, answer: '41' },
      { id: 'job', label: 'Peşə', options: ['teacher', 'doctor', 'student'], answer: 'doctor' }],
    variants: [{ match: { other: true }, explain: { answers: 'doctor', reason: 'Səsdə doctor deyilir.', rule: 'Peşəni dinlə.', example: 'doctor' } }] },
};
`;

// 1) TypeScript: the samples must satisfy TaskWithReview, and the Bölmə 4 files must still fit the card union.
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'birtalk-new-screens-'));
const typesPath = path.resolve(__dirname, '../src/data/designLessonTypes').replace(/\\/g, '/');
const sampleFile = path.join(dir, 'samples.ts');
fs.writeFileSync(sampleFile, `import type { TaskWithReview } from '${typesPath}';\n${SAMPLES}`);
const unit4 = path.resolve(__dirname, '../src/data/unit4');
const files = [sampleFile, ...fs.readdirSync(unit4).filter(f => f.endsWith('.ts')).map(f => path.join(unit4, f))];
const program = ts.createProgram(files, { noEmit: true, strict: true, target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler, skipLibCheck: true, esModuleInterop: true, resolveJsonModule: true });
const noise = new Set([2307, 2591, 2550]); // missing modules / node types / lib (no node_modules here)
const errors = ts.getPreEmitDiagnostics(program).filter(x => !noise.has(x.code) && x.file && !x.file.fileName.includes('node_modules'));
for (const e of errors) console.error(`${path.relative(process.cwd(), e.file.fileName)}: TS${e.code} ${ts.flattenDiagnosticMessageText(e.messageText, '\n')}`);
assert.equal(errors.length, 0, 'type errors in the samples or the Bölmə 4 lesson files');

// 2) Logic.
const samples = require(sampleFile);
fs.rmSync(dir, { recursive: true, force: true });
const clone = x => JSON.parse(JSON.stringify(x));
const lesson = L.resolveLesson({
  id: 'x', order: 99, title: 'Sınaq', section: 'Sınaq', cards: [clone(samples.tree), clone(samples.drag), clone(samples.profile)],
  result: { done: [], incomplete: '', goals: [{ group: 'Ailə', text: 'Ailəni tanıyırsan', tasks: ['x_tree', 'x_drag', 'x_profile'] }], closing: '', button: '', technical: '', unverified: '' },
  notices: { soundFailed: '', unknown: '', voiceUnknown: '', micFailed: '', review: '' }, vocabulary: [],
});
assert.ok(!JSON.stringify(lesson).includes('{F}'), '{F} resolved');
const flowTasks = L.lessonFlow(lesson).filter(L.isTask);
assert.deepEqual(flowTasks.map(t => t.type), ['tree', 'drag', 'profile'], 'isTask knows the three types');
assert.deepEqual(L.lessonTaskIds(lesson).required, ['x_tree', 'x_drag', 'x_profile'], 'each card is one required task id');
for (const g of lesson.result.goals) for (const id of g.tasks) assert.ok(flowTasks.some(t => t.id === id), `goal task ${id}`);
const card = id => lesson.cards.find(c => c.id === id);

// tree
const tree = card('x_tree');
assert.equal(L.gradeTree(tree, '').status, 'empty');
assert.equal(L.gradeTree(tree, 'mother').status, 'correct');
assert.equal(L.gradeTree(tree, 'sister').explain.reason, 'Bacı səninlə eyni sırada olur.');
assert.equal(L.gradeTree(tree, 'father').explain.yourAnswer, 'father');
const treeR = L.reviewTask(lesson, 'x_tree');
assert.equal(treeR.id, 'x_tree'); assert.equal(treeR.type, 'tree'); assert.equal(treeR.target, 'dad');
assert.equal(L.gradeTree(treeR, 'father').status, 'correct'); assert.equal(L.gradeTree(treeR, 'mother').status, 'wrong');

// drag
const drag = card('x_drag');
assert.equal(L.gradeDrag(drag, { p1: 'mother' }).status, 'empty');
assert.equal(L.gradeDrag(drag, { p1: 'mother', p2: 'brother' }).status, 'correct');
const dw = L.gradeDrag(drag, { p1: 'mother', p2: 'sister' });
assert.equal(dw.status, 'wrong'); assert.deepEqual(dw.rows, { p1: 'correct', p2: 'wrong' });
assert.equal(dw.explain.reason, 'Səsdə sister yox, brother deyilir.'); assert.equal(dw.explain.yourAnswer, '2 — sister');
assert.equal(L.gradeDrag(drag, { p1: 'brother', p2: 'mother' }).explain.reason, 'Sözlərin yeri dəyişib.');
const dragR = L.reviewTask(lesson, 'x_drag');
assert.equal(dragR.people.length, 1); assert.equal(L.gradeDrag(dragR, { p1: 'sister' }).status, 'correct');
assert.ok(!dragR.audio.includes('{F}'));

// profile
const prof = card('x_profile');
const who = prof.rows[0].answer;
assert.equal(L.gradeProfile(prof, { who, age: '30' }).status, 'empty');
assert.equal(L.gradeProfile(prof, { who, age: '30', job: 'teacher' }).status, 'correct');
assert.equal(L.gradeProfile(prof, { who, age: ' 30', job: 'teacher' }).status, 'correct', 'digits only');
const pw = L.gradeProfile(prof, { who, age: '13', job: 'doctor' });
assert.equal(pw.status, 'wrong'); assert.deepEqual(pw.rows, { who: 'correct', age: 'wrong', job: 'wrong' });
assert.equal(pw.notes.age, 'Səsdə thirty deyilir.'); assert.equal(pw.notes.job, 'Səsdə doctor yox, teacher deyilir.');
assert.equal(pw.explain.reason, 'Səsdə thirty deyilir.'); assert.equal(pw.explain.yourAnswer, 'Yaş — 13; Peşə — doctor');
assert.equal(L.gradeProfile(prof, { who: 'Yeni tanış', age: '30', job: 'teacher' }).notes.who, 'Səsə yenidən qulaq as.');
const profR = L.reviewTask(lesson, 'x_profile');
assert.equal(L.gradeProfile(profR, { who, age: '41', job: 'doctor' }).status, 'correct');
assert.equal(L.gradeProfile(profR, { who, age: '30', job: 'teacher' }).status, 'wrong');

console.log('PASS: new screens — tree / drag / profile: types (samples + Bölmə 4 files), isTask, names, review variants, grading, per-row notes, goal ids.');
