// No new project dependencies: run with `node scripts/check-onboarding.cjs`.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, filename);
const { defaultPreferences, parsePreferences, goals, levels, levelSummary, practiceMinutes } = require('../src/utils/onboarding.ts');
assert.deepEqual(parsePreferences(null), defaultPreferences);
for (const raw of ['broken JSON', 'null', '42', '"text"', '[]', '{"goal":"invalid","levelChoice":"invalid","minutes":-1}']) {
  assert.deepEqual(parsePreferences(raw), defaultPreferences);
}
for (const goal of goals) for (const level of levels) for (const minutes of practiceMinutes) {
  const choice = { goal: goal.id, levelChoice: level.id, minutes };
  assert.deepEqual(parsePreferences(JSON.stringify(choice)), choice, 'all 100 preference combinations survive storage');
}
assert.equal(parsePreferences(null, 'A2').levelChoice, 'basic');
assert.equal(parsePreferences(null, 'B1').levelChoice, 'conversation');
assert.equal(parsePreferences(null, 'B2').levelChoice, 'confident');
assert.equal(parsePreferences(null, 'test').levelChoice, 'unknown');
assert.equal(parsePreferences('{"goal":"career"}', 'B1').goal, 'career');
assert.equal(parsePreferences('{"goal":"career"}', 'B1').levelChoice, 'conversation');
const unknown = { ...defaultPreferences, levelChoice: 'unknown' };
assert.equal(levelSummary(unknown, 'test', null), 'Hələ müəyyən edilməyib');
assert.equal(levelSummary(unknown, 'A2', '4'), 'Test nəticəsi: A2');
assert.equal(levelSummary(defaultPreferences, 'A1', '9'), 'Sıfırdan başlayıram', 'manual choice is not claimed as a placement result');
const { getAllModules } = require('../src/data/modules.ts');
const { getLessonById } = require('../src/data/lessons.ts');
const available = getAllModules().filter(m => m.language === 'en' && m.level === 'A1');
assert.ok(available.length);
assert.ok(available[0].lessonIds.every(getLessonById));
assert.equal(getAllModules().filter(m => m.language === 'en' && m.level === 'B2').length, 0, 'advanced lessons must not be invented');
console.log('PASS: 100 preference round trips, malformed storage, migration, honest manual/test summaries and actual course availability.');
