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
  if (options.technical) await press('Səs eşidilmir · mətnlə davam et'); else await listen();
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
 if (mode === 'silent') { await act(async () => options.onDone()); await press('Səs eşidilmir · mətnlə davam et'); }
 else if (mode === 'timeout') await act(async () => jest.advanceTimersByTime(60001));
 else await act(async () => options.onError(new Error('no engine')));
 expect(screen.getByText('Salam!', { exact: true })).toBeEnabled();
 await press('Salam!'); await press('Yoxla'); await press('Davam et');
 const task = Object.values(Object.values(useUserStore.getState().attempts)[0].tasks)[0];
 expect(task.evidence).toMatchObject({ technicalText: true, listening: false });
 // A late callback from the prior card cannot unlock the next dictation.
 await act(async () => options.onDone());
 expect(screen.getByLabelText('Cavabını ingiliscə yaz')).toBeDisabled();
});
test('lesson 7: text prompt unlocks microphone; edited text cannot satisfy required speech; back asks before exit', async () => {
 await start(b1Packet[6]); await press('Səs eşidilmir · mətnlə davam et');
 const attempt = Object.values(useUserStore.getState().attempts)[0];
 let message;
 await act(async () => { message = mockVoice.onFinal({ text: 'Hello', edited: true, token: 'edited' }); });
 expect(message).toMatch(/yenidən səslə/); expect(useUserStore.getState().attempts[attempt.id].tasks).toEqual({});
 await act(async () => mockVoice.onFinal({ text: 'Hello', edited: false, token: 'actual' }));
 expect(useUserStore.getState().attempts[attempt.id].tasks[attempt.expected[0]].evidence).toMatchObject({ input: 'spoken', technicalText: true, listening: false });
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
 const before = Number([screen.getByText(/^\d+\/\d+$/).props.children].flat().join('').split('/')[0]);
 await act(async () => fireEvent.changeText(screen.getByLabelText('Cavabını ingiliscə yaz'), 'hjj'));
 await press('Yoxla');
 expect(screen.getByText('Bu dəfə alınmadı', {exact:true})).toBeOnTheScreen();
 expect(Number([screen.getByText(/^\d+\/\d+$/).props.children].flat().join('').split('/')[0])).toBe(before);
});
test('analysis: a partial compound answer shows partial feedback and stays on the current card', async () => {
 await reach(b1Packet[1], 15);
 const before = Number([screen.getByText(/^\d+\/\d+$/).props.children].flat().join('').split('/')[0]);
 await act(async () => fireEvent.changeText(screen.getByLabelText('Cavabını ingiliscə yaz'), 'Hello'));
 await press('Yoxla');
 expect(screen.getByText('Cavabın bir hissəsi düzdür', {exact:true})).toBeOnTheScreen();
 expect(Number([screen.getByText(/^\d+\/\d+$/).props.children].flat().join('').split('/')[0])).toBe(before);
});
test('regression: the same primary button ignores a second rapid tap', async () => {
 await start(b1Packet[0]); await press('Davam et'); await listen(); await press('Salam!');
 const before = Number([screen.getByText(/^\d+\/\d+$/).props.children].flat().join('').split('/')[0]);
 const button = screen.getByRole('button', {name:'Yoxla'});
 await act(async () => fireEvent.press(button));
 expect(screen.getByText('Düzdür!', {exact:true})).toBeOnTheScreen();
 await act(async () => fireEvent.press(button));
 expect(Number([screen.getByText(/^\d+\/\d+$/).props.children].flat().join('').split('/')[0])).toBe(before);
});
test('regression: re-entering the same wrong answer retains feedback', async () => {
 const packet=b1Packet[0];
 await start(packet); await press('Davam et'); await listen(); await press('Sağ ol!'); await press('Yoxla'); await press('Davam et');
 for(const card of packetFlow(packet).filter(c=>c.number>3&&!['review','result'].includes(c.kind))){
  if(card.kind==='teach')await press('Davam et');
  else if(card.kind==='voice')await back();
  else await answerCard(card);
 }
 expect(screen.getByText('BİR DƏ MƏŞQ ET',{exact:true})).toBeOnTheScreen();
 await act(async()=>fireEvent.changeText(screen.getByLabelText('Cavabını ingiliscə yaz'),'hjj'));
 await press('Yoxla');expect(screen.getByText('Bu dəfə alınmadı',{exact:true})).toBeOnTheScreen();
 await act(async()=>fireEvent.changeText(screen.getByLabelText('Cavabını ingiliscə yaz'),'hjjx'));
 await act(async()=>fireEvent.changeText(screen.getByLabelText('Cavabını ingiliscə yaz'),'hjj'));
 await press('Yoxla');expect(screen.getByText('Bu dəfə alınmadı',{exact:true})).toBeOnTheScreen();
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
