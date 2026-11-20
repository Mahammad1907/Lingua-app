// Spaced review engine (src/utils/spacedReview.ts): 1 / 3 / 7 / 14 day steps, shortening after a mistake, due order.
const fs = require('node:fs'), assert = require('node:assert/strict'), ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, f);
const E = require('../src/utils/spacedReview.ts');

assert.deepEqual([...E.INTERVALS], [1, 3, 7, 14]);
assert.equal(E.addDays('2026-11-18', 1), '2026-11-19');
assert.equal(E.addDays('2026-11-30', 1), '2026-12-01', 'month end');
assert.equal(E.addDays('2026-12-31', 1), '2027-01-01', 'year end');
assert.equal(E.addDays('2026-02-27', 3), '2026-03-02', 'February');

let items = E.registerItem({}, 'L1', 't1', '2026-11-18', true);
items = E.registerItem(items, 'L1', 't2', '2026-11-18', false);
assert.equal(items['L1:t1'].dueDay, '2026-11-19', 'difficult: tomorrow');
assert.equal(items['L1:t2'].dueDay, '2026-11-21', 'independent: 3 days');
assert.equal(E.registerItem(items, 'L1', 't1', '2026-11-25', false), items, 'registering twice changes nothing');

// Success ladder from tomorrow: 1 → 3 → 7 → 14 → steady 30.
let it = items['L1:t1']; let day = it.dueDay; const gaps = [];
for (let i = 0; i < 5; i++) { it = E.gradeItem(it, true, day); gaps.push((Date.parse(it.dueDay) - Date.parse(day)) / 864e5); day = it.dueDay; }
assert.deepEqual(gaps, [3, 7, 14, 30, 30], `ladder ${gaps}`);
assert.equal(it.stage, E.MAX_STAGE);

// A mistake shortens the interval: two stages down, never below 0.
const hard = E.gradeItem({ ...it, stage: 3 }, false, '2026-12-01');
assert.equal(hard.stage, 1); assert.equal(hard.dueDay, '2026-12-04'); assert.equal(hard.lapses, it.lapses + 1);
assert.equal(E.gradeItem({ ...it, stage: 0 }, false, '2026-12-01').dueDay, '2026-12-02');

// Due list: only due items, most overdue first, then lower stage; limited.
const set = {};
for (const [k, due, stage, lapses] of [['a', '2026-11-20', 2, 0], ['b', '2026-11-18', 3, 0], ['c', '2026-11-18', 1, 0], ['d', '2026-11-25', 0, 0], ['e', '2026-11-18', 1, 2]])
  set[k] = { key: k, lessonId: 'L', taskId: k, stage, dueDay: due, lapses, lastDay: '2026-11-10' };
assert.deepEqual(E.dueItems(set, '2026-11-20').map(i => i.key), ['e', 'c', 'b', 'a']);
assert.equal(E.dueItems(set, '2026-11-20', 2).length, 2);
assert.equal(E.dueItems(set, '2026-11-17').length, 0, 'nothing due yet');
console.log('PASS: spaced review — 1/3/7/14 days, steady 30, shortening after a mistake, due order.');
