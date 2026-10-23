import { normalizeApostrophes } from './spelling';
import { typoConfusables } from '../data/typoConfusables';

function oneEdit(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1 || a === b) return false;
  let i = 0; let j = 0; let changes = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++changes > 1) return false;
    if (a.length >= b.length) i++;
    if (b.length >= a.length) j++;
  }
  return changes + Number(i < a.length || j < b.length) === 1;
}

// Choices and grammar tokens stay exact. Only one spelling slip in the ENTIRE
// typed answer is allowed, and only for audited English vocabulary words.
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
    let changed = 0;
    return expectedWords.every((word, index) => {
      const actual = actualWords[index];
      if (actual === word) return true;
      if (++changed > 1 || !/^[a-z]+$/.test(actual) || !Object.hasOwn(typoConfusables, word)) return false;
      if (typoConfusables[word].includes(actual)) return false;
      return oneEdit(actual, word);
    });
  });
}
