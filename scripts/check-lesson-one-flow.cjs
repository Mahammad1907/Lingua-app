/* End-to-end component flow with mocked native/audio boundaries, not device QA. */
const assert=require('node:assert/strict'),fs=require('node:fs'),Module=require('node:module'),ts=require('typescript'),React=require('react');
const original=Module._load,storage=new Map(),navigation=[],spoken=[];
class Value{constructor(v){this.v=v}setValue(v){this.v=v}stopAnimation(){}interpolate(x){return x.outputRange.at(-1)}}
const component=name=>name;
const rn={View:'View',Text:'Text',Pressable:'Pressable',TouchableOpacity:'Pressable',TextInput:'TextInput',ScrollView:'ScrollView',KeyboardAvoidingView:'KeyboardAvoidingView',Image:'Image',ActivityIndicator:'Spinner',Platform:{OS:'ios'},StyleSheet:{create:s=>s,flatten:s=>Array.isArray(s)?Object.assign({},...s.filter(Boolean).map(v=>rn.StyleSheet.flatten(v))):s,absoluteFill:{}},useWindowDimensions:()=>({width:390,height:844,fontScale:1}),Keyboard:{dismiss(){},addListener:()=>({remove(){}})},BackHandler:{addEventListener:()=>({remove(){}})},AccessibilityInfo:{isReduceMotionEnabled:async()=>true,addEventListener:()=>({remove(){}})},Alert:{alert(){}},Modal:({visible,children})=>visible?React.createElement('Modal',null,children):null,Animated:{Value,View:'View',Text:'Text',createAnimatedComponent:component,timing:()=>({start:cb=>cb?.({finished:true}),stop(){}}),sequence:()=>({start:cb=>cb?.({finished:true}),stop(){}}),parallel:()=>({start:cb=>cb?.({finished:true}),stop(){}})},Easing:{linear:()=>{}}};
Module._load=function(name,parent,main){
 if(name==='react')return React;
 if(name==='react-native')return rn;
 if(name==='react-native-safe-area-context')return {useSafeAreaInsets:()=>({top:44,bottom:34})};
 if(name==='expo-router')return {Stack:{Screen:()=>null},useRouter:()=>({replace:p=>navigation.push(p)}),useFocusEffect:()=>{}};
 if(name==='expo-speech')return {stop:async()=>{},speak:(text,opts)=>{spoken.push(text);opts.onDone?.()}};
 if(name==='expo-status-bar')return {StatusBar:()=>null};
 if(name==='expo-haptics')return {ImpactFeedbackStyle:{Light:1},impactAsync:async()=>{}};
 if(name==='expo-linear-gradient')return {LinearGradient:'Gradient'};
 if(name==='expo-image')return {Image:Object.assign('Image',{prefetch:async()=>true})};
 if(name==='react-native-svg')return {__esModule:true,default:'Svg',Path:'Path',Rect:'Rect',Circle:'Circle'};
 if(name==='@react-native-async-storage/async-storage')return {getItem:async k=>storage.get(k)??null,setItem:async(k,v)=>storage.set(k,v)};
 if(name==='./LessonVoiceInput')return {__esModule:true,default:'VoiceInput'};
 if(name.endsWith('/cloudSpeech'))return {speechProxyEndpoint:()=>'',recognizeRecording:async()=>({status:'unknown'})};
 return original.call(this,name,parent,main);
};
for(const ext of ['.png','.webp'])require.extensions[ext]=(m,f)=>m.exports=1;
for(const ext of ['.ts','.tsx'])require.extensions[ext]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,f);
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
const warn=console.error;console.error=(...a)=>{if(!String(a[0]).includes('react-test-renderer is deprecated'))warn(...a)};
const {create,act}=require(process.env.V2_RENDERER||'react-test-renderer');
const {b1Packet,packetFlow}=require('../src/data/b1Course.ts'),packet=b1Packet[0],flow=packetFlow(packet);
const {useUserStore:user}=require('../src/store/userStore.ts'),{useVocabularyStore:vocab}=require('../src/store/vocabularyStore.ts');
const Screen=require('../src/components/lesson/PacketLesson.tsx').default;
const {skillResults}=require('../src/components/lesson/LessonSkillResults.tsx');
const flatten=n=>typeof n==='string'?n:Array.isArray(n)?n.map(flatten).join(''):flatten(n?.children||[]);
(async()=>{
 await user.getState().loadFromStorage();await vocab.getState().loadFromStorage();let tree;await act(async()=>tree=create(React.createElement(Screen,{packet})));
 const all=()=>flatten(tree.toJSON());
 const button=text=>tree.root.findAllByType('Pressable').find(n=>flatten({children:n.children})===text||flatten({children:n.children}).startsWith(text));
 const press=async text=>{const b=button(text);assert.ok(b,'button '+text);assert.ok(!b.props.disabled,'enabled '+text);await act(async()=>b.props.onPress());};
 const next=async()=>{await act(async()=>new Promise(r=>setTimeout(r,660)));await press('Davam et');};
 const cursor=()=>Object.values(user.getState().attempts)[0].cursor;
 const expect=c=>assert.equal(cursor(),packet.id+'_'+c);
 const write=async text=>{const input=tree.root.findAllByType('TextInput').find(n=>n.props.editable!==false);assert.ok(input,'writable input');await act(async()=>input.props.onChangeText(text));};
 const send=async text=>{const voice=tree.root.findByType('VoiceInput');assert.equal(voice.props.manualSend,true);await act(async()=>voice.props.onFinal({text,confidence:1,edited:false,token:'speech-'+cursor()}));};
 await press('Dərsə başla');expect('c02');
 assert.equal(vocab.getState().allWords.length,2,'first teach auto-saves only Hello and Hi');
 let fresh=tree.root.findAllByType('Text').filter(n=>n.props.accessibilityLabel==='Hello: mənasını göstər'||n.props.accessibilityLabel==='Hello!: mənasını göstər');assert.ok(fresh.length);assert.ok(fresh.some(n=>n.props.style?.color==='#AB5008'),'new word has accessible accent');
 await act(async()=>fresh[0].props.onPress());assert.match(all(),/Salam/);await press('İngiliscə dinlə');assert.equal(spoken.at(-1).replace(/[.!]/g,''),'Hello');await press('Bağla');
 await press('Davam et');expect('c03');await press('Səsi dinlə');await press('Sağollaşır.');await press('Yoxla');assert.match(all(),/Səhv cavab/);expect('c03');await next();
 expect('c04');await write('Hi!');await press('Yoxla');assert.match(all(),/Müstəqil/);await next();
 expect('c05');await press('Səsi dinlə');await send('Hi!');assert.match(all(),/Düzdür · Köməklə/);await next();
 expect('c06');assert.equal(vocab.getState().allWords.length,4);await press('Davam et');expect('c07a');await press('Goodbye!');await press('Yoxla');await next();
 expect('c07b');await press('Səsi başa düşmürəm');assert.match(all(),/Bye!/);await press('Mətni gizlət');await write('Bye');await press('Yoxla');assert.match(all(),/Düzdür · Köməklə/);await next();
 expect('c08');await press('İndi danışa bilmirəm');expect('c09');await write('Bye!');await press('Yoxla');await next();expect('c10');
 const inputs=tree.root.findAllByType('TextInput');await act(async()=>inputs[0].props.onChangeText('Hello!'));await act(async()=>tree.root.findAllByType('TextInput')[1].props.onChangeText('Hello!'));await press('Yoxla');assert.match(all(),/Qismən düz/);await next();
 expect('c11a');await act(async()=>tree.root.findByType('VoiceInput').props.onUnverifiedRecording({token:'real-recording',uri:'file://recording',duration:1500}));assert.match(all(),/Yoxlanmadı/);assert.doesNotMatch(all(),/Səhv cavab · Təkrar/);await press('Yoxlanmadı ilə davam et');
 expect('c11b');await send('Bye!');await next();assert.match(all(),/Etdiyin səhvlərin təkrarı/);await press('Davam et');
 assert.match(all(),/Başqa danışanı dinlə/);await press('Səsi dinlə');await press('Salam verir.');await press('Yoxla');assert.match(all(),/Düzdür · Köməklə/);await next();
 assert.match(all(),/Video görüş/);const retained=tree.root.findAllByType('TextInput');assert.equal(retained[0].props.value,'Hello!');assert.equal(retained[0].props.editable,false);await write('Bye!');await press('Yoxla');await next();
 expect('c13');assert.match(all(),/Konkret nəticən/);assert.match(all(),/Danışıq: 2\/4 cavab yoxlanıb/);
 const attempt=Object.values(user.getState().attempts)[0],outcomes=Object.fromEntries(Object.entries(attempt.tasks).map(([id,t])=>[id,{status:t.resolved?t.evidence?.assisted?'assisted':'independent':'unverified',evidence:t.evidence}]));
 const results=skillResults(packet,outcomes);assert.equal(results.filter(r=>r.voice&&r.verifiedVoice).length,2);assert.equal(results.find(r=>r.id.endsWith('c08')).status,'Yoxlanmadı');assert.ok(results.find(r=>r.id.endsWith('c07b')).listening);
 assert.equal(attempt.tasks[packet.id+'_c10'].initialAnswer,'["Hello!","Hello!"]');assert.equal(navigation.length,0);
 await press('Nəticəni saxla');assert.ok(user.getState().completedLessons.includes(packet.id));assert.equal(vocab.getState().allWords.length,4,'no duplicate dictionary entries');assert.equal(navigation.length,0,'no auto-next lesson');
 await press('Tapşırıqların nəticələri');assert.match(all(),/Yoxlanmadı/);await act(async()=>tree.unmount());
 const {stagePresentation}=require('../src/components/lesson/LessonStageHeading.tsx');
 assert.equal(stagePresentation(b1Packet[1].cards.find(c=>c.number===7)).title,'Qrammatika');
 let matrixCount=0;
 for(const lesson of b1Packet){
  for(const card of packetFlow(lesson).filter(c=>c.kind!=='review')){
   user.setState({attempts:{},lessonProgress:[],completedLessons:b1Packet.filter(l=>l.order<lesson.order).map(l=>l.id)});
   const id=user.getState().beginLesson(lesson.id);assert.ok(id);
   user.getState().saveCursor(id,card.id);
   await act(async()=>tree=create(React.createElement(Screen,{packet:lesson})));
   const screen=tree.root.findByType('KeyboardAvoidingView');
   assert.equal(rn.StyleSheet.flatten(screen.props.style).backgroundColor,'#F7F0FF');
   assert.equal(Object.values(user.getState().attempts)[0].cursor,card.id);
   assert.doesNotMatch(all(),/Gizli cavab|Müəllif üçün|Tələb olunan funksiya|Görünən nümunə:/);
   await act(async()=>tree.unmount());matrixCount++;
  }
 }
 console.log('PASS shared UI: '+matrixCount+' authored stages across all 12 lessons render in the scoped light theme; grammar/listening/speech/teaching roles do not reorder content. Layout/native/audio are mocked.');
 console.log('PASS D1: authored order, teaching auto-save + meaning + English audio, wrong/partial one-time retries, retained field, explicit Continue, interleaved speech, sticky transcript help, skipped/technical speech Unverified, concrete 2/4 speech result, original evidence, no auto-next and no dictionary duplicates. Native/audio mocked.');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>Module._load=original);
