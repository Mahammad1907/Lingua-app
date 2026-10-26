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
      const phrase = card.turns?.[0]?.audio || card.audio;
      if (phrase) assert.ok(audioMeaning(packet, phrase), `missing voice/listening meaning: ${card.id}`);
      if (card.audio) {
        listening++;
        const meaning = audioMeaning(packet, card.audio);
        assert.ok(meaning, `missing authored meaning: ${card.id}`);
        if (meaning) assert.ok([...packet.vocabulary.map(v => v.translation), ...Object.values(packet.audioMeanings || {})].some(text => meaning.endsWith(text)), 'translations come from the authored glossary');
      }
    }
  }
  assert.equal(audioMeaning(packet, 'UNKNOWN_PHRASE_123'), null, 'unknown translations are never invented');
}
assert.equal(b1Packet.length, 7);
const nameLesson = b1Packet.find(l => l.order === 2);
for (const original of packetFlow(nameLesson)) {
  for (const card of [original, original.review].filter(Boolean)) {
    const audio = card.turns?.[0]?.audio || card.audio;
    if (audio) assert.ok(audioMeaning(nameLesson, audio), `lesson 2 listening/voice phrase has an authored meaning: ${card.id}`);
  }
}
assert.equal(audioMeaning(nameLesson, "hi. i'm ali"), "hi. i'm ali — Salam. Mən Əliyəm.");
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

const { packetScene } = require('../src/utils/packetScene.ts');
const newScenes = new Set(['farewell', 'name-card', 'feelings']);
const placements = [];
for (const lesson of b1Packet) {
  for (const card of packetFlow(lesson)) {
    const scene = packetScene(lesson.order, card);
    if (newScenes.has(scene) && card.kind === 'teach') {
      assert.equal(card.kind, 'teach', 'new art is limited to teaching');
      placements.push(`${lesson.order}:${card.number}:${scene}`);
    }
    const freeSituation = card.kind === 'task' && !card.audio && !card.options && !card.words;
    if (['task', 'voice', 'review', 'result'].includes(card.kind) && !freeSituation) assert.equal(scene, undefined, 'listening, choice and word-bank questions cannot expose a topic answer');
    assert.equal(packetScene(lesson.order, card, true), freeSituation ? scene : undefined, 'only free situation prompts may reuse matching illustrations in review');
  }
}
assert.deepEqual(placements, ['1:7:farewell', '2:4:name-card', '3:4:name-card', '4:5:feelings', '4:14:feelings']);
assert.equal(packetScene(2, { kind: 'teach', number: 9 }), undefined, 'I am / My name is stays on the board');
assert.equal(packetScene(3, { kind: 'teach', number: 5 }), undefined, 'my / your stays on the board');
console.log('PASS: three reused character illustrations in five teaching placements; comparison boards and listening/choice isolation preserved; free situation artwork allowed.');
