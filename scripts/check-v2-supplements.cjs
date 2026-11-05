const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,f);
const plans=require('../src/data/b1ExtrasV2.json'),{assessSupplement,followUpAvailable,validateSupplementDraft,supplementalFlow}=require('../src/utils/supplement.ts'),{authoredRetry,spacedWarmups}=require('../src/utils/v2Flow.ts'),{assessPacketAnswer}=require('../src/utils/packetAnswer.ts'),{b1Packet}=require('../src/data/b1Course.ts');
assert.deepEqual(Object.values(plans).map(p=>p.cards.length),[16,16,6,8]);
let samples=0,alternatives=0;
for(const lesson of b1Packet)for(const c of lesson.cards){const r=c.rule||c.turns?.[0]?.rule;if(!r)continue;for(const a of r.authoredAlternatives||[]){if(a.includes('[ad]'))continue;assert.equal(assessPacketAnswer(a,r,c.kind==='voice').status,'correct',c.id+' alternative '+a);alternatives++;}}
for(const [kind,plan] of Object.entries(plans)){
 const responses={};
 for(const c of plan.cards){
  assert.doesNotMatch(c.body,/Gizli cavab|Hazırlayan üçün|Tələb olunan funksiya|Alternativlər:/);
  if(c.kind==='read')continue;
  const value=c.rule.answers[0].replaceAll('[ad]','Sam');
  const result=assessSupplement(c,value,{spoken:c.kind==='voice',helped:false,heard:true});
  assert.equal(result.status,'independent',`${kind} ${c.id}: ${value}`);responses[c.id]=result;samples++;
  const support=assessSupplement(c,value,{spoken:c.kind==='voice',helped:true,heard:true});assert.equal(support.status,'assisted');
  const failure=assessSupplement(c,'',{spoken:false,helped:false,heard:false,skipped:true});assert.equal(failure.status,'unverified');
  if(c.kind==='voice')assert.equal(assessSupplement(c,value,{spoken:false,helped:false,heard:true}).status,'unverified','typed input cannot earn speech');
  if(c.after){assert.equal(followUpAvailable(c,{}),false);assert.equal(followUpAvailable(c,responses),true);}
 }
 const state={version:2,index:plan.cards.length,responses,completed:true};assert.equal(validateSupplementDraft(state,plan).completed,true);
 assert.equal(validateSupplementDraft({...state,responses:{}},plan),undefined,'blank required answers cannot become a completed attempt');
}
const story=plans.story, storyWrong={story_3:assessSupplement(story.cards[1],'Alex',{spoken:false,helped:false,heard:false})};
const storyFlow=supplementalFlow(story,storyWrong);assert.equal(storyFlow.length,9);assert.equal(storyFlow.at(-1).id,'story_3:review');assert.match(storyFlow.at(-1).body,/Alex: Hello/);
assert.equal(supplementalFlow(story,{...storyWrong,'story_3:review':{...storyWrong.story_3,status:'needsPractice'}}).length,9,'a failed retry never creates another retry');
const original=b1Packet[0].cards.find(c=>c.fields);const partial=assessPacketAnswer(JSON.stringify(['Hello!','Hello!']),original.rule);
const retry=authoredRetry(original,partial,JSON.stringify(['Hello!','Hello!']));
assert.deepEqual(retry.retainedFields,['Hello!','']);assert.match(retry.body,/Video görüş/);assert.equal(retry.fields.length,2);
const verdict=assessPacketAnswer(JSON.stringify([retry.retainedFields[0],'Bye!']),retry.rule);assert.equal(verdict.status,'correct');
const voice=b1Packet.flatMap(l=>l.cards).filter(c=>c.kind==='voice');let paths=0;
for(const c of voice){const rule=c.turns[0].rule;const correct=assessPacketAnswer(rule.answers[0].replaceAll('[ad]','Sam'),rule,true);assert.equal(correct.status,'correct');assert.equal(assessPacketAnswer('',rule,true).status,'unknown');assert.notEqual(assessPacketAnswer('banana telescope',rule,true).status,'correct');paths++;}
const flow=spacedWarmups(b1Packet[1],b1Packet,[{lessonId:b1Packet[0].id,practiceNeeds:[b1Packet[0].cards.find(c=>c.number===4).id]}]);
assert.equal(flow.length,b1Packet[1].cards.filter(c=>c.kind!=='review').length,'spaced recall replaces a warm-up, never adds new lesson content');
assert.ok(flow.some(c=>c.id.startsWith('recheck:')),'a suitable authored warm-up receives the failed skill');
assert.ok(voice.find(c=>c.id.endsWith('d01_c11a')).turns[0].reply==='Hi!');
console.log(`PASS: ${alternatives} explicit main-lesson alternatives and ${samples} supplementary canonical answers, ${paths} voice-stage correct/unknown/unrelated paths, A/B 14+2 stages, deferred feedback state, help/technical/skip/speech boundaries, follow-up gates, complete-state validation, retained-field new-situation retry and authored spaced warm-up replacement. Device ASR not simulated.`);
