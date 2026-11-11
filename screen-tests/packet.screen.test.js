// Active lesson UI integration coverage is in approved-lesson.screen.test.js.
// Retain unchanged exam evidence and authored-content invariants here.
import React from 'react';
import { act, fireEvent, renderAsync as render, screen, cleanup } from '@testing-library/react-native';
import { b1Packet, packetFlow, packetTaskIds } from '../src/data/b1Course';
import { assessPacketAnswer, normalizePacketAnswer } from '../src/utils/packetAnswer';
import { useUserStore } from '../src/store/userStore';
import * as Speech from 'expo-speech';
import { Alert } from 'react-native';
let mockVoice;
let mockCloudAvailable = false;
const mockRecognizeRecording = jest.fn();
jest.mock('../src/utils/cloudSpeech', () => ({ speechProxyEndpoint: () => mockCloudAvailable ? 'https://speech.example.test/v1/speech/transcribe' : null, recognizeRecording: (...args) => mockRecognizeRecording(...args) }));
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
 mockCloudAvailable = false; mockRecognizeRecording.mockReset();
 useUserStore.setState({ hydrated: true, xp: 0, hearts: 5, attempts: {}, receipts: {}, rewards: {}, completedLessons: [], lessonProgress: [], placementResults: [], lastQualifiedDay: null, streak: 0, streakStart: null });
});
afterEach(() => { cleanup(); jest.useRealTimers(); });
const press = async text => { if(text === 'Davam et') await act(async () => jest.advanceTimersByTime(700)); await act(async () => fireEvent.press(screen.getByText(text, { exact: true }))); };
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
