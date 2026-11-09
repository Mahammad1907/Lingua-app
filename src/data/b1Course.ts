import { resolveMascot } from '../utils/mascot';
import raw from './b1PacketV2.json';
import type { PacketCard, PacketLesson } from './b1PacketTypes';
import type { Exercise, Lesson } from './types';
import { LESSON_XP } from '../utils/rewards';

export const b1Packet = resolveMascot(raw) as unknown as PacketLesson[];
export const getPacketLesson = (id: string) => b1Packet.find((lesson) => lesson.id === id);
export function packetFlow(lesson: PacketLesson): PacketCard[] {
  const cards = [...lesson.cards];
  return cards.flatMap((card) => card.kind === 'voice'
    ? card.turns!.map((turn, i) => ({ ...card, id: turn.id, turns: [turn], review: card.review ? { ...card.review, id: turn.id, turns: [card.review.turns![i]] } : undefined })) : [card]);
}
export function packetTaskIds(lesson: PacketLesson) {
  const flow = packetFlow(lesson);
  const required = flow.filter(c => c.kind === 'task' || c.kind === 'voice').map(c => c.id);
  return { required, optional: [] as string[] };
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
  xpReward: LESSON_XP, estimatedTime: lesson.order === 12 ? 10 : 8,
  focus: lesson.order === 12 ? 'speaking' : lesson.order <= 3 ? 'grammar' : 'vocabulary',
  parentGroup: lesson.order === 12 ? 'final' : 'd1', subOrder: lesson.order,
  isReview: lesson.order === 12, reviewType: lesson.order === 12 ? 'module_review' : undefined,
  canDo: lesson.goal,
  exercises: packetFlow(lesson).filter((c) => c.kind === 'task' || lesson.order === 12 && c.kind === 'voice').map(packetExercise),
  vocabulary: lesson.vocabulary.map((v, index) => ({ ...v, id: `${lesson.id}_v${index + 1}` })),
}));
