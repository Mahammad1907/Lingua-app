const assert = require('node:assert/strict');
const fs = require('node:fs'); const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true } }).outputText, filename);
const { assessPacketAnswer: assess } = require('../src/utils/packetAnswer.ts');
const { b1Packet, packetFlow } = require('../src/data/b1Course.ts');
const { audioMeaning } = require('../src/utils/lessonPresentation.ts');
const { summarizeEvidence } = require('../src/utils/lessonEvidence.ts');
const { newLessonWords, vocabularyParts } = require('../src/utils/lessonVocabulary.ts');
const r = goal => ({ answers: [], goals: [goal] }); let checked = 0;
function check(text, rule, accepted, voice = false) { assert.equal(assess(text, rule, voice).status === 'correct', accepted, `${text}: ${JSON.stringify(rule)}`); checked++; }
for (const text of ['I am from Italy','I am in Baku','I am a doctor', 'I am tired','My name am Leyla']) check(text,r('introduce'),false);
for (const text of ['I’m not good','I am not fine','I feel not well', 'I am fine and I am not good']) check(text,r('fine'),false);
for (const text of ['I’m fine', 'I am good', 'I feel great']) check(text,r('fine'),true);
for (const mark of ['’','‘','´','ʼ','ʻ','`','``']) check(`I${mark}m Leyla`,r('introduce'),true);
for (const text of ['And you?', 'How about you?']) check(text,{answers:['How are you?'],goals:['askFeeling']},false);
for (const text of ['How are you doing?', 'How are you today?']) check(text,{answers:['How are you?'],goals:['askFeeling']},true);
for (const [goal, texts] of Object.entries({ thanks:['Thank you so much','Many thanks'], farewell:['Good bye','Bye bye','Bye, see you!'],greet:['Hey','Hello there'],repeat:['Say it again, please','Repeat please','Pardon?','Could you say it again, please?'],slow:['Slower, please','Slow please','More slowly, please'] })) for(const text of texts) {check(text,r(goal),true);check(text,r(goal),true,true);}
check('Could you say it again more slowly, please?',{answers:[],goals:['repeat','slow']},true);
check('More slowly, please',{answers:[],goals:['repeat','slow']},false);
check('Repeat please',{answers:[],goals:['repeat','slow']},false);
for (const text of ['Helloo','Helllo','Hellp']) check(text,r('greet'),true);
for (const text of ['I am food','I am god','I am mood']) check(text,r('fine'),false);
check('What is our name?',r('askName'),false);
check('I am Leila',{...r('introduce'),roleName:'Leyla'},false);
check('Helloo',r('greet'),false,true);
check('Excuse me',r('sorry'),false);check('Sorry',r('attention'),false);
let phrases = 0;
for(const lesson of b1Packet) for(const c of packetFlow(lesson)) for(const card of [c,c.review].filter(Boolean)) for(const text of [card.audio,card.turns?.[0]?.audio,card.turns?.[0]?.reply].filter(Boolean)) {assert.ok(audioMeaning(lesson,text),`${card.id}: ${text}`);phrases++;}
const c = (l,n) => b1Packet[l-1].cards.find(c=>c.number===n);
assert.notEqual(c(2,6).review.body,c(2,7).review.body);
assert.equal(new Set([7,8,11].map(n=>c(3,n).review.body)).size,3);
assert.deepEqual(c(6,15).review.rule.goals,['repeat','slow']);
assert.equal(c(7,10).turns[0].rate,.45); assert.equal(c(7,10).review.turns[0].rate,.45);
assert.equal(c(7,3).kind,'teach','duplicate welcome drill becomes a conversation bridge');
const evidence = summarizeEvidence([
 { resolved: true,evidence:{input:'written',assisted:false,listening:true,technicalText:false}},
 { resolved: true,evidence:{input:'spoken',assisted:true,listening:true,technicalText:false}},
 { resolved: true,evidence:{input:'spoken',assisted:false,listening:false,technicalText:true}},
 { resolved: false,evidence:{input:'spoken',assisted:false,listening:true,technicalText:false}},
]);
assert.deepEqual(evidence,{written:1,spoken:2,listeningIndependent:1,listeningAssisted:1,technicalText:1});
assert.ok(newLessonWords(b1Packet[0],b1Packet).has('hello'));
assert.ok(!newLessonWords(b1Packet[1],b1Packet).has('hello'));
assert.ok(!vocabularyParts('Salam Hello!',new Set(['hello'])).find(p=>p.text==='Salam').fresh);
console.log(`PASS: ${checked} answer regressions; ${phrases} authored listening/reply meanings; distinct review purposes, combined goals, actual slow follow-up, evidence separation and new-word highlighting.`);
