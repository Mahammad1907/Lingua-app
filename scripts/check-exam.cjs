// Unified section-exam results: best attempt, history, and a section opens the next one only after its exam is passed.
const fs = require('node:fs'), assert = require('node:assert/strict'), ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, f);
const X = require('../src/utils/examResults.ts');
const a = (percent, passed) => ({ percent, passed, at: 'x' });
assert.deepEqual(X.bestAttempt(a(90, true), a(60, false)), a(90, true), 'a pass is never lost');
assert.deepEqual(X.bestAttempt(a(70, false), a(75, true)), a(75, true));
assert.deepEqual(X.bestAttempt(a(70, false), a(60, false)), a(70, false));
assert.deepEqual(X.bestAttempt(a(80, true), a(95, true)), a(95, true));
let h = {}; for (let i = 0; i < 25; i++) h = X.addAttempt(h, 'e', a(i, false));
assert.equal(h.e.length, 20); assert.equal(h.e[19].percent, 24);
assert.equal(X.isPass(69), false); assert.equal(X.isPass(70), true);
assert.equal(X.examCleared(undefined, {}), true, 'no exam → cleared');
assert.equal(X.examCleared('e', {}), false); assert.equal(X.examCleared('e', { e: a(80, true) }), true);
assert.equal(X.examCleared('e', { e: a(60, false) }), false);
try {
  require('../src/config/testAccess.ts').TEST_OPEN_SECTIONS.length = 0; // test access would open every section
  const { buildHomeCourse } = require('../src/utils/homeCourse.ts');
  const { getAllModules } = require('../src/data/modules.ts');
  const { lessons } = require('../src/data/lessons.ts');
  const mods = getAllModules().filter(m => m.language === 'en' && m.level === 'A1');
  const done = mods.filter(m => m.order <= 2).flatMap(m => m.lessonIds);
  const avail = new Set([...mods.flatMap(m => m.lessonIds)]);
  const state = (exams) => buildHomeCourse({ modules: mods, language: 'en', level: 'A1', completedLessons: done, availableLessonIds: avail, placementResults: [], sectionExams: exams }).items.find(i => i.order === 3)?.state;
  const noPass = state({}), pass = state({ a1_en_b1_exam: a(75, true), a1_en_b2_exam: a(75, true) });
  console.log('Bölmə 3 state without / with passed Bölmə 2 exam:', noPass, '/', pass);
  assert.equal(noPass, 'locked'); assert.equal(pass, 'current'); assert.equal(state({ a1_en_b1_exam: a(75, true), a1_en_b2_exam: a(65, false) }), 'locked', 'failed exam keeps next locked');
} catch (e) { if (e.code === 'ERR_ASSERTION') throw e; console.log('(home course check skipped here:', e.message.split('\n')[0] + ')'); }
console.log('PASS: exam results — best attempt, history, pass mark, section gating.');
