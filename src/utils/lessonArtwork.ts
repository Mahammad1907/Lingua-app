import type { SessionStyle, SessionStep } from '../data/firstConversation';

export type LessonArtworkKind = 'board' | 'identity' | 'conversation' | 'message' | 'listening';
export type DayScene = 'morning' | 'afternoon' | 'evening';

// Match the option's meaning, never its position or the question's answer.
export function daySceneForOption(option: string): DayScene | undefined {
  const word = option.split(' · ')[0].trim().toLocaleLowerCase('az');
  if (word === 'səhər') return 'morning';
  if (word === 'günorta') return 'afternoon';
  if (word === 'axşam') return 'evening';
  return undefined;
}

export function lessonArtworkKind(step: SessionStep, style: SessionStyle, order: number, index: number): LessonArtworkKind {
  const activity = step.activity || style;
  if (activity === 'repair' || order === 3) return 'board';
  if (activity === 'scene') return 'listening';
  if (step.exercise.type === 'fill_blank' || step.exercise.type === 'translation') return 'board';
  if (activity === 'dialogue') return 'conversation';
  if (activity === 'order') return 'message';
  if (order === 2 && index % 2 === 0) return 'identity';
  return 'board';
}

// The board must never use fullSentence/correctAnswer before the learner answers.
// The complete instruction also remains outside the picture for accessibility.
export function lessonBoardText(step: SessionStep): string {
  if (step.foxSays) return step.foxSays;
  const question = step.exercise.question;
  if (step.exercise.type === 'fill_blank') {
    const colon = question.lastIndexOf(':');
    const fragment = colon >= 0 ? question.slice(colon + 1).trim() : question;
    if (fragment.length <= 90) return fragment;
  }
  return step.exercise.type === 'sentence_build' ? 'Sözlərdən\ncümlə qur' : 'Düşün və\ncavabını hazırla';
}
