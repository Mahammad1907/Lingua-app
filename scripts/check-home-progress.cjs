// Optional renderer: HOME_PROGRESS_RENDERER=/path/to/react-test-renderer node scripts/check-home-progress.cjs
// Native primitives are mocked; this verifies progress wiring, not phone rendering.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const originalLoad = Module._load;
let width = 390;
let reduced = true;
let animations = 0;
const user = { streak: 0, completedLessons: [] };
class Value {
  constructor(value) { this.value = value; }
  setValue(value) { this.value = value; }
  stopAnimation() {}
  interpolate({ inputRange: [a, b], outputRange: [c, d] }) {
    return { __getValue: () => c + Math.min(1, Math.max(0, (this.value - a) / (b - a))) * (d - c) };
  }
}
const absoluteFill = { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 };
const native = { View: 'View', Text: 'Text', Image: 'Image', Pressable: 'Pressable', ScrollView: 'ScrollView',
  StyleSheet: { create: x => x, absoluteFill }, useWindowDimensions: () => ({ width }),
  Easing: { cubic: x => x ** 3, inOut: x => x },
  Animated: { Value, createAnimatedComponent: x => x,
    timing: (value, options) => ({ start() { animations++; value.setValue(options.toValue); }, stop() {} }),
    parallel: list => ({ start() { list.forEach(a => a.start()); }, stop() { list.forEach(a => a.stop()); } }) },
};
Module._load = function(name, parent, main) {
  if (name === 'react') return React;
  if (name === 'react-native') return native;
  if (name === 'expo-linear-gradient') return { LinearGradient: 'LinearGradient' };
  if (name === 'expo-status-bar') return { StatusBar: () => null };
  if (name === 'react-native-svg') return { __esModule: true, default: 'Svg', Path: 'Path', Defs: 'Defs', RadialGradient: 'RadialGradient', Stop: 'Stop' };
  if (name.endsWith('/hooks/useReducedMotion')) return { useReducedMotion: () => reduced };
  if (name.endsWith('/store/userStore')) return { useUserStore: selector => selector(user) };
  if (name === './HomeDashboard' && parent.filename.endsWith('ApprovedHome.tsx')) return { HOME_LANGUAGES: [], HomeDashboard: 'FallbackHome' };
  return originalLoad.call(this, name, parent, main);
};
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, filename);
require.extensions['.webp'] = (module, filename) => { module.exports = filename; };
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { create, act } = require(process.env.HOME_PROGRESS_RENDERER || 'react-test-renderer');
const { HomeDashboard } = require('../src/components/home/ApprovedHome.tsx');
const { HOME_CONNECTOR_LENGTHS } = require('../src/components/home/HomeJourneyProgress.tsx');
const { buildHomeCourse } = require('../src/utils/homeCourse.ts');
const { getAllModules } = require('../src/data/modules.ts');
const { lessons } = require('../src/data/lessons.ts');
const ids = getAllModules()[0].lessonIds;
const course = () => buildHomeCourse({ modules: getAllModules(), language: 'en', level: 'A1', completedLessons: user.completedLessons,
  placementResults: [], availableLessonIds: new Set(lessons.map(l => l.id)) });
(async () => {
  assert.equal(HOME_CONNECTOR_LENGTHS.length, 6);
  assert.ok(HOME_CONNECTOR_LENGTHS.every(n => n > 20 && n < 300));
  for (width of [320, 390, 430]) {
    user.completedLessons = [];
    const opened = [];
    const props = () => ({ course: course(), xp: 0, language: 'en', level: 'A1', onSelect() {}, onOpen: id => opened.push(id) });
    let tree;
    await act(async () => { tree = create(React.createElement(HomeDashboard, props())); });
    const inspect = (count, prefix = count) => {
      const svg = tree.root.findByType('Svg');
      assert.deepEqual(svg.props.style, absoluteFill);
      assert.equal(svg.props.viewBox, '43 83 682 1312');
      assert.ok(Math.abs(svg.props.width - width) < .00001);
      const paths = tree.root.findAllByType('Path');
      assert.equal(paths.length, 13);
      assert.ok(Math.abs(paths[0].props.opacity.__getValue() - Math.round(count / 7 * 100) / 100 * .24) < .00001);
      const fills = paths.filter(p => p.props.strokeDashoffset);
      assert.deepEqual(fills.map(p => p.props.opacity.__getValue()), fills.map((_, i) => i + 2 <= prefix ? 1 : 0));
      assert.ok(fills.every((p, i) => p.props.strokeDashoffset.__getValue() === (i + 2 <= prefix ? 0 : HOME_CONNECTOR_LENGTHS[i])));
      const badge = tree.root.findAllByType('View').find(n => n.props.accessibilityRole === 'progressbar');
      assert.equal(badge.props.accessibilityValue.now, Math.round(count / 7 * 100));
      const nodes = tree.root.findAllByType('Pressable').filter(n => n.props.accessibilityLabel?.startsWith('Dərs '));
      assert.equal(nodes.length, 7);
      assert.equal(nodes.filter(n => n.props.disabled).length, Math.max(0, 6 - prefix));
    };
    inspect(0);
    const before = animations;
    for (let count = 1; count <= 7; count++) {
      reduced = false;
      user.completedLessons = ids.slice(0, count);
      await act(async () => tree.update(React.createElement(HomeDashboard, props())));
      inspect(count);
    }
    assert.equal(animations - before, 14, 'both color and path animate once per completed lesson');
    reduced = true;
    user.completedLessons = ids.slice(0, 3);
    const previousAnimations = animations;
    await act(async () => tree.update(React.createElement(HomeDashboard, props())));
    inspect(3);
    assert.equal(animations, previousAnimations, 'reduced motion settles immediately');
    user.completedLessons = [ids[0], ids[2], ids[2], 'unrelated'];
    await act(async () => tree.update(React.createElement(HomeDashboard, props())));
    inspect(2, 1); // Never paint through an unfinished lesson.
    const nodes = tree.root.findAllByType('Pressable').filter(n => n.props.accessibilityLabel?.startsWith('Dərs '));
    await act(async () => nodes[1].props.onPress());
    assert.deepEqual(opened, ['module_1']);
    await act(async () => tree.unmount());
  }
  console.log('PASS: 0–7 completions, 320/390/430 widths, 43%/100% tint, sequential fill, resets, duplicate/unrelated IDs, reduced motion and existing navigation. Native rendering not tested.');
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => { Module._load = originalLoad; });
