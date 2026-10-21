const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true },
}).outputText, filename);
const { b1Packet, packetFlow } = require('../src/data/b1Course.ts');
const { lessonMode, audioMeaning, heroHeight } = require('../src/utils/lessonPresentation.ts');
let listening = 0; const modes = new Set();
for (const packet of b1Packet) {
  for (const original of packetFlow(packet)) {
    for (const card of [original, original.review].filter(Boolean)) {
      modes.add(lessonMode(card));
      if (card.kind === 'voice') assert.equal(lessonMode(card), 'DANIŞIQ');
      if (card.audio) {
        listening++;
        const meaning = audioMeaning(packet, card.audio);
        if (meaning) assert.ok(packet.vocabulary.some(v => meaning.endsWith(v.translation)), 'translations come from the authored glossary');
      }
    }
  }
  assert.equal(audioMeaning(packet, 'UNKNOWN_PHRASE_123'), null, 'unknown translations are never invented');
}
assert.equal(b1Packet.length, 7);
assert.ok(listening > 0);
for (const mode of ['BAŞLAMAZDAN ƏVVƏL','ÖYRƏN','DİNLƏMƏ','DÜZGÜN CAVABI SEÇ','CÜMLƏ QUR','YAZI MƏŞQİ','DANIŞIQ','DƏRSİN NƏTİCƏSİ']) assert.ok(modes.has(mode), mode);
assert.equal(heroHeight(700, true, true, 1), 0, 'keyboard removes decorative artwork');
assert.equal(heroHeight(700, true, false, 1.5), 0, 'large accessibility text keeps space for the task');
const catalog = JSON.parse(fs.readFileSync(require.resolve('../assets/lessons/scene-library.json')));
assert.equal(new Set(catalog.map(a => a.id)).size, catalog.length);
for (const asset of catalog) assert.ok(fs.existsSync(require.resolve('../' + asset.file)), asset.file);
console.log(`PASS: all 8 presentation modes across 7 lessons; ${listening} listening/review cards; authored translations, keyboard/accessibility layout and reusable assets.`);
