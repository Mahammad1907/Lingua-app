// Optional renderer: HOME_PROGRESS_RENDERER=/path/to/react-test-renderer node scripts/check-home-progress.cjs
// Native primitives are mocked; this verifies progress wiring, not phone rendering.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const originalLoad = Module._load;
let width = 390;
let fontScale = 1;
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
  StyleSheet: { create: x => x, absoluteFill }, useWindowDimensions: () => ({ width, fontScale }),
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
  if (name === 'react-native-svg') return { __esModule: true, default: 'Svg', Path: 'Path', Defs: 'Defs', LinearGradient: 'LinearGradientSvg', Stop: 'Stop', Rect: 'Rect', Circle: 'Circle', Ellipse: 'Ellipse', G: 'G' };
  if (name.endsWith('/hooks/useReducedMotion')) return { useReducedMotion: () => reduced };
  if (name.endsWith('/store/userStore')) return { useUserStore: selector => selector(user) };
  if (name === './HomeDashboard' && parent.filename.endsWith('ApprovedHome.tsx')) return { HOME_LANGUAGES: [], HomeDashboard: 'FallbackHome' };
  return originalLoad.call(this, name, parent, main);
};
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, filename);
require.extensions['.png'] = (module, filename) => { module.exports = filename; };
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { create, act } = require(process.env.HOME_PROGRESS_RENDERER || 'react-test-renderer');
const { HomeDashboard, HomeNavigation } = require('../src/components/home/ApprovedHome.tsx');
const { HomeJourneyProgress, homeConnectors, connectorLength } = require('../src/components/home/HomeJourneyProgress.tsx');
const HOME_CONNECTOR_LENGTHS = homeConnectors(0).map(connectorLength);
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
    const navigated = [];
    let selected = 0;
    const props = () => ({ course: course(), xp: 0, language: 'en', level: 'A1', onSelect() { selected++; }, onOpen: id => opened.push(id), onNavigate: id => navigated.push(id) });
    let tree;
    await act(async () => { tree = create(React.createElement(HomeDashboard, props())); });
    const inspect = (count, prefix = count) => {
      const progress = tree.root.findByType(HomeJourneyProgress);
      const svg = progress.findAllByType('Svg')[0];
      assert.deepEqual(svg.props.style, absoluteFill);
      assert.equal(svg.props.viewBox, '43 392 682 858');
      assert.ok(Math.abs(svg.props.width - (width - 24)) < .00001);
      const paths = progress.findAllByType('Path');
      assert.equal(paths.length, 15);
      assert.ok(Math.abs(paths[2].props.opacity.__getValue() - Math.round(count / 7 * 100) / 100 * .36) < .00001);
      const fills = paths.filter(p => p.props.strokeDashoffset);
      assert.deepEqual(fills.map(p => p.props.opacity.__getValue()), fills.map((_, i) => i + 2 <= prefix ? 1 : 0));
      assert.ok(fills.every((p, i) => p.props.strokeDashoffset.__getValue() === (i + 2 <= prefix ? 0 : connectorLength(p.props.d))));
      const badge = tree.root.findAllByType('View').find(n => n.props.accessibilityRole === 'progressbar');
      assert.equal(badge.props.accessibilityValue.now, Math.round(count / 7 * 100));
      const nodes = tree.root.findAllByType('Pressable').filter(n => n.props.accessibilityLabel?.startsWith('Dərs '));
      assert.equal(nodes.length, 7);
      assert.equal(nodes.filter(n => n.props.disabled).length, Math.max(0, 6 - prefix));
    };
    inspect(0);
    await act(async () => {
      tree.root.findByProps({ accessibilityLabel: 'Dil və səviyyə seç' }).props.onPress();
      tree.root.findByProps({ accessibilityLabel: 'Analiz' }).props.onPress();
      tree.root.findByProps({ accessibilityLabel: 'AI söhbət' }).props.onPress();
      tree.root.findByProps({ accessibilityLabel: 'Aktiv dərs üçün Başla' }).props.onPress();
    });
    assert.equal(selected, 1);
    assert.deepEqual(navigated, ['profile']);
    assert.deepEqual(opened, ['module_1', 'module_1']);
    opened.length = 0;
    const images = tree.root.findAllByType('Image');
    assert.equal(images.length, 1, 'only the separate high-resolution mascot is raster');
    assert.match(images[0].props.source, /assets\/onboarding\/welcome\.png$/);
    assert.ok(fs.readFileSync(images[0].props.source).readUInt32BE(16) >= 1024);
    assert.ok(!fs.readFileSync('src/components/home/ApprovedHome.tsx', 'utf8').includes('approved_reference_'));
    assert.ok(tree.root.findAllByType('Text').some(n => n.children.includes('Salam, Leyla!')), 'greeting is native text');
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
    fontScale = 1.6;
    await act(async () => tree.update(React.createElement(HomeDashboard, props())));
    inspect(2, 1);
    const caption = tree.root.findAllByType('View').find(n => n.props.onLayout && Array.isArray(n.props.style));
    await act(async () => caption.props.onLayout({ nativeEvent: { layout: { height: 140 } } }));
    const measuredNodes = tree.root.findAllByType('Pressable').filter(n => n.props.accessibilityLabel?.startsWith('Dərs '));
    const listening = measuredNodes[3].parent.props.style;
    const puzzle = measuredNodes[5].parent.props.style;
    const tileSize = (width - 24) / 682 * 136;
    assert.ok(puzzle.top >= listening.top + tileSize + 4 + 140 + 8 - .001, 'measured listening caption never overlaps the following tile');
    const lockedCourse = course(); lockedCourse.items[0] = { ...lockedCourse.items[0], state: 'locked' };
    await act(async () => tree.update(React.createElement(HomeDashboard, { ...props(), course: lockedCourse })));
    assert.equal(tree.root.findAllByType('Pressable').filter(n => n.props.accessibilityLabel?.startsWith('Dərs ') && n.props.disabled).length, 7);
    assert.equal(tree.root.findByProps({ accessibilityLabel: 'AI söhbət' }).props.disabled, true);
    assert.equal(tree.root.findByProps({ accessibilityLabel: 'Aktiv dərs üçün Başla' }).props.disabled, true);
    await act(async () => tree.update(React.createElement(HomeDashboard, { ...props(), language: 'de' })));
    assert.equal(tree.root.findAllByType('FallbackHome').length, 1, 'other selections retain the existing dashboard');
    fontScale = 1;
    await act(async () => tree.unmount());
  }
  const destinations = [];
  let navigation;
  await act(async () => { navigation = create(React.createElement(HomeNavigation, { bottomInset: 34, onNavigate: id => destinations.push(id) })); });
  assert.equal(navigation.root.findAllByType('Image').length, 0, 'navigation is native text and vectors');
  const tabs = navigation.root.findAllByType('Pressable');
  assert.equal(tabs.length, 4);
  assert.equal(tabs.filter(t => t.props.accessibilityState.selected).length, 1);
  await act(async () => tabs.forEach(t => t.props.onPress()));
  assert.deepEqual(destinations, ['learn', 'review', 'vocabulary', 'profile']);
  await act(async () => navigation.unmount());
  console.log('PASS: native text, high-resolution mascot, vectors, 0–7 completions, 320/390/430 widths, large text, 43%/100% tint, sequential fill, resets, duplicate/unrelated IDs, reduced motion and existing navigation. Native rendering not tested.');
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => { Module._load = originalLoad; });
