const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, filename);
const { daySceneForOption, lessonArtworkKind, lessonBoardText } = require('../src/utils/lessonArtwork.ts');
const { firstConversationSessions, firstConversationLessons } = require('../src/data/firstConversation.ts');

assert.deepEqual(['Axşam · 19:00', 'Səhər · 08:30', 'Günorta · 15:00'].map(daySceneForOption), ['evening', 'morning', 'afternoon']);
assert.equal(daySceneForOption('Unknown'), undefined, 'do not invent a misleading scene');
const kinds = new Set();
let tasks = 0;
for (const lesson of firstConversationLessons) {
  const session = firstConversationSessions[lesson.id];
  session.steps.forEach((step, index) => {
    tasks += 1;
    const kind = lessonArtworkKind(step, session.style, lesson.order, index);
    kinds.add(kind);
    const poisoned = { ...step, exercise: { ...step.exercise, correctAnswer: 'SECRET_ANSWER', fullSentence: 'SECRET_SENTENCE' } };
    assert.ok(!lessonBoardText(poisoned).includes('SECRET_'), 'art cannot reveal answer fields');
    assert.ok(lessonBoardText(step).length <= 90, 'board text fits the intended surface');
    if (step.foxSays) {
      assert.equal(kind, 'board');
      assert.equal(lessonBoardText(step), step.foxSays, 'keep the original mistake visible');
    }
    if ((step.activity || session.style) === 'scene') {
      assert.equal(kind, 'listening', 'hero cannot single out the correct time of day');
      assert.equal(new Set(step.exercise.options.map(daySceneForOption)).size, 3);
      assert.ok(step.exercise.options.every((option) => daySceneForOption(option)));
    }
  });
}
assert.equal(firstConversationLessons.length, 6);
assert.equal(kinds.size, 5, 'use different visual situations, not a fox on every task');
const names = ['teacher-board', 'morning', 'afternoon', 'evening', 'conversation'];
const bytes = names.reduce((total, name) => total + fs.statSync(require.resolve(`../assets/lessons/${name}-3d.webp`)).size, 0);
assert.ok(bytes < 450_000, 'keep the five local illustrations below 450KB');
console.log(`Lesson artwork checks passed: ${tasks} tasks, 6 lessons, 5 visual kinds, ${bytes} bytes.`);
