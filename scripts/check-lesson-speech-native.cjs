const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, filename);
// Exercise the hook's asynchronous native boundary without claiming a device test.
async function main() {
  const effects = [], cleanups = [], results = [];
  const listeners = new Map(); let starts = 0, aborts = 0, background;
  let permission = async () => ({ granted: true });
  const emit = (event, payload) => { for (const callback of [...(listeners.get(event) || [])]) callback(payload); };
  const engine = {
    addListener(event, callback) { if (!listeners.has(event)) listeners.set(event, new Set()); listeners.get(event).add(callback); return { remove: () => listeners.get(event).delete(callback) }; },
    supportsOnDeviceRecognition: () => true,
    isRecognitionAvailable: () => true,
    requestMicrophonePermissionsAsync: () => permission(),
    requestPermissionsAsync: () => permission(),
    start(options) { starts++; assert.equal(options.recordingOptions, undefined, 'lessons do not allocate a persisted audio recorder'); assert.equal(options.volumeChangeEventOptions.enabled, true); },
    stop() {},
    abort() { aborts++; emit('error', { error: 'aborted' }); emit('end'); },
  };
  const originalLoad = Module._load;
  Module._load = function(request, parent, isMain) {
    if (request === 'react') return {
      useState: value => [typeof value === 'function' ? value() : value, () => {}],
      useRef: value => ({ current: value }), useCallback: callback => callback,
      useEffect: callback => effects.push(callback),
    };
    if (request === 'react-native') return { AppState: { currentState: 'active', addEventListener: (_event, callback) => { background = callback; return { remove() {} }; } } };
    if (request === 'expo-speech') return { stop: async () => {} };
    if (request === '../utils/speechEngine') return { getSpeechEngine: () => engine };
    return originalLoad.call(this, request, parent, isMain);
  };
  try {
    const { useLessonSpeech } = require('../src/hooks/useLessonSpeech.ts');
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Isolated hook harness uses the mocked React runtime above.
    const speech = useLessonSpeech({ onBusyChange() {}, onFinal: result => { results.push(result); return null; } });
    for (const effect of effects) { const cleanup = effect(); if (typeof cleanup === 'function') cleanups.push(cleanup); }
    await speech.start(); assert.equal(starts, 1);
    emit('result', { isFinal: false, results: [{ transcript: 'Hello', confidence: 0 }] });
    assert.equal(results.length, 0, 'interim result is not sent');
    emit('result', { isFinal: true, results: [{ transcript: 'Hello!', confidence: .9 }] });
    emit('end'); emit('end');
    assert.equal(results.length, 1, 'final plus end sends automatically exactly once');
    await speech.start(); speech.cancel();
    emit('result', { isFinal: true, results: [{ transcript: 'Bye!', confidence: .9 }] }); emit('end');
    assert.equal(results.length, 1, 'cancel ignores late native events');
    let grant;
    permission = () => new Promise(resolve => { grant = resolve; });
    const pending = speech.start(); await Promise.resolve(); await Promise.resolve();
    assert.equal(typeof grant, 'function'); speech.cancel(); grant({ granted: true }); await pending;
    assert.equal(starts, 2, 'closing while permissions are pending cannot start hidden recognition');
    permission = async () => ({ granted: false });
    await speech.start(); assert.equal(starts, 2, 'denied permissions never start capture');
    permission = async () => ({ granted: true }); await speech.start();
    background('background'); emit('result', { isFinal: true, results: [{ transcript: 'Hi', confidence: .9 }] }); emit('end');
    assert.equal(results.length, 1, 'background cancels automatic submission');
    await speech.start();
    for (const cleanup of cleanups.splice(0).reverse()) cleanup();
    emit('result', { isFinal: true, results: [{ transcript: 'Hi', confidence: .9 }] }); emit('end');
    assert.equal(results.length, 1, 'unmounted hook cannot submit');
    assert.ok(aborts >= 3);
    assert.ok([...listeners.values()].every(set => set.size === 0), 'all native listeners are removed');
    console.log('PASS: mocked native final/end submission, cancellation, pending/denied permission, background and unmount cleanup.');
  } finally { for (const cleanup of cleanups.reverse()) cleanup(); Module._load = originalLoad; }
}
main().catch(error => { process.stderr.write(String(error.stack)); process.exitCode = 1; });
