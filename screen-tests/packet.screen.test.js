import React from 'react';
import { act, fireEvent, render, screen, cleanup } from '@testing-library/react-native';
import PacketLesson from '../src/components/lesson/PacketLesson';
import { b1Packet, packetFlow, packetTaskIds } from '../src/data/b1Course';
import { assessPacketAnswer, normalizePacketAnswer } from '../src/utils/packetAnswer';
import { useUserStore } from '../src/store/userStore';
import * as Speech from 'expo-speech';
let mockVoice;
const mockRouter = { replace: jest.fn() };
jest.mock('expo-router', () => ({ Stack: { Screen: () => null }, useRouter: () => mockRouter,
  useFocusEffect: callback => require('react').useEffect(callback, [callback]) }));
jest.mock('expo-speech', () => ({ stop: jest.fn(async () => {}), speak: jest.fn() }));
jest.mock('@react-native-async-storage/async-storage', () => ({ getItem: jest.fn(async () => null), setItem: jest.fn(async () => {}) }));
jest.mock('react-native-safe-area-context', () => ({ useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }) }));
jest.mock('../src/hooks/useLessonSpeed', () => ({ useLessonSpeed: () => require('react').useState(1) }));
jest.mock('../src/hooks/useReducedMotion', () => ({ useReducedMotion: () => true }));
jest.mock('expo-haptics', () => ({ impactAsync: jest.fn(async () => {}), ImpactFeedbackStyle: { Light: 'light' } }));
jest.mock('../src/store/vocabularyStore', () => ({ useVocabularyStore: { getState: () => ({ addLessonWords: jest.fn() }) } }));
jest.mock('../src/components/EarnedXP', () => () => null);
jest.mock('../src/components/lesson/LessonSurface', () => {
 const { View, Text, Pressable } = require('react-native');
 return { ink: { bg: '#000', text: '#fff', muted: '#aaa', orange: '#fa0', mint: '#0fa', violet: '#a0f', border: '#555', card: '#111' },
  Surface: ({ children }) => <View>{children}</View>, ClassroomScene: () => null, LessonIcon: () => null, SelectionMark: () => null, LessonEnergy: () => null,
  LessonButton: ({ label, onPress, disabled }) => <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress}><Text>{label}</Text></Pressable> };
});
jest.mock('../src/components/lesson/ReusableLessonScene', () => () => null);
jest.mock('../src/components/lesson/ListeningScene', () => () => null);
jest.mock('../src/components/lesson/LessonWelcome', () => () => null);
jest.mock('../src/components/lesson/LessonVoiceInput', () => props => { mockVoice = props; return null; });
beforeEach(() => {
 jest.useFakeTimers();
 mockVoice = undefined; mockRouter.replace.mockClear(); Speech.speak.mockClear();
 useUserStore.setState({ hydrated: true, xp: 0, hearts: 5, attempts: {}, receipts: {}, rewards: {}, completedLessons: [], lessonProgress: [], placementResults: [], lastQualifiedDay: null, streak: 0, streakStart: null });
});
afterEach(() => { cleanup(); jest.useRealTimers(); });
const press = async text => { if(text === 'Davam et') await act(async () => jest.advanceTimersByTime(700)); await act(async () => fireEvent.press(screen.getByText(text, { exact: true }))); };
const back = async () => act(async () => { fireEvent.press(screen.getByLabelText('Dərsdən geri çıx')); });
async function start(packet) { await render(<PacketLesson packet={packet} />); await press('Dərsə başla'); }
async function listen() {
 await act(async () => fireEvent.press(screen.getByLabelText('Səsi dinlə')));
 const options = Speech.speak.mock.calls.at(-1)[1];
 await act(async () => options.onDone()); return options;
}
async function answerCard(card, options = {}) {
 const turn = card.turns?.[0], rule = turn?.rule || card.rule;
 if (turn?.audio || card.audio) {
  if (options.technical) await press('Səsi başa düşmürəm'); else await listen();
 }
 if (card.kind === 'voice') {
  expect(mockVoice).toBeDefined();
  let returned;
  await act(async () => { returned = mockVoice.onFinal({ text: rule.answers[0], edited: false, token: `speech:${card.id}`, uri: 'voice://test', duration: 2 }); });
  expect(returned).toBeNull();
 } else {
  if (card.options) await press(rule.answers[0]);
  else if (card.words) {
   let remaining = [...card.words];
   // Canonical build answers use the supplied tokens in this authored order.
   let sentence = rule.answers[0];
   while (remaining.length) {
    const word = remaining.find(w => normalizePacketAnswer(sentence).startsWith(normalizePacketAnswer(w)));
    expect(word).toBeDefined(); await press(word);
    const at = sentence.toLowerCase().indexOf(word.toLowerCase());
    sentence = sentence.slice(at + word.length).trim(); remaining.splice(remaining.indexOf(word), 1);
   }
  } else await act(async () => fireEvent.changeText(screen.getByLabelText('Cavabını ingiliscə yaz'), rule.answers[0]));
  await press('Yoxla');
 }
 expect(screen.getByText('Düzdür!', { exact: true })).toBeOnTheScreen();
 await press('Davam et');
}
async function walk(packet, { skipFirst = false, technical = false } = {}) {
 let skipped;
 for (const card of packetFlow(packet).filter(c => !['intro','review','result'].includes(c.kind))) {
  if (card.kind === 'teach') await press('Davam et');
  else if (skipFirst && card.kind === 'task' && !card.audio && !card.words && card.rule?.goals && !skipped) { skipped = card; await act(async()=>fireEvent.press(screen.getByLabelText('Kömək göstər'))); await press('Sonra qayıt'); }
  else if (card.kind === 'voice' && packet.order < 7) { await back(); expect(mockRouter.replace).not.toHaveBeenCalled(); }
  else await answerCard(card, { technical });
 }
 return skipped;
}
test.each(b1Packet.map(p => [p.order, p]))('lesson %s: every current card completes; optional voice back preserves answers', async (_, packet) => {
 await start(packet); await walk(packet);
 expect(screen.queryByText('Dərs hələ tamamlanmayıb', { exact: true })).not.toBeOnTheScreen();
 await press('Nəticəni saxla');
 expect(useUserStore.getState().completedLessons).toContain(packet.id);
 const evidence = useUserStore.getState().lessonProgress[0].evidence;
 if (packet.order < 7) expect(evidence.spoken).toBe(0); else { expect(evidence.spoken).toBeGreaterThan(0); expect(Speech.speak.mock.calls.some(([text, opts]) => text === 'How are you?' && opts.rate === .45)).toBe(true); }
 const xp = useUserStore.getState().xp; await press('Bölməyə qayıt'); expect(useUserStore.getState().xp).toBe(xp);
});
test('skipped required answer retries alone and previously correct answers survive', async () => {
 const packet = b1Packet[0]; await start(packet); const skipped = await walk(packet, { skipFirst: true });
 expect(screen.getByText('Dərs hələ tamamlanmayıb', { exact: true })).toBeOnTheScreen();
 const attemptId = Object.keys(useUserStore.getState().attempts)[0];
 const before = Object.keys(useUserStore.getState().attempts[attemptId].tasks).filter(id => useUserStore.getState().attempts[attemptId].tasks[id].resolved);
 await press('Qalan tapşırıqları tamamla'); await answerCard(skipped.review);
 await press('Nəticəni saxla');
 expect(useUserStore.getState().completedLessons).toContain(packet.id);
 before.forEach(id => expect(useUserStore.getState().attempts[attemptId].tasks[id].resolved).toBe(true));
 expect(useUserStore.getState().attempts[attemptId].tasks[skipped.id].skipped).toBe(false);
});
test.each(['onError','timeout','silent'])('%s: technical text unlocks a listening task and never counts as listening', async mode => {
 if (mode === 'timeout') jest.useFakeTimers();
 await start(b1Packet[0]); await press('Davam et');
 expect(screen.getByText('Salam!', { exact: true })).toBeDisabled();
 await act(async () => fireEvent.press(screen.getByLabelText('Səsi dinlə')));
 const options = Speech.speak.mock.calls.at(-1)[1];
 if (mode === 'silent') { await act(async () => options.onDone()); await press('Səsi başa düşmürəm'); }
 else if (mode === 'timeout') await act(async () => jest.advanceTimersByTime(60001));
 else await act(async () => options.onError(new Error('no engine')));
 expect(screen.getByText('Salam!', { exact: true })).toBeEnabled();
 await press('Salam!'); await press('Yoxla'); await press('Davam et');
 const task = Object.values(Object.values(useUserStore.getState().attempts)[0].tasks)[0];
 expect(task.evidence).toMatchObject(mode === 'silent' ? { technicalText: false, transcriptShown: true, listening: false } : { technicalText: true, listening: false });
 // A late callback from the prior card cannot unlock the next dictation.
 await act(async () => options.onDone());
 expect(screen.getByLabelText('Cavabını ingiliscə yaz')).toBeDisabled();
});
test('lesson 7: text prompt unlocks microphone; edited text cannot satisfy required speech; back asks before exit', async () => {
 await start(b1Packet[6]); await press('Səsi başa düşmürəm');
 const attempt = Object.values(useUserStore.getState().attempts)[0];
 let message;
 await act(async () => { message = mockVoice.onFinal({ text: 'Hello', edited: true, token: 'edited' }); });
 expect(message).toMatch(/yenidən səslə/); expect(useUserStore.getState().attempts[attempt.id].tasks).toEqual({});
 await act(async () => mockVoice.onFinal({ text: 'Hello', edited: false, token: 'actual' }));
 expect(useUserStore.getState().attempts[attempt.id].tasks[attempt.expected[0]].evidence).toMatchObject({ input: 'spoken', technicalText: false, transcriptShown: true, listening: false });
 await press('Davam et'); await press('Davam et'); await back();
 expect(screen.getByText('Dərsdən çıxmaq istəyirsən?', { exact: true })).toBeOnTheScreen();
 expect(mockRouter.replace).not.toHaveBeenCalled();
});
async function reach(packet, number) {
 await start(packet);
 for (const card of packetFlow(packet).filter(c => !['intro','review','result'].includes(c.kind))) {
  if (card.number === number) return card;
  if (card.kind === 'teach') await press('Davam et');
  else if (card.kind === 'voice') await back();
  else await answerCard(card);
 }
}
test('analysis: a nonsensical written correction shows wrong feedback and stays on the current card', async () => {
 await reach(b1Packet[1], 11);
 const before = screen.getByRole('progressbar').props.accessibilityValue.now;
 await act(async () => fireEvent.changeText(screen.getByLabelText('Cavabını ingiliscə yaz'), 'hjj'));
 await press('Yoxla');
 expect(screen.getByText('Bu dəfə alınmadı', {exact:true})).toBeOnTheScreen();
 expect(screen.getByRole('progressbar').props.accessibilityValue.now).toBe(before);
});
test('analysis: a partial compound answer shows partial feedback and stays on the current card', async () => {
 await reach(b1Packet[1], 15);
 const before = screen.getByRole('progressbar').props.accessibilityValue.now;
 await act(async () => fireEvent.changeText(screen.getByLabelText('Cavabını ingiliscə yaz'), 'Hello'));
 await press('Yoxla');
 expect(screen.getByText('Cavabın bir hissəsi düzdür', {exact:true})).toBeOnTheScreen();
 expect(screen.getByRole('progressbar').props.accessibilityValue.now).toBe(before);
});
test('regression: the same primary button ignores a second rapid tap', async () => {
 await start(b1Packet[0]); await press('Davam et'); await listen(); await press('Salam!');
 const before = screen.getByRole('progressbar').props.accessibilityValue.now;
 const button = screen.getByRole('button', {name:'Yoxla'});
 await act(async () => fireEvent.press(button));
 expect(screen.getByText('Düzdür!', {exact:true})).toBeOnTheScreen();
 await act(async () => fireEvent.press(button));
 expect(screen.getByRole('progressbar').props.accessibilityValue.now).toBe(before);
});
test('wrong listening retry is locked, can continue, and never exposes the previous-answer block', async () => {
 const packet=b1Packet[0];
 await start(packet); await press('Davam et'); await listen(); await press('Sağ ol!'); await press('Yoxla'); await press('Davam et');
 for(const card of packetFlow(packet).slice(packetFlow(packet).findIndex(c=>c.number===3)+1).filter(c=>true&&!['review','result'].includes(c.kind))){
  if(card.kind==='teach')await press('Davam et');
  else if(card.kind==='voice')await back();
  else await answerCard(card);
 }
 expect(screen.getByText('Etdiyin səhvlərin təkrarı',{exact:true})).toBeOnTheScreen();
 await press('Davam et');
 expect(screen.getByText('BİR DƏ MƏŞQ ET',{exact:true})).toBeOnTheScreen();
 expect(screen.queryByText('ƏVVƏLKİ TAPŞIRIQ')).not.toBeOnTheScreen();
 expect(screen.queryByText(/Əvvəlki cavabın izahı/)).not.toBeOnTheScreen();
 await listen(); await press('Sağ ol!'); await press('Yoxla');
 expect(screen.getByText('Bu dəfə alınmadı',{exact:true})).toBeOnTheScreen();
 expect(screen.getByRole('radio',{name:'Salam!'})).toBeDisabled();
 await press('Salam!');
 expect(screen.getByRole('radio',{name:'Sağ ol!'})).toBeSelected();
 await press('Davam et'); await press('Nəticəni saxla');
 const progress=useUserStore.getState().lessonProgress[0];
 expect(progress.practiceNeeds).toContain(packet.cards.find(c=>c.number===3).id);
 expect(progress.completed).toBe(true);
});

async function wrongCard(card) {
 if(card.audio || card.turns?.[0]?.audio) await listen();
 if(card.kind==='voice') {
  let response;
  await act(async()=>{ response=mockVoice.onFinal({text:'Hello. Bye.',edited:false,token:`wrong:${card.id}:${Date.now()}`}); });
  expect(response).toBeNull();
 } else {
  if(card.options) await press(card.options.find(a=>!card.rule.answers.some(b=>normalizePacketAnswer(a)===normalizePacketAnswer(b))));
  else if(card.words) await press(card.words[0]);
  else await act(async()=>fireEvent.changeText(screen.getByLabelText('Cavabını ingiliscə yaz'),'bsbsj'));
  await press('Yoxla');
 }
 expect(screen.getByText('Davam et',{exact:true})).toBeOnTheScreen();
 if(card.kind==='voice') expect(screen.queryByText('Göndər',{exact:true})).not.toBeOnTheScreen();
 else if(card.options) card.options.forEach(a=>expect(screen.getByRole('radio',{name:a})).toBeDisabled());
 else if(!card.words) expect(screen.getByLabelText('Cavabını ingiliscə yaz')).toBeDisabled();
 await press('Davam et');
}

test.each(b1Packet.map(p=>[p.order,p]))('lesson %s: every wrong type reaches a bounded retry, with no invented success',async(_,packet)=>{
 await start(packet);
 const tasks=[];
 for(const card of packetFlow(packet).filter(c=>!['intro','review','result'].includes(c.kind))) {
  if(card.kind==='teach') await press('Davam et');
  else { tasks.push(card); await wrongCard(card); }
 }
 expect(screen.getByText('Etdiyin səhvlərin təkrarı',{exact:true})).toBeOnTheScreen();
 await press('Davam et');
 for(const card of tasks) {
  expect(screen.getByText('BİR DƏ MƏŞQ ET',{exact:true})).toBeOnTheScreen();
  await wrongCard(card.review || card);
 }
 expect(screen.queryByText('BİR DƏ MƏŞQ ET',{exact:true})).not.toBeOnTheScreen();
 await press('Nəticəni saxla');
 const progress=useUserStore.getState().lessonProgress[0];
 expect(progress.completed).toBe(true);expect(progress.correctCount).toBe(0);
 expect(progress.evidence.spoken).toBe(0);expect(progress.evidence.written).toBe(0);
 expect(progress.practiceNeeds.length).toBe(tasks.length);
});

test('unknown speech can explicitly continue unverified and never queues a mistake',async()=>{
 const packet=b1Packet[0]; const card=await reach(packet,6); await listen();
 let response;
 await act(async()=>{response=mockVoice.onFinal({text:'heah',edited:false,token:'unknown'});});
 expect(response).toMatch(/tanınmadı/);
 expect(screen.queryByText('Bu dəfə alınmadı',{exact:true})).not.toBeOnTheScreen();
 await press('Yoxlanmadı ilə davam et');
 for(const next of packetFlow(packet).slice(packetFlow(packet).findIndex(c=>c.number===6)+1).filter(c=>true&&!['review','result'].includes(c.kind))) {
  if(next.kind==='teach')await press('Davam et');else if(next.kind==='voice')await back();else await answerCard(next);
 }
 expect(screen.queryByText('BİR DƏ MƏŞQ ET',{exact:true})).not.toBeOnTheScreen();
 await press('Nəticəni saxla');
 expect(useUserStore.getState().completedLessons).toContain(packet.id);
 expect(useUserStore.getState().lessonProgress[0].practiceNeeds).toEqual([]);
});

test('same-lesson correction is assisted; a later model-free recheck records independent evidence separately',async()=>{
 const packet=b1Packet[0];await start(packet);await press('Davam et');await listen();await press('Sağ ol!');await press('Yoxla');await press('Davam et');
 for(const card of packetFlow(packet).slice(packetFlow(packet).findIndex(c=>c.number===3)+1).filter(c=>true&&!['review','result'].includes(c.kind))) {
  if(card.kind==='teach')await press('Davam et');else if(card.kind==='voice')await back();else await answerCard(card);
 }
 const original=packet.cards.find(c=>c.number===3);
 expect(screen.getByText('Etdiyin səhvlərin təkrarı',{exact:true})).toBeOnTheScreen();
 await press('Davam et');
 await answerCard(original.review);await press('Nəticəni saxla');
 expect(useUserStore.getState().lessonProgress[0].practiceNeeds).toContain(original.id);
 await cleanup();
 const next=b1Packet[1];await start(next);
 const {lessonRecall,withLessonRecall}=require('../src/utils/lessonReview');
 const recall=lessonRecall(next,b1Packet,useUserStore.getState().lessonProgress);
 expect(recall).toBeDefined();
 const flow=withLessonRecall(packetFlow(next).filter(c=>c.kind!=='review'),recall);
 expect(flow.indexOf(recall)).toBeGreaterThan(3);
 for(const card of flow.filter(c=>!['intro','review','result'].includes(c.kind))) {
  if(card.kind==='teach')await press('Davam et');else if(card.kind==='voice')await back();else await answerCard(card);
 }
 await press('Nəticəni saxla');
 const progress=useUserStore.getState().lessonProgress.find(p=>p.lessonId===next.id);
 expect(progress.rechecks).toContainEqual({sourceLessonId:packet.id,taskId:original.id,status:'independent'});
});

jest.mock('../src/components/RecognizedVoiceComposer', () => () => null);
jest.mock('../src/components/lesson/LessonArtwork3D', () => () => null);
test('regression: exam audio error opens an explicitly labeled text prompt', async () => {
 const PacketExam=require('../src/components/lesson/PacketExam').default;
 await render(<PacketExam/>);await press('Başla');
 expect(screen.getByText('Əvvəl səsi dinlə.',{exact:true})).toBeOnTheScreen();
 await press('▶ Dinlə');const opts=Speech.speak.mock.calls.at(-1)[1];
 await act(async()=>opts.onError(new Error('audio unavailable')));
 expect(screen.queryByText('Əvvəl səsi dinlə.',{exact:true})).not.toBeOnTheScreen();
 expect(screen.getByText('TEXNİKİ SƏBƏBDƏN MƏTNLƏ',{exact:true})).toBeOnTheScreen();
 expect(screen.queryByText('Yazılı davam et',{exact:true})).not.toBeOnTheScreen();
 expect(screen.getByText('Keç · yoxlanmadı',{exact:true})).toBeOnTheScreen();
});
test.each(['native','technical','edited'])('full exam: %s evidence controls the pass and XP', async mode => {
 const PacketExam=require('../src/components/lesson/PacketExam').default;
 const exam=require('../src/data/b1Exam').b1Exams[0];
 await render(<PacketExam/>);await press('Başla');
 for(const card of exam.cards){
  if(card.audio){
   if(mode==='technical')await press('Səs eşidilmir · mətnlə davam et');
   else{await press('▶ Dinlə');await act(async()=>Speech.speak.mock.calls.at(-1)[1].onDone());}
  }
  if(card.kind==='voice')await act(async()=>mockVoice.onFinal({text:card.rule.answers[0],token:`exam:${card.id}`,edited:mode==='edited'}));
  else{
   if(card.options)await press(card.rule.answers[0]);
   else if(card.words){
    let remaining=[...card.words],sentence=card.rule.answers[0];
    while(remaining.length){
     const word=remaining.find(w=>normalizePacketAnswer(sentence).startsWith(normalizePacketAnswer(w)));
     expect(word).toBeDefined();await press(word);
     const at=sentence.toLowerCase().indexOf(word.toLowerCase());sentence=sentence.slice(at+word.length).trim();remaining.splice(remaining.indexOf(word),1);
    }
   }else await act(async()=>fireEvent.changeText(screen.getByLabelText('Cavabın'),card.rule.answers[0]));
   await press('Yoxla və davam et');
  }
 }
 const result=useUserStore.getState().placementResults[0];
 expect(result.correctCount).toBe(17);
 expect(result.passed).toBe(mode==='native');
 expect(useUserStore.getState().xp).toBe(mode==='native'?50:0);
 if(mode==='native')expect(screen.getByText('Bölmə üzrə keçid',{exact:true})).toBeOnTheScreen();
 else{expect(screen.getByText('Keçid üçün yoxlama tamamlanmayıb',{exact:true})).toBeOnTheScreen();expect(result.evidence.pendingRequiredIds.length).toBeGreaterThan(0);}
});


test('accepted one-letter typo never creates a mistake retry',async()=>{
 const packet=b1Packet[0];await reach(packet,5);
 await act(async()=>fireEvent.changeText(screen.getByLabelText('Cavabını ingiliscə yaz'),'hellp'));
 await press('Yoxla');expect(screen.getByText('Cavab qəbul olundu',{exact:true})).toBeOnTheScreen();expect(screen.getByText('Kiçik yazı düzəlişi')).toBeOnTheScreen();expect(screen.getByText('hellp',{exact:true})).toBeOnTheScreen();expect(screen.getByText('hello',{exact:true})).toBeOnTheScreen();await press('Davam et');
 for(const c of packetFlow(packet).slice(packetFlow(packet).findIndex(c=>c.number===5)+1).filter(c=>true&&!['review','result'].includes(c.kind))){
  if(c.kind==='teach')await press('Davam et');else if(c.kind==='voice')await back();else await answerCard(c);
 }
 expect(screen.queryByText('BİR DƏ MƏŞQ ET',{exact:true})).not.toBeOnTheScreen();
});
test('edited text cannot be used as a speaking verdict in an optional voice card',async()=>{
 await reach(b1Packet[0],6);await listen();let message;
 await act(async()=>{message=mockVoice.onFinal({text:'heah',edited:true,token:'typed-heah'});});
 expect(message).toMatch(/yenidən səslə/);
 expect(screen.queryByText('Bu dəfə alınmadı',{exact:true})).not.toBeOnTheScreen();
});
test('audio technical text never queues a listening mistake for a bad text practice answer',async()=>{
 await start(b1Packet[0]);await press('Davam et');await press('Səsi başa düşmürəm');
 await press('Sağ ol!');await press('Yoxla');
 expect(screen.queryByText('Bu dəfə alınmadı',{exact:true})).not.toBeOnTheScreen();
 await press('Yoxlanmadı ilə davam et');
 const attempt=Object.values(useUserStore.getState().attempts)[0];
 expect(attempt.tasks[b1Packet[0].cards.find(c=>c.number===3).id].settled).toBe('unverified');
});
test('all authored retries preserve listening, response format, and every compound speech goal',()=>{
 for(const packet of b1Packet)for(const c of packetFlow(packet).filter(c=>['task','voice'].includes(c.kind))){
  const r=c.review;expect(r).toBeDefined();
  for(const key of ['audio','options','words'])expect(Boolean(r[key])).toBe(Boolean(c[key]));
  const goals=c.turns?.[0]?.rule.goals || c.rule?.goals;
  if(goals)expect(r.turns?.[0]?.rule.goals || r.rule?.goals).toEqual(goals);
 }
});

test('farewell writing is not asked twice and the correction is framed around the pictured humans',()=>{
 const flow=packetFlow(b1Packet[0]);
 expect(flow.filter(c=>c.kind==='task' && c.rule?.goals?.includes('farewell'))).toHaveLength(1);
 const correction=flow.find(c=>c.number===9);
 expect(correction.body).toContain('Əli');expect(correction.body).toContain('Leyla');
 expect(correction.body).not.toMatch(/Lövhədə|BirFox/);
});
test('wrong explanation is plain, expandable, and has no repeated abstract reason/rule labels',async()=>{
 await reach(b1Packet[0],9);
 await act(async()=>fireEvent.changeText(screen.getByLabelText('Cavabını ingiliscə yaz'),'ghjp'));
 await press('Yoxla');
 expect(screen.getByText('Burada sağollaşmaq lazımdır. Goodbye! və ya Bye! yaza bilərsən.')).toBeOnTheScreen();
 await press('Cavabın izahı ›');
 expect(screen.getByText('Sənin cavabın: ghjp')).toBeOnTheScreen();
 expect(screen.queryByText(/^Səbəb:/)).not.toBeOnTheScreen();
 expect(screen.queryByText(/^Qısa qayda:/)).not.toBeOnTheScreen();
 expect(screen.queryByText(/tapşırığın hədəfi/)).not.toBeOnTheScreen();
 expect(screen.queryByText(/^\d+\/\d+$/)).not.toBeOnTheScreen();
 expect(screen.getByRole('progressbar')).toBeOnTheScreen();
});
test('older successful skills return later while recent independent rechecks are spaced out',()=>{
 const {lessonRecall}=require('../src/utils/lessonReview');
 const source=b1Packet[0],task=packetFlow(source).find(c=>c.kind==='task');
 const progress=[{lessonId:source.id,completed:true,practiceNeeds:[]}];
 expect(lessonRecall(b1Packet[1],b1Packet,progress)).toBeUndefined();
 expect(lessonRecall(b1Packet[3],b1Packet,progress)).toBeDefined();
 const failed=[{lessonId:source.id,completed:true,practiceNeeds:[task.id]}];
 expect(lessonRecall(b1Packet[1],b1Packet,failed)?.id).toContain(task.id);
 const checked=[...failed,{lessonId:b1Packet[1].id,completed:true,rechecks:[{sourceLessonId:source.id,taskId:task.id,status:'independent'}]}];
 expect(lessonRecall(b1Packet[2],b1Packet,checked)).toBeUndefined();
});

test('transcript help shows only exact audio and stays outside listening evidence even after replay',async()=>{
 await start(b1Packet[0]);await press('Davam et');await press('Səsi başa düşmürəm');
 expect(screen.getByText(b1Packet[0].cards.find(c=>c.number===3).audio,{exact:true})).toBeOnTheScreen();
 expect(screen.queryByText('TEXNİKİ SƏBƏBDƏN MƏTNLƏ',{exact:true})).not.toBeOnTheScreen();
 expect(screen.queryByText(/Texniki səbəbdən mətnlə davam/)).not.toBeOnTheScreen();
 await listen();await press('Salam!');await press('Yoxla');
 const task=Object.values(Object.values(useUserStore.getState().attempts)[0].tasks)[0];
 expect(task.evidence).toMatchObject({transcriptShown:true,technicalText:false,listening:false,assisted:true});
 expect(task.wrong).toBe(0);
});
test('a wrong response after transcript help can continue unverified without a mistake or heart loss',async()=>{
 await start(b1Packet[0]);await press('Davam et');await press('Səsi başa düşmürəm');
 const hearts=useUserStore.getState().hearts;
 await press('Sağ ol!');await press('Yoxla');
 expect(screen.queryByText('Bu dəfə alınmadı',{exact:true})).not.toBeOnTheScreen();
 await press('Yoxlanmadı ilə davam et');
 const task=Object.values(Object.values(useUserStore.getState().attempts)[0].tasks)[0];
 expect(task.settled).toBe('unverified');expect(task.wrong).toBe(0);expect(useUserStore.getState().hearts).toBe(hearts);
});
test('explanation opens in a separate card without unlocking the answer',async()=>{
 await start(b1Packet[0]);await press('Davam et');await listen();await press('Sağ ol!');await press('Yoxla');
 await press('Cavabın izahı ›');expect(screen.getByText('Sənin cavabın: Sağ ol!',{exact:true})).toBeOnTheScreen();
 await act(async()=>fireEvent.press(screen.getByLabelText('İzahı bağla')));
 expect(screen.queryByText('Sənin cavabın: Sağ ol!',{exact:true})).not.toBeOnTheScreen();
 expect(screen.getByText('Sağ ol!',{exact:true})).toBeDisabled();
});

test('correct answer explanation opens authored vocabulary without changing assessment evidence',async()=>{
 await start(b1Packet[0]); await press('Davam et'); await listen(); await press('Salam!'); await press('Yoxla');
 const attempt=Object.values(useUserStore.getState().attempts)[0];
 const evidence=JSON.stringify(attempt.tasks);
 await press('Cavabın izahı ›');
 expect(screen.getByText('Cavabın izahı',{exact:true})).toBeOnTheScreen();
 await press('Hello');
 expect(screen.getByText('Hello — Salam',{exact:true})).toBeOnTheScreen();
 expect(screen.getByText('Hello, Leyla! — Salam, Leyla!',{exact:true})).toBeOnTheScreen();
 await press('Başa düşdüm');
 expect(JSON.stringify(useUserStore.getState().attempts[attempt.id].tasks)).toBe(evidence);
});

test('finishing with transcript help preserves completion and records no listening success or perfect reward',async()=>{
 const packet=b1Packet[0];await start(packet);await walk(packet,{technical:true});await press('Nəticəni saxla');
 const state=useUserStore.getState(),progress=state.lessonProgress[0];
 expect(state.completedLessons).toContain(packet.id);
 expect(progress.evidence.textHelp).toBeGreaterThan(0);expect(progress.evidence.technicalText).toBe(0);
 expect(progress.evidence.listeningIndependent).toBe(0);expect(progress.evidence.listeningAssisted).toBe(0);
 expect(state.rewards[`perfect:${packet.id}`]).toBeUndefined();
});

test('transcript can hide by touching its text and reopen without restoring listening credit',async()=>{
 await start(b1Packet[0]);await press('Davam et');await press('Səsi başa düşmürəm');
 await act(async()=>fireEvent.press(screen.getByLabelText('Audioda deyilən mətn')));
 expect(screen.queryByLabelText('Audioda deyilən mətn')).not.toBeOnTheScreen();
 await press('Mətni göstər');expect(screen.getByLabelText('Audioda deyilən mətn')).toBeOnTheScreen();
 await press('Mətni gizlət');expect(screen.queryByLabelText('Audioda deyilən mətn')).not.toBeOnTheScreen();
 await listen();await press('Salam!');await press('Yoxla');
 const task=Object.values(Object.values(useUserStore.getState().attempts)[0].tasks)[0];
 expect(task.evidence).toMatchObject({transcriptShown:true,listening:false});
});
test('opening a voice answer uses the compact mode and closing it preserves the written answer',async()=>{
 await reach(b1Packet[0],5);
 await act(async()=>fireEvent.changeText(screen.getByLabelText('Cavabını ingiliscə yaz'),'Hello'));
 const before=screen.getByRole('progressbar').props.accessibilityValue.now;
 const scroll=screen.getByTestId('packet-lesson-scroll');
 const originalStyle=scroll.props.contentContainerStyle;
 await act(async()=>fireEvent.press(screen.getByLabelText('Cavabını mikrofonla de')));
 expect(mockVoice.compact).toBe(true);expect(typeof mockVoice.onClose).toBe('function');
 await act(async()=>mockVoice.onBusyChange(true));expect(screen.getByText('Yoxla',{exact:true})).toBeDisabled();
 await act(async()=>mockVoice.onBusyChange(false));
 await act(async()=>{await fireEvent(screen.getByTestId('packet-lesson-scroll'),'layout',{nativeEvent:{layout:{height:600,width:390}}});});
 await act(async()=>{await fireEvent(screen.getByTestId('packet-lesson-scroll'),'contentSizeChange',350,590);});
 expect(screen.getByTestId('packet-lesson-scroll').props.scrollEnabled).toBe(false);
 await act(async()=>mockVoice.onClose());
 expect(screen.getByLabelText('Cavabını ingiliscə yaz').props.value).toBe('Hello');
 expect(screen.getByTestId('packet-lesson-scroll').props.contentContainerStyle).toEqual(originalStyle);
 expect(screen.getByTestId('packet-lesson-scroll').props.scrollEnabled).toBe(true);
 expect(screen.getByRole('progressbar').props.accessibilityValue.now).toBe(before);
 expect(screen.queryByText('Ardını göstər ›',{exact:true})).not.toBeOnTheScreen();
});
test('explanation modal leaves background layout and answer evidence unchanged through repeated open and close',async()=>{
 await start(b1Packet[0]);await press('Davam et');await listen();await press('Sağ ol!');await press('Yoxla');
 const attempt=Object.values(useUserStore.getState().attempts)[0];
 const evidence=JSON.stringify(attempt.tasks),style=screen.getByTestId('packet-lesson-scroll').props.contentContainerStyle;
 for(let i=0;i<2;i++){
  await press('Cavabın izahı ›');expect(screen.getByText('Sənin cavabın: Sağ ol!',{exact:true})).toBeOnTheScreen();
  if(i===0)await press('Başa düşdüm');else await act(async()=>fireEvent.press(screen.getByLabelText('İzahı bağla')));
  expect(screen.queryByText('Sənin cavabın: Sağ ol!',{exact:true})).not.toBeOnTheScreen();
  expect(screen.getByTestId('packet-lesson-scroll').props.contentContainerStyle).toEqual(style);
  expect(JSON.stringify(useUserStore.getState().attempts[attempt.id].tasks)).toBe(evidence);
 }
});

test('an automatically delivered untranscribed recording stays unverified and never auto-advances',async()=>{
 await reach(b1Packet[0],6);await listen();
 const before=screen.getByRole('progressbar').props.accessibilityValue.now;
 const hearts=useUserStore.getState().hearts;
 await act(async()=>mockVoice.onUnverifiedRecording({uri:'file://raw.m4a',duration:2,token:'raw:1'}));
 expect(screen.getByRole('progressbar').props.accessibilityValue.now).toBe(before);
 expect(screen.queryByText('Düzdür!',{exact:true})).not.toBeOnTheScreen();expect(screen.queryByText('Bu dəfə alınmadı',{exact:true})).not.toBeOnTheScreen();
 await press('Yoxlanmadı ilə davam et');
 const task=Object.values(useUserStore.getState().attempts)[0].tasks[packetFlow(b1Packet[0]).find(c=>c.number===6).id];
 expect(task.settled).toBe('unverified');expect(task.resolved).toBe(false);expect(task.wrong).toBe(0);expect(useUserStore.getState().hearts).toBe(hearts);
});
