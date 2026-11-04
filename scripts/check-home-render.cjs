// Optional React regression test; uses an external compatible renderer, no app dependency changes.
// ONBOARDING_RENDERER_MODULE=/path/to/react-test-renderer node scripts/check-home-render.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const originalLoad = Module._load;
let width = 390;
const absoluteFill = { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 };
const user = { streak: 0, completedLessons: [] };
const native = { View: 'View', Text: 'Text', Image: 'Image', Pressable: 'Pressable', ScrollView: 'ScrollView',
  StyleSheet: { create: value => value, absoluteFill }, useWindowDimensions: () => ({ width, height: 844, fontScale: 1 }) };
Module._load = function(name, parent, main) {
  if (name === 'react') return React;
  if (name === 'react-native') return native;
  if (name === 'expo-linear-gradient') return { LinearGradient: 'LinearGradient' };
  if (name === 'expo-status-bar') return { StatusBar: () => null };
  if (name === 'react-native-svg') return { __esModule: true, default: 'Svg', Path: 'Path', Circle: 'Circle', Rect: 'Rect' };
  if (name.endsWith('/store/userStore')) return { useUserStore: selector => selector(user) };
  if (name === './HomeDashboard' && parent.filename.endsWith('ApprovedHome.tsx')) return { HOME_LANGUAGES: [] };
  return originalLoad.call(this, name, parent, main);
};
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, filename);
require.extensions['.png'] = (module, filename) => { module.exports = filename; };
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { create, act } = require(process.env.ONBOARDING_RENDERER_MODULE || 'react-test-renderer');
const { HomeDashboard, HomeNavigation } = require('../src/components/home/ApprovedHome.tsx');
const { buildHomeCourse } = require('../src/utils/homeCourse.ts');
const { getAllModules } = require('../src/data/modules.ts');
const { lessons } = require('../src/data/lessons.ts');
const course = buildHomeCourse({ modules: getAllModules(), language: 'en', level: 'A1', completedLessons: [], placementResults: [], availableLessonIds: new Set(lessons.map(l => l.id)) });
(async () => {
  for (width of [320, 390, 430]) {
    const opened = [];
    let tree;
    await act(async () => { tree = create(React.createElement(HomeDashboard, { course, xp: 0, language: 'en', level: 'A1', onSelect() {}, onOpen: id => opened.push(id) })); });
    const svgs = tree.root.findAllByType('Svg');
    assert.equal(svgs.length, 2);
    for (const svg of svgs) assert.deepEqual(svg.props.style, absoluteFill, 'decorative SVG must overlay its panel, never consume the full height before headings/nodes');
    const flattenText = node => typeof node === 'string' ? node : Array.isArray(node) ? node.map(flattenText).join('') : flattenText(node?.children || []);
    const text = flattenText(tree.toJSON());
    assert.match(text, /İlk tanışlıq/); assert.match(text, /0\/7 dərs/);
    const nodes = tree.root.findAllByType('Pressable').filter(n => n.props.accessibilityLabel?.includes(': '));
    assert.equal(nodes.length, 7, 'all seven real lessons remain mounted');
    assert.equal(nodes.filter(n => n.props.disabled).length, 6, 'unlock behavior unchanged');
    await act(async () => nodes[0].props.onPress());
    assert.deepEqual(opened, ['module_1']);
    const mascot = tree.root.findByType('Image');
    assert.ok(mascot.props.source.endsWith('/assets/onboarding/welcome.png'), 'never reuse the corrupted home WebP');
    assert.equal(mascot.props.resizeMode, 'contain');
    const image = fs.readFileSync(mascot.props.source);
    assert.equal(image.subarray(1, 4).toString(), 'PNG');
    assert.ok(image.readUInt32BE(16) >= 512 && image.readUInt32BE(20) >= 512, 'high-resolution mascot source');
    await act(async () => tree.unmount());
  }
  let nav;
  await act(async () => { nav = create(React.createElement(HomeNavigation, { onNavigate() {} })); });
  assert.equal(nav.root.findAllByType('Pressable').length, 4);
  await act(async () => nav.unmount());
  console.log('PASS: 320/390/430-width React renders retain both absolute SVG backgrounds, heading, seven lesson nodes, current unlock/action behavior, clean PNG mascot and four navigation tabs. No physical-device layout claim.');
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => { Module._load = originalLoad; });
