const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, filename);
require.extensions['.webp'] = (module, filename) => { module.exports = filename; };
const nativeLoad = Module._load, requests = [], fail = new Set();
const nativeImage = { resolveAssetSource: source => ({ uri: source }) };
Module._load = function (id, ...args) {
  if (id === 'react-native') return { Image: nativeImage };
  if (id === 'expo-image') return { Image: { prefetch: async (uri, policy) => { requests.push({ uri, policy }); return !fail.has(uri); } } };
  return nativeLoad.call(this, id, ...args);
};
async function main() {
  const { classroomSource, lessonSceneSources, warmLessonArtwork } = require('../src/utils/lessonAssets.ts');
  await warmLessonArtwork([classroomSource, classroomSource]);
  assert.equal(requests.length, 1, 'the same board is prefetched only once');
  await Promise.all([warmLessonArtwork(), warmLessonArtwork()]);
  assert.equal(requests.length, 2, 'overlapping screens reuse an in-flight/cached preload');
  const source = lessonSceneSources.farewell;
  fail.add(source); await warmLessonArtwork([source]); await warmLessonArtwork([source]);
  assert.equal(requests.filter(r => r.uri === source).length, 2, 'a failed preload remains retryable');
  fail.delete(source); await warmLessonArtwork([source]); await warmLessonArtwork([source]);
  assert.equal(requests.filter(r => r.uri === source).length, 3, 'successful retry is cached');
  for (const request of requests) assert.equal(request.policy, 'memory-disk');
  for (const file of [classroomSource, ...Object.values(lessonSceneSources)]) {
    assert.ok(fs.statSync(file).size < 120 * 1024, `${file} must remain a small bundled image`);
  }
  delete nativeImage.resolveAssetSource;
  await warmLessonArtwork([{ uri: '/web-board.webp' }, { uri: '/web-board.webp' }]);
  assert.equal(requests.filter(r => r.uri === '/web-board.webp').length, 1, 'web URI assets preload without a native-only resolver');
  console.log('PASS: board/scene prefetch, overlapping requests, memory/disk policy, failed-load retry and bundled asset sizes.');
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => { Module._load = nativeLoad; });
