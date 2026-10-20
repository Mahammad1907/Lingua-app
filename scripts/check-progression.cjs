// Run with node scripts/check-progression.cjs. No packages, network or device required.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
const { createStore } = require('zustand/vanilla');
const nativeLoad = Module._load;
let disk = null;
let failWrite = false;
const storage = {
  getItem: async () => disk,
  setItem: async (_key, value) => { if (failWrite) throw new Error('Simulated interruption'); disk = value; },
};
Module._load = function (id, ...args) {
  if (id === '@react-native-async-storage/async-storage') return storage;
  if (id === 'zustand') return { create: createStore };
  return nativeLoad.call(this, id, ...args);
};
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, filename);
const NativeDate = Date;
let now = new NativeDate(2026, 9, 19, 12).getTime();
global.Date = class extends NativeDate {
  constructor(...args) { super(...(args.length ? args : [now])); }
  static now() { return now; }
};
const { lessons } = require('../src/data/lessons.ts');
const { modules } = require('../src/data/modules.ts');
const { placementTests } = require('../src/data/placementTests.ts');
const { buildHomeCourse } = require('../src/utils/homeCourse.ts');
const { moduleHasContent, moduleTest, moduleUnlocked } = require('../src/utils/moduleAccess.ts');
const { gameLevel, localDay, previousDay } = require('../src/utils/rewards.ts');
function newStore() {
  delete require.cache[require.resolve('../src/store/userStore.ts')];
  return require('../src/store/userStore.ts').useUserStore;
}
function answerAll(store, id, options = {}) {
  const attempt = store.getState().beginLesson(id);
  assert.ok(attempt);
  const s = store.getState();
  if (options.help) s.useHelp(attempt);
  [...s.attempts[attempt].expected, ...(s.attempts[attempt].optional ?? [])].forEach((key, i) => s.recordTask(attempt, key, options.skip && i === 0 ? null : true, `answer:${i}`));
  return attempt;
}
async function run() {
  let store = newStore();
  assert.equal(store.getState().beginLesson(lessons[0].id), '');
  await store.getState().loadFromStorage();
  assert.equal(store.getState().streak, 0, 'opening the app is not a streak day');
  const unanswered = store.getState().beginLesson(lessons[0].id);
  assert.equal((await store.getState().finishLesson(unanswered)).completed, false);
  assert.equal(store.getState().xp, 0, 'unanswered tasks cannot award completion XP');
  const speechSkipped = store.getState().beginLesson(lessons[0].id);
  const packetAttempt = store.getState().attempts[speechSkipped];
  packetAttempt.expected.forEach((key, i) => store.getState().recordTask(speechSkipped, key, true, `written:${i}`));
  packetAttempt.optional.forEach((key, i) => store.getState().recordTask(speechSkipped, key, null, `voice-skip:${i}`));
  const writtenReceipt = await store.getState().finishLesson(speechSkipped);
  assert.equal(writtenReceipt.completed, true, 'unverified speech does not erase completed written learning');
  assert.equal(writtenReceipt.xp, 30, 'skipped speech cannot claim an independent-all-tasks bonus');
  assert.ok(packetAttempt.optional.every(key => store.getState().attempts[speechSkipped].tasks[key].skipped));
  store.getState().resetAll(); await store.getState().saveToStorage();
  const first = answerAll(store, lessons[0].id);
  const [receipt, duplicate] = await Promise.all([store.getState().finishLesson(first), store.getState().finishLesson(first)]);
  assert.equal(receipt.xp, 35); assert.equal(duplicate.id, receipt.id); assert.equal(store.getState().xp, 35);
  assert.equal(store.getState().claimReceipt(first).xp, 35); assert.equal(store.getState().claimReceipt(first), undefined);
  const repeat = answerAll(store, lessons[0].id);
  assert.equal((await store.getState().finishLesson(repeat)).xp, 0);
  const skip = answerAll(store, lessons[1].id, { skip: true });
  assert.equal((await store.getState().finishLesson(skip)).completed, false);
  assert.ok(!store.getState().completedLessons.includes(lessons[1].id));
  const helped = answerAll(store, lessons[1].id, { help: true });
  assert.equal((await store.getState().finishLesson(helped)).xp, 20, 'help only removes the perfect bonus');
  const wrong = store.getState().beginLesson(lessons[2].id);
  const task = store.getState().attempts[wrong].expected[0];
  store.getState().recordTask(wrong, task, false, 'one');
  store.getState().recordTask(wrong, task, false, 'one');
  assert.equal(store.getState().hearts, 4, 'double submission costs one energy');
  store.getState().attempts[wrong].expected.forEach(key => store.getState().recordTask(wrong, key, true, 'fixed'));
  assert.equal((await store.getState().finishLesson(wrong)).xp, 20, 'a retry is not perfect');
  for (let day = 20; day <= 25; day++) {
    now = new NativeDate(2026, 9, day, 12).getTime();
    const a = answerAll(store, lessons[0].id);
    const reward = (await store.getState().finishLesson(a)).xp;
    assert.equal(reward, day === 21 ? 35 : day === 25 ? 70 : 10);
    const sameDay = answerAll(store, lessons[0].id);
    assert.equal((await store.getState().finishLesson(sameDay)).xp, 0);
  }
  assert.equal(store.getState().streak, 7);
  now = new NativeDate(2026, 9, 27, 12).getTime();
  store.getState().checkDailyStreak(); assert.equal(store.getState().streak, 0);
  for (let day = 27; day <= 29; day++) {
    now = new NativeDate(2026, 9, day, 12).getTime();
    await store.getState().finishLesson(answerAll(store, lessons[0].id));
  }
  assert.equal(store.getState().streak, 3);
  assert.equal(Object.keys(store.getState().rewards).filter(k => k.startsWith('streak:') && k.endsWith(':3')).length, 2);
  for (const lesson of lessons.slice(3)) await store.getState().finishLesson(answerAll(store, lesson.id));
  assert.equal(store.getState().rewards['module:module_1'].amount, 100);
  const moduleXP = store.getState().xp;
  await store.getState().finishLesson(answerAll(store, lessons.at(-1).id)); assert.equal(store.getState().xp, moduleXP);
  while (store.getState().hearts > 0) store.getState().loseHeart();
  await store.getState().saveToStorage();
  store = newStore(); await store.getState().loadFromStorage();
  assert.equal(store.getState().hearts, 0, 'restart preserves empty energy'); assert.equal(store.getState().xp, moduleXP);
  assert.equal(store.getState().claimReceipt(first), undefined, 'cold start cannot replay reward animation');
  // A content-bearing locked module fixture, with a copy of existing questions ONLY in this test.
  modules.push({ ...modules[0], id: 'fixture_second', order: 2, lessonIds: [lessons[1].id] });
  modules.push({ ...modules[0], id: 'fixture_third', order: 3, lessonIds: [lessons[2].id] });
  assert.equal(moduleTest('fixture_second'), undefined);
  placementTests.push({ ...placementTests[0], moduleId: 'fixture_second' });
  store.setState({ completedLessons: [], placementResults: [] });
  assert.equal(moduleUnlocked('fixture_second', [], []), false);
  const answers = Object.fromEntries(placementTests[0].questions.map(q => [q.id, true]));
  await assert.rejects(store.getState().finishExam('fixture_second', {}));
  const belowThreshold = { ...answers };
  placementTests[0].questions.slice(0, 3).forEach(q => { belowThreshold[q.id] = false; });
  assert.equal((await store.getState().finishExam('fixture_second', belowThreshold)).passed, false);
  assert.equal(moduleUnlocked('fixture_second', [], store.getState().placementResults), false);
  const passed = await store.getState().finishExam('fixture_second', answers);
  assert.equal(passed.xp, 50); assert.equal(passed.passed, true);
  assert.equal((await store.getState().finishExam('fixture_second', answers)).xp, 0);
  const essentialFailed = { ...answers, [placementTests[0].questions[0].id]: false };
  assert.equal((await store.getState().finishExam('fixture_second', essentialFailed)).passed, false, '94% cannot hide a missing required communication goal');
  const diagnosticFailed = { ...answers };
  for (const question of placementTests[0].questions) if (!placementTests[0].requiredQuestionIds.includes(question.id)) diagnosticFailed[question.id] = false;
  assert.equal((await store.getState().finishExam('fixture_second', diagnosticFailed)).passed, true, 'diagnostic grammar cannot replace the authored essential-goal pass map');
  assert.equal(moduleUnlocked('fixture_second', [], store.getState().placementResults), true);
  await store.getState().finishExam('fixture_second', belowThreshold);
  assert.equal(store.getState().placementResults.find(r => r.moduleId === 'fixture_second').correctCount, placementTests[0].questions.length, 'a failed retry does not erase a passed result');
  assert.equal(moduleUnlocked('fixture_third', [], store.getState().placementResults), false);
  assert.deepEqual(store.getState().completedLessons, []);
  const course = buildHomeCourse({ modules, language: 'en', level: 'A1', completedLessons: [], placementResults: store.getState().placementResults, availableLessonIds: new Set(lessons.map(l => l.id)) });
  assert.equal(course.items.find(i => i.id === 'fixture_second').percent, 0);
  assert.equal(course.items.find(i => i.id === 'fixture_third').state, 'locked');
  assert.equal(moduleHasContent('upcoming_en_A1_7'), false); assert.equal(moduleTest('upcoming_en_A1_7'), undefined);
  modules.splice(-2); placementTests.pop();
  // Existing users retain XP and energy, without retroactive lesson/module awards.
  disk = JSON.stringify({ xp: 543, hearts: 0, streak: 99, completedLessons: lessons.map(l => l.id), lessonProgress: [], placementResults: [] });
  store = newStore(); await store.getState().loadFromStorage();
  assert.equal(store.getState().xp, 543); assert.equal(store.getState().hearts, 0); assert.equal(store.getState().streak, 0);
  assert.equal((await store.getState().finishLesson(answerAll(store, lessons[0].id))).xp, 10);
  // A write failure cannot leave XP without its reward ID. Retry writes the same value.
  now = new NativeDate(2026, 9, 30, 12).getTime();
  const interrupted = answerAll(store, lessons[0].id); const before = store.getState().xp;
  failWrite = true; await assert.rejects(store.getState().finishLesson(interrupted));
  assert.equal(store.getState().xp, before + 10);
  failWrite = false; await store.getState().finishLesson(interrupted);
  assert.equal(store.getState().xp, before + 10);
  const persisted = JSON.parse(disk); assert.equal(persisted.xp, before + 10); assert.ok(persisted.rewards[`daily:${localDay()}`]);
  assert.equal(gameLevel(0), 1); assert.equal(gameLevel(999999), 10000);
  assert.equal(previousDay(new NativeDate(2026, 2, 1, 0, 5)), '2026-02-28');
  assert.equal(localDay(new NativeDate(2026, 0, 1, 0, 5)), '2026-01-01');
  disk = null; store = newStore(); await store.getState().loadFromStorage();
  const concurrent = [answerAll(store, lessons[0].id), answerAll(store, lessons[0].id)];
  const simultaneous = await Promise.all(concurrent.map(id => store.getState().finishLesson(id)));
  assert.deepEqual(simultaneous.map(r => r.xp).sort((a, b) => a - b), [0, 35]);
  assert.equal(store.getState().xp, 35, 'two different attempts cannot pay the same completion twice');
  console.log(`PASS (${Intl.DateTimeFormat().resolvedOptions().timeZone}): energy, hydration, migration, answer/skip/help eligibility, duplicate and repeat rewards, 3/7-day streaks, local dates, module bonus, unlock isolation, persistence and interrupted-write retry.`);
}
run().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => { global.Date = NativeDate; Module._load = nativeLoad; });
