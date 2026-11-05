const assert=require('node:assert/strict'),fs=require('fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,f);
const {lessonPictures}=require('../src/utils/lessonPicturePlan.ts'),{pictureTeachingEntries}=require('../src/utils/pictureTeaching.ts'),{b1Packet}=require('../src/data/b1Course.ts');
const expected=[[1,2,'P01'],[1,6,'P02'],[1,9,'P02'],[2,4,'P03'],[2,9,'P03'],[3,4,'P04'],[4,4,'P04'],[5,4,'P05'],[6,4,'P05'],[7,4,'P06'],[8,8,'P07-attention'],[10,4,'P08'],[11,4,'P08']];
for(const [order,number,id] of expected){const card=b1Packet[order-1].cards.find(c=>c.number===number);assert.ok(lessonPictures(order,card).includes(id));}
assert.deepEqual(lessonPictures(8,{number:8,kind:'teach'}),['P07-attention','P07-apology']);
assert.deepEqual(lessonPictures(12,{number:8,kind:'voice'}),['P09']);
assert.deepEqual(lessonPictures(1,{number:3,kind:'task'}),[],'no illustration cue added to independent listening');
for(const p of b1Packet)for(const c of p.cards.filter(c=>c.kind==='teach'&&c.board)){for(const e of pictureTeachingEntries(c.board,p,c.number)){assert.ok(p.vocabulary.some(v=>v.word===e.word));assert.equal(e.translation,p.vocabulary.find(v=>v.word===e.word).translation);}}
const first=b1Packet[0];const altered={...first,vocabulary:first.vocabulary.map((v,i)=>i===0?{...v,example:'Hello, I bought a pineapple.'}:v)};
assert.equal(pictureTeachingEntries('Hello',altered,2)[0].example,'','untaught example is withheld');
assert.equal(first.vocabulary.length,4,'no unrelated object words');
console.log('PASS: explicit P01–P09 positions, separate attention/apology, no independent-listening picture cue, author-only vocabulary, untaught-example guard and no unrelated object additions.');
