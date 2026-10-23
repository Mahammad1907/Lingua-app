import { isSafeEnglishTypo, normalizeApostrophes } from './spelling';
import type { Exercise } from '../data/types';
import { checkWrittenIntentAnswer } from './spokenAnswer';

export function checkExerciseAnswer(answer: string, exercise: Exercise): { correct: boolean; message: string } {
  if (exercise.answerRule) return checkWrittenIntentAnswer(answer, exercise.answerRule.intent, exercise.answerRule.roleName);
  return { correct: isSessionAnswerCorrect(answer, exercise.correctAnswer, exercise.answerLang || 'en',
    exercise.acceptedAnswers, exercise.type === 'fill_blank' || exercise.type === 'translation'), message: exercise.explanation };
}

// Each typed word may contain one harmless letter slip. Choices remain exact.
export function isSessionAnswerCorrect(answer: string, target: string, language = 'en', alternatives: string[] = [], allowTypo = false): boolean {
  const normalize = (value: string) => normalizeApostrophes(value)
    .toLocaleLowerCase(language === 'az' ? 'az' : 'en')
    .replace(/[.!?,;:“”"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const input = normalize(answer);
  if (!input) return false;
  return [target, ...alternatives].some((value) => {
    const expected = normalize(value);
    if (input === expected) return true;
    if (!allowTypo || language !== 'en') return false;
    const actualWords = input.split(' '); const expectedWords = expected.split(' ');
    if (actualWords.length !== expectedWords.length) return false;
    return expectedWords.every((word, index) => actualWords[index] === word || isSafeEnglishTypo(actualWords[index], word));
  });
}
