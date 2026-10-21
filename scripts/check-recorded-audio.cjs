const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, filename);
const { loadRecordedAudio } = require('../src/utils/recordedAudio.ts');

// Reproduce the phone's native player: replace(null) throws before JS playback.
const sources = [];
let pauses = 0;
const player = {
  pause() { pauses++; },
  replace(source) {
    assert.ok(source && typeof source.uri === 'string', 'native source must be an AudioSource object');
    sources.push(source);
  },
};
for (const empty of [undefined, null, '', '   ']) assert.equal(loadRecordedAudio(player, empty), 'idle');
assert.deepEqual(sources, [], 'initial mount and clearing a recording never pass an empty source to native code');
assert.equal(loadRecordedAudio(player, 'file:///recording.m4a'), 'ready');
assert.deepEqual(sources, [{ uri: 'file:///recording.m4a' }]);
assert.equal(loadRecordedAudio(player, null), 'idle');
assert.equal(sources.length, 1, 're-record pauses the old source without replacing it with null');
assert.equal(pauses, 6);
assert.equal(loadRecordedAudio({ pause() {}, replace() { throw new Error('native unavailable'); } }, 'file:///bad.m4a'), 'error');
assert.equal(loadRecordedAudio({ pause() { throw new Error('released'); }, replace() {} }, null), 'error');
for (const file of ['src/components/lesson/VoicePracticeRecorder.tsx', 'src/components/RecognizedVoiceComposer.tsx']) {
  const source = fs.readFileSync(require.resolve('../' + file), 'utf8');
  assert.ok(source.includes('loadRecordedAudio(player, draft?.uri)'), `${file} must use the guarded native source path`);
  assert.ok(!source.includes('player.replace('), `${file} must not bypass the guarded source path`);
}
console.log('PASS: empty mount, re-record, valid playback source, native failure handling and both recorder integrations.');
