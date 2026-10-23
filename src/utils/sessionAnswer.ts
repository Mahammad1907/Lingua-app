import { normalizeApostrophes, isSafeEnglishTypo } from './spelling';

// Each audited English word may contain one harmless spelling slip.
export function isSessionAnswerCorrect(answer: string, target: string, language = 'en', alternatives: string[] = [], allowTypo = false): boolean {
  const normalize = (value: string) => normalizeApostrophes(value)
    .toLocaleLowerCase(language === 'az' ? 'az' : 'en')
    .replace(/[‘’]/g, "'")
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
