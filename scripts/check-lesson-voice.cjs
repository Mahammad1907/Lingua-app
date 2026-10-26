const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, filename);
const { SpeechTurn } = require('../src/utils/speechTurn.ts');
const { safelyStopRecorder, safelyReadRecorder } = require('../src/utils/recordedAudio.ts');
const { fitLessonArtwork } = require('../src/utils/lessonPresentation.ts');
const { lessonCorrection } = require('../src/utils/lessonGuide.ts');

const turn = new SpeechTurn();
turn.result('Hello', true, .9, 0); assert.equal(turn.finish(), null, 'late idle events cannot submit');
turn.begin(0); assert.equal(turn.tick(7900), null); assert.equal(turn.tick(8000), 'empty');
assert.equal(turn.finish(), null, 'silence is not a language attempt');
turn.begin(10000); turn.result('Hello', false, 0, 10200);
turn.volume(5, 11000); assert.equal(turn.tick(12799), null);
assert.equal(turn.tick(12800), 'stop', '1.8 seconds of silence after speech stops capture');
assert.equal(turn.tick(12900), null, 'stop is requested once');
assert.equal(turn.finish(), null, 'partial transcript is never graded');
turn.begin(20000); turn.result('Hello!', false, 0, 20500); turn.result('Hello!', true, .9, 20800);
const answer = turn.finish(); assert.equal(answer.text, 'Hello!'); assert.ok(answer.token);
assert.equal(turn.finish(), null, 'end/final duplicates cannot award twice');
turn.result('Goodbye', true, .9, 21000); assert.equal(turn.finish(), null, 'late final after end is ignored');
turn.begin(22000); turn.result('Hi', true, .1, 22100); assert.equal(turn.finish(), null, 'uncertain recognition never penalizes a learner');
turn.begin(23000); turn.result('Hi', true, -1, 23100); assert.equal(turn.finish().text, 'Hi', '-1 means confidence unavailable, not low');
turn.begin(24000); turn.result('Hi', false, 0, 24100); turn.cancel(); turn.result('Hi', true, .9, 25000); assert.equal(turn.finish(), null, 'cancel/back/unmount disarms automatic submission');
turn.begin(26000); turn.result('Hi', false, 0, 26100); turn.processing(26200); assert.equal(turn.tick(31200), 'timeout'); assert.equal(turn.finish(), null);
let stopCalls = 0;
safelyStopRecorder({ get isRecording() { throw new Error('native shared object released'); }, stop() { stopCalls++; return Promise.resolve(); } });
assert.equal(stopCalls, 0, 'released native getter is guarded before stop');
safelyStopRecorder({ isRecording: true, stop() { throw new Error('released during cleanup'); } });
safelyStopRecorder({ isRecording: true, stop() { stopCalls++; return Promise.reject(new Error('already stopped')); } });
assert.equal(stopCalls, 1);
assert.equal(safelyReadRecorder(() => { throw new Error('released status'); }), null);
assert.equal(safelyReadRecorder(() => false), false);
for (const viewport of [240, 400, 580, 700]) for (const body of [180, 300, 600]) {
  const art = fitLessonArtwork(viewport, body, 220);
  assert.ok(art >= 0 && art <= 220);
  if (body + 60 <= viewport) assert.ok(art + body + 60 <= viewport, 'decoration fits only the remaining viewport');
  else assert.equal(art, 0, 'long/keyboard content yields all decorative space');
}
assert.match(lessonCorrection({ rule: { goals: ['farewell'] } }, 'Hi!', { status: 'wrong', message: '' }), /Goodbye/);
const source = fs.readFileSync(require.resolve('../src/components/lesson/PacketLesson.tsx'), 'utf8');
const ast = ts.createSourceFile('PacketLesson.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let inlineFeedback = false;
function visit(node) {
  if (ts.isJsxElement(node) && node.openingElement.tagName.getText(ast) === 'LessonViewport') {
    function findFeedback(child) {
      if (ts.isJsxSelfClosingElement(child) && child.tagName.getText(ast) === 'LessonFeedback') inlineFeedback = true;
      ts.forEachChild(child, findFeedback);
    }
    ts.forEachChild(node, findFeedback);
  }
  ts.forEachChild(node, visit);
}
visit(ast);
assert.ok(inlineFeedback, 'feedback belongs below answers inside the content, never in an overlay footer');
assert.ok(!source.includes('SoundMark'), 'the player cannot duplicate the hero waveform');
assert.ok(!source.includes('RecognizedVoiceComposer'), 'lessons no longer mount the record/replay fallback');
assert.ok(!source.includes('İndi sən danış'), 'redundant speaking heading is removed');
console.log('PASS: silence, partial/final/end order, confidence, timeout, cancel, duplicate submit, released native cleanup, measured decoration and inline feedback structure.');
