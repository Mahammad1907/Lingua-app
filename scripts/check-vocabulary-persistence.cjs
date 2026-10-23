const assert = require('node:assert/strict'), fs = require('node:fs'), Module = require('node:module'), ts = require('typescript');
const { createStore } = require('zustand/vanilla');
const original = Module._load; let disk = null, fail = false, delayed;
const storage = { getItem: async () => delayed ? new Promise(resolve => { delayed = resolve; }) : disk, setItem: async (_key, value) => { if(fail) throw Error('storage unavailable'); disk=value; } };
Module._load = function(id,...args) { if(id==='@react-native-async-storage/async-storage')return storage;if(id==='zustand')return {create:createStore};return original.call(this,id,...args); };
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true,resolveJsonModule:true}}).outputText,f);
const { b1Packet }=require('../src/data/b1Course.ts'), { newLessonWords }=require('../src/utils/lessonVocabulary.ts'), { vocabularyKey }=require('../src/utils/vocabularyIdentity.ts');
function fresh() { delete require.cache[require.resolve('../src/store/vocabularyStore.ts')];return require('../src/store/vocabularyStore.ts').useVocabularyStore; }
(async()=>{
 let store=fresh();await store.getState().loadFromStorage();
 for(const l of b1Packet)await store.getState().addLessonWords(l.id);
 const words=store.getState().allWords;const keys=new Set(words.map(w=>vocabularyKey(w.word)));
 for(const l of b1Packet)for(const w of newLessonWords(l,b1Packet))assert.ok(keys.has(vocabularyKey(w)),`highlighted word has a dictionary card: ${w}`);
 for(const l of b1Packet)await store.getState().addLessonWords(l.id);
 assert.equal(store.getState().allWords.length, words.length, 'repeated completion never duplicates words');
 store=fresh();await store.getState().loadFromStorage();assert.equal(store.getState().allWords.length,words.length);
 const saved=JSON.parse(disk);saved.allWords=saved.allWords.filter(w=>/[ /]/.test(w.word));disk=JSON.stringify(saved);
 store=fresh();await store.getState().loadFromStorage();const ids=store.getState().allWords.map(w=>w.id);
 await store.getState().reconcileCompletedLessons(b1Packet.map(l=>l.id));assert.equal(store.getState().allWords.length,words.length);
 ids.forEach(id=>assert.ok(store.getState().allWords.some(w=>w.id===id),'upgrade preserves old dictionary/test identities'));
 disk=null;store=fresh();await store.getState().loadFromStorage();fail=true;
 await assert.rejects(store.getState().addLessonWords(b1Packet[0].id));assert.ok(store.getState().storageError);
 fail=false;await store.getState().addLessonWords(b1Packet[0].id);assert.equal(store.getState().storageError,null);assert.ok(JSON.parse(disk).allWords.length);
 disk=null;delayed=true;store=fresh();const pending=store.getState().addLessonWords(b1Packet[0].id);await Promise.resolve();
 assert.equal(typeof delayed,'function');const release=delayed;delayed=null;release(null);await pending;
 assert.equal(store.getState().allWords.length,4,'completion waits for hydration rather than being overwritten by it');
 console.log(`PASS: ${words.length} dictionary cards, every highlighted word, duplicate prevention, persistence reload, existing-user upgrade, visible storage failure/retry and hydration race.`);
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>{Module._load=original});
