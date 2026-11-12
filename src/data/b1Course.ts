import { resolveMascot } from '../utils/mascot';
import { CHARACTERS, characterEn, hasCharacterName, resolveNames } from '../config/characters';
import raw from './b1Packet.json';
import { lesson1Design } from './lesson1Design';
import type { PacketCard, PacketLesson } from './b1PacketTypes';
import type { Exercise, Lesson } from './types';
import { LESSON_XP } from '../utils/rewards';

// Older lessons have the placeholder names Leyla / Əli (Ali) written into their data.
// Once a name is chosen in src/config/characters.ts it replaces them everywhere.
function legacyNames<T>(value: T): T {
  const swap = (text: string) => text
    .replace(/Leyla/g, hasCharacterName('girl') ? CHARACTERS.girl.az : 'Leyla')
    .replace(/Əli/g, hasCharacterName('boy') ? CHARACTERS.boy.az : 'Əli')
    .replace(/\bAli\b/g, hasCharacterName('boy') ? characterEn('boy') : 'Ali');
  if (typeof value === 'string') return swap(value) as T;
  if (Array.isArray(value)) return value.map(legacyNames) as T;
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [swap(k), legacyNames(v)])) as T;
  return value;
}
const packets = legacyNames(resolveMascot(raw)) as unknown as PacketLesson[];
// Lesson 1 vocabulary follows the redesigned lesson (docs/BirTalk_Ders_1_Yekun.md).
const lesson1Words = resolveNames(lesson1Design.vocabulary).map(({ teachCard: _card, ...word }) => ({ ...word, lexical: true, acceptedAnswers: [], acceptedTranslations: [word.translation] }));
export const b1Packet = packets.map(p => p.id === lesson1Design.id ? { ...p, vocabulary: lesson1Words } : p);
export const getPacketLesson = (id: string) => b1Packet.find((lesson) => lesson.id === id);
export function packetFlow(lesson: PacketLesson): PacketCard[] {
  const cards = lesson.order === 1 ? lesson.cards.filter(c => c.number !== 10) : [...lesson.cards];
  if (lesson.order === 1) {
    const speech = cards.findIndex(c => c.number === 6);
    if (speech >= 0) { const [card] = cards.splice(speech, 1); cards.splice(cards.findIndex(c => c.number === 9), 0, card); }
  }
  return cards.flatMap((card) => card.kind === 'voice'
    ? card.turns!.map((turn, i) => ({ ...card, id: turn.id, turns: [turn], review: card.review ? { ...card.review, id: turn.id, turns: [card.review.turns![i]] } : undefined })) : [card]);
}
export function packetTaskIds(lesson: PacketLesson) {
  const flow = packetFlow(lesson);
  const written = flow.filter((c) => c.kind === 'task').map((c) => c.id);
  const voice = flow.filter((c) => c.kind === 'voice').map((c) => c.id);
  const extra = lesson.order === 7 ? flow.filter((c) => c.kind === 'voice' && [9, 10].includes(c.number)).map((c) => c.id) : [];
  return { required: written.length ? written : voice.filter((id) => !extra.includes(id)), optional: written.length ? voice : extra };
}
export function packetExercise(card: PacketCard): Exercise {
  const rule = card.rule || card.turns?.[0].rule;
  return { id: card.id, type: card.options ? 'multiple_choice' : card.words ? 'sentence_build' : 'translation',
    question: card.body || card.turns?.[0].prompt || card.title, correctAnswer: rule?.answers[0] || '',
    acceptedAnswers: rule?.answers.slice(1), options: card.options, words: card.words,
    explanation: card.explanation || '', difficulty: 1, questionLang: 'az', answerLang: 'en' };
}
export const b1Lessons: Lesson[] = b1Packet.map((lesson) => ({
  id: lesson.id, title: lesson.title, titleAz: lesson.title, description: lesson.goal,
  language: 'en', level: 'A1', moduleId: 'module_1', order: lesson.order,
  xpReward: LESSON_XP, estimatedTime: lesson.order === 7 ? 10 : 8,
  focus: lesson.order === 7 ? 'speaking' : lesson.order <= 3 ? 'grammar' : 'vocabulary',
  parentGroup: lesson.order === 7 ? 'final' : 'd1', subOrder: lesson.order,
  isReview: lesson.order === 7, reviewType: lesson.order === 7 ? 'module_review' : undefined,
  canDo: lesson.goal,
  exercises: packetFlow(lesson).filter((c) => c.kind === 'task' || lesson.order === 7 && c.kind === 'voice').map(packetExercise),
  vocabulary: lesson.vocabulary.map((v, index) => ({ ...v, id: `${lesson.id}_v${index + 1}` })),
}));
