const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true },
}).outputText, filename);
const { b1Packet, packetFlow } = require('../src/data/b1Course.ts');
const { lessonMode, audioMeaning, heroHeight, welcomeSceneHeight } = require('../src/utils/lessonPresentation.ts');
const { lessonIntroduction, lessonHint, teachingText, microphoneLevel } = require('../src/utils/lessonGuide.ts');
let listening = 0; const modes = new Set();
for (const packet of b1Packet) {
  const introduction = lessonIntroduction(packet);
  assert.equal(introduction.objectives.length, 3, 'each lesson opens with three passive learning objectives');
  assert.ok(introduction.board && introduction.subtitle);

  for (const original of packetFlow(packet)) {
    for (const card of [original, original.review].filter(Boolean)) {
      modes.add(lessonMode(card));
      const hint = lessonHint({ ...card, explanation: 'SECRET_ANSWER', rule: card.rule ? { ...card.rule, answers: ['SECRET_ANSWER'] } : undefined });
      if (hint) assert.ok(!hint.includes('SECRET_ANSWER'), 'pre-answer hints cannot read the answer key');
      if (card.kind !== 'task' || card.audio || card.options) assert.equal(hint, null, 'help only where needed');
      if (card.kind === 'teach') assert.equal([teachingText(card), ...card.body.split(/\n\s*\n/).slice(1)].join('\n\n'), card.body, 'separating the explanation preserves the authored teaching text');

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
assert.equal(microphoneLevel(undefined), 0);
assert.equal(microphoneLevel(-160), 0);
assert.equal(microphoneLevel(0), 1);
assert.equal(microphoneLevel(Number.NaN), 0);
assert.ok(microphoneLevel(-20) > microphoneLevel(-45), 'the waveform follows measured microphone loudness');
assert.ok(listening > 0);
for (const mode of ['BAŞLAMAZDAN ƏVVƏL','ÖYRƏN','DİNLƏMƏ','DÜZGÜN CAVABI SEÇ','CÜMLƏ QUR','YAZI MƏŞQİ','DANIŞIQ','DƏRSİN NƏTİCƏSİ']) assert.ok(modes.has(mode), mode);
assert.equal(heroHeight(700, true, true, 1), 0, 'keyboard removes decorative artwork');
assert.equal(heroHeight(700, true, false, 1.5), 0, 'large accessibility text keeps space for the task');
assert.ok(welcomeSceneHeight(700, 150, 210) <= 700 - 150 - 210 - 60, 'welcome reserves space for headings, objectives, caption and gaps');
assert.ok(welcomeSceneHeight(580, 150, 210) < welcomeSceneHeight(700, 150, 210), 'artwork shrinks with the remaining viewport');
assert.ok(Number.isFinite(welcomeSceneHeight(0, 150, 210)), 'first layout has a finite fallback');
const catalog = JSON.parse(fs.readFileSync(require.resolve('../assets/lessons/scene-library.json')));
assert.equal(new Set(catalog.map(a => a.id)).size, catalog.length);
for (const asset of catalog) assert.ok(fs.existsSync(require.resolve('../' + asset.file)), asset.file);
console.log(`PASS: all 8 presentation modes across 7 lessons; ${listening} listening/review cards; authored translations, keyboard/accessibility layout and reusable assets.`);
