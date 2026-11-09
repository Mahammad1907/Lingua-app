const assert=require('node:assert/strict'),fs=require('node:fs'),Module=require('node:module'),ts=require('typescript');
const {createStore}=require('zustand/vanilla');
const disk=new Map(); const originalLoad=Module._load;
Module._load=function(id,...args){if(id==='@react-native-async-storage/async-storage')return {getItem:async k=>disk.get(k)??null,setItem:async(k,v)=>disk.set(k,v)};if(id==='zustand')return {create:createStore};return originalLoad.call(this,id,...args)};
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,f);
const {b1Packet,packetFlow,packetTaskIds}=require('../src/data/b1Course.ts');
const {lessons}=require('../src/data/lessons.ts');
const {buildHomeGroups,resumeGroup,homeGroups}=require('../src/utils/homeGroups.ts');
const {buildHomeCourse}=require('../src/utils/homeCourse.ts');
const {getAllModules}=require('../src/data/modules.ts');
const {assessPacketAnswer}=require('../src/utils/packetAnswer.ts');
const {vocabularySegments}=require('../src/utils/contextVocabulary.ts');
const {vocabularyKey}=require('../src/utils/vocabularyIdentity.ts');
const ids=b1Packet.map(l=>l.id);
function freshUser(){delete require.cache[require.resolve('../src/store/userStore.ts')];return require('../src/store/userStore.ts').useUserStore;}
(async()=>{
 assert.equal(b1Packet.length,12);assert.equal(homeGroups.length,7);
 assert.deepEqual(homeGroups.map(g=>g.lessonIds.length),[1,1,2,2,3,2,1]);
 assert.deepEqual(homeGroups.flatMap(g=>g.lessonIds),ids);
 assert.equal(new Set(ids).size,12);
 const groups=buildHomeGroups([ids[6],ids[6],'legacy'],{});
 assert.equal(groups[4].count,1);assert.equal(groups[4].lessons.length,3);
 const course=buildHomeCourse({modules:getAllModules(),language:'en',level:'A1',completedLessons:['a1_en_b1_v2_d1',ids[0],ids[0]],placementResults:[],availableLessonIds:new Set(ids)});
 assert.equal(course.items[0].lessonsCount,12);assert.equal(course.items[0].completedCount,1);assert.equal(course.items[0].percent,8);
 assert.equal(resumeGroup(ids.slice(0,5),{}),homeGroups[3].id);
 let answerCount=0;
 for(const l of b1Packet){
  const flow=packetFlow(l);assert.equal(flow.filter(c=>c.kind==='intro').length>=1,true);assert.equal(flow.at(-1).kind,'result');
  assert.equal(new Set(flow.map(c=>c.id)).size,flow.length);
  assert.ok(packetTaskIds(l).required.length>0);
  for(const c of flow){
   for(const text of [c.body,c.board||''])assert.doesNotMatch(text,/Hazırlayan üçün|Gizli cavab|Tələb olunan funksiya|\*\*Status/);
   const rule=c.rule||c.turns?.[0]?.rule;if(!rule)continue;
   const sample=rule.fields?JSON.stringify(['Hello!','Bye!']):rule.answers[0]?.replaceAll('[ad]','Sam');
   assert.equal(assessPacketAnswer(sample,rule,c.kind==='voice').status,'correct',`${c.id}: ${sample}`);answerCount++;
   for(const audio of [c.audio||'',...(c.examples||[]),...(c.turns||[]).map(t=>t.audio)])assert.doesNotMatch(audio,/[ƏəıİşŞğĞçÇöÖüÜ]|Audio:|SONRA/);
  }
 }
 const grammar=packetFlow(b1Packet[1]).find(c=>c.number===7);
 assert.notEqual(assessPacketAnswer('is',grammar.rule).status,'correct','am/is must not become a typo');
 const heardWord=packetFlow(b1Packet[0]).find(c=>c.id.endsWith('c07b'));
 assert.notEqual(assessPacketAnswer('Goodbye!',heardWord.rule).status,'correct','dictation requires the heard word');
 const role=packetFlow(b1Packet[1]).find(c=>c.number===8).turns[0].rule;
 assert.notEqual(assessPacketAnswer('Hi. I’m Alex.',role,true).status,'correct','fixed-role name preserved');
 const fields=b1Packet[0].cards.find(c=>c.fields).rule;
 assert.equal(assessPacketAnswer(JSON.stringify(['Hello!','']),fields).status,'unknown');
 assert.equal(assessPacketAnswer(JSON.stringify(['Hello!','Hello!']),fields).status,'partial');
 const am=b1Packet[1].vocabulary.find(v=>v.word.startsWith('I am'));
 assert.equal(vocabularySegments('I’m Sam.',[am]).find(p=>p.entry)?.text,'I’m','authored ellipsis is a template, not part of a token');
 const phrase=b1Packet.flatMap(l=>l.vocabulary).find(v=>v.word.includes('welcome'));
 assert.ok(phrase);
 const parts=vocabularySegments('You’re welcome. Hello!', [phrase,...b1Packet[0].vocabulary]);
 assert.equal(parts.find(p=>p.entry?.word===phrase.word)?.text,'You’re welcome');
 assert.equal(vocabularyKey('You’re welcome!'),vocabularyKey('You are welcome.'));
 let user=freshUser();await user.getState().loadFromStorage();
 assert.equal(user.getState().beginLesson(ids[1]),'', 'direct URL cannot bypass lesson order');
 const attempt=user.getState().beginLesson(ids[0]);assert.ok(attempt);
 const first=packetFlow(b1Packet[0]).find(c=>c.kind==='task');
 user.getState().recordTask(attempt,first.id,true,'token',{input:'written',assisted:false,listening:false,technicalText:false},first.rule.answers[0]);
 user.getState().markTranscript(attempt,first.id);user.getState().saveCursor(attempt,first.id);await user.getState().saveToStorage();
 user=freshUser();await user.getState().loadFromStorage();
 assert.equal(user.getState().beginLesson(ids[0]),attempt);assert.equal(user.getState().attempts[attempt].cursor,first.id);
 assert.equal(user.getState().attempts[attempt].tasks[first.id].resolved,true);assert.ok(user.getState().attempts[attempt].transcriptTaskIds.includes(first.id));
 for(const c of packetFlow(b1Packet[0]).filter(c=>['task','voice'].includes(c.kind))) {
  if(c.kind==='voice'){user.getState().recordTask(attempt,c.id,null,'skip'+c.id);user.getState().settlePacketTask(attempt,c.id,'skipped');}
  else user.getState().recordTask(attempt,c.id,true,'written'+c.id,{input:'written',assisted:false,listening:false,technicalText:false});
 }
 const receipt=await user.getState().finishLesson(attempt);assert.equal(receipt.completed,true);assert.deepEqual(user.getState().completedLessons,[ids[0]]);
 assert.equal(user.getState().completedLessons.includes(ids[1]),false,'finishing never starts or completes the next lesson');
 const vocab=require('../src/store/vocabularyStore.ts').useVocabularyStore;await vocab.getState().loadFromStorage();
 await vocab.getState().addLessonWords(ids[0],['Hello']);assert.equal(vocab.getState().allWords.length,1);
 await vocab.getState().addLessonWords(ids[0],['Hello']);assert.equal(vocab.getState().allWords.length,1);
 await vocab.getState().addLessonWords(ids[0]);const count=vocab.getState().allWords.length;await vocab.getState().addLessonWords(ids[0]);assert.equal(vocab.getState().allWords.length,count);
 console.log(`PASS: 7 groups / 12 lessons, version isolation, real counts, ${answerCount} authored answer samples, field boundaries, phrase lookup, English audio payloads, order boundary, persisted drafts/evidence, separate completion and dictionary deduplication. No native-device claim.`);
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>{Module._load=originalLoad});
