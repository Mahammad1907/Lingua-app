import React from 'react';
import { act, cleanup, fireEvent, renderAsync, screen } from '@testing-library/react-native';
import { AppState } from 'react-native';
import * as Speech from 'expo-speech';
import PacketLesson from '../src/components/lesson/PacketLesson';
import HoldVoiceInput from '../src/components/lesson/HoldVoiceInput';
import LessonReportSheet from '../src/components/lesson/LessonReportSheet';
import { b1Packet, packetFlow } from '../src/data/b1Course';
import { useUserStore } from '../src/store/userStore';
import { useVocabularyStore } from '../src/store/vocabularyStore';
const mockDisk = new Map();
let mockWriteFailure = false, mockEngine = null, mockMeter = -20;
const mockRouter = { replace: jest.fn(), back: jest.fn() };
const mockRecorder = { isRecording: false, currentTime: 2, uri: 'file://speech.m4a', getStatus: () => ({ isRecording: mockRecorder.isRecording, metering: mockMeter }), prepareToRecordAsync: jest.fn(async () => {}), record: jest.fn(() => { mockRecorder.isRecording = true; }), stop: jest.fn(async () => { mockRecorder.isRecording = false; }) };
jest.mock('@react-native-async-storage/async-storage', () => ({ getItem: jest.fn(async key => mockDisk.get(key) || null), setItem: jest.fn(async (key, value) => { if (mockWriteFailure) throw Error('full'); mockDisk.set(key, value); }), removeItem: jest.fn(async key => { mockDisk.delete(key); }) }));
jest.mock('expo-router', () => ({ Stack: { Screen: () => null }, useRouter: () => mockRouter, useFocusEffect: callback => require('react').useEffect(callback, [callback]) }));
jest.mock('expo-speech', () => ({ stop: jest.fn(async () => {}), speak: jest.fn() }));
jest.mock('expo-audio', () => ({ AudioModule: { requestRecordingPermissionsAsync: jest.fn(async () => ({ granted: true })) }, RecordingPresets: { HIGH_QUALITY: {} }, setAudioModeAsync: jest.fn(async () => {}), useAudioRecorder: () => mockRecorder, useAudioPlayer: () => ({ pause: jest.fn(), replace: jest.fn() }), useAudioPlayerStatus: () => ({ playing: false }) }));
jest.mock('../src/utils/speechEngine', () => ({ getSpeechEngine: () => mockEngine }));
jest.mock('react-native-safe-area-context', () => ({ useSafeAreaInsets: () => ({ top: 0, bottom: 0 }) }));
jest.mock('../src/hooks/useReducedMotion', () => ({ useReducedMotion: () => true }));
jest.mock('../src/utils/lessonAssets', () => ({ warmLessonArtwork: jest.fn(async () => {}), lessonSceneSources: {}, classroomSource: 1 }));
jest.mock('../src/components/EarnedXP', () => () => null);
const tick = async (ms = 1) => act(async () => { jest.advanceTimersByTime(ms); await Promise.resolve(); });
const press = async text => { await act(async () => fireEvent.press(screen.getAllByText(text, { exact: true }).at(-1))); await tick(); };
const start = async () => { await renderAsync(<PacketLesson packet={b1Packet[0]} />); await tick(); await press('Dərsə başla'); };
const listen = async () => { await act(async () => fireEvent.press(screen.getByLabelText('Səsi dinlə'))); await act(async () => Speech.speak.mock.calls.at(-1)[1].onDone()); };
const checkAnswer = async (card, answer) => {
 if (card.audio || card.turns?.[0]?.audio) await listen();
 if (card.options) await press(answer);
 else await act(async () => fireEvent.changeText(screen.getByLabelText('Cavabını ingiliscə yaz'), answer));
 await press('Yoxla'); await tick(700);
};
beforeEach(() => {
 jest.useFakeTimers(); jest.clearAllMocks(); mockDisk.clear(); mockWriteFailure = false; mockEngine = null; mockMeter = -20; mockRecorder.isRecording = false; AppState.currentState = 'active';
 useUserStore.setState({ hydrated: true, xp: 0, hearts: 5, attempts: {}, receipts: {}, rewards: {}, completedLessons: [], lessonProgress: [], placementResults: [], streak: 0, lastQualifiedDay: null });
 useVocabularyStore.setState({ hydrated: true, storageError: null, allWords: [], pages: [], completedLessons: [], testResults: [], wrongWords: [] });
});
afterEach(() => { cleanup(); jest.useRealTimers(); });
test('first teaching adds Hello/Hi once, before completion; farewell words wait for their teaching card', async () => {
 await start(); expect(useVocabularyStore.getState().allWords.map(w => w.word)).toEqual(['Hello', 'Hi']);
 expect(useUserStore.getState().completedLessons).toEqual([]);
 await act(async () => fireEvent.press(screen.getAllByLabelText('Hello: mənası və nümunəsi')[0]));
 expect(screen.getByText('Neytral salamlaşma.', { exact: true })).toBeOnTheScreen();
 expect(useVocabularyStore.getState().allWords).toHaveLength(2);
});
test('typing has no verdict; a checked mistake returns in its original input modality without a review intro', async () => {
 await start(); await press('Davam et'); const flow = packetFlow(b1Packet[0]).filter(c => c.kind !== 'review');
 const firstTask = flow.find(c => c.kind === 'task');
 await checkAnswer(firstTask, firstTask.options.find(o => o !== firstTask.rule.answers[0]));
 expect(screen.getByText('! Bir daha baxaq', { exact: true })).toBeOnTheScreen();
 await press('Davam et');
 const dictation = flow.find(c => c.kind === 'task' && c.audio && !c.options); await listen();
 await act(async () => fireEvent.changeText(screen.getByLabelText('Cavabını ingiliscə yaz'), 'Bye'));
 expect(screen.queryByText('! Bir daha baxaq', { exact: true })).not.toBeOnTheScreen();
 expect(screen.getByText('Yoxla', { exact: true })).toBeEnabled();
 await act(async () => fireEvent.changeText(screen.getByLabelText('Cavabını ingiliscə yaz'), dictation.rule.answers[0]));
 await press('Yoxla'); await tick(700); await press('Davam et');
 for (const card of flow.slice(flow.indexOf(dictation) + 1)) {
  if (card.kind === 'result') break;
  if (card.kind === 'teach') await press('Davam et');
  else if (card.kind === 'voice') await press('Keç');
  else { await checkAnswer(card, card.rule.answers[0]); await press('Davam et'); }
 }
 expect(screen.getByText('↻ Təkrar', { exact: true })).toBeOnTheScreen();
 expect(screen.queryByText('Etdiyin səhvlərin təkrarı', { exact: true })).not.toBeOnTheScreen();
 await checkAnswer(firstTask.review, firstTask.review.rule.answers[0]); await press('Davam et');
 await press('Nəticəni saxla');
 expect(useUserStore.getState().completedLessons).toContain(b1Packet[0].id);
 expect(mockRouter.replace).not.toHaveBeenCalled();
});
test('text help remains sticky after hiding and never counts as listening or costs a heart', async () => {
 await start(); await press('Davam et'); await press('İpucu'); await press('Mətnlə davam et');
 expect(screen.getByText('Hello!', { exact: true })).toBeOnTheScreen();
 await act(async () => fireEvent.press(screen.getByLabelText('Audioda deyilən mətn')));
 const task = packetFlow(b1Packet[0]).find(c => c.kind === 'task');
 await press(task.rule.answers[0]); await press('Yoxla'); await tick(700);
 const attempt = Object.values(useUserStore.getState().attempts)[0];
 expect(attempt.tasks[task.id].evidence).toMatchObject({ transcriptShown: true, listening: false });
 expect(useUserStore.getState().hearts).toBe(5);
});
test('exit/reopen restores the written answer and sticky transcript evidence', async () => {
 await start(); await press('Davam et'); const first = packetFlow(b1Packet[0]).find(c => c.kind === 'task');
 await checkAnswer(first, first.rule.answers[0]); await press('Davam et');
 await press('İpucu'); await press('Mətnlə davam et');
 await act(async () => fireEvent.changeText(screen.getByLabelText('Cavabını ingiliscə yaz'), 'Hi'));
 await tick(); await act(async () => cleanup());
 useUserStore.setState({ attempts: {} });
 await renderAsync(<PacketLesson packet={b1Packet[0]} />); await tick();
 expect(screen.getByLabelText('Cavabını ingiliscə yaz').props.value).toBe('Hi');
 expect(screen.getByText('Hi!', { exact: true })).toBeOnTheScreen();
 expect(Object.values(useUserStore.getState().attempts)[0].tasks[first.id].resolved).toBe(true);
});
test('report save failure remains retryable; success is explicitly local, not sent', async () => {
 await renderAsync(<LessonReportSheet visible onClose={() => {}} context={{ lessonId: 'l', cardId: 'c' }} />);
 expect(screen.getByText('Hesabatı saxla')).toBeDisabled(); await act(async () => fireEvent.press(screen.getByRole('radio', { name: /Audio/ }))); mockWriteFailure = true; await press('Hesabatı saxla');
 expect(screen.getByText('Hesabat saxlanmadı. Yenidən cəhd et.')).toBeOnTheScreen();
 mockWriteFailure = false; await press('Hesabatı saxla');
 expect(screen.getByText('Hesabat bu cihazda saxlanıldı. Dəstək xidmətinə göndərilməyib.')).toBeOnTheScreen();
});
function engine() { const listeners = new Map(); return { addListener: (name, fn) => { listeners.set(name, fn); return { remove: () => listeners.delete(name) }; }, emit: (name, data) => listeners.get(name)?.(data), abort: jest.fn(), stop: jest.fn(), start: jest.fn(), isRecognitionAvailable: () => true, supportsOnDeviceRecognition: () => true, supportsRecording: () => false, requestMicrophonePermissionsAsync: async () => ({ granted: true }) }; }
test('recognized speech is buffered while held and sent once on release; no replay/send controls', async () => {
 mockEngine = engine(); const final = jest.fn(() => null);
 await renderAsync(<HoldVoiceInput onFinal={final} onUnverifiedRecording={jest.fn()} onBusyChange={() => {}} suspended={false} />);
 const mic = screen.getByLabelText('Basılı saxla və danış'); await act(async () => fireEvent(mic, 'pressIn'));
 await act(async () => { mockEngine.emit('result', { isFinal: true, results: [{ transcript: 'Hello', confidence: .9 }] }); mockEngine.emit('end'); });
 expect(final).not.toHaveBeenCalled();
 await act(async () => fireEvent(mic, 'pressOut')); expect(final).toHaveBeenCalledTimes(1);
 await act(async () => fireEvent(mic, 'pressOut')); expect(final).toHaveBeenCalledTimes(1);
 expect(screen.queryByText('Göndər', { exact: true })).not.toBeOnTheScreen(); expect(screen.queryByText('Yazını dinlə', { exact: true })).not.toBeOnTheScreen();
});
test('raw microphone delivers audible audio as unverified only; silence cannot submit', async () => {
 const recording = jest.fn(), final = jest.fn();
 await renderAsync(<HoldVoiceInput onFinal={final} onUnverifiedRecording={recording} onBusyChange={() => {}} suspended={false} />);
 const mic = screen.getByLabelText('Basılı saxla və danış'); await act(async () => fireEvent(mic, 'pressIn')); await tick(130); await act(async () => fireEvent(mic, 'pressOut'));
 expect(recording).toHaveBeenCalledTimes(1); expect(final).not.toHaveBeenCalled();
 mockMeter = -90; await act(async () => fireEvent(mic, 'pressIn')); await tick(130); await act(async () => fireEvent(mic, 'pressOut'));
 expect(recording).toHaveBeenCalledTimes(1); expect(screen.getByText(/Səs tanınmadı/)).toBeOnTheScreen();
});
test.each(b1Packet.map(packet => [packet.order, packet]))('lesson %s: authored written cards complete with explicit Continue and never start another lesson', async (_, packet) => {
 // Open the target module directly in this boundary test; progression rules are tested separately.
 useUserStore.setState({ completedLessons: b1Packet.filter(p => p.order < packet.order).map(p => p.id) });
 await renderAsync(<PacketLesson packet={packet} />); await tick(); await press('Dərsə başla');
 for (const card of packetFlow(packet).filter(c => c.kind !== 'review' && c.kind !== 'intro' && c.kind !== 'result')) {
  if (card.kind === 'teach') { await press('Davam et'); continue; }
  if (card.kind === 'voice') { await press('Keç'); continue; }
  if (card.words) {
   if (card.audio) await listen();
   let text = card.rule.answers[0]; const remaining = [...card.words];
   while (remaining.length) { const at = remaining.findIndex(word => text.toLowerCase().startsWith(word.toLowerCase())); expect(at).toBeGreaterThanOrEqual(0); const word = remaining.splice(at, 1)[0]; await press(word); text = text.slice(word.length).trim(); }
   await press('Yoxla'); await tick(700);
  } else await checkAnswer(card, card.rule.answers[0]);
  expect(screen.getByText('✓ Düzgündür', { exact: true })).toBeOnTheScreen(); await press('Davam et');
 }
 await press('Nəticəni saxla'); expect(useUserStore.getState().completedLessons).toContain(packet.id);
 expect(mockRouter.replace).not.toHaveBeenCalled();
});
test('release during permission preparation never starts late recording', async () => {
 const audio = require('expo-audio'); let grant;
 audio.AudioModule.requestRecordingPermissionsAsync.mockImplementationOnce(() => new Promise(resolve => { grant = resolve; }));
 await renderAsync(<HoldVoiceInput onFinal={jest.fn()} onUnverifiedRecording={jest.fn()} onBusyChange={() => {}} suspended={false} />);
 const mic = screen.getByLabelText('Basılı saxla və danış'); await act(async () => fireEvent(mic, 'pressIn')); await act(async () => fireEvent(mic, 'pressOut')); await act(async () => grant({ granted: true }));
 expect(mockRecorder.record).not.toHaveBeenCalled();
});
test('feedback explanation for a correct answer never claims it is wrong', async () => {
 await start(); await press('Davam et'); const card = packetFlow(b1Packet[0]).find(c => c.kind === 'task');
 await checkAnswer(card, card.rule.answers[0]); await press('Mənə başa sal');
 expect(screen.getByText('Səbəb', { exact: true })).toBeOnTheScreen(); expect(screen.getByText('Düzdür.', { exact: true })).toBeOnTheScreen();
 expect(screen.queryByText('Bu cavab uyğun deyil. Aşağıdakı nümunəyə bax.', { exact: true })).not.toBeOnTheScreen();
});
test('a safe one-letter written typo remains accepted and does not enter the mistake queue', async () => {
 await start(); await press('Davam et'); const tasks = packetFlow(b1Packet[0]).filter(c => c.kind === 'task');
 await checkAnswer(tasks[0], tasks[0].rule.answers[0]); await press('Davam et');
 await checkAnswer(tasks[1], tasks[1].rule.answers[0]); await press('Davam et');
 await act(async () => fireEvent.changeText(screen.getByLabelText('Cavabını ingiliscə yaz'), 'Hellp'));
 await press('Yoxla'); await tick(700);
 expect(screen.getByText('Kiçik yazı düzəlişi')).toBeOnTheScreen();
 const attempt = Object.values(useUserStore.getState().attempts)[0];
 expect(attempt.tasks[tasks[2].id]).toMatchObject({ firstCorrect: true, resolved: true, wrong: 0 });
 expect(useUserStore.getState().hearts).toBe(5);
});
test('two rapid Check presses never advance the card or grade twice', async () => {
 await start(); await press('Davam et'); const task = packetFlow(b1Packet[0]).find(c => c.kind === 'task'); await listen(); await press(task.rule.answers[0]);
 const button = screen.getByText('Yoxla'); await act(async () => { fireEvent.press(button); fireEvent.press(button); }); await tick(700);
 expect(screen.getByText('✓ Düzgündür')).toBeOnTheScreen(); expect(screen.queryByLabelText('Cavabını ingiliscə yaz')).not.toBeOnTheScreen();
 expect(Object.keys(Object.values(useUserStore.getState().attempts)[0].tasks)).toHaveLength(1);
});
test('failed partial-progress save blocks exit and preserves a retry path', async () => {
 await start(); mockWriteFailure = true;
 await act(async () => fireEvent.press(screen.getByLabelText('Dərsdən geri çıx'))); await press('Çıx');
 expect(mockRouter.replace).not.toHaveBeenCalled(); expect(screen.getAllByText('Cari irəliləyiş saxlanmadı. Yenidən cəhd et.').length).toBeGreaterThan(0);
 mockWriteFailure = false; await press('Çıx'); expect(mockRouter.replace).toHaveBeenCalledWith(expect.objectContaining({ pathname: '/module/[id]' }));
});
test('low-confidence held speech earns no verdict, penalty or task evidence', async () => {
 mockEngine = engine(); const final = jest.fn(() => null);
 await renderAsync(<HoldVoiceInput onFinal={final} onUnverifiedRecording={jest.fn()} onBusyChange={() => {}} suspended={false} />);
 const mic = screen.getByLabelText('Basılı saxla və danış'); await act(async () => fireEvent(mic, 'pressIn'));
 await act(async () => { mockEngine.emit('result', { isFinal: true, results: [{ transcript: 'Hello', confidence: .1 }] }); mockEngine.emit('end'); });
 await act(async () => fireEvent(mic, 'pressOut')); expect(final).not.toHaveBeenCalled(); expect(screen.getByText(/səhv sayılmır/)).toBeOnTheScreen();
});
test('object card requires object classification, known structure and sourced IPA; only English is spoken', async () => {
 const Card = require('../src/components/lesson/ObjectWordCard').default;
 const entry = { kind: 'object', word: 'apple', translation: 'alma', image: 1, example: 'This is an apple.', exampleAz: 'Bu, almadır.', structureTaught: true, pronunciation: { ipa: '/ˈæp.əl/', source: 'https://dictionary.cambridge.org/pronunciation/english/apple', checkedAt: '2026-11-11', locale: 'en-GB' } };
 const speak = jest.fn(), practice = jest.fn(); const view = await renderAsync(<Card entry={entry} onSpeak={speak} onPractice={practice} />);
 await act(async () => fireEvent.press(screen.getByLabelText('Sözü ingiliscə dinlə'))); await act(async () => fireEvent.press(screen.getByLabelText('Nümunəni ingiliscə dinlə'))); await press('Məşqə keç');
 expect(speak.mock.calls.map(c => c[0])).toEqual(['apple', 'This is an apple.']); expect(practice).toHaveBeenCalledTimes(1);
 await view.rerenderAsync(<Card entry={{ ...entry, kind: 'phrase', word: 'Hello' }} onSpeak={speak} onPractice={practice} />); expect(screen.queryByText('Hello', { exact: true })).not.toBeOnTheScreen();
 await view.rerenderAsync(<Card entry={{ ...entry, structureTaught: false }} onSpeak={speak} onPractice={practice} />); expect(screen.queryByText('This is an apple.', { exact: true })).not.toBeOnTheScreen();
});
test('a buffered native phrase is cancelled on backgrounding and cannot submit on return', async () => {
 mockEngine = engine(); let stateChange; const native = AppState.addEventListener; jest.spyOn(AppState, 'addEventListener').mockImplementation((name, fn) => { if (name === 'change') stateChange = fn; return { remove: jest.fn() }; });
 const final = jest.fn(() => null); await renderAsync(<HoldVoiceInput onFinal={final} onUnverifiedRecording={jest.fn()} onBusyChange={() => {}} suspended={false} />);
 const mic = screen.getByLabelText('Basılı saxla və danış'); await act(async () => fireEvent(mic, 'pressIn'));
 await act(async () => { mockEngine.emit('result', { isFinal: true, results: [{ transcript: 'Hello', confidence: .9 }] }); mockEngine.emit('end'); });
 await act(async () => { AppState.currentState = 'background'; stateChange('background'); }); AppState.currentState = 'active';
 await act(async () => fireEvent(mic, 'pressOut')); expect(final).not.toHaveBeenCalled(); AppState.addEventListener = native;
});
test('an unassessable recognized phrase can be tried again without a separate Send control', async () => {
 mockEngine = engine(); const final = jest.fn(() => 'Yenidən cəhd et.');
 await renderAsync(<HoldVoiceInput onFinal={final} onUnverifiedRecording={jest.fn()} onBusyChange={() => {}} suspended={false} />);
 const mic = screen.getByLabelText('Basılı saxla və danış'); await act(async () => fireEvent(mic, 'pressIn')); await act(async () => fireEvent(mic, 'pressOut'));
 await act(async () => { mockEngine.emit('result', { isFinal: true, results: [{ transcript: 'unmatched phrase', confidence: .9 }] }); mockEngine.emit('end'); });
 await act(async () => fireEvent(mic, 'pressIn')); expect(mockEngine.start).toHaveBeenCalledTimes(2);
});
async function say(text) {
 const mic = screen.getByLabelText('Basılı saxla və danış');
 await act(async () => fireEvent(mic, 'pressIn'));
 await act(async () => { mockEngine.emit('result', { isFinal: true, results: [{ transcript: text, confidence: .9 }] }); mockEngine.emit('end'); });
 await act(async () => fireEvent(mic, 'pressOut')); await tick(700);
}
async function submitWrong(card) {
 if (card.audio || card.turns?.[0]?.audio) await listen();
 if (card.kind === 'voice') {
  const { assessPacketAnswer } = require('../src/utils/packetAnswer');
  const wrong = ['Goodbye', 'Hello', 'I am Leyla', 'Sorry', 'Thank you', 'Please repeat', 'I am fine', 'What is your name?'].find(value => ['wrong', 'partial'].includes(assessPacketAnswer(value, card.turns[0].rule, true).status));
  expect(wrong).toBeDefined(); await say(wrong);
 } else {
  if (card.options) await press(card.options.find(value => value !== card.rule.answers[0]));
  else if (card.words) {
   const { assessPacketAnswer } = require('../src/utils/packetAnswer');
   const wrongOrder = [card.words, [...card.words].reverse(), [...card.words.slice(1), card.words[0]]].find(words => assessPacketAnswer(words.join(' '), card.rule).status !== 'correct');
   expect(wrongOrder).toBeDefined(); for (const word of wrongOrder) await press(word);
  }
  else await act(async () => fireEvent.changeText(screen.getByLabelText('Cavabını ingiliscə yaz'), 'zqx'));
  await press('Yoxla'); await tick(700);
 }
 expect(screen.getByText('! Bir daha baxaq', { exact: true })).toBeOnTheScreen();
}
test.each(b1Packet.map(packet => [packet.order, packet]))('lesson %s: mistakes in every authored modality get one bounded retry and retain first evidence', async (_, packet) => {
 mockEngine = engine(); useUserStore.setState({ completedLessons: b1Packet.filter(p => p.order < packet.order).map(p => p.id) });
 await renderAsync(<PacketLesson packet={packet} />); await tick(); await press('Dərsə başla');
 const tasks = [];
 for (const card of packetFlow(packet).filter(c => !['intro', 'review', 'result'].includes(c.kind))) {
  if (card.kind === 'teach') await press('Davam et'); else { tasks.push(card); await submitWrong(card); await press('Davam et'); }
 }
 for (const original of tasks) {
  expect(screen.getByText('↻ Təkrar', { exact: true })).toBeOnTheScreen();
  await submitWrong(original.review); await press('Davam et');
 }
 expect(screen.getByText('Dərsin nəticəsi', { exact: true })).toBeOnTheScreen();
 expect(screen.queryByText('↻ Təkrar', { exact: true })).not.toBeOnTheScreen();
 await press('Nəticəni saxla');
 const progress = useUserStore.getState().lessonProgress.find(p => p.lessonId === packet.id);
 expect(progress.practiceNeeds).toHaveLength(tasks.length);
 expect(Object.values(progress.initialEvidence).every(item => item.correct === false)).toBe(true);
 expect(mockRouter.replace).not.toHaveBeenCalled();
});
test('a contextual choice uses the short screen heading and has no extra Skip footer', async () => {
 const packet = b1Packet[1]; useUserStore.setState({ completedLessons: [b1Packet[0].id] });
 await renderAsync(<PacketLesson packet={packet} />); await tick(); await press('Dərsə başla');
 const firstTask = packetFlow(packet).find(c => c.kind === 'task'); await checkAnswer(firstTask, firstTask.rule.answers[0]); await press('Davam et');
 expect(screen.getByRole('header').props.children).toBe('Cavabı seç');
 expect(screen.getByText('Tanışın gedir.\nSağollaşmaq üçün ifadəni seç.', { exact: true })).toBeOnTheScreen();
 expect(screen.queryByText('Keç', { exact: true })).not.toBeOnTheScreen();
 expect(screen.getByText('Yoxla', { exact: true })).toBeDisabled();
});

const messagePacket = () => {
 const source = b1Packet[0]; const first = source.cards.find(c => c.kind === 'task');
 const messages = [{ id: 'opening', label: 'Görüşün əvvəlində', placeholder: 'Salamını yaz', rule: { answers: ['Hello!', 'Hi!'], goals: ['greet'] } }, { id: 'closing', label: 'Görüşün sonunda', placeholder: 'Sağollaşmanı yaz', rule: { answers: ['Bye!', 'Goodbye!'], goals: ['farewell'] } }];
 const task = { ...first, audio: undefined, options: undefined, words: undefined, body: 'Görüşün əvvəlində salam, sonunda isə sağollaşma yaz.', messages, messageHint: 'Birinci sahədə görüşü başlayan salamı yaz. İkinci sahədə ayrılarkən dediyin sağollaşmanı yaz.', messageExample: ['Hello!', 'Bye!'], scenes: ['toy-park', 'toy-farewell'] };
 task.review = { ...task, body: 'Yeni görüş başlayır və sonra bitir. İki uyğun mesaj yaz.', review: undefined };
 return { ...source, cards: [source.cards[0], task, source.cards.at(-1)] };
};
test('two-message task checks both fields only on Check and keeps its correct field on bounded review', async () => {
 const packet = messagePacket(); await renderAsync(<PacketLesson packet={packet} />); await tick(); await press('Dərsə başla');
 expect(screen.getByText('Yoxla')).toBeDisabled();
 await act(async () => fireEvent.changeText(screen.getByLabelText('Görüşün əvvəlində'), 'Hello!'));
 expect(screen.getByText('Yoxla')).toBeDisabled();
 await act(async () => fireEvent.changeText(screen.getByLabelText('Görüşün sonunda'), 'Hello!'));
 expect(screen.queryByText(/Bir daha baxaq/)).not.toBeOnTheScreen(); await press('Yoxla'); await tick(700);
 expect(screen.getByText('! Bir daha baxaq')).toBeOnTheScreen();
 expect(screen.getByLabelText('Görüşün əvvəlində').props.editable).toBe(false);
 await press('Davam et'); expect(screen.getByText('↻ Təkrar')).toBeOnTheScreen();
 expect(screen.getByLabelText('Görüşün əvvəlində').props.value).toBe('Hello!'); expect(screen.getByLabelText('Görüşün əvvəlində').props.editable).toBe(false);
 expect(screen.getByLabelText('Görüşün sonunda').props.value).toBe('');
 await act(async () => fireEvent.changeText(screen.getByLabelText('Görüşün sonunda'), 'Bye!')); await press('Yoxla'); await tick(700); await press('Davam et');
 expect(screen.queryByText('↻ Təkrar')).not.toBeOnTheScreen();
 const attempt = Object.values(useUserStore.getState().attempts)[0]; const task = attempt.tasks[packet.cards[1].id];
 expect(task.firstCorrect).toBe(false); expect(task.resolved).toBe(true); expect(task.evidence.assisted).toBe(true);
});
test('two-message example is opt-in and marks the response assisted; merely opening help does not', async () => {
 await renderAsync(<PacketLesson packet={messagePacket()} />); await tick(); await press('Dərsə başla'); await press('İpucu');
 expect(screen.queryByText('Nümunəni göstər')).not.toBeOnTheScreen();
 await press('İpucu'); await press('Nümunəni göstər'); expect(screen.getByText('Hello! / Bye!')).toBeOnTheScreen();
 await act(async () => fireEvent.press(screen.getByLabelText('Kömək seç panelini bağla')));
 await act(async () => { fireEvent.changeText(screen.getByLabelText('Görüşün əvvəlində'), 'Hello!'); fireEvent.changeText(screen.getByLabelText('Görüşün sonunda'), 'Bye!'); });
 await press('Yoxla'); expect(Object.values(Object.values(useUserStore.getState().attempts)[0].tasks)[0].evidence.assisted).toBe(true);
});
test('two-message partial answer and retained field survive process-state restoration', async () => {
 const packet=messagePacket(); await renderAsync(<PacketLesson packet={packet} />); await tick(); await press('Dərsə başla');
 await act(async () => { fireEvent.changeText(screen.getByLabelText('Görüşün əvvəlində'), 'Hi!'); fireEvent.changeText(screen.getByLabelText('Görüşün sonunda'), 'Hi!'); });
 await press('Yoxla'); await tick(700); await press('Davam et'); await tick(); await act(async () => cleanup()); useUserStore.setState({ attempts: {} });
 await renderAsync(<PacketLesson packet={packet} />); await tick(); expect(screen.getByLabelText('Görüşün əvvəlində').props.value).toBe('Hi!'); expect(screen.getByLabelText('Görüşün əvvəlində').props.editable).toBe(false);
 expect(screen.getByLabelText('Görüşün sonunda').props.value).toBe('');
});
test('teaching explanation remains authored and contextual multiword expressions open their meaning', async () => {
 const source=b1Packet[1]; const card=source.cards.find(c=>c.kind==='teach' && c.examples.includes('My name is Leyla.'));
 const packet={...source,cards:[source.cards[0],card,source.cards.at(-1)]}; await renderAsync(<PacketLesson packet={packet}/>); await tick(); await press('Dərsə başla');
 await press('Qısa izah'); expect(screen.getByText(/Sonuna adını əlavə et/)).toBeOnTheScreen();
 await act(async()=>fireEvent.press(screen.getByLabelText('Qısa izah panelini bağla')));
 const labels = screen.getAllByLabelText(/My name is: mənası və nümunəsi/); await act(async()=>fireEvent.press(labels[0]));
 expect(screen.getByText('Mənim adım …-dır/-dir', {exact:true})).toBeOnTheScreen();
});
test('held speech uses British on-device recognition; unavailable local recognition falls back to unverified recording', async () => {
 mockEngine=engine(); const props={onFinal:jest.fn(()=>null),onUnverifiedRecording:jest.fn(),onBusyChange:()=>{},suspended:false};
 const view=await renderAsync(<HoldVoiceInput {...props}/>); await act(async()=>fireEvent(screen.getByLabelText('Basılı saxla və danış'),'pressIn'));
 expect(mockEngine.start).toHaveBeenCalledWith(expect.objectContaining({lang:'en-GB',requiresOnDeviceRecognition:true}));
 await view.unmountAsync(); mockEngine=engine(); mockEngine.supportsOnDeviceRecognition=()=>false;
 await renderAsync(<HoldVoiceInput {...props}/>); const mic=screen.getByLabelText('Basılı saxla və danış'); await act(async()=>fireEvent(mic,'pressIn')); await tick(130); await act(async()=>fireEvent(mic,'pressOut'));
 expect(mockEngine.start).not.toHaveBeenCalled(); expect(props.onFinal).not.toHaveBeenCalled(); expect(props.onUnverifiedRecording).toHaveBeenCalledTimes(1);
});
test('a confirmed spoken mistake offers one immediate retry while preserving original evidence', async () => {
 mockEngine=engine(); const source=b1Packet[0]; const voice=packetFlow(source).find(c=>c.kind==='voice');
 const packet={...source,cards:[source.cards[0],voice,source.cards.at(-1)]}; await renderAsync(<PacketLesson packet={packet}/>); await tick(); await press('Dərsə başla'); await listen();
 const say=async value=>{ const mic=screen.getByLabelText('Basılı saxla və danış'); await act(async()=>fireEvent(mic,'pressIn')); await act(async()=>{mockEngine.emit('result',{isFinal:true,results:[{transcript:value,confidence:.9}]});mockEngine.emit('end');}); await act(async()=>fireEvent(mic,'pressOut')); await tick(700); };
 await say('Bye!'); expect(screen.getByText('! Bir daha baxaq')).toBeOnTheScreen(); await press('Yenidən cəhd et');
 await say('Bye!'); expect(screen.queryByText('Yenidən cəhd et')).not.toBeOnTheScreen();
 const task=Object.values(useUserStore.getState().attempts)[0].tasks[voice.id]; expect(task.firstCorrect).toBe(false); expect(task.firstEvidence.input).toBe('spoken');
 await press('Davam et'); expect(screen.getByText('↻ Təkrar')).toBeOnTheScreen();
});
test('an authored object card adds its word before practice, opens sourced meaning and speaks English only', async () => {
 const source=b1Packet[0]; const card={...source.cards.find(c=>c.kind==='teach'),body:'',board:undefined,examples:[],introducedWords:['apple'],objectWord:{kind:'object',word:'apple',translation:'alma',image:'apple',example:'This is an apple.',exampleAz:'Bu, almadır.',structureTaught:true,pronunciation:{ipa:'/ˈæp.əl/',source:'https://dictionary.cambridge.org/pronunciation/english/apple',checkedAt:'2026-11-11',locale:'en-GB'}}};
 const packet={...source,cards:[source.cards[0],card,source.cards.at(-1)],vocabulary:[{word:'apple',translation:'alma',pronunciation:'',example:'This is an apple.',exampleAz:'Bu, almadır.',usageNote:''}]};
 await renderAsync(<PacketLesson packet={packet}/>); await tick(); await press('Dərsə başla');
 expect(useVocabularyStore.getState().allWords.map(v=>v.word)).toEqual(['apple']); expect(screen.queryByText('Davam et')).not.toBeOnTheScreen();
 await act(async()=>fireEvent.press(screen.getByLabelText('Sözü ingiliscə dinlə'))); expect(Speech.speak.mock.calls.at(-1)).toEqual(['apple',expect.objectContaining({language:'en-GB'})]);
 await act(async()=>fireEvent.press(screen.getByLabelText('apple: mənası və nümunəsi'))); expect(screen.getAllByText('/ˈæp.əl/').length).toBeGreaterThan(0);
 await act(async()=>fireEvent.press(screen.getByLabelText('apple panelini bağla'))); await press('Məşqə keç'); expect(screen.getByText('Dərs hələ tamamlanmayıb')).toBeOnTheScreen(); expect(screen.queryByText('Məşqə keç')).not.toBeOnTheScreen();
});
test('object metadata without a known structure cannot create a blank lesson with no Continue', async () => {
 const source=b1Packet[0]; const card={...source.cards.find(c=>c.kind==='teach'),objectWord:{kind:'object',word:'apple',translation:'alma',image:'apple',example:'This is an apple.',exampleAz:'Bu, almadır.',structureTaught:false,pronunciation:{ipa:'/ˈæp.əl/',source:'https://dictionary.cambridge.org/pronunciation/english/apple',checkedAt:'2026-11-11',locale:'en-GB'}}};
 await renderAsync(<PacketLesson packet={{...source,cards:[source.cards[0],card,source.cards.at(-1)]}}/>); await tick(); await press('Dərsə başla'); expect(screen.getByText('Davam et')).toBeEnabled(); expect(screen.queryByText('Məşqə keç')).not.toBeOnTheScreen();
});
test('preview listening uses the authored choices, requires listening and writes no learner achievement', async () => {
 const Preview=require('../src/components/lesson/LessonPreview').default;
 await renderAsync(<Preview/>); await act(async()=>fireEvent.press(screen.getByLabelText('Ekran seç'))); await press('4. Dinlə və seç');
 const card=b1Packet[0].cards.find(c=>c.kind==='task' && c.audio && c.options);
 expect(screen.getByText('Yoxla')).toBeDisabled(); expect(screen.getByText(card.options[0])).toBeDisabled();
 await listen(); await press(card.rule.answers[0]); await press('Yoxla');
 expect(screen.getByText('✓ Düzgündür')).toBeOnTheScreen(); expect(useUserStore.getState().attempts).toEqual({}); expect(useVocabularyStore.getState().allWords).toEqual([]);
});
test('a late preview audio completion cannot unlock a different listening screen', async () => {
 const Preview=require('../src/components/lesson/LessonPreview').default;
 await renderAsync(<Preview/>); await act(async()=>fireEvent.press(screen.getByLabelText('Ekran seç'))); await press('4. Dinlə və seç');
 await act(async()=>fireEvent.press(screen.getByLabelText('Səsi dinlə'))); const old=Speech.speak.mock.calls.at(-1)[1];
 await act(async()=>fireEvent.press(screen.getByLabelText('Ekran seç'))); await press('5. Dinlə və yaz');
 await act(async()=>old.onDone()); expect(screen.getByLabelText('Cavabını ingiliscə yaz').props.editable).toBe(false);
 await listen(); expect(screen.getByLabelText('Cavabını ingiliscə yaz').props.editable).toBe(true);
});
test('all approved scenes are reachable in the device gallery; image errors offer a retry', async () => {
 const Preview=require('../src/components/lesson/LessonPreview').default;
 const {approvedSceneLabels}=require('../src/utils/approvedLessonScenes');
 await renderAsync(<Preview/>); await act(async()=>fireEvent.press(screen.getByLabelText('Ekran seç'))); await press('Bütün vizuallara bax');
 Object.values(approvedSceneLabels).forEach(label=>expect(screen.getByLabelText(label)).toBeOnTheScreen());
 await act(async()=>fireEvent(screen.getByLabelText(approvedSceneLabels['toy-entrance']),'error',{nativeEvent:{error:'unavailable'}}));
 await act(async()=>fireEvent.press(screen.getByLabelText(`${approvedSceneLabels['toy-entrance']} şəklini yenidən yüklə`)));
 expect(screen.getByLabelText(approvedSceneLabels['toy-entrance']).props.recyclingKey).toBe('toy-entrance:1');
});
test('reference fix is limited to the first lesson introduction; Start still opens its authored teaching card', async () => {
 const {firstWelcomeCopy}=require('../src/components/lesson/FirstLessonWelcome');
 await renderAsync(<PacketLesson packet={b1Packet[0]}/>); await tick();
 expect(screen.getByTestId('reference-first-welcome')).toBeOnTheScreen(); expect(screen.queryByTestId('packet-lesson-viewport')).not.toBeOnTheScreen();
 expect(screen.getByText(firstWelcomeCopy.subtitle)).toBeOnTheScreen(); firstWelcomeCopy.objectives.forEach(text=>expect(screen.getByText(text)).toBeOnTheScreen());
 expect(screen.getAllByText('Dərsə başla')).toHaveLength(1); await press('Dərsə başla');
 expect(screen.queryByTestId('reference-first-welcome')).not.toBeOnTheScreen(); expect(screen.getByTestId('packet-lesson-viewport')).toBeOnTheScreen();
 await act(async()=>cleanup()); useUserStore.setState({attempts:{}}); await renderAsync(<PacketLesson packet={b1Packet[1]}/>); await tick();
 expect(screen.queryByTestId('reference-first-welcome')).not.toBeOnTheScreen(); expect(screen.getByText('Tanışlıq öz adından başlayır.')).toBeOnTheScreen();
});
