const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => {
  let source = fs.readFileSync(filename, 'utf8');
  if (filename.endsWith('/utils/mascot.ts')) source = source.replace("MASCOT_NAME: string = 'BirFox'", "MASCOT_NAME: string = 'Lopuki'");
  module._compile(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, filename);
};
const { mascotText, resolveMascot } = require('../src/utils/mascot.ts');
assert.equal(mascotText('BirFox-un adını soruş. BirFox-a salam ver.'), 'Lopuki-nin adını soruş. Lopuki-yə salam ver.');
assert.deepEqual(resolveMascot({ 'I’m BirFox.': 'Mən BirFox-am.' }), { 'I’m Lopuki.': 'Mən Lopuki-əm.' });
const { b1Packet } = require('../src/data/b1Course.ts');
const { b1Exams } = require('../src/data/b1Exam.ts');
const { firstConversationSessions, firstConversationLessons } = require('../src/data/firstConversation.ts');
for (const content of [b1Packet, b1Exams, firstConversationSessions, firstConversationLessons]) {
  const json = JSON.stringify(content);
  assert.ok(json.includes('Lopuki'));
  assert.ok(!json.includes('BirFox'));
}
const { checkSpokenAnswer } = require('../src/utils/spokenAnswer.ts');
assert.equal(checkSpokenAnswer('Hello Lopuki', 'greeting').correct, true);
assert.equal(checkSpokenAnswer('Bye Lopuki', 'farewell').correct, true);
assert.equal(checkSpokenAnswer('Hello Lopuki I am Ali', 'introduce', 'Ali').correct, true);
console.log('PASS: mascot name in lessons, exams, audio translations and voice grading.');
