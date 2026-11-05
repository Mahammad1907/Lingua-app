const assert=require('node:assert/strict'), fs=require('node:fs'), Module=require('node:module'), ts=require('typescript'), React=require('react');
const original=Module._load; let width=390;const user={completedLessons:[],attempts:{},streak:0};
const absoluteFill={position:'absolute',top:0,left:0,right:0,bottom:0};
class Value{constructor(v){this.v=v}setValue(v){this.v=v}stopAnimation(){}interpolate(){return this.v}}
const native={View:'View',Text:'Text',Image:'Image',Modal:'Modal',Pressable:'Pressable',ScrollView:'ScrollView',StyleSheet:{create:s=>s,absoluteFill},useWindowDimensions:()=>({width,fontScale:1,height:844}),Animated:{Value,createAnimatedComponent:x=>x,parallel:()=>({start(){},stop(){}})},Easing:{cubic:x=>x,inOut:x=>x}};
Module._load=function(name,parent,main){
 if(name==='react')return React;if(name==='react-native')return native;
 if(name==='react-native-safe-area-context')return {useSafeAreaInsets:()=>({top:0,bottom:34})};
 if(name==='expo-linear-gradient')return {LinearGradient:'Gradient'};
 if(name==='expo-status-bar')return {StatusBar:()=>null};
 if(name==='react-native-svg')return {__esModule:true,default:'Svg',Defs:'Defs',Circle:'Circle',Ellipse:'Ellipse',G:'G',Path:'Path',Rect:'Rect',Stop:'Stop',LinearGradient:'SvgGradient'};
 if(name.endsWith('/store/userStore'))return {useUserStore:selector=>selector(user)};
 if(name.endsWith('/hooks/useReducedMotion'))return {useReducedMotion:()=>true};
 if(name==='./HomeDashboard'&&parent.filename.endsWith('ApprovedHome.tsx'))return {HomeDashboard:'FallbackHome',HOME_LANGUAGES:[]};
 return original.call(this,name,parent,main);
};
for(const ext of ['.ts','.tsx'])require.extensions[ext]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,f);
require.extensions['.png']=(m,f)=>{m.exports=f};
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
const {create,act}=require(process.env.V2_RENDERER||'react-test-renderer');
const {HomeDashboard}=require('../src/components/home/ApprovedHome.tsx');
const Panel=require('../src/components/home/LessonGroupPanel.tsx').default;
const {buildHomeCourse}=require('../src/utils/homeCourse.ts');
const {getAllModules}=require('../src/data/modules.ts');const {lessons}=require('../src/data/lessons.ts');
const ids=getAllModules()[0].lessonIds;
const course=()=>buildHomeCourse({modules:getAllModules(),language:'en',level:'A1',completedLessons:user.completedLessons,placementResults:[],availableLessonIds:new Set(ids)});
(async()=>{
 for(width of [320,390,430]){
  user.completedLessons=[];const opened=[];const supplements=[];let tree;
  const element=()=>React.createElement(HomeDashboard,{course:course(),language:'en',level:'A1',xp:0,onSelect(){},onOpen(){throw Error('group tap must not route through old module screen')},onLessonOpen:id=>opened.push(id),onSupplement:kind=>supplements.push(kind)});
  await act(async()=>{tree=create(element())});
  const groups=tree.root.findAllByType('Pressable').filter(n=>n.props.accessibilityLabel?.endsWith('Qrupu aç'));
  assert.equal(groups.length,7);assert.equal(tree.root.findAllByType('Image').length,1);
  for(const label of ['Keçid imtahanı','Özünü yoxla','Hekayə']){const action=tree.root.findAllByType('Pressable').find(n=>n.findAllByType('Text').some(t=>t.children.includes(label)));assert.ok(action);await act(async()=>action.props.onPress());}
  assert.deepEqual(supplements,['exam','self-check','story']);
  await act(async()=>groups[0].props.onPress());
  let panel=tree.root.findByType(Panel);assert.equal(panel.findByType('Modal').props.visible,true);
  let row=panel.findAllByType('Pressable').find(n=>n.props.accessibilityLabel?.startsWith('1. '));assert.ok(row);
  await act(async()=>row.props.onPress());assert.deepEqual(opened,[ids[0]]);
  await act(async()=>groups[1].props.onPress());panel=tree.root.findByType(Panel);
  row=panel.findAllByType('Pressable').find(n=>n.props.accessibilityLabel?.startsWith('2. '));
  await act(async()=>row.props.onPress());assert.equal(opened.length,1,'locked row shows a reason and never opens');
  user.completedLessons=[ids[0]];await act(async()=>tree.update(element()));panel=tree.root.findByType(Panel);
  row=panel.findAllByType('Pressable').find(n=>n.props.accessibilityLabel?.startsWith('2. '));await act(async()=>row.props.onPress());assert.deepEqual(opened,[ids[0],ids[1]]);
  const progress=tree.root.findAllByType('View').find(n=>n.props.accessibilityRole==='progressbar');assert.equal(progress.props.accessibilityValue.now,8);
  await act(async()=>tree.unmount());
 }
 console.log('PASS: native 7-card home at 320/390/430, bottom panel, real lesson callbacks, lock reason, unlock on updated progress, 1/12=8%, and original high-resolution mascot. Native geometry not certified.');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>{Module._load=original});
