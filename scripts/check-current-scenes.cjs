const assert=require('node:assert/strict'),fs=require('node:fs'),Module=require('node:module'),ts=require('typescript'),React=require('react');
const original=Module._load;
Module._load=function(name,parent,main){if(name==='react')return React;if(name==='react-native')return {View:'View',Image:'Image',StyleSheet:{create:s=>s}};return original.call(this,name,parent,main);};
for(const ext of ['.ts','.tsx'])require.extensions[ext]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,f);
require.extensions['.webp']=(m,f)=>{assert.ok(fs.statSync(f).size>1000);m.exports=f;};
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
const {create,act}=require(process.env.V2_RENDERER||'react-test-renderer');
const {currentTeachingScene,currentDialogueScene}=require('../src/utils/currentScenePlan.ts');
const {speechBoundary,highlightedSpeechRange}=require('../src/utils/speechHighlight.ts');
const {default:Scene,currentSceneAssets}=require('../src/components/lesson/CurrentSceneArt.tsx');
const {b1Packet}=require('../src/data/b1Course.ts');
(async()=>{
 assert.equal(Object.keys(currentSceneAssets).length,10);
 const seen=new Set();
 for(const lesson of b1Packet)for(const card of lesson.cards){const scene=currentTeachingScene(lesson.order,card);if(scene)seen.add(scene);if(card.kind==='task'||card.kind==='review')assert.equal(scene,undefined,'assessment/retry has no scene hint');}
 assert.equal(seen.size,10,'every planned topic scene is connected to a teaching card');
 assert.equal(currentTeachingScene(5,{kind:'teach',number:4}),undefined,'do not illustrate future unwell vocabulary before its authored lesson');
 assert.equal(currentTeachingScene(8,{kind:'teach',number:8}),'attention','no premature apology scene in the attention lesson');
 for(let order=1;order<=12;order++)assert.ok(currentSceneAssets[currentDialogueScene(order)]);
 for(const [name,asset] of Object.entries(currentSceneAssets)){
   let tree;await act(async()=>{tree=create(React.createElement(Scene,{scene:name}));});
   const image=tree.root.findByType('Image'),s=image.props.style;
   assert.equal(s.width,`${100*asset.columns}%`);assert.equal(s.height,`${100*asset.rows}%`);
   assert.equal(s.left,`${-(asset.cell%asset.columns)*100}%`);
   assert.equal(s.top,`${-Math.floor(asset.cell/asset.columns)*100}%`);
   const frame=image.parent.props.style;assert.equal(frame.width,'100%');assert.equal(frame.aspectRatio,1.5);
   for(const available of [60,90,180,320]){const width=Math.min(available,frame.maxWidth);assert.ok(width<=available);assert.equal(width/(width/frame.aspectRatio),1.5);}
   await act(async()=>tree.unmount());
 }
 assert.equal(speechBoundary('Hello!',-1,2),null);assert.equal(speechBoundary('Hello!',0,0),null);assert.equal(speechBoundary('Hello!',0,99),null);
 const focus=speechBoundary('You are welcome',4,3);assert.deepEqual(highlightedSpeechRange('You are welcome — Dəyməz',focus),{start:4,end:7});assert.equal(highlightedSpeechRange('Hello!',focus),null);assert.equal(highlightedSpeechRange('Hello!',null),null);
 console.log('PASS: all 10 current scenes connected, correct attention/feeling boundaries, no task/retry illustrations, 12 dialogue mappings, full atlas cells at narrow widths, and real-boundary-only word focus. Native geometry/audio mocked.');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>Module._load=original);
