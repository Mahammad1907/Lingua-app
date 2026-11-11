const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, file);
const { b1Packet, packetFlow } = require('../src/data/b1Course.ts');
const { approvedSceneIds, approvedScenesForCard, buildApprovedScenePlan } = require('../src/utils/approvedLessonScenes.ts');
const catalog = JSON.parse(fs.readFileSync(require.resolve('../assets/lessons/scene-library.json')));
const manifest = JSON.parse(fs.readFileSync(require.resolve('../assets/lessons/scenes/visual-completion-20261111.json')));
const ids = new Set(); let selected = 0, taskCount = 0, illustratedTasks = 0;
for (const lesson of b1Packet) {
 const flow = packetFlow(lesson).filter(c => c.kind !== 'review'); const plan = buildApprovedScenePlan(flow);
 flow.forEach((card, i) => {
  const scenes = plan[i]; scenes.forEach(id => { assert.ok(approvedSceneIds.includes(id)); ids.add(id); });
  selected += scenes.length;
  if (card.kind === 'task') { taskCount++; if (scenes.length) illustratedTasks++; }
  if (i) assert.ok(scenes.every(id => !plan[i-1].includes(id)), `${card.id}: no consecutive picture reuse`);
  if (card.audio || card.turns || card.options || card.words || card.kind === 'voice') assert.deepEqual(scenes, [], `${card.id}: independent assessment has no visual answer cue`);
  assert.deepEqual(approvedScenesForCard(card, true), [], `${card.id}: reviews cannot reuse an old scene context`);
 });
}
assert.ok(illustratedTasks < taskCount / 3, 'illustrations remain selective');
assert.equal(manifest.assets.length, 12, 'the agreed missing visual set has twelve actual assets');
let bytes = 0;
for (const asset of manifest.assets) {
 const catalogEntry = catalog.find(entry => entry.id === asset.id); assert.equal(catalogEntry?.file, asset.file);
 const data = fs.readFileSync(require.resolve('../' + asset.file)); bytes += data.length;
 assert.equal(data.toString('ascii', 0, 4), 'RIFF'); assert.equal(data.toString('ascii', 8, 12), 'WEBP');
 assert.ok(asset.prompt && asset.source, 'generation provenance remains reviewable');
 if (asset.id.startsWith('toy-')) assert.ok(ids.has(asset.id), `${asset.id} is connected to a real authored lesson situation`);
 else assert.ok(fs.readFileSync(require.resolve('../src/components/lesson/LessonMascot.tsx'),'utf8').includes(asset.file.split('/').at(-1)), `${asset.id} is bound to the reusable mascot`);
}
assert.ok(bytes < 1_600_000, 'optimized twelve-image pack stays below 1.6 MB');
console.log(`PASS: 12 bundled visuals, ${bytes} bytes; ${selected} picture placements; selective teaching/writing, no listening/choice cues, no consecutive reuse, no stale review images.`);
