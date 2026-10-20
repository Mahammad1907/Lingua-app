// Pure progression/geometry checks; no device, installed packages or network changes.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, filename);
const { buildChapterJourney, journeyRoute, clampPercent, chapterReferenceLayout } = require('../src/utils/chapterJourney.ts');
const { lessons } = require('../src/data/lessons.ts');
const source = lessons.filter((lesson) => lesson.moduleId === 'module_1').sort((a, b) => a.order - b.order);
assert.equal(source.length, 7);
let items = buildChapterJourney(source, [], {}, false);
assert.deepEqual(items.map((item) => item.status), ['current', ...source.slice(1).map(() => 'locked')]);
assert.ok(items.every((item) => item.percent === 0));
const attempt = (id, expected, tasks, finished = false) => ({ id, lessonId: source[2].id, expected, tasks, assisted: false, finished });
const result = (resolved, skipped = false, wrong = 0) => ({ resolved, skipped, firstCorrect: !wrong, wrong, token: 't' });
const completed = [source[0].id, source[1].id];
const attempts = { current: attempt('current', ['a', 'b', 'c', 'd', 'e'], { a: result(true, false, 2), b: result(true) }) };
items = buildChapterJourney(source, completed, attempts, false);
assert.equal(items[0].percent, 100, 'a completed lesson is not its answer accuracy');
assert.equal(items[1].percent, 100);
assert.equal(items[2].percent, 40, 'corrected/resolved tasks count toward completion');
assert.equal(items[2].status, 'current');
assert.equal(items[3].status, 'locked');
attempts.current.tasks.b = result(true, true);
assert.equal(buildChapterJourney(source, completed, attempts, false)[2].percent, 20, 'skipped tasks never light the route');
attempts.current = attempt('current', ['a', 'a', 'b'], { a: result(true), b: result(true) });
assert.equal(buildChapterJourney(source, completed, attempts, false)[2].percent, 99, 'only completion transaction permits 100%');
const newer = { ...attempts, newer: attempt('newer', ['a', 'b'], { a: result(true) }) };
assert.equal(buildChapterJourney(source, completed, newer, false)[2].percent, 50, 'use latest attempt, not best accuracy or sum of attempts');
assert.equal(buildChapterJourney(source, [...completed, source[2].id], newer, false)[2].percent, 100);
assert.equal(buildChapterJourney([...source, source[0]], completed, {}, false).length, 7, 'unique stable lesson IDs');
assert.deepEqual(buildChapterJourney([], [], {}, false), []);
const allDone = buildChapterJourney(source, source.map((lesson) => lesson.id), {}, false);
assert.ok(allDone.every((item) => item.percent === 100 && item.status === 'completed'));
const exam = buildChapterJourney(source, [], {}, true);
assert.equal(exam[1].status, 'locked', 'a passed exam does not complete previous lessons');
const final = source.findIndex((lesson) => lesson.isReview && lesson.reviewType === 'module_review');
assert.ok(final >= 0);
assert.equal(exam[final].status, 'available', 'preserve existing final-review access');
assert.equal(exam[final].percent, 0);
const many = Array.from({ length: 40 }, (_, i) => ({ ...source[0], id: `long_${i}`, order: i + 1 }));
assert.equal(buildChapterJourney(many, [], {}, false).length, 40, 'no six-lesson layout cap');
assert.equal(clampPercent(NaN), 0); assert.equal(clampPercent(Infinity), 0);
assert.equal(clampPercent(-30), 0); assert.equal(clampPercent(120), 100);
for (const width of [1, 240, 288, 358, 480]) for (const right of [false, true]) {
  const points = journeyRoute(width, 70, right);
  assert.equal(points[0].fraction, 0); assert.equal(points.at(-1).fraction, 1);
  assert.equal(points[0].y, 0); assert.equal(points.at(-1).y, 70);
  const distances = points.slice(1).map((point, i) => {
    assert.ok(point.y > points[i].y, 'path moves toward next lesson');
    assert.ok(point.x >= 0 && point.x <= width);
    return Math.hypot(point.x - points[i].x, point.y - points[i].y);
  });
  assert.ok(Math.max(...distances) / Math.min(...distances) < 1.05, 'dots measure curve distance uniformly');
  const reverse = journeyRoute(width, 70, !right);
  points.forEach((point, i) => assert.ok(Math.abs(point.x + reverse[i].x - width) < 0.01, 'mirrored paths'));
}
const small = journeyRoute(NaN, -4, false);
assert.ok(small.every((point) => Number.isFinite(point.x) && Number.isFinite(point.y)));
const reference = chapterReferenceLayout(345);
assert.equal(reference.badge, 88);
assert.equal(reference.heroHeight, 128);
assert.equal(reference.cardWidth('greeting', false), 244);
assert.equal(reference.cardWidth('identity', false), 221);
assert.equal(reference.cardWidth('board', true), 328);
assert.ok(reference.cardWidth('identity', false) < 345 * 0.7, 'short reference label panel, not full-width rectangle');
assert.ok(reference.foxWidth > reference.badge * 1.8, 'large hero mascot as in approved reference');
assert.equal(reference.gap(false), 28);
assert.equal(reference.gap(true), 36);
for (const width of [272, 327, 345, 382, 480]) {
  const layout = chapterReferenceLayout(width);
  assert.ok(layout.lessonSize >= 12, 'narrow displays retain readable titles');
  for (const artwork of ['greeting', 'identity', 'board', 'dialogue', 'questions', 'headphones']) {
    assert.ok(layout.cardWidth(artwork, false) <= width);
    assert.ok(layout.cardWidth(artwork, true) <= width);
  }
  const bridge = journeyRoute(width, layout.gap(false), false, layout.badge + 8 * layout.scale, layout.badge + 36 * layout.scale);
  assert.ok(bridge.length < 22, 'sparse short bridge, no dense full-width necklace');
  assert.ok(bridge.every((point) => point.x >= 0 && point.x <= width));
}
console.log('PASS: completion vs accuracy, corrected/skipped tasks, latest attempt, unlock preservation, unique IDs, 40 lessons, route endpoints and equal-distance dots at five widths.');
