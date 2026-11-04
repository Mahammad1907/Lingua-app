// Optional React interaction tests. Supply a compatible react-test-renderer path without
// changing app dependencies: ONBOARDING_RENDERER_MODULE=/path/to/react-test-renderer node scripts/check-onboarding-flow.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const originalLoad = Module._load;
const storage = new Map();
const navigation = [];
let failWrites = false;
let failReads = false;
const router = { push: (...args) => navigation.push(['push', ...args]), replace: (...args) => navigation.push(['replace', ...args]), back: () => navigation.push(['back']), canGoBack: () => true };
const AsyncStorage = {
  getItem: async key => storage.get(key) ?? null,
  multiGet: async keys => { if (failReads) throw Error('read failed'); return keys.map(key => [key, storage.get(key) ?? null]); },
  setItem: async (key, value) => { if (failWrites) throw Error('storage full'); storage.set(key, value); },
  removeItem: async key => { if (failWrites) throw Error('storage full'); storage.delete(key); },
};
let viewport = { width: 390, height: 844, fontScale: 1 };
const rn = { View: 'View', Text: 'Text', Image: 'Image', Pressable: 'Pressable', ActivityIndicator: 'ActivityIndicator',
  StyleSheet: { create: x => x, absoluteFill: {} }, useWindowDimensions: () => viewport };
const user = { completedLessons: [], placementResults: [] };
Module._load = function(name, parent, main) {
  if (name === 'react') return React;
  if (name === 'react-native') return rn;
  if (name === '@react-native-async-storage/async-storage') return AsyncStorage;
  if (name === 'expo-router') return { useRouter: () => router, Stack: { Screen: () => null }, useFocusEffect: callback => React.useEffect(callback, [callback]) };
  if (name === 'expo-status-bar') return { StatusBar: () => null };
  if (name === 'expo-linear-gradient') return { LinearGradient: 'LinearGradient' };
  if (name === 'react-native-safe-area-context') return { useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }) };
  if (name === 'react-native-svg') return { __esModule: true, default: 'Svg', Path: 'Path' };
  if (name.endsWith('/store/userStore')) return { useUserStore: selector => selector(user) };
  return originalLoad.call(this, name, parent, main);
};
for (const extension of ['.ts', '.tsx']) require.extensions[extension] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, filename);
require.extensions['.png'] = (module, filename) => { module.exports = filename; };
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { act, create } = require(process.env.ONBOARDING_RENDERER_MODULE || 'react-test-renderer');
const { ONBOARDING_KEY } = require('../src/utils/onboarding.ts');
const Welcome = require('../src/app/index.tsx').default;
const Goal = require('../src/app/onboarding/goal.tsx').default;
const Level = require('../src/app/onboarding/level.tsx').default;
const Plan = require('../src/app/onboarding/welcome.tsx').default;
let tree;
async function render(Component) { navigation.length = 0; if (tree) await act(async () => tree.unmount()); await act(async () => { tree = create(React.createElement(Component)); }); }
async function press(predicate) {
  const target = tree.root.findAllByType('Pressable').find(node => predicate(node.props));
  assert.ok(target, 'requested action exists'); assert.ok(!target.props.disabled, 'action enabled');
  await act(async () => { await target.props.onPress(); });
}
function text() { return JSON.stringify(tree.toJSON()); }
const primary = props => typeof props.style === 'function' && props.accessibilityRole === 'button' && typeof props.accessibilityState?.busy === 'boolean';
(async () => {
  const progress = JSON.stringify({ xp: 350, completedLessons: ['existing'], evidence: 'unchanged' });
  storage.set('@birtalk_user_data', progress);
  await render(Welcome); assert.match(text(), /xoş gəlmisən/); await press(primary);
  assert.deepEqual(navigation.at(-1), ['push', '/onboarding/goal']); assert.equal(storage.get('selected_language'), 'en');
  await render(Goal); await press(p => p.testID === 'choice-career'); assert.equal(navigation.length, 0);
  const continueButton = tree.root.findAllByType('Pressable').find(n => primary(n.props));
  await act(async () => { continueButton.props.onPress(); continueButton.props.onPress(); });
  assert.equal(navigation.length, 1, 'rapid Continue presses navigate only once');
  assert.equal(JSON.parse(storage.get(ONBOARDING_KEY)).goal, 'career');
  await render(Goal); assert.equal(tree.root.findAllByType('Pressable').find(n => n.props.testID === 'choice-career').props.accessibilityState.selected, true);
  await render(Level); await press(p => p.testID === 'choice-confident'); await press(primary);
  assert.equal(storage.get('user_level'), 'B2'); assert.equal(JSON.parse(storage.get(ONBOARDING_KEY)).goal, 'career');
  await render(Plan); assert.match(text(), /Karyera/); assert.match(text(), /Yaxşı bilirəm/); assert.match(text(), /Bu səviyyədə dərs hələ yoxdur/); assert.match(text(), /Ana səhifəyə keç/);
  assert.ok(!text().includes('Fərdi planın hazırdır'), 'no unsupported personalization claim');
  await press(p => p.accessibilityLabel === '15 dəqiqə'); await press(primary);
  assert.equal(JSON.parse(storage.get(ONBOARDING_KEY)).minutes, 15); assert.equal(storage.get('onboarding_completed'), 'true');
  assert.deepEqual(navigation.at(-1), ['replace', '/(tabs)']);
  storage.delete('onboarding_completed');
  await render(Level); await press(p => p.testID === 'choice-beginner'); await press(primary);
  await render(Plan); assert.match(text(), /İlk tanışlıq/); assert.match(text(), /İlk dərsə başla/); assert.match(text(), /15 dəq/);
  failWrites = true; await press(primary); assert.equal(navigation.length, 0); assert.equal(storage.has('onboarding_completed'), false); assert.match(text(), /saxlanmadı/);
  failWrites = false; await press(primary); assert.equal(navigation.at(-1)[1].pathname, '/lesson/session');
  storage.set('placement_score', '9'); await render(Level); await press(p => p.testID === 'choice-unknown'); await press(primary);
  assert.deepEqual(navigation.at(-1), ['push', '/onboarding/placement']); assert.equal(storage.get('user_level'), 'test'); assert.equal(storage.has('placement_score'), false);
  storage.set('user_level', 'A2'); storage.set('placement_score', '4'); await render(Plan); assert.match(text(), /Test nəticəsi: A2/);
  storage.set('onboarding_completed', 'true'); await render(Welcome); assert.deepEqual(navigation.at(-1), ['replace', '/(tabs)']);
  viewport = { width: 320, height: 568, fontScale: 1 }; await render(Goal);
  assert.equal(tree.root.findAllByType('Pressable').filter(n => n.props.accessibilityRole === 'radio').length, 2);
  await press(p => p.accessibilityLabel === 'Digər seçimlər');
  assert.ok(tree.root.findAllByType('Pressable').some(n => n.props.testID === 'choice-travel'));
  await render(Plan); assert.ok(!text().includes('15 dəq'), 'short plan first shows choices');
  await press(primary); assert.match(text(), /15 dəq/);
  await press(p => p.accessibilityLabel === '20 dəqiqə'); await press(primary);
  assert.equal(JSON.parse(storage.get(ONBOARDING_KEY)).minutes, 20);
  failReads = true; await render(Goal); assert.match(text(), /oxunmadı/);
  assert.ok(tree.root.findAllByType('Pressable').find(n => primary(n.props)).props.disabled);
  failReads = false; await press(p => p.accessibilityRole === 'button' && p.onPress && !p.accessibilityLabel && typeof p.style !== 'function');
  assert.ok(tree.root.findAllByType('Pressable').some(n => n.props.testID === 'choice-daily'));
  assert.equal(storage.get('@birtalk_user_data'), progress, 'existing lesson progress and evidence are untouched');
  await act(async () => tree.unmount());
  console.log('PASS: actual React screens: welcome flow, goal/level restoration, plan availability, editable time, storage failure/retry, duplicate prevention, unchanged placement handoff, completed-user redirect and small-screen choice pages.');
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => { Module._load = originalLoad; });
