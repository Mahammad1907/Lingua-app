// Qaydalar (21 Nov 2026): every Müəllim izahı is a rule with a name and topic; tables come from real word cards.
const assert = require('node:assert/strict');
const fs = require('node:fs'); const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true },
}).outputText, filename);

const { designLessons } = require('../src/data/designLessons.ts');
const { RULES, RULE_META, RULE_TOPICS, TABLES, ruleOfTask } = require('../src/data/rules.ts');
const topics = new Set(RULE_TOPICS.map(t => t.id));
const explains = designLessons.filter(l => !l.exam).flatMap(l => l.cards.filter(c => c.type === 'explain'));
for (const c of explains) {
  assert.ok(RULE_META[c.id], `${c.id}: Müəllim izahı needs a name and topic in RULE_META (src/data/rules.ts)`);
  assert.ok(topics.has(RULE_META[c.id].topic), `${c.id}: unknown topic`);
  assert.ok(RULE_META[c.id].title.endsWith('?'), `${c.id}: the rule name must be a question`);
  assert.ok(RULE_META[c.id].eg && !RULE_META[c.id].eg.includes('…'), `${c.id}: English example missing`);
}
for (const id of Object.keys(RULE_META)) assert.ok(explains.some(c => c.id === id), `RULE_META ${id}: no such explain card`);
assert.equal(RULES.length, explains.length);
for (const r of RULES) assert.ok(r.tasks.length > 0, `${r.id}: no task practises this rule`);
for (const r of RULES) for (const t of r.tasks) assert.equal(ruleOfTask(t).id, r.id);
for (const t of TABLES) if (t.id !== 'letters') for (const g of t.groups) {
  assert.ok(g.rows.length, `${t.id}/${g.title}: empty`);
  for (const row of g.rows) assert.ok(designLessons.some(l => l.cards.some(c => c.id === row.card)), `${t.id}: ${row.key} has no lesson card`);
}
const nums = TABLES.find(t => t.id === 'numbers').groups.flatMap(g => g.rows);
assert.equal(nums.length, 26, `numbers 0–20, 30–60, 25: ${nums.length}`);
for (const r of nums) assert.ok(r.reading, `number ${r.en}: reading`);
console.log(`check-rules: ${RULES.length} rules in ${topics.size} topics, ${TABLES.length} tables — names, topics, linked tasks, table rows OK.`);
