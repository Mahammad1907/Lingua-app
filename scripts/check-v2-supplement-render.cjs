const assert=require('node:assert/strict'),fs=require('node:fs'),Module=require('node:module'),ts=require('typescript'),React=require('react');
const original=Module._load,storage=new Map();let completed=[];const navigation=[];
Module._load=function(name,parent,main){
 if(name==='react')return React;
 if(name==='react-native')return {View:'View',Text:'Text',Pressable:'Pressable',ScrollView:'ScrollView',TextInput:'TextInput',KeyboardAvoidingView:'KeyboardAvoidingView',ActivityIndicator:'Spinner',Platform:{OS:'ios'},StyleSheet:{create:s=>s}};
 if(name==='react-native-safe-area-context')return {useSafeAreaInsets:()=>({top:44,bottom:34})};
 if(name==='expo-router')return {useRouter:()=>({back:()=>navigation.push('back')}),useFocusEffect:()=>{}};
 if(name==='expo-speech')return {stop:async()=>{},getAvailableVoicesAsync:async()=>[],speak:(_text,options)=>options.onDone?.()};
 if(name==='@react-native-async-storage/async-storage')return {getItem:async k=>storage.get(k)??null,setItem:async(k,v)=>storage.set(k,v)};
 if(name.endsWith('/store/userStore'))return {useUserStore:selector=>selector({completedLessons:completed})};
 if(name==='./LessonPicture')return {__esModule:true,default:'LessonPicture'};
 if(name==='./LessonVoiceInput')return {__esModule:true,default:'VoiceInput'};
 if(name==='./FixedLessonViewport')return {__esModule:true,default:({children})=>React.createElement('Viewport',null,children)};
 if(name==='./LessonVocabularyText')return {__esModule:true,default:({text})=>React.createElement('Text',null,text)};
 if(name==='./VocabularyMeaningPanel')return {__esModule:true,default:()=>null};
 return original.call(this,name,parent,main);
};
for(const ext of ['.ts','.tsx'])require.extensions[ext]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,f);
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
const {create,act}=require(process.env.V2_RENDERER||'react-test-renderer'),Screen=require('../src/components/lesson/V2Supplement.tsx').default,plan=require('../src/data/b1ExtrasV2.json')['self-check'];
const flatten=n=>typeof n==='string'?n:Array.isArray(n)?n.map(flatten).join(''):flatten(n?.children||[]);
(async()=>{
 let tree;await act(async()=>{tree=create(React.createElement(Screen,{kind:'self-check'}))});
 const button=text=>tree.root.findAllByType('Pressable').find(n=>flatten(n.toJSON?n.toJSON():{children:n.children}).includes(text));
 const press=async text=>{const b=button(text);assert.ok(b,'button '+text);assert.ok(!b.props.disabled,'enabled '+text);await act(async()=>b.props.onPress());};
 await press('Başla');
 for(let i=0;i<plan.cards.length;i++){
  const c=plan.cards[i];if(c.audio)await press('Səsi dinlə');
  const answer=c.rule.answers[0].replaceAll('[ad]','Sam');
  if(c.kind==='voice')await act(async()=>{const voice=tree.root.findByType('VoiceInput');assert.equal(voice.props.manualSend,true);voice.props.onFinal({text:answer,edited:false,token:'speech-'+i,confidence:1});});
  else {if(c.options)await press(answer);else await act(async()=>tree.root.findByType('TextInput').props.onChangeText(answer));await press('Cavabı saxla');}
  assert.ok(!flatten(tree.toJSON()).includes('Uyğun cavab:'),'answer key stays hidden before the explicit final continue');
  await press(i+1===plan.cards.length?'Nəticəyə bax':'Davam et');
 }
 assert.ok(flatten(tree.toJSON()).includes('Uyğun cavab:'));
 const saved=JSON.parse(storage.get('@birtalk_supplement_v2:self-check'));assert.equal(saved.completed,true);assert.equal(Object.keys(saved.responses).length,6);assert.equal(saved.responses.self_3.spoken,true);
 assert.equal(navigation.length,0,'no auto-navigation after completion');
 await act(async()=>tree.unmount());
 await act(async()=>{tree=create(React.createElement(Screen,{kind:'self-check'}))});await press('Nəticəyə bax');assert.ok(flatten(tree.toJSON()).includes('Uyğun cavab:'));await act(async()=>tree.unmount());
 await act(async()=>{tree=create(React.createElement(Screen,{kind:'story'}))});assert.match(flatten(tree.toJSON()),/Əvvəl 12 əsas dərsi tamamla/);await act(async()=>tree.unmount());
 console.log('PASS: full rendered six-question self-check, explicit save/continue, hidden pre-result answers, manual voice submission, persisted result reload, no automatic navigation and story prerequisite. Native primitives/audio are mocked.');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>Module._load=original);
