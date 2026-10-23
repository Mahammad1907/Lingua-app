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
  const platform = { OS: 'android', Version: 33 };
  const listeners = new Map(); let starts = 0, aborts = 0, background, local = true, available = true, lastOptions, modelDownloads = 0;
  let recording = false;
  let permission = async () => ({ granted: true });
  const emit = (event, payload) => { for (const callback of [...(listeners.get(event) || [])]) callback(payload); };
  const engine = {
    addListener(event, callback) { if (!listeners.has(event)) listeners.set(event, new Set()); listeners.get(event).add(callback); return { remove: () => listeners.get(event).delete(callback) }; },
    supportsRecording: () => recording,
    supportsOnDeviceRecognition: () => local,
    isRecognitionAvailable: () => available,
    requestMicrophonePermissionsAsync: () => permission(),
    requestPermissionsAsync: () => permission(),
    androidTriggerOfflineModelDownload: async () => { modelDownloads++; return { status: 'download_success' }; },
    start(options) { lastOptions = options; starts++; assert.deepEqual(options.recordingOptions, recording ? { persist: true } : undefined, 'recording is requested only when the native service supports it'); assert.equal(options.volumeChangeEventOptions.enabled, true); },
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
    if (request === 'react-native') return { Platform: platform, AppState: { currentState: 'active', addEventListener: (_event, callback) => { background = callback; return { remove() {} }; } } };
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
    assert.equal(results.length, 0, 'recognition does not grade before the learner reviews the text');
    speech.confirm('   '); assert.equal(results.length, 0, 'empty corrections cannot be submitted');
    speech.confirm('Hello!'); speech.confirm('Hello!');
    assert.equal(results.length, 1, 'confirmation submits once despite rapid repeated taps');
    assert.equal(results[0].edited, false);
    assert.equal(lastOptions.requiresOnDeviceRecognition, true, 'native on-device recognition is the default');
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
    emit('result', { isFinal: true, results: [{ transcript: 'good buy', confidence: .9 }] }); emit('end');
    speech.confirm('Goodbye!'); assert.equal(results.length, 2); assert.equal(results[1].edited, true, 'user corrections are explicitly marked, not presented as original recognition');
    const beforeFallback = starts;
    local = false; await speech.start(); assert.equal(starts, beforeFallback, 'network recognition is never silently selected');
    await speech.start(true); assert.equal(lastOptions.requiresOnDeviceRecognition, false); speech.cancel();
    await speech.start(); assert.equal(lastOptions.requiresOnDeviceRecognition, false, 'explicit consent remains for retry in this input session'); speech.cancel();
    local = true; available = false; const beforeUnavailable = starts; await speech.start(); assert.equal(starts, beforeUnavailable, 'no service never starts a broken capture');
    speech.beginTyping(); speech.confirm('Hello!'); assert.equal(results.length, 3); assert.equal(results[2].edited, true); assert.match(results[2].token, /^typed:/, 'typed fallback is never labeled as recognized speech');
    available = true; platform.Version = 32; await speech.downloadModel(); assert.equal(modelDownloads, 0, 'old Android never invokes unsupported model download');
    platform.Version = 33; await speech.downloadModel(); assert.equal(modelDownloads, 1);
    platform.OS = 'ios'; await speech.downloadModel(); assert.equal(modelDownloads, 1, 'iPhone never invokes Android model download'); platform.OS = 'android';
    recording = true; await speech.start();
    emit('audiostart', { timestamp: 100 });
    emit('audioend', { timestamp: 400, uri: 'file:///captured.m4a' });
    emit('result', { isFinal: true, results: [{ transcript: 'Hello!', confidence: .9 }] }); emit('end');
    speech.confirm('Hello!'); assert.equal(results[3].uri, 'file:///captured.m4a', 'review retains the actual native recording for replay');
    await speech.start();
    for (const cleanup of cleanups.splice(0).reverse()) cleanup();
    emit('result', { isFinal: true, results: [{ transcript: 'Hi', confidence: .9 }] }); emit('end');
    assert.equal(results.length, 4, 'unmounted hook cannot submit');
    assert.ok(aborts >= 3);
    assert.ok([...listeners.values()].every(set => set.size === 0), 'all native listeners are removed');
    console.log('PASS: native review/confirm/edit, duplicate protection, on-device default, explicit network consent/retry, missing service/model, cancellation, permission and lifecycle boundaries.');
  } finally { for (const cleanup of cleanups.reverse()) cleanup(); Module._load = originalLoad; }
}
main().catch(error => { process.stderr.write(String(error.stack)); process.exitCode = 1; });
