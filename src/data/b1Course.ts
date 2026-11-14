import { resolveMascot } from '../utils/mascot';
import { CHARACTERS, characterEn, hasCharacterName, resolveNames } from '../config/characters';
import raw from './b1Packet.json';
import { designLessons } from './designLessons';
import type { DesignLesson } from './designLessonTypes';
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
// Lessons on the new screens own their title and vocabulary. The old packet cards stay only for the section exam;
// a lesson with no old packet (Dərs 8) gets an empty one so progress, vocabulary and the home screen know it.
const designWords = (lesson: DesignLesson) => resolveNames(lesson.vocabulary).map(({ teachCard: _card, ...word }) => ({ ...word, lexical: true, acceptedAnswers: [], acceptedTranslations: [word.translation] }));
const designPacket = (lesson: DesignLesson, old?: PacketLesson): PacketLesson => ({
  ...(old ?? { cards: [] }), id: lesson.id, order: lesson.order, title: resolveNames(lesson.title), goal: resolveNames(lesson.result.done[1] ?? lesson.title), vocabulary: designWords(lesson),
});
export const b1Packet: PacketLesson[] = [
  ...packets.map(p => { const d = designLessons.find(l => l.id === p.id); return d ? designPacket(d, p) : p; }),
  ...designLessons.filter(d => !packets.some(p => p.id === d.id)).map(d => designPacket(d)),
].sort((a, b) => a.order - b.order);
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
// Section of a lesson on the new screens (Bölmə 2+, exams); the old packet lessons are all Bölmə 1.
const unitOf = (id: string) => designLessons.find(l => l.id === id)?.unit ?? 1;
const finalOf = (id: string, order: number) => { const d = designLessons.find(l => l.id === id); return d ? d.exam || (d.unit === 2 && d.number === 8) || (!d.unit && order === 8) : order === 8; };
export const b1Lessons: Lesson[] = b1Packet.map((lesson) => ({
  id: lesson.id, title: lesson.title, titleAz: lesson.title, description: lesson.goal,
  language: 'en', level: 'A1', moduleId: `module_${unitOf(lesson.id)}`, order: lesson.order,
  xpReward: LESSON_XP, estimatedTime: finalOf(lesson.id, lesson.order) ? 10 : 8,
  focus: finalOf(lesson.id, lesson.order) ? 'speaking' : lesson.order <= 3 ? 'grammar' : 'vocabulary',
  parentGroup: finalOf(lesson.id, lesson.order) ? 'final' : unitOf(lesson.id) === 2 ? 'd2' : 'd1', subOrder: lesson.order,
  isReview: finalOf(lesson.id, lesson.order), reviewType: finalOf(lesson.id, lesson.order) ? 'module_review' : undefined,
  canDo: lesson.goal,
  exercises: packetFlow(lesson).filter((c) => c.kind === 'task' || lesson.order === 7 && c.kind === 'voice').map(packetExercise),
  vocabulary: lesson.vocabulary.map((v, index) => ({ ...v, id: `${lesson.id}_v${index + 1}` })),
}));
